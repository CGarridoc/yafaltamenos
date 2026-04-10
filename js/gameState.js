// ============================================================
// gameState.js — CraftQuiz single source of truth for game state
// ============================================================

const GameState = {
  mode: null,            // "infinite" | "hardcore" | "wordle"
  lang: "es",            // current language
  currentRecipe: null,   // recipe object currently on screen
  attemptsLeft: 3,       // attempts remaining for this puzzle
  totalFailed: 0,        // hardcore: total failed attempts across session
  score: 0,
  streak: 0,
  level: 1,              // hardcore: current level
  hardcoreStep: 0,       // index into hardcoreChain
  hardcoreChain: [],     // ordered recipe ids to solve in this hardcore level
  usedRecipeIds: [],     // infinite: track already-shown ids to avoid repeats
  grid: Array(3).fill(null).map(() => Array(3).fill(null)),
  wordleTimer: null,     // setInterval reference
  wordleStartTime: null, // Date.now() when timer started
  wordleElapsed: 0,      // seconds elapsed (final)
  wordleDate: null,      // YYYY-MM-DD string
  wordleAttempts: []     // array of grid snapshots per attempt (for emoji)
};

// ── Mode initializer ────────────────────────────────────
/**
 * Reset all state fields for a fresh mode start.
 * @param {"infinite"|"hardcore"|"wordle"} mode
 */
function initMode(mode) {
  GameState.mode = mode;
  GameState.currentRecipe = null;
  GameState.attemptsLeft = 3;
  GameState.totalFailed = 0;
  GameState.score = 0;
  GameState.streak = getStreak();  // restore from storage
  GameState.level = 1;
  GameState.hardcoreStep = 0;
  GameState.hardcoreChain = [];
  GameState.usedRecipeIds = [];
  GameState.grid = Array(3).fill(null).map(() => Array(3).fill(null));
  if (GameState.wordleTimer) {
    clearInterval(GameState.wordleTimer);
    GameState.wordleTimer = null;
  }
  GameState.wordleStartTime = null;
  GameState.wordleElapsed = 0;
  GameState.wordleDate = null;
  GameState.wordleAttempts = [];
}

// ── Recipe selection ────────────────────────────────────
/**
 * Pick the next recipe for the current mode.
 * - infinite: random from RECIPES (no repeats until pool exhausted)
 * - hardcore: first item in hardcoreChain[hardcoreStep]
 * - wordle: date-seeded selection
 */
function loadNextRecipe() {
  switch (GameState.mode) {
    case "infinite": {
      // Filter out smelting if desired? Keep all.
      let available = RECIPES.filter(r => !GameState.usedRecipeIds.includes(r.id));
      if (available.length === 0) {
        // Pool exhausted — reshuffle
        GameState.usedRecipeIds = [];
        available = [...RECIPES];
      }
      const idx = Math.floor(Math.random() * available.length);
      const recipe = available[idx];
      GameState.usedRecipeIds.push(recipe.id);
      GameState.currentRecipe = recipe;
      GameState.attemptsLeft = 3;
      GameState.grid = Array(3).fill(null).map(() => Array(3).fill(null));
      return recipe;
    }
    case "hardcore": {
      const id = GameState.hardcoreChain[GameState.hardcoreStep];
      const recipe = RECIPES.find(r => r.id === id);
      if (!recipe) {
        console.error("Hardcore chain recipe not found:", id);
        return null;
      }
      GameState.currentRecipe = recipe;
      GameState.grid = Array(3).fill(null).map(() => Array(3).fill(null));
      return recipe;
    }
    case "wordle": {
      const today = getTodayDateString();
      GameState.wordleDate = today;
      const rng = seededRandom(today);
      // Only non-smelting recipes for Wordle (grid-based only)
      const pool = RECIPES.filter(r => !r.furnace);
      const idx = Math.floor(rng() * pool.length);
      const recipe = pool[idx];
      GameState.currentRecipe = recipe;
      GameState.attemptsLeft = 3;
      GameState.grid = Array(3).fill(null).map(() => Array(3).fill(null));
      return recipe;
    }
    default:
      return null;
  }
}

// ── Hardcore chain builder ───────────────────────────────
/**
 * Build the ordered chain of recipe ids to solve for the given hardcore level.
 * Levels 1-3: just the recipe itself.
 * Levels 4-6: one prereq subRecipe + the recipe.
 * Levels 7+:  up to two prereq subRecipes + the recipe (may include furnace).
 * @param {object} recipe  target recipe object
 * @returns {string[]}
 */
function buildHardcoreChain(recipe) {
  const level = GameState.level;
  const subs = recipe.subRecipes || [];

  if (level <= 3) {
    return [recipe.id];
  } else if (level <= 6) {
    const prereq = subs.length > 0 ? subs[0] : null;
    if (prereq && RECIPES.find(r => r.id === prereq)) {
      return [prereq, recipe.id];
    }
    return [recipe.id];
  } else {
    // Level 7+: try to build a 2-step prereq chain
    const chain = [];
    if (subs.length >= 2 && RECIPES.find(r => r.id === subs[0]) && RECIPES.find(r => r.id === subs[1])) {
      chain.push(subs[0], subs[1]);
    } else if (subs.length >= 1 && RECIPES.find(r => r.id === subs[0])) {
      chain.push(subs[0]);
    }
    chain.push(recipe.id);
    return chain;
  }
}

/**
 * Initialize a new hardcore level: pick a suitable recipe and build its chain.
 * Recipes are chosen ensuring subRecipes exist when needed for the level.
 */
function initHardcoreLevel() {
  const level = GameState.level;
  let pool;

  if (level <= 3) {
    // Any non-trivially-shapeless, non-smelting recipe
    pool = RECIPES.filter(r => !r.furnace);
  } else if (level <= 6) {
    // Need at least one valid subRecipe
    pool = RECIPES.filter(r =>
      !r.furnace &&
      r.subRecipes.length > 0 &&
      r.subRecipes.some(s => RECIPES.find(rec => rec.id === s))
    );
  } else {
    // Prefer recipes with 2+ subRecipes; furnace chains allowed
    pool = RECIPES.filter(r =>
      r.subRecipes.length >= 1 &&
      r.subRecipes.some(s => RECIPES.find(rec => rec.id === s))
    );
  }

  if (pool.length === 0) pool = RECIPES.filter(r => !r.furnace);

  // Avoid repeats across the session
  const unused = pool.filter(r => !GameState.usedRecipeIds.includes(r.id));
  const source = unused.length > 0 ? unused : pool;
  const recipe = source[Math.floor(Math.random() * source.length)];
  GameState.usedRecipeIds.push(recipe.id);

  const chain = buildHardcoreChain(recipe);
  GameState.hardcoreChain = chain;
  GameState.hardcoreStep = 0;
  return recipe;
}

// ── Grid validation ─────────────────────────────────────
/**
 * Compare the player's current grid against the current recipe.
 * @returns {{ correct: boolean, wrongPositions: [number,number][], wrongItems: [number,number][] }}
 */
function validateGrid() {
  const recipe = GameState.currentRecipe;
  if (!recipe) return { correct: false, wrongPositions: [], wrongItems: [] };

  const playerGrid = GameState.grid;
  const targetGrid = recipe.grid;
  const wrongPositions = [];
  const wrongItems = [];

  if (recipe.shapeless) {
    // Collect all required items (with duplicates)
    const required = [];
    targetGrid.forEach(row => row.forEach(cell => { if (cell) required.push(cell); }));
    const placed = [];
    playerGrid.forEach(row => row.forEach(cell => { if (cell) placed.push(cell); }));

    // Check that placed items exactly match required (bag equality)
    const reqCopy = [...required];
    let allMatch = placed.length === required.length;
    if (allMatch) {
      for (const item of placed) {
        const idx = reqCopy.indexOf(item);
        if (idx === -1) { allMatch = false; break; }
        reqCopy.splice(idx, 1);
      }
    }

    if (allMatch) return { correct: true, wrongPositions: [], wrongItems: [] };

    // Mark wrong cells
    playerGrid.forEach((row, r) => row.forEach((cell, c) => {
      if (cell && !required.includes(cell)) wrongItems.push([r, c]);
    }));
    return { correct: false, wrongPositions, wrongItems };
  }

  if (recipe.furnace) {
    // Furnace mode: only check [0][0] (material) and [1][0] (fuel)
    const material = targetGrid[0][0];
    const playerMaterial = playerGrid[0][0];
    const playerFuel = playerGrid[1][0];

    if (playerMaterial !== material) wrongItems.push([0, 0]);
    if (!FUELS.includes(playerFuel)) wrongItems.push([1, 0]);

    const correct = playerMaterial === material && FUELS.includes(playerFuel);
    return { correct, wrongPositions, wrongItems };
  }

  // Standard shaped recipe
  let allCorrect = true;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const target = targetGrid[r][c];
      const player = playerGrid[r][c];
      if (target === null && player === null) continue;
      if (target === null && player !== null) {
        wrongItems.push([r, c]);
        allCorrect = false;
      } else if (target !== null && player !== target) {
        if (player === null) {
          wrongPositions.push([r, c]);
        } else {
          wrongItems.push([r, c]);
        }
        allCorrect = false;
      }
    }
  }
  return { correct: allCorrect, wrongPositions, wrongItems };
}

// ── Attempt recording ───────────────────────────────────
/**
 * Record the result of a submission.
 * Updates score, streak, attemptsLeft, totalFailed accordingly.
 * @param {boolean} correct
 * @returns {{ score: number, streak: number }}
 */
function recordAttempt(correct) {
  const attemptsUsed = 4 - GameState.attemptsLeft; // 1, 2, or 3

  if (correct) {
    GameState.streak++;
    setStreak(GameState.streak);

    const streakMultiplier =
      GameState.streak >= 10 ? 3 :
      GameState.streak >= 5  ? 2 :
      GameState.streak >= 3  ? 1.5 : 1;

    let base = 0;
    if (GameState.mode === "infinite") {
      base = attemptsUsed === 1 ? 100 : attemptsUsed === 2 ? 50 : 25;
    } else if (GameState.mode === "hardcore") {
      base = 200;
      if (GameState.totalFailed === 0) base += 100; // level perfect bonus
    }
    GameState.score += Math.round(base * streakMultiplier);

    const hs = getHighScore();
    if (GameState.mode === "infinite" && GameState.score > hs) {
      setHighScore(GameState.score);
    }
  } else {
    GameState.streak = 0;
    setStreak(0);
    GameState.attemptsLeft--;
    GameState.totalFailed++;
  }

  return { score: GameState.score, streak: GameState.streak };
}

// ── Date helpers ────────────────────────────────────────
/**
 * Returns today's date as "YYYY-MM-DD".
 */
function getTodayDateString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Simple deterministic seeded PRNG (mulberry32).
 * @param {string} seed  string seed (e.g. "2026-04-04")
 * @returns {() => number}  function returning [0,1)
 */
function seededRandom(seed) {
  // Hash the seed string into a 32-bit integer
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  let state = h >>> 0;

  return function () {
    state += 0x6D2B79F5;
    let z = state;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Format seconds as "MM:SS".
 * @param {number} totalSeconds
 * @returns {string}
 */
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
