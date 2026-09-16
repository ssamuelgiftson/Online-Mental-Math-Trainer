// ============================================================
//  MENTAL MATH TRAINER - v3.2.0
//  Complete JavaScript - All Features Integrated
// ============================================================

// ============================================================
//  STATE MANAGEMENT
// ============================================================
let currentOperation = '+';
let currentDifficulty = 'easy';
let questionCount = 10;
let currentAnswer = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let totalCorrect = 0;
let totalWrong = 0;
let questionsAnswered = 0;
let timerInterval = null;
let seconds = 0;
let isPlaying = false;

let playerXP = 0;
let playerLevel = 1;
const XP_PER_LEVEL = 100;

// ============================================================
//  SOUND EFFECTS
// ============================================================
let soundEnabled = true;

function playSound(type) {
    if (!soundEnabled) return;
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        switch (type) {
            case 'correct':
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4); break;
            case 'wrong':
                osc.frequency.setValueAtTime(311.13, ctx.currentTime);
                osc.frequency.setValueAtTime(233.08, ctx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3); break;
            case 'levelup':
                osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5); break;
            case 'click':
                osc.frequency.setValueAtTime(800, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08); break;
            case 'gameover':
                osc.frequency.setValueAtTime(392, ctx.currentTime);
                osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.2);
                osc.frequency.setValueAtTime(329.63, ctx.currentTime + 0.4);
                osc.frequency.setValueAtTime(261.63, ctx.currentTime + 0.6);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.8); break;
            case 'badge':
                osc.frequency.setValueAtTime(659.25, ctx.currentTime);
                osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);
                osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3);
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.6); break;
        }
    } catch (e) { console.log('Sound not supported'); }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle');
    btn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    localStorage.setItem('mathSoundEnabled', soundEnabled);
    playSound('click');
}

function loadSoundPreference() {
    const saved = localStorage.getItem('mathSoundEnabled');
    if (saved !== null) soundEnabled = saved === 'true';
    const btn = document.getElementById('sound-toggle');
    if (btn) btn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
}

// ============================================================
//  CONFETTI
// ============================================================
function createConfetti() {
    const colors = ['#f7971e', '#ffd200', '#a8e063', '#56ab2f', '#6495ed', '#ff6b6b'];
    for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece';
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 0.5 + 's';
        c.style.animationDuration = (Math.random() * 1 + 1) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2000);
    }
}

function createBigConfetti() {
    const colors = ['#f7971e', '#ffd200', '#a8e063', '#56ab2f', '#6495ed', '#ff6b6b', '#ba55d3'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div');
        c.className = 'confetti-piece big';
        c.style.left = Math.random() * 100 + '%';
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        c.style.animationDelay = Math.random() * 1 + 's';
        c.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3500);
    }
}

// ============================================================
//  LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 500); }
    }, 1000);
});

// ============================================================
//  EXIT WARNING
// ============================================================
window.addEventListener('beforeunload', (e) => {
    if (isPlaying || speedPlaying || chainPlaying || tfPlaying || missingPlaying || duelPlaying || estPlaying || expoPlaying) {
        e.preventDefault();
        e.returnValue = 'You have an active quiz!';
    }
});

// ============================================================
//  INITIALIZATION
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    loadPlayerProgress();
    loadSoundPreference();
    checkDailyStreak();
    showSection('practice');

    const streakFlame = document.getElementById('streak-flame');
    if (streakFlame) streakFlame.addEventListener('click', () => showSection('streak'));
});

// ============================================================
//  NAVIGATION
// ============================================================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('hidden');
    playSound('click');
    if (sectionId === 'tables') { generateTables(); generateReferenceGrid(); }
    if (sectionId === 'exponents') generatePowersTable();
    if (sectionId === 'stats') loadStats();
    if (sectionId === 'badges') renderBadges();
    if (sectionId === 'streak') { updateStreakDisplay(); renderMilestones(); renderStreakCalendar(); }
}

function toggleShortcuts() {
    const panel = document.getElementById('shortcuts-panel');
    if (panel) { panel.classList.toggle('hidden'); playSound('click'); }
}

// ============================================================
//  SETTINGS
// ============================================================
function setOperation(op) {
    currentOperation = op;
    document.querySelectorAll('.op-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.op === op));
    playSound('click');
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.diff === diff));
    playSound('click');
}

function setQuestionCount(count) {
    questionCount = count;
    document.querySelectorAll('.ques-btn').forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.ques) === count));
    playSound('click');
}

// ============================================================
//  NUMBER GENERATION
// ============================================================
function getRange() {
    switch (currentDifficulty) {
        case 'easy': return { min: 1, max: 12 };
        case 'medium': return { min: 10, max: 50 };
        case 'hard': return { min: 25, max: 999 };
        default: return { min: 1, max: 12 };
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const { min, max } = getRange();
    let a, b, questionText, op = currentOperation;
    if (op === 'mix') { const ops = ['+', '-', '×', '÷']; op = ops[randInt(0, 3)]; }
    const opNames = { '+': '➕ Addition', '-': '➖ Subtraction', '×': '✖️ Multiplication', '÷': '➗ Division', '^': '🔢 Exponents' };
    document.getElementById('operation-badge').textContent = opNames[op] || opNames[currentOperation];

    switch (op) {
        case '+':
            a = randInt(min, max); b = randInt(min, max);
            currentAnswer = a + b; questionText = `${a} + ${b} = ?`; break;
        case '-':
            a = randInt(min, max); b = randInt(min, max);
            if (b > a) [a, b] = [b, a];
            currentAnswer = a - b; questionText = `${a} − ${b} = ?`; break;
        case '×':
            if (currentDifficulty === 'hard') { a = randInt(10, 99); b = randInt(2, 25); }
            else { a = randInt(min, max); b = randInt(min, max); }
            currentAnswer = a * b; questionText = `${a} × ${b} = ?`; break;
        case '÷':
            b = randInt(Math.max(min, 2), Math.min(max, currentDifficulty === 'hard' ? 25 : 12));
            currentAnswer = randInt(min, Math.min(max, 20));
            a = currentAnswer * b; questionText = `${a} ÷ ${b} = ?`; break;
        case '^':
            a = randInt(2, currentDifficulty === 'hard' ? 15 : 10);
            b = randInt(2, currentDifficulty === 'hard' ? 4 : 3);
            currentAnswer = Math.pow(a, b); questionText = `${a}^${b} = ?`; break;
    }

    document.getElementById('question').textContent = questionText;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    if (questionCount > 0) document.getElementById('question-counter').textContent = `Q: ${questionsAnswered + 1} / ${questionCount}`;
    else document.getElementById('question-counter').textContent = `Q: ${questionsAnswered + 1} / ♾️`;
}

// ============================================================
//  QUIZ CONTROL
// ============================================================
function startQuiz() {
    isPlaying = true; score = 0; streak = 0; bestStreak = 0;
    totalCorrect = 0; totalWrong = 0; questionsAnswered = 0; seconds = 0;
    playSound('click'); updateScoreDisplay(); generateQuestion();
    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('start-btn').textContent = '🔄 Restart';
    document.getElementById('results').classList.add('hidden');
    if (questionCount > 0) { document.getElementById('progress-container').style.display = 'flex'; updateProgress(); }
    else document.getElementById('progress-container').style.display = 'none';
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const m = Math.floor(seconds / 60), s = seconds % 60;
        document.getElementById('timer').textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopQuiz() { if (!isPlaying) return; playSound('gameover'); endQuiz(); }

function checkAnswer() {
    if (!isPlaying) return;
    const userAnswer = parseFloat(document.getElementById('answer-input').value);
    const feedback = document.getElementById('feedback');
    if (isNaN(userAnswer)) { feedback.textContent = '⚠️ Please enter a number!'; feedback.className = 'feedback wrong'; playSound('wrong'); return; }
    questionsAnswered++;
    if (userAnswer === currentAnswer) {
        totalCorrect++; streak++;
        const multiplier = currentDifficulty === 'easy' ? 1 : currentDifficulty === 'medium' ? 2 : 3;
        const points = 10 * multiplier; score += points;
        if (streak > bestStreak) bestStreak = streak;
        feedback.textContent = `✅ Correct! +${points} pts | Streak: ${streak} 🔥`;
        feedback.className = 'feedback correct'; playSound('correct'); addXP(points);
        if (streak === 5) createConfetti();
        if (streak === 10 || streak === 20) createBigConfetti();
    } else {
        totalWrong++; streak = 0;
        feedback.textContent = `❌ Wrong! Answer: ${currentAnswer}`;
        feedback.className = 'feedback wrong'; playSound('wrong');
    }
    updateScoreDisplay(); updateProgress();
    if (questionCount > 0 && questionsAnswered >= questionCount) setTimeout(() => endQuiz(), 1000);
    else setTimeout(() => generateQuestion(), 1000);
}

function skipQuestion() {
    if (!isPlaying) return;
    questionsAnswered++; totalWrong++; streak = 0;
    document.getElementById('feedback').textContent = `⏭️ Skipped! Answer: ${currentAnswer}`;
    document.getElementById('feedback').className = 'feedback wrong';
    playSound('wrong'); updateScoreDisplay(); updateProgress();
    if (questionCount > 0 && questionsAnswered >= questionCount) setTimeout(() => endQuiz(), 800);
    else setTimeout(() => generateQuestion(), 800);
}

function endQuiz() {
    isPlaying = false; clearInterval(timerInterval); playSound('gameover');
    document.getElementById('answer-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('start-btn').textContent = '▶️ Start Quiz';
    const total = totalCorrect + totalWrong;
    const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
    const mins = Math.floor(seconds / 60), secs = seconds % 60;
    document.getElementById('total-correct').textContent = totalCorrect;
    document.getElementById('total-wrong').textContent = totalWrong;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('total-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('xp-earned').textContent = score;
    document.getElementById('results').classList.remove('hidden');
    if (accuracy >= 90) createBigConfetti(); else if (accuracy >= 70) createConfetti();
    saveStats(total, totalCorrect, bestStreak, score); checkBadges();
}

function updateScoreDisplay() { document.getElementById('score-display').textContent = `Score: ${score} | Streak: ${streak} 🔥`; }
function updateProgress() {
    if (questionCount > 0) {
        const pct = Math.round((questionsAnswered / questionCount) * 100);
        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-text').textContent = pct + '%';
    }
}

// ============================================================
//  TABLES (1-35)
// ============================================================
function generateTables() {
    const start = parseInt(document.getElementById('table-start').value);
    const end = parseInt(document.getElementById('table-end').value);
    const mult = parseInt(document.getElementById('table-multiplier').value);
    const type = document.getElementById('table-type').value;
    const container = document.getElementById('tables-container');
    container.innerHTML = '';
    for (let n = start; n <= end; n++) {
        const card = document.createElement('div');
        card.className = 'table-card'; card.setAttribute('data-table-number', n);
        let title = '', rows = '';
        for (let i = 1; i <= mult; i++) {
            let expr, res;
            switch (type) {
                case 'multiplication': title = `${n} × Table`; expr = `${n} × ${i}`; res = n * i; break;
                case 'addition': title = `${n} + Table`; expr = `${n} + ${i}`; res = n + i; break;
                case 'subtraction': title = `${n + mult} − Table`; expr = `${n + mult} − ${i}`; res = (n + mult) - i; break;
                case 'division': title = `÷ ${n} Table`; expr = `${n * i} ÷ ${n}`; res = i; break;
            }
            rows += `<tr><td>${expr}</td><td>= ${res}</td></tr>`;
        }
        card.innerHTML = `<h3>${title}</h3><table>${rows}</table>`;
        container.appendChild(card);
    }
}

function searchTable() {
    const val = document.getElementById('table-search-input').value.trim();
    document.querySelectorAll('.table-card').forEach(card => {
        if (!val) { card.style.display = 'block'; return; }
        card.style.display = card.getAttribute('data-table-number') === val ? 'block' : 'none';
    });
}

function printTables() {
    const content = document.getElementById('tables-container').innerHTML;
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><title>Math Tables</title><style>body{font-family:Arial,sans-serif;padding:20px;color:#333}h1{text-align:center;color:#f7971e;margin-bottom:20px}.tables-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:15px}.table-card{border:1px solid #ddd;border-radius:8px;padding:12px;break-inside:avoid}.table-card h3{text-align:center;color:#f7971e;margin-bottom:8px}table{width:100%;border-collapse:collapse}td{padding:3px 8px;border-bottom:1px solid #eee;font-size:.9rem}td:last-child{text-align:right;font-weight:bold}.footer{text-align:center;margin-top:20px;color:#999;font-size:.8rem}</style></head><body><h1>🧮 Mental Math Trainer - Tables</h1><div class="tables-grid">${content}</div><div class="footer">Generated by Mental Math Trainer | ${new Date().toLocaleDateString()}</div><script>window.print();<\/script></body></html>`);
}

// ============================================================
//  REFERENCE GRID
// ============================================================
function generateReferenceGrid() {
    const size = parseInt(document.getElementById('grid-size').value);
    const container = document.getElementById('reference-grid');
    let html = '<table><thead><tr><th class="header-cell">×</th>';
    for (let i = 1; i <= size; i++) html += `<th>${i}</th>`;
    html += '</tr></thead><tbody>';
    for (let row = 1; row <= size; row++) {
        html += `<tr><th class="header-cell">${row}</th>`;
        for (let col = 1; col <= size; col++) html += `<td>${row * col}</td>`;
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============================================================
//  EXPONENTS
// ============================================================
function generatePowersTable() {
    const container = document.getElementById('powers-table');
    let html = '<table><thead><tr><th class="header-cell">Base</th>';
    for (let p = 2; p <= 6; p++) html += `<th>^${p}</th>`;
    html += '</tr></thead><tbody>';
    for (let base = 2; base <= 15; base++) {
        html += `<tr><th class="header-cell">${base}</th>`;
        for (let p = 2; p <= 6; p++) html += `<td>${Math.pow(base, p).toLocaleString()}</td>`;
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

let expoPlaying = false, expoAnswer = 0, expoCorrect = 0, expoTotal = 0;

function startExpoPractice() {
    expoPlaying = true; expoCorrect = 0; expoTotal = 0;
    document.getElementById('expo-answer').disabled = false;
    document.getElementById('expo-submit-btn').disabled = false;
    document.getElementById('expo-stop-btn').disabled = false;
    document.getElementById('expo-start-btn').textContent = '🔄 Restart';
    playSound('click'); generateExpoQuestion();
}

function stopExpoPractice() {
    expoPlaying = false;
    document.getElementById('expo-answer').disabled = true;
    document.getElementById('expo-submit-btn').disabled = true;
    document.getElementById('expo-stop-btn').disabled = true;
    document.getElementById('expo-start-btn').textContent = '▶️ Start';
    const acc = expoTotal > 0 ? Math.round((expoCorrect / expoTotal) * 100) : 0;
    document.getElementById('expo-score').textContent = `✅ ${expoCorrect}/${expoTotal} | Accuracy: ${acc}%`;
    playSound('gameover');
}

function generateExpoQuestion() {
    const base = randInt(2, 12), exp = randInt(2, 4);
    expoAnswer = Math.pow(base, exp);
    document.getElementById('expo-question').textContent = `${base}^${exp} = ?`;
    document.getElementById('expo-answer').value = '';
    document.getElementById('expo-answer').focus();
    document.getElementById('expo-feedback').textContent = '';
    document.getElementById('expo-feedback').className = 'feedback';
}

function checkExpoAnswer() {
    if (!expoPlaying) return;
    const userAns = parseFloat(document.getElementById('expo-answer').value);
    const feedback = document.getElementById('expo-feedback');
    if (isNaN(userAns)) { feedback.textContent = '⚠️ Enter a number!'; feedback.className = 'feedback wrong'; playSound('wrong'); return; }
    expoTotal++;
    if (userAns === expoAnswer) { expoCorrect++; feedback.textContent = '✅ Correct!'; feedback.className = 'feedback correct'; playSound('correct'); addXP(15); }
    else { feedback.textContent = `❌ Wrong! Answer: ${expoAnswer}`; feedback.className = 'feedback wrong'; playSound('wrong'); }
    const acc = expoTotal > 0 ? Math.round((expoCorrect / expoTotal) * 100) : 0;
    document.getElementById('expo-score').textContent = `✅ ${expoCorrect}/${expoTotal} | Accuracy: ${acc}%`;
    setTimeout(() => generateExpoQuestion(), 1000);
}

// ============================================================
//  GAME 1: SPEED ROUND
// ============================================================
let speedPlaying = false, speedScore = 0, speedCorrect = 0, speedAnswer = 0, speedTimeLeft = 60, speedInterval = null;

function startSpeedGame() {
    speedPlaying = true; speedScore = 0; speedCorrect = 0; speedTimeLeft = 60;
    document.getElementById('speed-answer').disabled = false;
    document.getElementById('speed-stop-btn').disabled = false;
    document.getElementById('speed-start-btn').textContent = '🔄 Restart';
    document.getElementById('speed-results').classList.add('hidden');
    document.getElementById('speed-timer-fill').style.background = 'linear-gradient(90deg, #56ab2f, #a8e063)';
    playSound('click'); generateSpeedQuestion();
    clearInterval(speedInterval);
    speedInterval = setInterval(() => {
        speedTimeLeft -= 0.1;
        document.getElementById('speed-time-left').textContent = `⏱️ ${speedTimeLeft.toFixed(1)}s`;
        document.getElementById('speed-timer-fill').style.width = `${(speedTimeLeft / 60) * 100}%`;
        if (speedTimeLeft <= 10) document.getElementById('speed-timer-fill').style.background = 'linear-gradient(90deg, #e53935, #ff6b6b)';
        if (speedTimeLeft <= 0) stopSpeedGame();
    }, 100);
}

function generateSpeedQuestion() {
    const a = randInt(2, 20), b = randInt(2, 20), ops = ['+', '-', '×'], op = ops[randInt(0, 2)];
    switch (op) {
        case '+': speedAnswer = a + b; break;
        case '-': speedAnswer = Math.abs(a - b); break;
        case '×': speedAnswer = a * b; break;
    }
    const display = op === '-' ? `${Math.max(a, b)} − ${Math.min(a, b)}` : `${a} ${op} ${b}`;
    document.getElementById('speed-question').textContent = `${display} = ?`;
    document.getElementById('speed-answer').value = '';
    document.getElementById('speed-answer').focus();
}

function checkSpeedAnswer() {
    if (!speedPlaying) return;
    const userAns = parseFloat(document.getElementById('speed-answer').value);
    const feedback = document.getElementById('speed-feedback');
    if (isNaN(userAns)) return;
    if (userAns === speedAnswer) { speedCorrect++; speedScore += 10; feedback.textContent = '✅ Correct!'; feedback.className = 'feedback correct'; playSound('correct'); addXP(10); }
    else { feedback.textContent = `❌ Answer: ${speedAnswer}`; feedback.className = 'feedback wrong'; playSound('wrong'); }
    document.getElementById('speed-score').textContent = `Score: ${speedScore}`;
    document.getElementById('speed-correct-count').textContent = `✅ ${speedCorrect}`;
    setTimeout(() => { if (speedPlaying) { generateSpeedQuestion(); feedback.textContent = ''; feedback.className = 'feedback'; } }, 400);
}

function stopSpeedGame() {
    speedPlaying = false; clearInterval(speedInterval);
    document.getElementById('speed-answer').disabled = true;
    document.getElementById('speed-stop-btn').disabled = true;
    document.getElementById('speed-start-btn').textContent = '▶️ Start';
    playSound('gameover');
    document.getElementById('speed-results').innerHTML = `<h3>🏆 Speed Round Results</h3><div class="results-grid"><div class="result-item"><span class="result-label">Score</span><span class="result-value">${speedScore}</span></div><div class="result-item correct-bg"><span class="result-label">Correct</span><span class="result-value">${speedCorrect}</span></div></div>`;
    document.getElementById('speed-results').classList.remove('hidden');
    if (speedCorrect >= 20) createBigConfetti(); else if (speedCorrect >= 10) createConfetti();
    saveStats(speedCorrect, speedCorrect, speedCorrect, speedScore); checkBadges();
}

// ============================================================
//  GAME 2: NUMBER CHAIN
// ============================================================
let chainPlaying = false, chainScore = 0, chainLength = 0, chainCurrent = 0, chainAnswer = 0;

function startChainGame() {
    chainPlaying = true; chainScore = 0; chainLength = 0; chainCurrent = randInt(5, 20);
    document.getElementById('chain-answer').disabled = false;
    document.getElementById('chain-submit-btn').disabled = false;
    document.getElementById('chain-stop-btn').disabled = false;
    document.getElementById('chain-start-btn').textContent = '🔄 Restart';
    playSound('click'); generateChainQuestion();
}

function generateChainQuestion() {
    const ops = ['+', '-', '×'], op = ops[randInt(0, 2)];
    let b;
    switch (op) {
        case '+': b = randInt(1, 15); chainAnswer = chainCurrent + b; break;
        case '-': b = randInt(1, Math.min(chainCurrent - 1, 15)); if (b <= 0) b = 1; chainAnswer = chainCurrent - b; break;
        case '×': b = randInt(2, 5); chainAnswer = chainCurrent * b; break;
    }
    const opSym = op === '-' ? '−' : op;
    document.getElementById('chain-question').textContent = `${chainCurrent} ${opSym} ${b} = ?`;
    document.getElementById('chain-answer').value = '';
    document.getElementById('chain-answer').focus();
    document.getElementById('chain-feedback').textContent = '';
    document.getElementById('chain-feedback').className = 'feedback';
}

function checkChainAnswer() {
    if (!chainPlaying) return;
    const userAns = parseFloat(document.getElementById('chain-answer').value);
    const feedback = document.getElementById('chain-feedback');
    if (isNaN(userAns)) { feedback.textContent = '⚠️ Enter a number!'; feedback.className = 'feedback wrong'; playSound('wrong'); return; }
    if (userAns === chainAnswer) {
        chainLength++; chainScore += 15; chainCurrent = chainAnswer;
        feedback.textContent = `✅ Correct! Chain: ${chainLength} 🔗`; feedback.className = 'feedback correct';
        playSound('correct'); addXP(15);
        if (chainLength === 5) createConfetti(); if (chainLength === 10) createBigConfetti();
        document.getElementById('chain-length').textContent = `Chain: ${chainLength} 🔗`;
        document.getElementById('chain-score').textContent = `Score: ${chainScore}`;
        setTimeout(() => generateChainQuestion(), 800);
    } else {
        feedback.textContent = `❌ Chain broken! Answer was ${chainAnswer}. Final chain: ${chainLength}`;
        feedback.className = 'feedback wrong'; playSound('gameover'); stopChainGame();
    }
}

function stopChainGame() {
    chainPlaying = false;
    document.getElementById('chain-answer').disabled = true;
    document.getElementById('chain-submit-btn').disabled = true;
    document.getElementById('chain-stop-btn').disabled = true;
    document.getElementById('chain-start-btn').textContent = '▶️ Start';
    saveStats(chainLength, chainLength, chainLength, chainScore); checkBadges();
}

// ============================================================
//  GAME 3: TRUE OR FALSE
// ============================================================
let tfPlaying = false, tfScore = 0, tfLives = 3, tfStreak = 0, tfIsTrue = true;

function startTFGame() {
    tfPlaying = true; tfScore = 0; tfLives = 3; tfStreak = 0;
    document.getElementById('tf-buttons').style.display = 'flex';
    document.getElementById('tf-stop-btn').disabled = false;
    document.getElementById('tf-start-btn').textContent = '🔄 Restart';
    playSound('click'); updateTFDisplay(); generateTFQuestion();
}

function generateTFQuestion() {
    const a = randInt(2, 15), b = randInt(2, 15), ops = ['+', '-', '×'], op = ops[randInt(0, 2)];
    let real;
    switch (op) { case '+': real = a + b; break; case '-': real = a - b; break; case '×': real = a * b; break; }
    tfIsTrue = Math.random() > 0.4;
    let shown = tfIsTrue ? real : real + randInt(-5, 5);
    if (shown === real) tfIsTrue = true;
    const opSym = op === '-' ? '−' : op;
    document.getElementById('tf-question').textContent = `${a} ${opSym} ${b} = ${shown}`;
    document.getElementById('tf-feedback').textContent = ''; document.getElementById('tf-feedback').className = 'feedback';
}

function checkTFAnswer(userSaysTrue) {
    if (!tfPlaying) return;
    const feedback = document.getElementById('tf-feedback');
    if (userSaysTrue === tfIsTrue) {
        tfScore += 10; tfStreak++; feedback.textContent = '✅ Correct!'; feedback.className = 'feedback correct';
        playSound('correct'); addXP(10);
        if (tfStreak === 5) createConfetti(); if (tfStreak === 10) createBigConfetti();
    } else {
        tfLives--; tfStreak = 0;
        feedback.textContent = `❌ Wrong! It was ${tfIsTrue ? 'TRUE' : 'FALSE'}`;
        feedback.className = 'feedback wrong'; playSound('wrong');
    }
    updateTFDisplay();
    if (tfLives <= 0) { feedback.textContent = `💀 Game Over! Score: ${tfScore}`; playSound('gameover'); stopTFGame(); return; }
    setTimeout(() => { if (tfPlaying) generateTFQuestion(); }, 800);
}

function updateTFDisplay() {
    document.getElementById('tf-score').textContent = `Score: ${tfScore}`;
    document.getElementById('tf-lives').textContent = '❤️'.repeat(tfLives) + '🖤'.repeat(3 - tfLives);
    document.getElementById('tf-streak-display').textContent = `🔥 Streak: ${tfStreak}`;
}

function stopTFGame() {
    tfPlaying = false;
    document.getElementById('tf-buttons').style.display = 'none';
    document.getElementById('tf-stop-btn').disabled = true;
    document.getElementById('tf-start-btn').textContent = '▶️ Start';
    saveStats(tfScore / 10, tfScore / 10, tfStreak, tfScore); checkBadges();
}

// ============================================================
//  GAME 4: MISSING NUMBER
// ============================================================
let missingPlaying = false, missingScore = 0, missingStreak = 0, missingAnswer = 0;

function startMissingGame() {
    missingPlaying = true; missingScore = 0; missingStreak = 0;
    document.getElementById('missing-answer').disabled = false;
    document.getElementById('missing-submit-btn').disabled = false;
    document.getElementById('missing-stop-btn').disabled = false;
    document.getElementById('missing-start-btn').textContent = '🔄 Restart';
    playSound('click'); generateMissingQuestion();
}

function generateMissingQuestion() {
    const a = randInt(2, 15), b = randInt(2, 15), ops = ['+', '−', '×'], op = ops[randInt(0, 2)];
    let result, pos = randInt(0, 2);
    switch (op) { case '+': result = a + b; break; case '−': result = a - b; break; case '×': result = a * b; break; }
    let qText;
    if (pos === 0) { missingAnswer = a; qText = `? ${op} ${b} = ${result}`; }
    else if (pos === 1) { missingAnswer = b; qText = `${a} ${op} ? = ${result}`; }
    else { missingAnswer = result; qText = `${a} ${op} ${b} = ?`; }
    document.getElementById('missing-question').textContent = qText;
    document.getElementById('missing-answer').value = '';
    document.getElementById('missing-answer').focus();
    document.getElementById('missing-feedback').textContent = '';
    document.getElementById('missing-feedback').className = 'feedback';
}

function checkMissingAnswer() {
    if (!missingPlaying) return;
    const userAns = parseFloat(document.getElementById('missing-answer').value);
    const feedback = document.getElementById('missing-feedback');
    if (isNaN(userAns)) { feedback.textContent = '⚠️ Enter a number!'; feedback.className = 'feedback wrong'; playSound('wrong'); return; }
    if (userAns === missingAnswer) {
        missingScore += 15; missingStreak++;
        feedback.textContent = `✅ Correct! Streak: ${missingStreak} 🔥`; feedback.className = 'feedback correct';
        playSound('correct'); addXP(15);
        if (missingStreak === 5) createConfetti(); if (missingStreak === 10) createBigConfetti();
    } else {
        missingStreak = 0; feedback.textContent = `❌ Wrong! Answer: ${missingAnswer}`;
        feedback.className = 'feedback wrong'; playSound('wrong');
    }
    document.getElementById('missing-score').textContent = `Score: ${missingScore}`;
    document.getElementById('missing-streak').textContent = `🔥 Streak: ${missingStreak}`;
    setTimeout(() => { if (missingPlaying) generateMissingQuestion(); }, 1000);
}

function stopMissingGame() {
    missingPlaying = false;
    document.getElementById('missing-answer').disabled = true;
    document.getElementById('missing-submit-btn').disabled = true;
    document.getElementById('missing-stop-btn').disabled = true;
    document.getElementById('missing-start-btn').textContent = '▶️ Start';
    playSound('gameover');
    saveStats(missingScore / 15, missingScore / 15, missingStreak, missingScore); checkBadges();
}

// ============================================================
//  GAME 5: BEAT THE CLOCK
// ============================================================
let duelPlaying = false, duelScore = 0, duelAnswered = 0, duelTimeLeft = 30, duelAnswer = 0, duelInterval = null;

function startDuelGame() {
    duelPlaying = true; duelScore = 0; duelAnswered = 0; duelTimeLeft = 30;
    document.getElementById('duel-answer').disabled = false;
    document.getElementById('duel-stop-btn').disabled = false;
    document.getElementById('duel-start-btn').textContent = '🔄 Restart';
    document.getElementById('duel-results').classList.add('hidden');
    document.getElementById('duel-timer-fill').style.background = 'linear-gradient(90deg, #56ab2f, #a8e063)';
    playSound('click'); generateDuelQuestion();
    clearInterval(duelInterval);
    duelInterval = setInterval(() => {
        duelTimeLeft -= 0.1;
        document.getElementById('duel-time').textContent = `⏱️ ${duelTimeLeft.toFixed(1)}s`;
        document.getElementById('duel-timer-fill').style.width = Math.max(0, (duelTimeLeft / 60) * 100) + '%';
        if (duelTimeLeft <= 10) document.getElementById('duel-timer-fill').style.background = 'linear-gradient(90deg, #e53935, #ff6b6b)';
        if (duelTimeLeft <= 0) stopDuelGame();
    }, 100);
}

function generateDuelQuestion() {
    const a = randInt(5, 30), b = randInt(2, 20), ops = ['+', '-', '×'], op = ops[randInt(0, 2)];
    switch (op) { case '+': duelAnswer = a + b; break; case '-': duelAnswer = a - b; break; case '×': duelAnswer = a * b; break; }
    const opSym = op === '-' ? '−' : op;
    document.getElementById('duel-question').textContent = `${a} ${opSym} ${b} = ?`;
    document.getElementById('duel-answer').value = ''; document.getElementById('duel-answer').focus();
}

function checkDuelAnswer() {
    if (!duelPlaying) return;
    const userAns = parseFloat(document.getElementById('duel-answer').value);
    const feedback = document.getElementById('duel-feedback');
    if (isNaN(userAns)) return;
    duelAnswered++;
    if (userAns === duelAnswer) { duelScore += 10; duelTimeLeft += 3; feedback.textContent = '✅ +3 seconds!'; feedback.className = 'feedback correct'; playSound('correct'); addXP(10); }
    else { duelTimeLeft -= 5; feedback.textContent = `❌ -5 seconds! Answer: ${duelAnswer}`; feedback.className = 'feedback wrong'; playSound('wrong'); }
    document.getElementById('duel-score').textContent = `Score: ${duelScore}`;
    document.getElementById('duel-answered').textContent = `Answered: ${duelAnswered}`;
    if (duelTimeLeft <= 0) { stopDuelGame(); return; }
    setTimeout(() => { if (duelPlaying) { generateDuelQuestion(); feedback.textContent = ''; feedback.className = 'feedback'; } }, 500);
}

function stopDuelGame() {
    duelPlaying = false; clearInterval(duelInterval);
    document.getElementById('duel-answer').disabled = true;
    document.getElementById('duel-stop-btn').disabled = true;
    document.getElementById('duel-start-btn').textContent = '▶️ Start';
    playSound('gameover');
    document.getElementById('duel-results').innerHTML = `<h3>⚔️ Beat the Clock Results</h3><div class="results-grid"><div class="result-item"><span class="result-label">Score</span><span class="result-value">${duelScore}</span></div><div class="result-item"><span class="result-label">Answered</span><span class="result-value">${duelAnswered}</span></div></div>`;
    document.getElementById('duel-results').classList.remove('hidden');
    if (duelScore >= 200) createBigConfetti(); else if (duelScore >= 100) createConfetti();
    saveStats(duelAnswered, duelScore / 10, duelAnswered, duelScore); checkBadges();
}

// ============================================================
//  GAME 6: ESTIMATION MASTER
// ============================================================
let estPlaying = false, estScore = 0, estRound = 0, estMaxRounds = 10, estAnswer = 0;

function startEstGame() {
    estPlaying = true; estScore = 0; estRound = 0;
    document.getElementById('est-answer').disabled = false;
    document.getElementById('est-submit-btn').disabled = false;
    document.getElementById('est-stop-btn').disabled = false;
    document.getElementById('est-start-btn').textContent = '🔄 Restart';
    document.getElementById('est-results').classList.add('hidden');
    playSound('click'); generateEstQuestion();
}

function generateEstQuestion() {
    estRound++;
    const a = randInt(10, 99), b = randInt(10, 99), ops = ['+', '×'], op = ops[randInt(0, 1)];
    switch (op) { case '+': estAnswer = a + b; break; case '×': estAnswer = a * b; break; }
    document.getElementById('est-question').textContent = `Estimate: ${a} ${op} ${b} = ?`;
    document.getElementById('est-round').textContent = `Round: ${estRound} / ${estMaxRounds}`;
    document.getElementById('est-answer').value = ''; document.getElementById('est-answer').focus();
    document.getElementById('est-feedback').textContent = ''; document.getElementById('est-feedback').className = 'feedback';
}

function checkEstAnswer() {
    if (!estPlaying) return;
    const userAns = parseFloat(document.getElementById('est-answer').value);
    const feedback = document.getElementById('est-feedback');
    if (isNaN(userAns)) { feedback.textContent = '⚠️ Enter a number!'; feedback.className = 'feedback wrong'; playSound('wrong'); return; }
    const diff = Math.abs(userAns - estAnswer), pctOff = (diff / estAnswer) * 100;
    let points = 0;
    if (pctOff === 0) { points = 100; feedback.textContent = `🎯 PERFECT! Answer: ${estAnswer} (+100pts)`; createConfetti(); }
    else if (pctOff <= 5) { points = 75; feedback.textContent = `🔥 Very close! Answer: ${estAnswer} (+75pts)`; }
    else if (pctOff <= 10) { points = 50; feedback.textContent = `👍 Good! Answer: ${estAnswer} (+50pts)`; }
    else if (pctOff <= 20) { points = 25; feedback.textContent = `🤏 Not bad. Answer: ${estAnswer} (+25pts)`; }
    else { points = 0; feedback.textContent = `😅 Far off. Answer: ${estAnswer} (+0pts)`; }
    feedback.className = points >= 50 ? 'feedback correct' : 'feedback wrong';
    playSound(points >= 50 ? 'correct' : 'wrong');
    estScore += points; addXP(points);
    document.getElementById('est-score').textContent = `Score: ${estScore}`;
    if (estRound >= estMaxRounds) {
        setTimeout(() => {
            const grade = estScore >= 750 ? 'A+' : estScore >= 500 ? 'A' : estScore >= 300 ? 'B' : 'C';
            document.getElementById('est-results').innerHTML = `<h3>🎯 Estimation Results</h3><div class="results-grid"><div class="result-item"><span class="result-label">Total Score</span><span class="result-value">${estScore}</span></div><div class="result-item"><span class="result-label">Max Possible</span><span class="result-value">1000</span></div><div class="result-item"><span class="result-label">Grade</span><span class="result-value">${grade}</span></div></div>`;
            document.getElementById('est-results').classList.remove('hidden');
            if (estScore >= 750) createBigConfetti(); else if (estScore >= 500) createConfetti();
            playSound('gameover'); stopEstGame();
        }, 1500);
    } else { setTimeout(() => { if (estPlaying) generateEstQuestion(); }, 1500); }
}

function stopEstGame() {
    estPlaying = false;
    document.getElementById('est-answer').disabled = true;
    document.getElementById('est-submit-btn').disabled = true;
    document.getElementById('est-stop-btn').disabled = true;
    document.getElementById('est-start-btn').textContent = '▶️ Start';
    saveStats(estRound, estScore / 100, 0, estScore); checkBadges();
}

// ============================================================
//  XP & LEVEL SYSTEM
// ============================================================
function addXP(amount) {
    playerXP += amount; let leveledUp = false;
    while (playerXP >= playerLevel * XP_PER_LEVEL) {
        playerXP -= playerLevel * XP_PER_LEVEL; playerLevel++; leveledUp = true;
    }
    if (leveledUp) { playSound('levelup'); createBigConfetti(); }
    updateXPDisplay(); savePlayerProgress();
}

function updateXPDisplay() {
    const xpNeeded = playerLevel * XP_PER_LEVEL;
    const pct = Math.min((playerXP / xpNeeded) * 100, 100);
    document.getElementById('player-level').textContent = `🏅 Level ${playerLevel}`;
    document.getElementById('player-xp').textContent = `${playerXP} / ${xpNeeded} XP`;
    document.getElementById('xp-fill').style.width = pct + '%';
}

function savePlayerProgress() { localStorage.setItem('mathPlayerXP', playerXP); localStorage.setItem('mathPlayerLevel', playerLevel); }
function loadPlayerProgress() {
    playerXP = parseInt(localStorage.getItem('mathPlayerXP') || '0');
    playerLevel = parseInt(localStorage.getItem('mathPlayerLevel') || '1');
    updateXPDisplay();
}

// ============================================================
//  STATS
// ============================================================
function saveStats(totalQ, correct, bestStr, xp) {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    stats.totalQuestions = (stats.totalQuestions || 0) + totalQ;
    stats.totalCorrect = (stats.totalCorrect || 0) + correct;
    stats.bestStreak = Math.max(stats.bestStreak || 0, bestStr);
    stats.sessions = (stats.sessions || 0) + 1;
    stats.totalXP = (stats.totalXP || 0) + xp;
    localStorage.setItem('mathStats', JSON.stringify(stats));
}

function loadStats() {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    document.getElementById('stat-total').textContent = stats.totalQuestions || 0;
    const acc = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
    document.getElementById('stat-accuracy').textContent = acc + '%';
    document.getElementById('stat-streak').textContent = stats.bestStreak || 0;
    document.getElementById('stat-sessions').textContent = stats.sessions || 0;
    document.getElementById('stat-xp').textContent = stats.totalXP || 0;
    document.getElementById('stat-level').textContent = playerLevel;
}

function clearStats() {
    if (confirm('⚠️ Reset ALL stats, XP, levels, badges, and streak?')) {
        localStorage.removeItem('mathStats'); localStorage.removeItem('mathPlayerXP');
        localStorage.removeItem('mathPlayerLevel'); localStorage.removeItem('mathBadges');
        localStorage.removeItem('mathStreakData'); localStorage.removeItem('mathStreakMilestones');
        playerXP = 0; playerLevel = 1;
        streakData = { currentStreak: 0, bestStreak: 0, totalLogins: 0, lastLoginDate: null, loginDates: [], freezesLeft: 0, freezeUsedDates: [], shownTodayPopup: false };
        updateXPDisplay(); updateStreakDisplay(); loadStats(); renderBadges(); playSound('click');
    }
}

// ============================================================
//  BADGES
// ============================================================
const ALL_BADGES = [
    { id: 'first_quiz', icon: '🌟', name: 'First Steps', desc: 'Complete your first quiz', check: s => s.sessions >= 1 },
    { id: 'five_sessions', icon: '🎯', name: 'Dedicated', desc: 'Complete 5 sessions', check: s => s.sessions >= 5 },
    { id: 'ten_sessions', icon: '💪', name: 'Committed', desc: 'Complete 10 sessions', check: s => s.sessions >= 10 },
    { id: 'fifty_questions', icon: '📝', name: 'Half Century', desc: 'Answer 50 questions', check: s => s.totalQuestions >= 50 },
    { id: 'hundred_questions', icon: '💯', name: 'Centurion', desc: 'Answer 100 questions', check: s => s.totalQuestions >= 100 },
    { id: 'five_hundred_q', icon: '🏆', name: 'Math Warrior', desc: 'Answer 500 questions', check: s => s.totalQuestions >= 500 },
    { id: 'streak_5', icon: '🔥', name: 'On Fire', desc: 'Get a 5 answer streak', check: s => s.bestStreak >= 5 },
    { id: 'streak_10', icon: '🔥🔥', name: 'Unstoppable', desc: 'Get a 10 answer streak', check: s => s.bestStreak >= 10 },
    { id: 'streak_20', icon: '💥', name: 'Legendary', desc: 'Get a 20 answer streak', check: s => s.bestStreak >= 20 },
    { id: 'xp_500', icon: '⭐', name: 'Rising Star', desc: 'Earn 500 total XP', check: s => s.totalXP >= 500 },
    { id: 'xp_1000', icon: '🌟', name: 'Bright Star', desc: 'Earn 1000 total XP', check: s => s.totalXP >= 1000 },
    { id: 'xp_5000', icon: '✨', name: 'Superstar', desc: 'Earn 5000 total XP', check: s => s.totalXP >= 5000 },
    { id: 'level_5', icon: '🏅', name: 'Level 5', desc: 'Reach Level 5', check: () => playerLevel >= 5 },
    { id: 'level_10', icon: '🥇', name: 'Level 10', desc: 'Reach Level 10', check: () => playerLevel >= 10 },
    { id: 'level_25', icon: '👑', name: 'Math King', desc: 'Reach Level 25', check: () => playerLevel >= 25 },
    { id: 'login_streak_3', icon: '🌱', name: 'Sprout', desc: '3 day login streak', check: () => streakData.bestStreak >= 3 },
    { id: 'login_streak_7', icon: '🔥', name: 'Week Warrior', desc: '7 day login streak', check: () => streakData.bestStreak >= 7 },
    { id: 'login_streak_14', icon: '⚡', name: 'Fortnight Fighter', desc: '14 day login streak', check: () => streakData.bestStreak >= 14 },
    { id: 'login_streak_30', icon: '🏆', name: 'Monthly Master', desc: '30 day login streak', check: () => streakData.bestStreak >= 30 },
    { id: 'login_streak_100', icon: '💎', name: 'Diamond Dedication', desc: '100 day login streak', check: () => streakData.bestStreak >= 100 },
    { id: 'login_streak_365', icon: '🏅', name: 'Year of Math', desc: '365 day login streak', check: () => streakData.bestStreak >= 365 },
    { id: 'freeze_used', icon: '🛡️', name: 'Saved!', desc: 'Use a streak freeze', check: () => streakData.freezeUsedDates && streakData.freezeUsedDates.length >= 1 },
    { id: 'total_30_logins', icon: '📅', name: 'Regular', desc: 'Login 30 total days', check: () => streakData.totalLogins >= 30 },
    { id: 'total_100_logins', icon: '📆', name: 'Committed Learner', desc: 'Login 100 total days', check: () => streakData.totalLogins >= 100 },
];

function checkBadges() {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    const unlocked = JSON.parse(localStorage.getItem('mathBadges') || '[]');
    let newBadge = false;
    ALL_BADGES.forEach(badge => {
        if (!unlocked.includes(badge.id) && badge.check(stats)) { unlocked.push(badge.id); newBadge = true; }
    });
    if (newBadge) { playSound('badge'); createConfetti(); }
    localStorage.setItem('mathBadges', JSON.stringify(unlocked));
}

function renderBadges() {
    const unlocked = JSON.parse(localStorage.getItem('mathBadges') || '[]');
    document.getElementById('badges-container').innerHTML = ALL_BADGES.map(badge => {
        const u = unlocked.includes(badge.id);
        return `<div class="badge-card ${u ? 'unlocked' : 'locked'}"><span class="badge-icon">${badge.icon}</span><h4>${badge.name}</h4><p>${badge.desc}</p><p style="margin-top:5px;font-size:0.7rem;color:${u ? '#a8e063' : '#666'}">${u ? '✅ Unlocked!' : '🔒 Locked'}</p></div>`;
    }).join('');
}

// ============================================================
//  DAILY LOGIN STREAK SYSTEM
// ============================================================
let streakData = {
    currentStreak: 0, bestStreak: 0, totalLogins: 0, lastLoginDate: null,
    loginDates: [], freezesLeft: 0, freezeUsedDates: [], shownTodayPopup: false
};

const STREAK_MILESTONES = [
    { days: 3, icon: '🌱', name: '3 Day Start', reward: '30 XP', xp: 30, freeze: 0 },
    { days: 5, icon: '🌿', name: '5 Day Warrior', reward: '50 XP', xp: 50, freeze: 0 },
    { days: 7, icon: '🔥', name: '1 Week Streak', reward: '100 XP + 🛡️', xp: 100, freeze: 1 },
    { days: 14, icon: '⚡', name: '2 Week Champion', reward: '200 XP + 🛡️', xp: 200, freeze: 1 },
    { days: 21, icon: '💪', name: '3 Week Legend', reward: '300 XP', xp: 300, freeze: 0 },
    { days: 30, icon: '🏆', name: '1 Month Master', reward: '500 XP + 🛡️🛡️', xp: 500, freeze: 2 },
    { days: 50, icon: '💎', name: '50 Day Diamond', reward: '750 XP + 🛡️', xp: 750, freeze: 1 },
    { days: 75, icon: '👑', name: '75 Day Royalty', reward: '1000 XP + 🛡️', xp: 1000, freeze: 1 },
    { days: 100, icon: '🌟', name: '100 Day Legend', reward: '2000 XP + 🛡️🛡️🛡️', xp: 2000, freeze: 3 },
    { days: 150, icon: '🚀', name: '150 Day Rocket', reward: '3000 XP + 🛡️🛡️', xp: 3000, freeze: 2 },
    { days: 200, icon: '🎯', name: '200 Day Master', reward: '5000 XP + 🛡️🛡️🛡️', xp: 5000, freeze: 3 },
    { days: 365, icon: '🏅', name: '1 Year Champion', reward: '10000 XP + 🛡️🛡️🛡️🛡️🛡️', xp: 10000, freeze: 5 },
];

function getTodayStr() { const t = new Date(); return t.getFullYear() + '-' + String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0'); }
function getYesterdayStr() { const y = new Date(); y.setDate(y.getDate() - 1); return y.getFullYear() + '-' + String(y.getMonth() + 1).padStart(2, '0') + '-' + String(y.getDate()).padStart(2, '0'); }
function getDaysBetween(d1, d2) { return Math.ceil(Math.abs(new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24)); }
function loadStreakData() { const s = localStorage.getItem('mathStreakData'); if (s) streakData = JSON.parse(s); }
function saveStreakData() { localStorage.setItem('mathStreakData', JSON.stringify(streakData)); }
function calculateDailyBonusXP() { const s = streakData.currentStreak; if (s <= 3) return 10; if (s <= 7) return 20; if (s <= 14) return 35; if (s <= 30) return 50; if (s <= 60) return 75; if (s <= 100) return 100; return 150; }

function checkDailyStreak() {
    loadStreakData();
    const today = getTodayStr(), yesterday = getYesterdayStr();
    if (streakData.lastLoginDate === today) { updateStreakDisplay(); return; }
    if (!streakData.lastLoginDate) {
        streakData.currentStreak = 1; streakData.bestStreak = 1; streakData.totalLogins = 1;
        streakData.lastLoginDate = today; streakData.loginDates.push(today); streakData.shownTodayPopup = false;
        saveStreakData(); updateStreakDisplay(); showStreakPopup('first'); return;
    }
    if (streakData.lastLoginDate === yesterday) {
        streakData.currentStreak++; streakData.totalLogins++;
        streakData.lastLoginDate = today; streakData.loginDates.push(today); streakData.shownTodayPopup = false;
        if (streakData.currentStreak > streakData.bestStreak) streakData.bestStreak = streakData.currentStreak;
        checkStreakMilestones(); addXP(calculateDailyBonusXP());
        saveStreakData(); updateStreakDisplay(); showStreakPopup('continue'); return;
    }
    const daysMissed = getDaysBetween(streakData.lastLoginDate, today);
    if (daysMissed === 2 && streakData.freezesLeft > 0) {
        streakData.freezesLeft--; streakData.currentStreak++; streakData.totalLogins++;
        streakData.lastLoginDate = today; streakData.loginDates.push(today);
        if (!streakData.freezeUsedDates) streakData.freezeUsedDates = [];
        streakData.freezeUsedDates.push(yesterday); streakData.shownTodayPopup = false;
        if (streakData.currentStreak > streakData.bestStreak) streakData.bestStreak = streakData.currentStreak;
        checkStreakMilestones(); addXP(calculateDailyBonusXP());
        saveStreakData(); updateStreakDisplay(); showStreakPopup('freeze'); return;
    }
    const oldStreak = streakData.currentStreak;
    streakData.currentStreak = 1; streakData.totalLogins++;
    streakData.lastLoginDate = today; streakData.loginDates.push(today); streakData.shownTodayPopup = false;
    saveStreakData(); updateStreakDisplay(); showStreakPopup('broken', oldStreak);
}

function checkStreakMilestones() {
    const reached = JSON.parse(localStorage.getItem('mathStreakMilestones') || '[]');
    STREAK_MILESTONES.forEach(m => {
        if (streakData.currentStreak >= m.days && !reached.includes(m.days)) {
            reached.push(m.days); addXP(m.xp); streakData.freezesLeft += m.freeze;
            playSound('levelup'); createBigConfetti();
        }
    });
    localStorage.setItem('mathStreakMilestones', JSON.stringify(reached));
}

function updateStreakDisplay() {
    const c = document.getElementById('streak-count'), f = document.getElementById('streak-flame'), fi = document.getElementById('flame-icon');
    if (c) c.textContent = streakData.currentStreak;
    if (f) { if (streakData.currentStreak > 0) f.classList.add('active'); else f.classList.remove('active'); }
    if (fi) {
        if (streakData.currentStreak >= 100) fi.textContent = '💎'; else if (streakData.currentStreak >= 50) fi.textContent = '👑';
        else if (streakData.currentStreak >= 30) fi.textContent = '🏆'; else if (streakData.currentStreak >= 14) fi.textContent = '⚡';
        else if (streakData.currentStreak >= 7) fi.textContent = '🔥'; else if (streakData.currentStreak >= 3) fi.textContent = '🌿';
        else fi.textContent = '🔥';
    }
    const hc = document.getElementById('streak-hero-count'), hi = document.getElementById('streak-hero-icon'), hm = document.getElementById('streak-hero-message');
    if (hc) hc.textContent = streakData.currentStreak;
    if (hi) { if (streakData.currentStreak >= 100) hi.textContent = '💎'; else if (streakData.currentStreak >= 50) hi.textContent = '👑'; else if (streakData.currentStreak >= 30) hi.textContent = '🏆'; else if (streakData.currentStreak >= 7) hi.textContent = '🔥'; else hi.textContent = '🔥'; }
    if (hm) {
        if (streakData.currentStreak >= 100) hm.textContent = '🎉 LEGENDARY! You are a math machine!';
        else if (streakData.currentStreak >= 50) hm.textContent = '👑 Incredible dedication!';
        else if (streakData.currentStreak >= 30) hm.textContent = '🏆 Amazing! A full month!';
        else if (streakData.currentStreak >= 14) hm.textContent = '⚡ Two weeks strong!';
        else if (streakData.currentStreak >= 7) hm.textContent = '🔥 One week streak!';
        else if (streakData.currentStreak >= 3) hm.textContent = '🌿 Growing! Keep it up!';
        else hm.textContent = 'Login every day to build your streak!';
    }
    const sc = document.getElementById('streak-current'), sb = document.getElementById('streak-best');
    const st = document.getElementById('streak-total-logins'), sx = document.getElementById('streak-bonus-xp');
    const sf = document.getElementById('streak-freezes'), sl = document.getElementById('streak-last-login');
    if (sc) sc.textContent = streakData.currentStreak + ' days';
    if (sb) sb.textContent = streakData.bestStreak + ' days';
    if (st) st.textContent = streakData.totalLogins + ' days';
    if (sx) sx.textContent = calculateDailyBonusXP() + ' XP';
    if (sf) sf.textContent = streakData.freezesLeft + ' left';
    if (sl && streakData.lastLoginDate) sl.textContent = new Date(streakData.lastLoginDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderMilestones() {
    const c = document.getElementById('milestones-container'); if (!c) return;
    const reached = JSON.parse(localStorage.getItem('mathStreakMilestones') || '[]');
    let nextM = null;
    for (const m of STREAK_MILESTONES) { if (streakData.currentStreak < m.days) { nextM = m.days; break; } }
    c.innerHTML = STREAK_MILESTONES.map(m => {
        const r = reached.includes(m.days), isN = m.days === nextM;
        let cls = 'locked'; if (r) cls = 'reached'; else if (isN) cls = 'next';
        const prog = isN ? `<div style="margin-top:6px;font-size:0.7rem;color:#aaa;">${streakData.currentStreak}/${m.days} days</div>` : '';
        return `<div class="milestone-card ${cls}"><span class="milestone-icon">${m.icon}</span><h4>${m.name}</h4><p>${m.days} day streak</p><span class="milestone-reward">${m.reward}</span>${prog}</div>`;
    }).join('');
}

function renderStreakCalendar() {
    const c = document.getElementById('streak-calendar'); if (!c) return;
    const today = new Date(), dn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let h = '';
    for (let i = 29; i >= 0; i--) {
        const d = new Date(); d.setDate(today.getDate() - i);
        const ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        const isT = i === 0, isL = streakData.loginDates.includes(ds);
        const isF = streakData.freezeUsedDates && streakData.freezeUsedDates.includes(ds);
        let cls = 'calendar-day';
        if (isT) cls += ' today'; if (isL) cls += ' logged-in'; if (isF) cls += ' frozen';
        if (!isL && !isT && !isF) cls += ' missed';
        h += `<div class="${cls}" title="${ds}"><span class="day-name">${dn[d.getDay()]}</span><span class="day-number">${d.getDate()}</span></div>`;
    }
    c.innerHTML = h;
}

function showStreakPopup(type, oldStreak) {
    if (streakData.shownTodayPopup) return;
    streakData.shownTodayPopup = true; saveStreakData();
    const popup = document.getElementById('streak-popup'), icon = document.getElementById('streak-popup-icon');
    const title = document.getElementById('streak-popup-title'), msg = document.getElementById('streak-popup-message');
    const count = document.getElementById('streak-popup-count'), reward = document.getElementById('streak-popup-reward');
    if (!popup) return;
    count.textContent = streakData.currentStreak;
    switch (type) {
        case 'first': icon.textContent = '🎉'; title.textContent = 'Welcome!'; msg.textContent = 'You started your streak journey!'; reward.textContent = '🌱 Your streak begins today!'; break;
        case 'continue':
            icon.textContent = streakData.currentStreak >= 30 ? '🏆' : streakData.currentStreak >= 7 ? '🔥' : '✨';
            title.textContent = streakData.currentStreak >= 30 ? 'INCREDIBLE!' : streakData.currentStreak >= 7 ? 'ON FIRE!' : 'Welcome Back!';
            msg.textContent = `${streakData.currentStreak} days in a row!`;
            reward.textContent = `⚡ Daily Bonus: +${calculateDailyBonusXP()} XP!`;
            playSound('correct'); createConfetti(); break;
        case 'freeze': icon.textContent = '🛡️'; title.textContent = 'Streak Saved!'; msg.textContent = 'A streak freeze saved you!'; reward.textContent = `🛡️ Freeze used! ${streakData.freezesLeft} remaining`; playSound('correct'); break;
        case 'broken': icon.textContent = '💔'; title.textContent = 'Streak Reset'; msg.textContent = `Your ${oldStreak} day streak was broken.`; reward.textContent = "💪 Don't give up! Start again!"; playSound('wrong'); break;
    }
    popup.classList.remove('hidden');
}

function closeStreakPopup() { const p = document.getElementById('streak-popup'); if (p) p.classList.add('hidden'); playSound('click'); }

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isPlaying) stopQuiz(); if (speedPlaying) stopSpeedGame(); if (chainPlaying) stopChainGame();
        if (tfPlaying) stopTFGame(); if (missingPlaying) stopMissingGame(); if (duelPlaying) stopDuelGame();
        if (estPlaying) stopEstGame(); if (expoPlaying) stopExpoPractice();
    }
});