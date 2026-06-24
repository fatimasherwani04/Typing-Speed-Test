// ============================================================
//  CODETYPE — typing.js  |  Core game engine
// ============================================================

// ── State ───────────────────────────────────────────────────
let state = {
  mode: 'code',
  subMode: 'javascript',
  timeLimit: 30,
  timeLeft: 30,
  timer: null,
  started: false,
  finished: false,
  text: '',
  charIndex: 0,
  errors: 0,
  totalTyped: 0,
  correctTyped: 0,
  streak: 0,
  bestStreak: 0,
  mistakeMap: {},   // letter -> count
  wpmHistory: [],   // [{t, wpm}] for chart
  wpmInterval: null,
  startTime: null,
};

// ── Init ────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  buildSubOptions();
  loadNewText();
  buildTips();
  buildLeaderboard();
  buildScaleGrid();

  document.getElementById('typingInput').addEventListener('input', onInput);
  document.getElementById('typingInput').addEventListener('keydown', onKeyDown);

  document.addEventListener('keydown', e => {
    if (e.key === 'Tab') { e.preventDefault(); restartTest(); }
  });
});

// ── Mode & Time setters ──────────────────────────────────────
function setMode(m) {
  state.mode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
  // default submode
  if (m === 'code')   state.subMode = 'javascript';
  if (m === 'words')  state.subMode = 'common';
  if (m === 'quotes') state.subMode = 'random';
  buildSubOptions();
  loadNewText();
}
function setTime(t) {
  state.timeLimit = t;
  state.timeLeft  = t;
  document.querySelectorAll('.time-btn').forEach(b => b.classList.toggle('active', +b.dataset.time === t));
  document.getElementById('liveTimer').textContent = t;
  loadNewText();
}
function setSubMode(sm) {
  state.subMode = sm;
  document.querySelectorAll('.sub-btn').forEach(b => b.classList.toggle('active', b.dataset.sub === sm));
  loadNewText();
}

// ── Build sub-option buttons ─────────────────────────────────
function buildSubOptions() {
  const wrap = document.getElementById('subOptions');
  wrap.innerHTML = '';
  if (state.mode === 'code') {
    Object.entries(CONTENT.code.languages).forEach(([key, lang]) => {
      const btn = document.createElement('button');
      btn.className = 'sub-btn' + (state.subMode === key ? ' active' : '');
      btn.dataset.sub = key;
      btn.textContent = lang.label;
      btn.onclick = () => setSubMode(key);
      wrap.appendChild(btn);
    });
  } else if (state.mode === 'words') {
    Object.entries(CONTENT.words.sets).forEach(([key, set]) => {
      const btn = document.createElement('button');
      btn.className = 'sub-btn' + (state.subMode === key ? ' active' : '');
      btn.dataset.sub = key;
      btn.textContent = set.label;
      btn.onclick = () => setSubMode(key);
      wrap.appendChild(btn);
    });
  }
}

// ── Load new text ─────────────────────────────────────────────
function loadNewText() {
  clearInterval(state.timer);
  clearInterval(state.wpmInterval);

  let text = '';
  let badge = '';

  if (state.mode === 'code') {
    const lang = CONTENT.code.languages[state.subMode];
    const snippets = lang.snippets;
    text = snippets[Math.floor(Math.random() * snippets.length)];
    badge = lang.label;
    document.getElementById('langBadge').textContent = lang.label;
    document.getElementById('langBadge').style.color = lang.color;
  } else if (state.mode === 'words') {
    const wordList = CONTENT.words.sets[state.subMode].words;
    const count = state.timeLimit === 30 ? 25 : state.timeLimit === 60 ? 50 : 80;
    const picked = [];
    for (let i = 0; i < count; i++) picked.push(wordList[Math.floor(Math.random() * wordList.length)]);
    text = picked.join(' ');
    document.getElementById('langBadge').textContent = CONTENT.words.sets[state.subMode].label + ' Words';
    document.getElementById('langBadge').style.color = '';
  } else if (state.mode === 'quotes') {
    const items = CONTENT.quotes.items;
    const q = items[Math.floor(Math.random() * items.length)];
    text = q.text + ' — ' + q.author;
    document.getElementById('langBadge').textContent = 'Quote';
    document.getElementById('langBadge').style.color = '';
  }

  state.text = text;
  state.charIndex   = 0;
  state.errors      = 0;
  state.totalTyped  = 0;
  state.correctTyped = 0;
  state.streak      = 0;
  state.bestStreak  = 0;
  state.mistakeMap  = {};
  state.wpmHistory  = [];
  state.started     = false;
  state.finished    = false;
  state.startTime   = null;
  state.timeLeft    = state.timeLimit;

  document.getElementById('typingInput').value = '';
  document.getElementById('typingInput').disabled = false;
  document.getElementById('typingInput').classList.remove('error');
  document.getElementById('resultsOverlay').classList.add('hidden');

  document.getElementById('liveWpm').textContent    = '0';
  document.getElementById('liveAcc').textContent    = '100';
  document.getElementById('liveTimer').textContent  = state.timeLimit;
  document.getElementById('liveErrors').textContent = '0';
  document.getElementById('liveStreak').textContent = '0';
  document.getElementById('progressBar').style.width = '0%';

  setStatus('Ready');
  renderText();
  drawChart();
}

// ── Render text display ──────────────────────────────────────
function renderText() {
  const display = document.getElementById('textDisplay');
  display.innerHTML = [...state.text].map((ch, i) => {
    let cls = 'char';
    if (i < state.charIndex)      cls += ' correct';
    else if (i === state.charIndex) cls += ' current';
    return `<span class="${cls}" data-i="${i}">${ch === ' ' ? '&nbsp;' : ch}</span>`;
  }).join('');
}

function updateChar(i, type) {
  const el = document.querySelector(`.char[data-i="${i}"]`);
  if (!el) return;
  el.className = 'char ' + type;
}
function setCurrentChar(i) {
  document.querySelectorAll('.char.current').forEach(el => el.classList.remove('current'));
  const el = document.querySelector(`.char[data-i="${i}"]`);
  if (el) el.classList.add('current');
}

// ── Input handler ─────────────────────────────────────────────
function onInput(e) {
  if (state.finished) return;
  const val = e.target.value;
  if (!val) return;

  if (!state.started) startTest();

  const typed = val[val.length - 1];
  const expected = state.text[state.charIndex];

  e.target.value = '';

  state.totalTyped++;

  if (typed === expected) {
    updateChar(state.charIndex, 'correct');
    state.charIndex++;
    state.correctTyped++;
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    document.getElementById('liveStreak').textContent = state.bestStreak;

    // scroll current char into view
    setCurrentChar(state.charIndex);

    // progress
    const pct = (state.charIndex / state.text.length) * 100;
    document.getElementById('progressBar').style.width = pct + '%';

    if (state.charIndex >= state.text.length) finishTest();
  } else {
    updateChar(state.charIndex, 'wrong');
    state.errors++;
    state.streak = 0;
    document.getElementById('liveStreak').textContent = 0;

    // Track mistake map
    const key = expected.toUpperCase();
    state.mistakeMap[key] = (state.mistakeMap[key] || 0) + 1;

    // Error flash
    const input = document.getElementById('typingInput');
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 150);
    document.getElementById('liveErrors').textContent = state.errors;
  }

  updateLiveStats();
}

function onKeyDown(e) {
  // Allow backspace for UX feel but don't advance index
  if (e.key === 'Backspace') e.preventDefault();
}

// ── Start / Stop ──────────────────────────────────────────────
function startTest() {
  state.started   = true;
  state.startTime = Date.now();
  setStatus('Typing...');

  state.timer = setInterval(() => {
    state.timeLeft--;
    document.getElementById('liveTimer').textContent = state.timeLeft;
    if (state.timeLeft <= 0) finishTest();
  }, 1000);

  state.wpmInterval = setInterval(() => {
    const elapsed = (Date.now() - state.startTime) / 60000;
    const wpm = elapsed > 0 ? Math.round((state.correctTyped / 5) / elapsed) : 0;
    state.wpmHistory.push({ t: Math.round((Date.now() - state.startTime) / 1000), wpm });
    drawChart();
  }, 1000);
}

function finishTest() {
  if (state.finished) return;
  state.finished = true;
  clearInterval(state.timer);
  clearInterval(state.wpmInterval);
  document.getElementById('typingInput').disabled = true;
  setStatus('Done!');

  const elapsed = state.startTime ? (Date.now() - state.startTime) / 60000 : state.timeLimit / 60;
  const wpm = Math.round((state.correctTyped / 5) / elapsed) || 0;
  const acc = state.totalTyped > 0 ? Math.round((state.correctTyped / state.totalTyped) * 100) : 100;
  const timeTaken = Math.round(elapsed * 60);

  showResults(wpm, acc, timeTaken);
}

function updateLiveStats() {
  if (!state.startTime) return;
  const elapsed = (Date.now() - state.startTime) / 60000;
  const wpm = elapsed > 0 ? Math.round((state.correctTyped / 5) / elapsed) : 0;
  const acc = state.totalTyped > 0 ? Math.round((state.correctTyped / state.totalTyped) * 100) : 100;
  document.getElementById('liveWpm').textContent = wpm;
  document.getElementById('liveAcc').textContent = acc;
}

// ── Results ───────────────────────────────────────────────────
function showResults(wpm, acc, timeTaken) {
  const level = getLevel(wpm);

  document.getElementById('resWpm').textContent     = wpm;
  document.getElementById('resAcc').textContent     = acc + '%';
  document.getElementById('resErrors').textContent  = state.errors;
  document.getElementById('resStreak').textContent  = state.bestStreak;
  document.getElementById('resChars').textContent   = state.correctTyped;
  document.getElementById('resTime').textContent    = timeTaken + 's';
  document.getElementById('resultsLevel').textContent = level.emoji + ' ' + level.label.toUpperCase();
  document.getElementById('levelMessage').textContent = level.msg;

  buildHeatmap();
  document.getElementById('resultsOverlay').classList.remove('hidden');
}

// ── Heatmap ───────────────────────────────────────────────────
const KB_ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L',';'],
  ['Z','X','C','V','B','N','M',',','.'],
];
function buildHeatmap() {
  const wrap = document.getElementById('heatmapKeyboard');
  const max = Math.max(1, ...Object.values(state.mistakeMap));
  wrap.innerHTML = KB_ROWS.map(row =>
    `<div class="heatmap-row">${row.map(k => {
      const count = state.mistakeMap[k] || 0;
      let cls = 'hm-key';
      if (count > 0)           cls += ' mistake-1';
      if (count >= max * 0.5)  cls += ' mistake-2';
      if (count >= max * 0.85) cls += ' mistake-3';
      return `<div class="${cls}" title="${count} mistake${count !== 1 ? 's' : ''}">${k}</div>`;
    }).join('')}</div>`
  ).join('');
}

// ── WPM Chart ─────────────────────────────────────────────────
function drawChart() {
  const canvas = document.getElementById('wpmChart');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 700;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  if (state.wpmHistory.length < 2) {
    ctx.fillStyle = 'rgba(0,245,255,0.1)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(0,245,255,0.3)';
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Start typing to see your WPM chart...', W / 2, H / 2 + 4);
    return;
  }

  const maxWpm = Math.max(10, ...state.wpmHistory.map(p => p.wpm));
  const pad = 8;

  // Background
  ctx.fillStyle = 'rgba(0,245,255,0.04)';
  ctx.fillRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(0,245,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const y = pad + ((H - pad * 2) / 4) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Area fill
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, 'rgba(0,245,255,0.3)');
  gradient.addColorStop(1, 'rgba(0,245,255,0)');

  ctx.beginPath();
  state.wpmHistory.forEach((pt, i) => {
    const x = pad + (i / (state.wpmHistory.length - 1)) * (W - pad * 2);
    const y = H - pad - (pt.wpm / maxWpm) * (H - pad * 2);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  const lastX = pad + (W - pad * 2);
  const lastY = H - pad;
  ctx.lineTo(lastX, lastY); ctx.lineTo(pad, lastY);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#00f5ff';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  state.wpmHistory.forEach((pt, i) => {
    const x = pad + (i / (state.wpmHistory.length - 1)) * (W - pad * 2);
    const y = H - pad - (pt.wpm / maxWpm) * (H - pad * 2);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Dots
  state.wpmHistory.forEach((pt, i) => {
    const x = pad + (i / (state.wpmHistory.length - 1)) * (W - pad * 2);
    const y = H - pad - (pt.wpm / maxWpm) * (H - pad * 2);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#00f5ff';
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

// ── Leaderboard ───────────────────────────────────────────────
function buildLeaderboard() {
  const wrap = document.getElementById('leaderboardTable');
  const board = getLeaderboard();
  if (!board.length) {
    wrap.innerHTML = '<div class="lb-empty">No scores yet. Complete a test to appear here!</div>';
    return;
  }
  wrap.innerHTML = board.map((entry, i) => `
    <div class="lb-row rank-${i + 1}">
      <span class="lb-rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '#' + (i + 1)}</span>
      <span class="lb-name">${entry.name || 'Anonymous'}</span>
      <span class="lb-wpm">${entry.wpm} WPM</span>
      <span class="lb-acc">${entry.accuracy}%</span>
      <span class="lb-mode">${entry.mode}</span>
      <span class="lb-date">${entry.date}</span>
    </div>`).join('');
}

function saveScore() {
  const name = document.getElementById('playerName').value.trim() || 'Anonymous';
  const wpm = parseInt(document.getElementById('resWpm').textContent);
  const acc = document.getElementById('resAcc').textContent;
  const mode = state.mode + (state.subMode ? ' / ' + state.subMode : '');
  saveToLeaderboard(name, wpm, acc, mode);
  buildLeaderboard();
  const btn = document.querySelector('.save-btn');
  btn.textContent = '✓ Saved!';
  btn.style.background = 'rgba(52,211,153,0.2)';
  btn.style.borderColor = '#34d399';
  btn.style.color = '#34d399';
  setTimeout(() => {
    btn.textContent = 'Save to Leaderboard';
    btn.style = '';
  }, 2000);
}

function clearLeaderboard() {
  if (confirm('Clear all leaderboard scores?')) {
    localStorage.removeItem('ct_leaderboard');
    buildLeaderboard();
  }
}

// ── Tips ──────────────────────────────────────────────────────
function buildTips() {
  const speedWrap  = document.getElementById('speedTipsGrid');
  const codeWrap   = document.getElementById('codingTipsGrid');
  if (speedWrap) {
    speedWrap.innerHTML = TIPS.speed.map(t => `
      <div class="tip-card">
        <div class="tip-icon">${t.icon}</div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-desc">${t.desc}</div>
      </div>`).join('');
  }
  if (codeWrap) {
    codeWrap.innerHTML = TIPS.coding.map(t => `
      <div class="tip-card">
        <div class="tip-icon">${t.icon}</div>
        <div class="tip-title">${t.title}</div>
        <div class="tip-desc">${t.desc}</div>
      </div>`).join('');
  }
}

function buildScaleGrid() {
  const wrap = document.getElementById('scaleGrid');
  if (!wrap) return;
  wrap.innerHTML = Object.values(TIPS.levels).map(lv => `
    <div class="scale-card" style="border-color:${lv.color}22">
      <div class="scale-emoji">${lv.emoji}</div>
      <div class="scale-label" style="color:${lv.color}">${lv.label}</div>
      <div class="scale-range">${lv.min}${lv.max < 999 ? ' – ' + lv.max : '+'} WPM</div>
    </div>`).join('');
}

// ── Navigation ────────────────────────────────────────────────
function switchView(name) {
  document.querySelectorAll('.view').forEach(v => {
    v.classList.toggle('active', v.id === 'view-' + name);
    v.classList.toggle('hidden', v.id !== 'view-' + name);
  });
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  document.getElementById('resultsOverlay').classList.add('hidden');
  if (name === 'leaderboard') buildLeaderboard();
}

// ── Restart ───────────────────────────────────────────────────
function restartTest() {
  document.getElementById('resultsOverlay').classList.add('hidden');
  loadNewText();
  setTimeout(() => document.getElementById('typingInput').focus(), 50);
}
function restartFromResults() {
  switchView('test');
  restartTest();
}

// ── Utility ───────────────────────────────────────────────────
function setStatus(msg) {
  const el = document.getElementById('statusText');
  if (el) el.textContent = msg;
}

window.addEventListener('resize', drawChart);