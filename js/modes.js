// ============================================================
// modes.js — CraftQuiz game flow for each mode
// ============================================================

// ────────────────────────────────────────────────────────
// MODE 1: INFINITE
// ────────────────────────────────────────────────────────

/**
 * Start Infinite mode: init state, load first recipe, render screen.
 */
function startInfiniteMode() {
  initMode("infinite");
  GameState.streak = getStreak();

  const recipe = loadNextRecipe();
  renderGameScreen(recipe);
  setSubmitHandler(submitInfinite);
}

/**
 * Submit handler for Infinite mode.
 * Validates the grid, gives feedback, advances to next puzzle.
 */
function submitInfinite() {
  const { correct, wrongPositions, wrongItems } = validateGrid();

  if (correct) {
    flashCorrect();
    const result = recordAttempt(true);
    showToast(t("correct"), "success");
    refreshStats();

    // Short delay then next recipe
    setTimeout(() => {
      loadNextRecipe();
      renderGameScreen(GameState.currentRecipe);
      setSubmitHandler(submitInfinite);
    }, 1000);

  } else {
    flashCells(wrongPositions, wrongItems);
    recordAttempt(false);
    refreshStats();

    if (GameState.attemptsLeft <= 0) {
      // Show solution then next
      showToast(t("wrong"), "error");
      setTimeout(() => {
        showSolutionReveal(() => {
          loadNextRecipe();
          renderGameScreen(GameState.currentRecipe);
          setSubmitHandler(submitInfinite);
        });
      }, 400);
    } else {
      showToast(`${t("wrong")} — ${t("attemptsLeft")}: ${GameState.attemptsLeft}`, "error");
    }
  }
}

// ────────────────────────────────────────────────────────
// MODE 2: HARDCORE
// ────────────────────────────────────────────────────────

/**
 * Start Hardcore mode: init state, build level 1, render screen.
 */
function startHardcoreMode() {
  initMode("hardcore");
  GameState.level = 1;
  GameState.totalFailed = 0;

  const targetRecipe = initHardcoreLevel();
  loadNextRecipe(); // loads hardcoreChain[0]
  renderGameScreen(GameState.currentRecipe);
  setSubmitHandler(submitHardcore);
}

/**
 * Submit handler for Hardcore mode.
 */
function submitHardcore() {
  const { correct, wrongPositions, wrongItems } = validateGrid();

  if (correct) {
    flashCorrect();
    showToast(t("correct"), "success");

    const chainLen = GameState.hardcoreChain.length;
    const isLastStep = GameState.hardcoreStep === chainLen - 1;

    setTimeout(() => {
      if (isLastStep) {
        // Level complete
        GameState.score += 200;
        if (GameState.totalFailed === 0) {
          GameState.score += 100;
          showToast(t("perfect"), "success", 2000);
        }
        showToast(`${t("levelComplete")} ${t("level")} ${GameState.level}`, "success", 2000);

        GameState.level++;
        initHardcoreLevel();
        loadNextRecipe();
        renderGameScreen(GameState.currentRecipe);
        setSubmitHandler(submitHardcore);
      } else {
        // Advance to next step in chain
        GameState.hardcoreStep++;
        loadNextRecipe();
        renderGameScreen(GameState.currentRecipe);
        setSubmitHandler(submitHardcore);
        refreshHardcoreProgress();
      }
    }, 900);

  } else {
    // Wrong attempt
    flashCells(wrongPositions, wrongItems);
    GameState.totalFailed++;
    GameState.streak = 0;
    setStreak(0);
    refreshStats();

    showToast(`${t("wrong")} — ${t("lives")}: ${3 - GameState.totalFailed}`, "error");

    if (GameState.totalFailed >= 3) {
      // Game over
      setTimeout(() => {
        renderGameOverScreen({ score: GameState.score, level: GameState.level });
      }, 800);
    }
  }
}

// ────────────────────────────────────────────────────────
// MODE 3: CRAFTWORDLE
// ────────────────────────────────────────────────────────

/**
 * Start CraftWordle mode.
 * If already played today, show result directly.
 * Otherwise, load today's recipe and start timer.
 */
async function startWordleMode() {
  const today = getTodayDateString();
  const lastDate = getLastWordleDate();
  const savedResult = getWordleResult();

  if (lastDate === today && savedResult) {
    // Already played today — show result screen
    GameState.mode = "wordle";
    GameState.lang = getLang();
    GameState.currentRecipe = RECIPES.find(r => r.id === savedResult.recipeId);
    GameState.wordleAttempts = savedResult.attempts || [];

    const leaderboard = await getWordleLeaderboard(today);
    renderWordleResult({
      attempts: savedResult.attemptsUsed,
      time: savedResult.time,
      emojiGrid: savedResult.emojiGrid,
      recipe: GameState.currentRecipe,
      date: today,
      leaderboard
    });
    return;
  }

  initMode("wordle");
  const recipe = loadNextRecipe();
  renderGameScreen(recipe);
  setSubmitHandler(submitWordle);
  startWordleTimerUI();
}

/**
 * Submit handler for CraftWordle mode.
 */
async function submitWordle() {
  // Snapshot the current grid for emoji display
  const snapshot = GameState.grid.map(row => [...row]);
  GameState.wordleAttempts.push(snapshot);

  const { correct, wrongPositions, wrongItems } = validateGrid();

  if (correct) {
    flashCorrect();
    const elapsed = stopWordleTimerUI();
    GameState.wordleElapsed = elapsed;
    const attemptsUsed = 4 - GameState.attemptsLeft; // attempts used = initial 3 - remaining + 1 correct

    const emojiGrid = buildWordleEmojiGrid();
    const today = getTodayDateString();

    setLastWordleDate(today);
    setWordleResult({
      recipeId: GameState.currentRecipe.id,
      attemptsUsed,
      time: elapsed,
      emojiGrid,
      attempts: GameState.wordleAttempts
    });

    // Save to leaderboard (prompt for name)
    await promptAndSaveWordleScore(attemptsUsed, elapsed, today);

    const leaderboard = await getWordleLeaderboard(today);
    renderWordleResult({
      attempts: attemptsUsed,
      time: elapsed,
      emojiGrid,
      recipe: GameState.currentRecipe,
      date: today,
      leaderboard
    });

  } else {
    flashCells(wrongPositions, wrongItems);
    GameState.attemptsLeft--;
    refreshStats();

    if (GameState.attemptsLeft <= 0) {
      // Failure — show solution
      const elapsed = stopWordleTimerUI();
      GameState.wordleElapsed = elapsed;
      const emojiGrid = buildWordleEmojiGrid();
      const today = getTodayDateString();

      setLastWordleDate(today);
      setWordleResult({
        recipeId: GameState.currentRecipe.id,
        attemptsUsed: 3,
        time: elapsed,
        emojiGrid,
        attempts: GameState.wordleAttempts
      });

      showToast(t("wrong"), "error");
      setTimeout(() => {
        showSolutionReveal(async () => {
          const leaderboard = await getWordleLeaderboard(today);
          renderWordleResult({
            attempts: 3,
            time: elapsed,
            emojiGrid,
            recipe: GameState.currentRecipe,
            date: today,
            leaderboard
          });
        });
      }, 400);
    } else {
      showToast(`${t("wrong")} — ${t("attemptsLeft")}: ${GameState.attemptsLeft}`, "error");
    }
  }
}

/**
 * Prompt user for name and save their Wordle score.
 * Uses a simple inline name-entry overlay.
 */
async function promptAndSaveWordleScore(attempts, time, date) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className = "name-overlay";

    const box = document.createElement("div");
    box.className = "name-box";

    const label = document.createElement("p");
    label.textContent = t("enterName");
    box.appendChild(label);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20;
    input.className = "name-input";
    input.placeholder = t("enterName");
    box.appendChild(input);

    const btn = document.createElement("button");
    btn.className = "action-btn";
    btn.textContent = t("save");
    btn.addEventListener("click", async () => {
      const name = input.value.trim() || "Anon";
      await saveWordleScore({ name, time, attempts }, date);
      overlay.remove();
      resolve();
    });
    box.appendChild(btn);
    overlay.appendChild(box);
    document.getElementById("app").appendChild(overlay);
    input.focus();
  });
}
