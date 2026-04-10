// ============================================================
// ui.js — CraftQuiz DOM rendering and interaction layer
// ============================================================

// ── Bilingual strings ───────────────────────────────────
const STRINGS = {
  es: {
    title:              "CraftQuiz",
    subtitle:           "Adivina la receta de Minecraft",
    modeInfinite:       "♾️ INFINITO",
    modeHardcore:       "☠️ HARDCORE",
    modeWordle:         "📅 CRAFTWORDLE",
    chooseMode:         "Elige el modo de juego",
    score:              "Puntos",
    streak:             "Racha",
    level:              "Nivel",
    lives:              "Vidas",
    highScore:          "Récord",
    hearts:             "❤️",
    skulls:             "💀",
    craftingTable:      "Mesa de Crafteo",
    furnaceTitle:       "Horno",
    submit:             "Comprobar",
    clearGrid:          "Limpiar",
    nextPuzzle:         "Siguiente",
    solutionReveal:     "La solución era:",
    correct:            "¡Correcto!",
    wrong:              "Incorrecto",
    gameOver:           "¡Juego Terminado!",
    finalScore:         "Puntuación Final",
    finalLevel:         "Nivel Alcanzado",
    levelComplete:      "¡Nivel Completado!",
    goalLabel:          "Objetivo:",
    stepLabel:          "Paso",
    of:                 "de",
    craftLabel:         "Craftea:",
    back:               "Menú",
    attemptsLeft:       "Intentos",
    enterName:          "Tu nombre",
    save:               "Guardar",
    leaderboard:        "Tabla de Records",
    todayLeaderboard:   "Ranking de Hoy",
    shareBtn:           "Compartir",
    copied:             "¡Copiado!",
    timerLabel:         "Tiempo",
    attempts:           "Intentos",
    alreadyPlayed:      "Ya jugaste hoy",
    yourResult:         "Tu resultado",
    playAgain:          "Jugar de Nuevo",
    ingredient:         "Ingrediente",
    fuel:               "Combustible",
    output:             "Resultado",
    decoyHint:          "Arrastra los ingredientes correctos",
    streakMultiplier:   "Multiplicador de racha",
    itemsSolved:        "Ítems resueltos",
    hardcoreSkull:      "☠",
    perfect:            "¡Perfecto sin errores! +100 bonus",
    noEntries:          "Sin entradas aún"
  },
  en: {
    title:              "CraftQuiz",
    subtitle:           "Guess the Minecraft recipe",
    modeInfinite:       "♾️ INFINITE",
    modeHardcore:       "☠️ HARDCORE",
    modeWordle:         "📅 CRAFTWORDLE",
    chooseMode:         "Choose game mode",
    score:              "Score",
    streak:             "Streak",
    level:              "Level",
    lives:              "Lives",
    highScore:          "High Score",
    hearts:             "❤️",
    skulls:             "💀",
    craftingTable:      "Crafting Table",
    furnaceTitle:       "Furnace",
    submit:             "Check",
    clearGrid:          "Clear",
    nextPuzzle:         "Next",
    solutionReveal:     "The solution was:",
    correct:            "Correct!",
    wrong:              "Wrong",
    gameOver:           "Game Over!",
    finalScore:         "Final Score",
    finalLevel:         "Level Reached",
    levelComplete:      "Level Complete!",
    goalLabel:          "Goal:",
    stepLabel:          "Step",
    of:                 "of",
    craftLabel:         "Craft:",
    back:               "Menu",
    attemptsLeft:       "Attempts",
    enterName:          "Your name",
    save:               "Save",
    leaderboard:        "Leaderboard",
    todayLeaderboard:   "Today's Ranking",
    shareBtn:           "Share",
    copied:             "Copied!",
    timerLabel:         "Time",
    attempts:           "Attempts",
    alreadyPlayed:      "Already played today",
    yourResult:         "Your result",
    playAgain:          "Play Again",
    ingredient:         "Ingredient",
    fuel:               "Fuel",
    output:             "Output",
    decoyHint:          "Drag the correct ingredients",
    streakMultiplier:   "Streak multiplier",
    itemsSolved:        "Items solved",
    hardcoreSkull:      "☠",
    perfect:            "Perfect, no mistakes! +100 bonus",
    noEntries:          "No entries yet"
  }
};

// ── Active drag state ────────────────────────────────────
let dragState = {
  item: null,       // item id being dragged
  source: null,     // "tray" | "grid"
  sourceRow: -1,    // grid row if source === "grid"
  sourceCol: -1,    // grid col if source === "grid"
  ghost: null       // ghost DOM element
};

// ── Tooltip element ──────────────────────────────────────
let tooltipEl = null;

// ── Helper: get string in current language ───────────────
function t(key) {
  return (STRINGS[GameState.lang] || STRINGS.es)[key] || key;
}

// ── Helper: get app root ─────────────────────────────────
function app() {
  return document.getElementById("app");
}

// ── Helper: build item sprite img or fallback div ────────
function buildItemEl(id, size = 48) {
  if (!id) return null;
  const sprite = (() => {
    const recipe = RECIPES.find(r => r.id === id);
    return recipe ? recipe.sprite : null;
  })();

  const wrapper = document.createElement("div");
  wrapper.className = "item-sprite-wrapper";
  wrapper.style.width = size + "px";
  wrapper.style.height = size + "px";
  wrapper.style.position = "relative";

  if (sprite) {
    const img = document.createElement("img");
    img.src = `https://minecraft.wiki/images/${encodeURIComponent(sprite)}.png`;
    img.alt = id;
    img.style.width = size + "px";
    img.style.height = size + "px";
    img.style.imageRendering = "pixelated";
    img.style.display = "block";
    img.onerror = () => {
      img.style.display = "none";
      const fb = buildFallbackEl(id, size);
      wrapper.appendChild(fb);
    };
    wrapper.appendChild(img);
  } else {
    const fb = buildFallbackEl(id, size);
    wrapper.appendChild(fb);
  }
  return wrapper;
}

/** Colored pixel-art placeholder with item initial */
function buildFallbackEl(id, size = 48) {
  const colors = [
    "#4a90d9","#7b4ea0","#2e8b57","#b8860b",
    "#cd5c5c","#4682b4","#8fbc8f","#d2691e"
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffffffff;
  const color = colors[Math.abs(hash) % colors.length];
  const el = document.createElement("div");
  el.className = "item-fallback";
  el.style.width = size + "px";
  el.style.height = size + "px";
  el.style.background = color;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = Math.floor(size * 0.35) + "px";
  el.style.color = "#fff";
  el.style.fontFamily = "'Press Start 2P', monospace";
  el.style.boxSizing = "border-box";
  el.style.border = "2px solid #222";
  el.textContent = id.charAt(0).toUpperCase();
  return el;
}

// ────────────────────────────────────────────────────────
// SCREEN: Mode selection
// ────────────────────────────────────────────────────────
function renderModeScreen() {
  const root = app();
  root.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "mode-screen";

  // Language toggle
  screen.appendChild(buildLangToggle());

  // Title
  const title = document.createElement("h1");
  title.className = "game-title";
  title.textContent = t("title");
  screen.appendChild(title);

  const sub = document.createElement("p");
  sub.className = "game-subtitle";
  sub.textContent = t("subtitle");
  screen.appendChild(sub);

  const btnArea = document.createElement("div");
  btnArea.className = "mode-btn-area";

  const modes = [
    { key: "infinite", label: t("modeInfinite"), fn: () => startInfiniteMode() },
    { key: "hardcore", label: t("modeHardcore"), fn: () => startHardcoreMode() },
    { key: "wordle",   label: t("modeWordle"),   fn: () => startWordleMode()   }
  ];

  modes.forEach(({ label, fn }) => {
    const btn = document.createElement("button");
    btn.className = "mode-btn";
    btn.textContent = label;
    btn.addEventListener("click", fn);
    btnArea.appendChild(btn);
  });

  screen.appendChild(btnArea);

  // High score display
  const hs = document.createElement("p");
  hs.className = "hs-display";
  hs.innerHTML = `${t("highScore")}: <span class="hs-value">${getHighScore()}</span>`;
  screen.appendChild(hs);

  root.appendChild(screen);
}

// ────────────────────────────────────────────────────────
// SCREEN: Game screen (crafting table or furnace)
// ────────────────────────────────────────────────────────
function renderGameScreen(recipe) {
  const root = app();
  root.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "game-screen";

  // Top bar
  screen.appendChild(buildTopBar());

  // Main content
  const main = document.createElement("div");
  main.className = "game-main";

  // Target item display
  main.appendChild(buildTargetDisplay(recipe));

  // Hardcore: step/goal indicator
  if (GameState.mode === "hardcore") {
    main.appendChild(buildHardcoreProgress());
  }

  // Crafting area
  if (recipe.furnace) {
    main.appendChild(buildFurnaceUI(recipe));
  } else {
    main.appendChild(buildCraftingTableUI(recipe));
  }

  // Action buttons
  main.appendChild(buildActionButtons());

  // Item tray
  main.appendChild(buildTray(recipe));

  screen.appendChild(main);
  root.appendChild(screen);

  // Init tooltip
  initTooltip();
}

// ── Top bar (score, lives, streak, back button) ──────────
function buildTopBar() {
  const bar = document.createElement("div");
  bar.className = "top-bar";
  bar.id = "top-bar";

  const left = document.createElement("div");
  left.className = "top-bar-left";

  const backBtn = document.createElement("button");
  backBtn.className = "back-btn";
  backBtn.textContent = t("back");
  backBtn.addEventListener("click", () => {
    if (GameState.wordleTimer) clearInterval(GameState.wordleTimer);
    renderModeScreen();
  });
  left.appendChild(backBtn);
  bar.appendChild(left);

  const center = document.createElement("div");
  center.className = "top-bar-center";
  center.id = "stats-display";
  center.innerHTML = buildStatsHTML();
  bar.appendChild(center);

  const right = document.createElement("div");
  right.className = "top-bar-right";
  right.appendChild(buildLangToggle());
  bar.appendChild(right);

  return bar;
}

function buildStatsHTML() {
  let html = "";
  if (GameState.mode === "infinite") {
    html += `<span class="stat">${t("score")}: <b id="stat-score">${GameState.score}</b></span>`;
    html += `<span class="stat">${t("streak")}: <b id="stat-streak">${GameState.streak}</b></span>`;
    html += buildHeartsHTML(GameState.attemptsLeft);
    html += `<span class="stat">${t("highScore")}: <b>${getHighScore()}</b></span>`;
  } else if (GameState.mode === "hardcore") {
    html += `<span class="stat">${t("score")}: <b id="stat-score">${GameState.score}</b></span>`;
    html += `<span class="stat">${t("level")}: <b id="stat-level">${GameState.level}</b></span>`;
    html += buildSkullsHTML(3 - GameState.totalFailed);
  } else if (GameState.mode === "wordle") {
    html += `<span class="stat" id="wordle-timer">${t("timerLabel")}: 00:00</span>`;
    html += buildHeartsHTML(GameState.attemptsLeft);
  }
  return html;
}

function buildHeartsHTML(n) {
  let html = `<span class="stat lives-stat">`;
  for (let i = 0; i < 3; i++) {
    html += i < n
      ? `<span class="heart-icon active">❤</span>`
      : `<span class="heart-icon empty">♡</span>`;
  }
  html += `</span>`;
  return html;
}

function buildSkullsHTML(remaining) {
  let html = `<span class="stat lives-stat">`;
  for (let i = 0; i < 3; i++) {
    html += i < remaining
      ? `<span class="skull-icon active">☠</span>`
      : `<span class="skull-icon empty">☠</span>`;
  }
  html += `</span>`;
  return html;
}

function refreshStats() {
  const el = document.getElementById("stats-display");
  if (el) el.innerHTML = buildStatsHTML();
}

// ── Target item display ──────────────────────────────────
function buildTargetDisplay(recipe) {
  const wrap = document.createElement("div");
  wrap.className = "target-display";

  const label = document.createElement("span");
  label.className = "target-label";
  label.textContent = GameState.mode === "hardcore" && GameState.hardcoreStep < GameState.hardcoreChain.length - 1
    ? t("craftLabel") + " " + (GameState.lang === "es" ? recipe.nameES : recipe.nameEN)
    : (GameState.lang === "es" ? recipe.nameES : recipe.nameEN);

  const spriteEl = buildItemEl(recipe.id, 56);

  wrap.appendChild(spriteEl);
  wrap.appendChild(label);
  return wrap;
}

// ── Hardcore progress indicator ──────────────────────────
function buildHardcoreProgress() {
  const wrap = document.createElement("div");
  wrap.className = "hardcore-progress";
  wrap.id = "hardcore-progress";
  wrap.innerHTML = buildHardcoreProgressHTML();
  return wrap;
}

function buildHardcoreProgressHTML() {
  const chain = GameState.hardcoreChain;
  const step = GameState.hardcoreStep;
  const total = chain.length;
  const finalId = chain[chain.length - 1];
  const finalRecipe = RECIPES.find(r => r.id === finalId);

  const stepText = `${t("stepLabel")} ${step + 1} ${t("of")} ${total}: ${t("craftLabel")}`;
  const currentId = chain[step];
  const currentRecipe = RECIPES.find(r => r.id === currentId);
  const currentName = currentRecipe ? (GameState.lang === "es" ? currentRecipe.nameES : currentRecipe.nameEN) : currentId;

  let html = `<div class="step-indicator">${stepText} <b>${currentName}</b></div>`;

  if (total > 1) {
    const finalName = finalRecipe ? (GameState.lang === "es" ? finalRecipe.nameES : finalRecipe.nameEN) : finalId;
    html += `<div class="goal-indicator"><span>${t("goalLabel")}</span> `;
    html += `<span class="goal-name">${finalName}</span></div>`;
  }

  return html;
}

function refreshHardcoreProgress() {
  const el = document.getElementById("hardcore-progress");
  if (el) el.innerHTML = buildHardcoreProgressHTML();
}

// ── Crafting Table UI ─────────────────────────────────────
function buildCraftingTableUI(recipe) {
  const container = document.createElement("div");
  container.className = "crafting-container";

  const header = document.createElement("div");
  header.className = "crafting-header";
  header.textContent = t("craftingTable");
  container.appendChild(header);

  const body = document.createElement("div");
  body.className = "crafting-body";

  const grid = document.createElement("div");
  grid.className = "crafting-grid";
  grid.id = "crafting-grid";

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = buildGridCell(r, c, "grid");
      grid.appendChild(cell);
    }
  }
  body.appendChild(grid);

  // Arrow
  const arrow = document.createElement("div");
  arrow.className = "craft-arrow";
  arrow.textContent = "▶";
  body.appendChild(arrow);

  // Output slot
  const output = buildOutputSlot(recipe);
  body.appendChild(output);

  container.appendChild(body);
  return container;
}

// ── Furnace UI ───────────────────────────────────────────
function buildFurnaceUI(recipe) {
  const container = document.createElement("div");
  container.className = "furnace-container";

  const header = document.createElement("div");
  header.className = "furnace-header";
  header.textContent = t("furnaceTitle");
  container.appendChild(header);

  const body = document.createElement("div");
  body.className = "furnace-body";

  // Left: input slots
  const inputs = document.createElement("div");
  inputs.className = "furnace-inputs";

  const matSlot = buildGridCell(0, 0, "furnace");
  matSlot.setAttribute("data-label", t("ingredient"));
  matSlot.classList.add("furnace-cell");
  inputs.appendChild(matSlot);

  // Flame animation
  const flame = document.createElement("div");
  flame.className = "furnace-flame";
  flame.textContent = "🔥";
  inputs.appendChild(flame);

  const fuelSlot = buildGridCell(1, 0, "furnace");
  fuelSlot.setAttribute("data-label", t("fuel"));
  fuelSlot.classList.add("furnace-cell");
  inputs.appendChild(fuelSlot);

  body.appendChild(inputs);

  // Arrow
  const arrow = document.createElement("div");
  arrow.className = "craft-arrow";
  arrow.textContent = "▶";
  body.appendChild(arrow);

  // Output
  const output = buildOutputSlot(recipe);
  output.querySelector(".output-slot").classList.add("furnace-output");
  body.appendChild(output);

  container.appendChild(body);
  return container;
}

// ── Grid cell builder ────────────────────────────────────
function buildGridCell(row, col, type) {
  const cell = document.createElement("div");
  cell.className = "grid-cell";
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.dataset.type = type;
  cell.id = `cell-${row}-${col}`;

  const item = GameState.grid[row][col];
  if (item) {
    const el = buildItemEl(item, 40);
    el.dataset.item = item;
    cell.appendChild(el);
  }

  // Drop target
  cell.addEventListener("dragover", e => e.preventDefault());
  cell.addEventListener("drop", onDropToGrid);

  // Right-click or double-click to remove
  cell.addEventListener("contextmenu", e => { e.preventDefault(); removeFromGrid(row, col); });
  cell.addEventListener("dblclick", () => removeFromGrid(row, col));

  // Touch support
  cell.addEventListener("touchstart", onTouchStart, { passive: false });
  cell.addEventListener("touchmove",  onTouchMove,  { passive: false });
  cell.addEventListener("touchend",   onTouchEnd,   { passive: false });

  return cell;
}

// ── Output slot ──────────────────────────────────────────
function buildOutputSlot(recipe) {
  const wrap = document.createElement("div");
  wrap.className = "output-wrap";

  const label = document.createElement("div");
  label.className = "output-label";
  label.textContent = t("output");
  wrap.appendChild(label);

  const slot = document.createElement("div");
  slot.className = "output-slot";
  slot.id = "output-slot";
  const el = buildItemEl(recipe.id, 48);
  if (el) slot.appendChild(el);
  wrap.appendChild(slot);

  return wrap;
}

// ── Action buttons ───────────────────────────────────────
function buildActionButtons() {
  const row = document.createElement("div");
  row.className = "action-buttons";

  const clearBtn = document.createElement("button");
  clearBtn.className = "action-btn clear-btn";
  clearBtn.textContent = t("clearGrid");
  clearBtn.addEventListener("click", clearGrid);
  row.appendChild(clearBtn);

  const submitBtn = document.createElement("button");
  submitBtn.className = "action-btn submit-btn";
  submitBtn.id = "submit-btn";
  submitBtn.textContent = t("submit");
  submitBtn.addEventListener("click", onSubmit);
  row.appendChild(submitBtn);

  return row;
}

// ── Item tray ────────────────────────────────────────────
function buildTray(recipe) {
  const wrap = document.createElement("div");
  wrap.className = "tray-wrap";

  const hint = document.createElement("p");
  hint.className = "tray-hint";
  hint.textContent = t("decoyHint");
  wrap.appendChild(hint);

  const tray = document.createElement("div");
  tray.className = "item-tray";
  tray.id = "item-tray";
  tray.setAttribute("data-source", "tray");

  const items = getTrayItems(recipe);
  items.forEach(id => {
    const slot = buildTraySlot(id);
    tray.appendChild(slot);
  });

  wrap.appendChild(tray);
  return wrap;
}

/**
 * Returns shuffled array of item ids for the tray.
 * Includes all required ingredients + decoys.
 */
function getTrayItems(recipe) {
  const required = getRecipeIngredients(recipe);
  const decoys = buildDecoys(recipe, required);
  const all = [...required, ...decoys];
  return shuffleArray(all);
}

/**
 * Pick 4-6 decoys from the same category + 2-3 from related categories.
 */
function buildDecoys(recipe, required) {
  const cat = recipe.category;
  const decoys = new Set();

  // Related category mapping
  const related = {
    weapons: ["tools"],
    tools: ["weapons", "building"],
    armor: ["weapons", "tools"],
    building: ["misc", "redstone"],
    food: ["building"],
    redstone: ["building", "misc"],
    misc: ["building", "redstone"],
    smelting: ["tools", "weapons"]
  };

  // All ingredients from same category (excluding this recipe's ingredients)
  const sameCatIngredients = [];
  const relatedIngredients = [];

  RECIPES.forEach(r => {
    if (r.id === recipe.id) return;
    const ingredients = getRecipeIngredients(r);
    ingredients.forEach(ing => {
      if (!required.includes(ing) && !decoys.has(ing)) {
        if (r.category === cat) sameCatIngredients.push(ing);
        else if ((related[cat] || []).includes(r.category)) relatedIngredients.push(ing);
      }
    });
  });

  const sameCatShuffled = shuffleArray([...new Set(sameCatIngredients)]);
  const relatedShuffled = shuffleArray([...new Set(relatedIngredients)]);

  sameCatShuffled.slice(0, 5).forEach(d => decoys.add(d));
  relatedShuffled.slice(0, 3).forEach(d => decoys.add(d));

  return Array.from(decoys);
}

function buildTraySlot(id) {
  const slot = document.createElement("div");
  slot.className = "item-slot";
  slot.dataset.item = id;
  slot.draggable = true;
  slot.title = getIngredientName(id, GameState.lang);

  const el = buildItemEl(id, 40);
  if (el) slot.appendChild(el);

  slot.addEventListener("dragstart", onDragStart);
  slot.addEventListener("dragend",   onDragEnd);
  slot.addEventListener("touchstart", onTouchStart, { passive: false });
  slot.addEventListener("touchmove",  onTouchMove,  { passive: false });
  slot.addEventListener("touchend",   onTouchEnd,   { passive: false });

  // Tooltip on hover
  slot.addEventListener("mouseenter", e => showTooltip(id, e.clientX, e.clientY));
  slot.addEventListener("mouseleave", hideTooltip);
  slot.addEventListener("mousemove",  e => moveTooltip(e.clientX, e.clientY));

  return slot;
}

// ────────────────────────────────────────────────────────
// DRAG AND DROP — Mouse
// ────────────────────────────────────────────────────────
function onDragStart(e) {
  const slot = e.currentTarget;
  const id = slot.dataset.item;
  dragState.item = id;
  dragState.source = slot.closest(".item-tray") ? "tray" : "grid";
  if (dragState.source === "grid") {
    dragState.sourceRow = parseInt(slot.dataset.row);
    dragState.sourceCol = parseInt(slot.dataset.col);
  }
  e.dataTransfer.setData("text/plain", id);
  e.dataTransfer.effectAllowed = "move";

  // Semi-transparent ghost
  const ghost = buildItemEl(id, 40);
  if (ghost) {
    ghost.style.opacity = "0.6";
    ghost.style.position = "absolute";
    ghost.style.top = "-100px";
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    setTimeout(() => ghost.remove(), 0);
  }
  slot.style.opacity = "0.4";
}

function onDragEnd(e) {
  e.currentTarget.style.opacity = "1";
  dragState = { item: null, source: null, sourceRow: -1, sourceCol: -1, ghost: null };
}

function onDropToGrid(e) {
  e.preventDefault();
  const id = e.dataTransfer.getData("text/plain") || dragState.item;
  if (!id) return;

  const cell = e.currentTarget;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  placeItemInGrid(id, row, col);
}

// ── Grid / tray drop zones ───────────────────────────────
function placeItemInGrid(id, row, col) {
  const existing = GameState.grid[row][col];

  if (dragState.source === "grid") {
    // Moving within grid: swap
    const fromR = dragState.sourceRow;
    const fromC = dragState.sourceCol;
    GameState.grid[fromR][fromC] = existing; // put old item where dragged-from was
    GameState.grid[row][col] = id;
    refreshCell(fromR, fromC);
  } else {
    // From tray: if cell occupied, put existing back to tray (visually it stays; tray is unlimited)
    GameState.grid[row][col] = id;
  }

  refreshCell(row, col);
}

function removeFromGrid(row, col) {
  if (!GameState.grid[row][col]) return;
  GameState.grid[row][col] = null;
  refreshCell(row, col);
}

function clearGrid() {
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      GameState.grid[r][c] = null;
  refreshAllCells();
}

function refreshCell(row, col) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (!cell) return;
  cell.innerHTML = "";
  const item = GameState.grid[row][col];
  if (item) {
    const el = buildItemEl(item, 40);
    el.dataset.item = item;
    cell.appendChild(el);
  }
  // Re-attach drop listeners
  cell.ondragover = e => e.preventDefault();
  cell.ondrop = onDropToGrid;
}

function refreshAllCells() {
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      refreshCell(r, c);
}

// ────────────────────────────────────────────────────────
// DRAG AND DROP — Touch
// ────────────────────────────────────────────────────────
function onTouchStart(e) {
  const slot = e.currentTarget;
  // Determine if it's a tray slot or grid cell
  const fromTray = slot.classList.contains("item-slot");
  const id = fromTray ? slot.dataset.item : (GameState.grid[parseInt(slot.dataset.row)][parseInt(slot.dataset.col)] || null);
  if (!id) return;

  dragState.item = id;
  dragState.source = fromTray ? "tray" : "grid";
  if (!fromTray) {
    dragState.sourceRow = parseInt(slot.dataset.row);
    dragState.sourceCol = parseInt(slot.dataset.col);
  }

  // Create ghost element
  const ghost = document.createElement("div");
  ghost.className = "ghost";
  ghost.id = "touch-ghost";
  const inner = buildItemEl(id, 40);
  if (inner) ghost.appendChild(inner);
  document.body.appendChild(ghost);
  dragState.ghost = ghost;

  const touch = e.touches[0];
  positionGhost(touch.clientX, touch.clientY);
  e.preventDefault();
}

function onTouchMove(e) {
  if (!dragState.item) return;
  const touch = e.touches[0];
  positionGhost(touch.clientX, touch.clientY);
  e.preventDefault();
}

function onTouchEnd(e) {
  if (!dragState.item) return;
  const touch = e.changedTouches[0];

  // Remove ghost
  if (dragState.ghost) {
    dragState.ghost.remove();
    dragState.ghost = null;
  }

  // Find drop target at touch position
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  const cell = el ? el.closest(".grid-cell") : null;
  if (cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    placeItemInGrid(dragState.item, row, col);
  }

  dragState = { item: null, source: null, sourceRow: -1, sourceCol: -1, ghost: null };
  e.preventDefault();
}

function positionGhost(x, y) {
  const ghost = dragState.ghost;
  if (!ghost) return;
  ghost.style.left = (x - 20) + "px";
  ghost.style.top  = (y - 20) + "px";
}

// ────────────────────────────────────────────────────────
// ANIMATIONS
// ────────────────────────────────────────────────────────

/**
 * Flash wrong cells: wrongItems = red shake, wrongPositions = orange pulse.
 * @param {[number,number][]} wrongPositions
 * @param {[number,number][]} wrongItems
 */
function flashCells(wrongPositions, wrongItems) {
  wrongItems.forEach(([r, c]) => {
    const cell = document.getElementById(`cell-${r}-${c}`);
    if (cell) {
      cell.classList.add("flash-wrong");
      setTimeout(() => cell.classList.remove("flash-wrong"), 700);
    }
  });
  wrongPositions.forEach(([r, c]) => {
    const cell = document.getElementById(`cell-${r}-${c}`);
    if (cell) {
      cell.classList.add("flash-missing");
      setTimeout(() => cell.classList.remove("flash-missing"), 700);
    }
  });
}

/**
 * Flash all grid cells green on correct answer.
 */
function flashCorrect() {
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.getElementById(`cell-${r}-${c}`);
      if (cell) {
        cell.classList.add("flash-correct");
        setTimeout(() => cell.classList.remove("flash-correct"), 800);
      }
    }
  }
}

/**
 * Animate solution reveal: drop correct items into grid one by one.
 * @param {string[][]} grid  3x3 array of item ids or null
 * @param {function} onDone  callback when animation finishes
 */
function animateSolutionReveal(grid, onDone) {
  // Clear current grid display
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) {
      const cell = document.getElementById(`cell-${r}-${c}`);
      if (cell) cell.innerHTML = "";
    }

  const cells = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (grid[r][c]) cells.push([r, c, grid[r][c]]);

  cells.forEach(([r, c, id], i) => {
    setTimeout(() => {
      const cell = document.getElementById(`cell-${r}-${c}`);
      if (!cell) return;
      const el = buildItemEl(id, 40);
      el.classList.add("solution-drop");
      cell.appendChild(el);
      cell.classList.add("flash-correct");
      if (i === cells.length - 1 && onDone) {
        setTimeout(onDone, 400);
      }
    }, i * 300);
  });
}

// ────────────────────────────────────────────────────────
// SUBMIT HANDLER (called by button)
// ────────────────────────────────────────────────────────
function onSubmit() {
  // This delegates to the active mode handler
  if (typeof currentModeSubmit === "function") {
    currentModeSubmit();
  }
}

// ────────────────────────────────────────────────────────
// RESULT SCREENS
// ────────────────────────────────────────────────────────

/**
 * Show solution reveal overlay + next button.
 * @param {function} onNext  callback for "next puzzle" action
 */
function showSolutionReveal(onNext) {
  const recipe = GameState.currentRecipe;
  const overlay = document.createElement("div");
  overlay.className = "solution-overlay";

  const box = document.createElement("div");
  box.className = "solution-box";

  const title = document.createElement("h2");
  title.textContent = t("solutionReveal");
  box.appendChild(title);

  const nameEl = document.createElement("p");
  nameEl.className = "solution-name";
  nameEl.textContent = GameState.lang === "es" ? recipe.nameES : recipe.nameEN;
  box.appendChild(nameEl);

  overlay.appendChild(box);
  document.getElementById("app").appendChild(overlay);

  // Animate correct items into the grid
  animateSolutionReveal(recipe.grid, () => {
    const nextBtn = document.createElement("button");
    nextBtn.className = "action-btn next-btn";
    nextBtn.textContent = t("nextPuzzle");
    nextBtn.addEventListener("click", () => {
      overlay.remove();
      if (typeof onNext === "function") onNext();
    });
    box.appendChild(nextBtn);
  });
}

/**
 * Game Over screen for Hardcore mode.
 * @param {{ score:number, level:number }} data
 */
function renderGameOverScreen(data) {
  const root = app();
  root.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "gameover-screen";

  const title = document.createElement("h1");
  title.className = "gameover-title";
  title.textContent = t("gameOver");
  screen.appendChild(title);

  const scoreEl = document.createElement("p");
  scoreEl.className = "gameover-stat";
  scoreEl.innerHTML = `${t("finalScore")}: <b>${data.score}</b>`;
  screen.appendChild(scoreEl);

  const levelEl = document.createElement("p");
  levelEl.className = "gameover-stat";
  levelEl.innerHTML = `${t("finalLevel")}: <b>${data.level}</b>`;
  screen.appendChild(levelEl);

  // Name entry
  const nameWrap = document.createElement("div");
  nameWrap.className = "name-entry";

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = t("enterName");
  nameInput.maxLength = 20;
  nameInput.className = "name-input";
  nameWrap.appendChild(nameInput);

  const saveBtn = document.createElement("button");
  saveBtn.className = "action-btn";
  saveBtn.textContent = t("save");
  saveBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim() || "Anon";
    const entry = { name, score: data.score, level: data.level, date: getTodayDateString() };
    const board = saveHardcoreScore(entry);
    renderHardcoreLeaderboard(screen, board);
    nameWrap.remove();
    saveBtn.remove();
  });
  nameWrap.appendChild(saveBtn);
  screen.appendChild(nameWrap);

  // Menu button
  const menuBtn = document.createElement("button");
  menuBtn.className = "action-btn mode-btn";
  menuBtn.textContent = t("back");
  menuBtn.addEventListener("click", renderModeScreen);
  screen.appendChild(menuBtn);

  root.appendChild(screen);
}

function renderHardcoreLeaderboard(container, board) {
  const existing = container.querySelector(".leaderboard");
  if (existing) existing.remove();

  const lb = document.createElement("div");
  lb.className = "leaderboard";

  const h = document.createElement("h3");
  h.textContent = t("leaderboard");
  lb.appendChild(h);

  if (board.length === 0) {
    const p = document.createElement("p");
    p.textContent = t("noEntries");
    lb.appendChild(p);
  } else {
    board.forEach((entry, i) => {
      const row = document.createElement("div");
      row.className = "lb-row";
      row.innerHTML = `<span class="lb-rank">${i + 1}.</span> <span class="lb-name">${escapeHTML(entry.name)}</span> <span class="lb-score">${entry.score}</span> <span class="lb-level">Lvl ${entry.level}</span>`;
      lb.appendChild(row);
    });
  }
  container.appendChild(lb);
}

/**
 * CraftWordle result screen.
 * @param {{ attempts:number, time:number, emojiGrid:string, recipe:object, leaderboard:Array }} data
 */
async function renderWordleResult(data) {
  const root = app();
  root.innerHTML = "";

  const screen = document.createElement("div");
  screen.className = "wordle-result-screen";

  const title = document.createElement("h2");
  title.textContent = t("yourResult");
  screen.appendChild(title);

  // Recipe name
  const recipeName = document.createElement("p");
  recipeName.className = "wordle-recipe-name";
  recipeName.textContent = GameState.lang === "es" ? data.recipe.nameES : data.recipe.nameEN;
  screen.appendChild(recipeName);

  // Stats
  const statsRow = document.createElement("div");
  statsRow.className = "wordle-stats";
  statsRow.innerHTML = `
    <span>${t("attempts")}: <b>${data.attempts}/3</b></span>
    <span>${t("timerLabel")}: <b>${formatTime(data.time)}</b></span>
  `;
  screen.appendChild(statsRow);

  // Emoji grid display
  const emojiEl = document.createElement("pre");
  emojiEl.className = "emoji-grid";
  emojiEl.textContent = data.emojiGrid;
  screen.appendChild(emojiEl);

  // Share button
  const shareArea = document.createElement("div");
  shareArea.className = "share-area";
  const shareBtn = document.createElement("button");
  shareBtn.className = "action-btn share-btn";
  shareBtn.textContent = t("shareBtn");

  const shareText = buildShareText(data);
  shareBtn.addEventListener("click", () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        shareBtn.textContent = t("copied");
        setTimeout(() => shareBtn.textContent = t("shareBtn"), 2000);
      });
    } else {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = shareText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      shareBtn.textContent = t("copied");
      setTimeout(() => shareBtn.textContent = t("shareBtn"), 2000);
    }
  });
  shareArea.appendChild(shareBtn);
  screen.appendChild(shareArea);

  // Leaderboard
  const lbSection = document.createElement("div");
  lbSection.className = "wordle-lb-section";
  const lbTitle = document.createElement("h3");
  lbTitle.textContent = t("todayLeaderboard");
  lbSection.appendChild(lbTitle);

  try {
    const board = await getWordleLeaderboard(data.date);
    if (board.length === 0) {
      const p = document.createElement("p");
      p.textContent = t("noEntries");
      lbSection.appendChild(p);
    } else {
      board.forEach((entry, i) => {
        const row = document.createElement("div");
        row.className = "lb-row";
        row.innerHTML = `<span class="lb-rank">${i + 1}.</span> <span class="lb-name">${escapeHTML(entry.name)}</span> <span class="lb-score">${entry.attempts}/3</span> <span class="lb-time">${formatTime(entry.time)}</span>`;
        lbSection.appendChild(row);
      });
    }
  } catch {
    lbSection.appendChild(Object.assign(document.createElement("p"), { textContent: t("noEntries") }));
  }
  screen.appendChild(lbSection);

  // Menu button
  const menuBtn = document.createElement("button");
  menuBtn.className = "action-btn mode-btn";
  menuBtn.style.marginTop = "16px";
  menuBtn.textContent = t("back");
  menuBtn.addEventListener("click", renderModeScreen);
  screen.appendChild(menuBtn);

  root.appendChild(screen);
}

function buildShareText(data) {
  const date = data.date || getTodayDateString();
  const header = `CraftQuiz Wordle ${date} ${data.attempts}/3`;
  const timeStr = formatTime(data.time);
  return `${header}\n${data.emojiGrid}\n⏱ ${timeStr}`;
}

// ────────────────────────────────────────────────────────
// TOAST / FEEDBACK MESSAGE
// ────────────────────────────────────────────────────────
function showToast(msg, type = "info", duration = 1500) {
  const existing = document.getElementById("toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toast";
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("toast-visible"));
  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ────────────────────────────────────────────────────────
// TOOLTIP
// ────────────────────────────────────────────────────────
function initTooltip() {
  tooltipEl = document.getElementById("tooltip");
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "tooltip";
    tooltipEl.className = "tooltip";
    document.body.appendChild(tooltipEl);
  }
}

function showTooltip(id, x, y) {
  if (!tooltipEl) initTooltip();
  tooltipEl.textContent = getIngredientName(id, GameState.lang);
  tooltipEl.style.display = "block";
  moveTooltip(x, y);
}

function moveTooltip(x, y) {
  if (!tooltipEl) return;
  tooltipEl.style.left = (x + 12) + "px";
  tooltipEl.style.top  = (y + 12) + "px";
}

function hideTooltip() {
  if (!tooltipEl) return;
  tooltipEl.style.display = "none";
}

// ────────────────────────────────────────────────────────
// LANGUAGE TOGGLE
// ────────────────────────────────────────────────────────
function buildLangToggle() {
  const wrap = document.createElement("div");
  wrap.className = "lang-toggle";

  ["es", "en"].forEach(lang => {
    const btn = document.createElement("button");
    btn.className = "lang-btn" + (GameState.lang === lang ? " active" : "");
    btn.textContent = lang.toUpperCase();
    btn.addEventListener("click", () => toggleLang(lang));
    wrap.appendChild(btn);
  });

  return wrap;
}

/**
 * Switch language and re-render the current screen.
 * @param {string} lang  "es" | "en"
 */
function toggleLang(lang) {
  if (GameState.lang === lang) return;
  GameState.lang = lang;
  setLang(lang);

  // Re-render the active screen without losing game state
  if (GameState.mode === null) {
    renderModeScreen();
  } else if (GameState.currentRecipe) {
    renderGameScreen(GameState.currentRecipe);
  }
}

// ────────────────────────────────────────────────────────
// WORDLE TIMER UI
// ────────────────────────────────────────────────────────
function startWordleTimerUI() {
  GameState.wordleStartTime = Date.now();
  if (GameState.wordleTimer) clearInterval(GameState.wordleTimer);
  GameState.wordleTimer = setInterval(() => {
    const el = document.getElementById("wordle-timer");
    if (!el) return;
    const elapsed = Math.floor((Date.now() - GameState.wordleStartTime) / 1000);
    el.textContent = `${t("timerLabel")}: ${formatTime(elapsed)}`;
  }, 1000);
}

function stopWordleTimerUI() {
  if (GameState.wordleTimer) {
    clearInterval(GameState.wordleTimer);
    GameState.wordleTimer = null;
  }
  return Math.floor((Date.now() - (GameState.wordleStartTime || Date.now())) / 1000);
}

// ────────────────────────────────────────────────────────
// WORDLE EMOJI BUILDER
// ────────────────────────────────────────────────────────
/**
 * Build emoji summary string from all wordle attempts.
 * Each attempt is a 3x3 grid snapshot.
 * ✅ = correct position, ❌ = wrong item or empty
 */
function buildWordleEmojiGrid() {
  const recipe = GameState.currentRecipe;
  const attempts = GameState.wordleAttempts;
  const lines = [];

  attempts.forEach(gridSnapshot => {
    let line = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const expected = recipe.grid[r][c];
        const placed   = gridSnapshot[r][c];
        if (expected === null && placed === null) {
          line += "⬛";
        } else if (expected !== null && placed === expected) {
          line += "✅";
        } else {
          line += "❌";
        }
      }
    }
    lines.push(line);
  });

  return lines.join("\n");
}

// ────────────────────────────────────────────────────────
// HELPERS
// ────────────────────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Expose for modes.js
let currentModeSubmit = null;

function setSubmitHandler(fn) {
  currentModeSubmit = fn;
}
