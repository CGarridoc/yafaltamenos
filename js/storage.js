// ============================================================
// storage.js — CraftQuiz localStorage persistence layer
// ============================================================

const KEYS = {
  HIGH_SCORE:         "craftquiz_highscore_infinite",
  STREAK:             "craftquiz_streak",
  HARDCORE_LB:        "craftquiz_hardcore_lb",
  WORDLE_DATE:        "craftquiz_wordle_date",
  WORDLE_RESULT:      "craftquiz_wordle_result",
  LANG:               "craftquiz_lang"
};

// ── Infinite mode high score ─────────────────────────────
function getHighScore() {
  return parseInt(localStorage.getItem(KEYS.HIGH_SCORE) || "0", 10);
}
function setHighScore(score) {
  localStorage.setItem(KEYS.HIGH_SCORE, String(score));
}

// ── Streak ───────────────────────────────────────────────
function getStreak() {
  return parseInt(localStorage.getItem(KEYS.STREAK) || "0", 10);
}
function setStreak(n) {
  localStorage.setItem(KEYS.STREAK, String(n));
}

// ── Hardcore leaderboard (top 10) ───────────────────────
function getHardcoreLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.HARDCORE_LB) || "[]");
  } catch {
    return [];
  }
}

/**
 * Save a hardcore score entry.
 * @param {{name:string, score:number, level:number, date:string}} entry
 */
function saveHardcoreScore(entry) {
  const board = getHardcoreLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score || b.level - a.level);
  const top10 = board.slice(0, 10);
  localStorage.setItem(KEYS.HARDCORE_LB, JSON.stringify(top10));
  return top10;
}

// ── CraftWordle date tracking ────────────────────────────
function getLastWordleDate() {
  return localStorage.getItem(KEYS.WORDLE_DATE) || null;
}
function setLastWordleDate(date) {
  localStorage.setItem(KEYS.WORDLE_DATE, date);
}

function getWordleResult() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.WORDLE_RESULT) || "null");
  } catch {
    return null;
  }
}
function setWordleResult(obj) {
  localStorage.setItem(KEYS.WORDLE_RESULT, JSON.stringify(obj));
}

// ── Language preference ──────────────────────────────────
function getLang() {
  return localStorage.getItem(KEYS.LANG) || "es";
}
function setLang(lang) {
  localStorage.setItem(KEYS.LANG, lang);
}

// ── CraftWordle shared leaderboard ──────────────────────
// Uses window.storage (Artifact storage API) when available,
// falls back to localStorage for offline use.

/**
 * Fetch today's CraftWordle leaderboard.
 * Returns array of {name, time, attempts, timestamp}, sorted:
 *   attempts ASC, then time ASC (top 10).
 * @param {string} date  YYYY-MM-DD
 * @returns {Promise<Array>}
 */
async function getWordleLeaderboard(date) {
  const key = `craftwordle_${date}`;
  try {
    if (window.storage && typeof window.storage.getItem === "function") {
      const raw = await window.storage.getItem(key, { shared: true });
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return arr
        .sort((a, b) => a.attempts - b.attempts || a.time - b.time)
        .slice(0, 10);
    }
  } catch (e) {
    console.warn("Artifact storage unavailable, using localStorage fallback.");
  }
  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return arr
      .sort((a, b) => a.attempts - b.attempts || a.time - b.time)
      .slice(0, 10);
  } catch {
    return [];
  }
}

/**
 * Save a CraftWordle score for today.
 * @param {{name:string, time:number, attempts:number}} entry
 * @param {string} date  YYYY-MM-DD
 * @returns {Promise<Array>}  updated top-10 leaderboard
 */
async function saveWordleScore(entry, date) {
  const key = `craftwordle_${date}`;
  const newEntry = { ...entry, timestamp: Date.now() };
  try {
    if (window.storage && typeof window.storage.getItem === "function") {
      const raw = await window.storage.getItem(key, { shared: true });
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(newEntry);
      await window.storage.setItem(key, JSON.stringify(arr), { shared: true });
      return arr
        .sort((a, b) => a.attempts - b.attempts || a.time - b.time)
        .slice(0, 10);
    }
  } catch (e) {
    console.warn("Artifact storage unavailable, using localStorage fallback.");
  }
  // Fallback: localStorage
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push(newEntry);
    localStorage.setItem(key, JSON.stringify(arr));
    return arr
      .sort((a, b) => a.attempts - b.attempts || a.time - b.time)
      .slice(0, 10);
  } catch {
    return [];
  }
}
