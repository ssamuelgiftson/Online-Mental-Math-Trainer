// ============================================================
//  MENTAL MATH TRAINER - v3.1.0
//  Complete JavaScript with all features
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

// XP & Level System
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
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'correct':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.4);
                break;

            case 'wrong':
                oscillator.frequency.setValueAtTime(311.13, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(233.08, audioContext.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;

            case 'levelup':
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
                break;

            case 'click':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.08);
                break;

            case 'gameover':
                oscillator.frequency.setValueAtTime(392, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(349.23, audioContext.currentTime + 0.2);
                oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.4);
                oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime + 0.6);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
                break;

            case 'badge':
                oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.15);
                oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3);
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.6);
                break;
        }
    } catch (e) {
        console.log('Sound not supported');
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('sound-toggle');
    btn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    localStorage.setItem('mathSoundEnabled', soundEnabled);
    playSound('click');
}

// ============================================================
//  CONFETTI ANIMATION
// ============================================================
function createConfetti() {
    const colors = ['#f7971e', '#ffd200', '#a8e063', '#56ab2f', '#6495ed', '#ff6b6b'];

    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = (Math.random() * 1 + 1) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 2000);
    }
}

function createBigConfetti() {
    const colors = ['#f7971e', '#ffd200', '#a8e063', '#56ab2f', '#6495ed', '#ff6b6b', '#ba55d3'];

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece big';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3500);
    }
}

// ============================================================
//  LOADING SCREEN
// ============================================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
});

// ============================================================
//  INITIALIZATION
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
    loadPlayerProgress();
    loadSoundPreference();
    showSection('practice');
});

function loadSoundPreference() {
    const saved = localStorage.getItem('mathSoundEnabled');
    if (saved !== null) {
        soundEnabled = saved === 'true';
    }
    const btn = document.getElementById('sound-toggle');
    if (btn) {
        btn.textContent = soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
    }
}

// ============================================================
//  EXIT WARNING
// ============================================================
window.addEventListener('beforeunload', (e) => {
    if (isPlaying || speedPlaying || chainPlaying || tfPlaying ||
        missingPlaying || duelPlaying || estPlaying || expoPlaying) {
        e.preventDefault();
        e.returnValue = 'You have an active quiz! Are you sure you want to leave?';
    }
});

// ============================================================
//  NAVIGATION
// ============================================================
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('hidden');

    playSound('click');

    if (sectionId === 'tables') {
        generateTables();
        generateReferenceGrid();
    }
    if (sectionId === 'exponents') generatePowersTable();
    if (sectionId === 'stats') loadStats();
    if (sectionId === 'badges') renderBadges();
}

// ============================================================
//  KEYBOARD SHORTCUTS PANEL
// ============================================================
function toggleShortcuts() {
    const panel = document.getElementById('shortcuts-panel');
    if (panel) {
        panel.classList.toggle('hidden');
        playSound('click');
    }
}

// ============================================================
//  SETTINGS
// ============================================================
function setOperation(op) {
    currentOperation = op;
    document.querySelectorAll('.op-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.op === op)
    );
    playSound('click');
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.diff === diff)
    );
    playSound('click');
}

function setQuestionCount(count) {
    questionCount = count;
    document.querySelectorAll('.ques-btn').forEach(btn =>
        btn.classList.toggle('active', parseInt(btn.dataset.ques) === count)
    );
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

    // Mixed mode
    if (op === 'mix') {
        const ops = ['+', '-', '×', '÷'];
        op = ops[randInt(0, 3)];
    }

    const opNames = {
        '+': '➕ Addition',
        '-': '➖ Subtraction',
        '×': '✖️ Multiplication',
        '÷': '➗ Division',
        '^': '🔢 Exponents'
    };
    document.getElementById('operation-badge').textContent = opNames[op] || opNames[currentOperation];

    switch (op) {
        case '+':
            a = randInt(min, max);
            b = randInt(min, max);
            currentAnswer = a + b;
            questionText = `${a} + ${b} = ?`;
            break;
        case '-':
            a = randInt(min, max);
            b = randInt(min, max);
            if (b > a) [a, b] = [b, a];
            currentAnswer = a - b;
            questionText = `${a} − ${b} = ?`;
            break;
        case '×':
            if (currentDifficulty === 'hard') {
                a = randInt(10, 99);
                b = randInt(2, 25);
            } else {
                a = randInt(min, max);
                b = randInt(min, max);
            }
            currentAnswer = a * b;
            questionText = `${a} × ${b} = ?`;
            break;
        case '÷':
            b = randInt(Math.max(min, 2), Math.min(max, currentDifficulty === 'hard' ? 25 : 12));
            currentAnswer = randInt(min, Math.min(max, 20));
            a = currentAnswer * b;
            questionText = `${a} ÷ ${b} = ?`;
            break;
        case '^':
            a = randInt(2, currentDifficulty === 'hard' ? 15 : 10);
            b = randInt(2, currentDifficulty === 'hard' ? 4 : 3);
            currentAnswer = Math.pow(a, b);
            questionText = `${a}^${b} = ?`;
            break;
    }

    document.getElementById('question').textContent = questionText;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    // Update counter
    if (questionCount > 0) {
        document.getElementById('question-counter').textContent = `Q: ${questionsAnswered + 1} / ${questionCount}`;
    } else {
        document.getElementById('question-counter').textContent = `Q: ${questionsAnswered + 1} / ♾️`;
    }
}

// ============================================================
//  QUIZ CONTROL
// ============================================================
function startQuiz() {
    isPlaying = true;
    score = 0;
    streak = 0;
    bestStreak = 0;
    totalCorrect = 0;
    totalWrong = 0;
    questionsAnswered = 0;
    seconds = 0;

    playSound('click');
    updateScoreDisplay();
    generateQuestion();

    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    document.getElementById('stop-btn').disabled = false;
    document.getElementById('start-btn').textContent = '🔄 Restart';
    document.getElementById('results').classList.add('hidden');

    // Show progress
    if (questionCount > 0) {
        document.getElementById('progress-container').style.display = 'flex';
        updateProgress();
    } else {
        document.getElementById('progress-container').style.display = 'none';
    }

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopQuiz() {
    if (!isPlaying) return;
    playSound('gameover');
    endQuiz();
}

function checkAnswer() {
    if (!isPlaying) return;

    const input = document.getElementById('answer-input');
    const userAnswer = parseFloat(input.value);
    const feedback = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = '⚠️ Please enter a number!';
        feedback.className = 'feedback wrong';
        playSound('wrong');
        return;
    }

    questionsAnswered++;

    if (userAnswer === currentAnswer) {
        totalCorrect++;
        streak++;
        const multiplier = currentDifficulty === 'easy' ? 1 : currentDifficulty === 'medium' ? 2 : 3;
        const points = 10 * multiplier;
        score += points;
        if (streak > bestStreak) bestStreak = streak;
        feedback.textContent = `✅ Correct! +${points} pts | Streak: ${streak} 🔥`;
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(points);

        // Confetti on streaks
        if (streak === 5) createConfetti();
        if (streak === 10) createBigConfetti();
        if (streak === 20) createBigConfetti();
    } else {
        totalWrong++;
        streak = 0;
        feedback.textContent = `❌ Wrong! Answer: ${currentAnswer}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    updateScoreDisplay();
    updateProgress();

    if (questionCount > 0 && questionsAnswered >= questionCount) {
        setTimeout(() => endQuiz(), 1000);
    } else {
        setTimeout(() => generateQuestion(), 1000);
    }
}

function skipQuestion() {
    if (!isPlaying) return;
    questionsAnswered++;
    totalWrong++;
    streak = 0;
    const feedback = document.getElementById('feedback');
    feedback.textContent = `⏭️ Skipped! Answer: ${currentAnswer}`;
    feedback.className = 'feedback wrong';
    playSound('wrong');
    updateScoreDisplay();
    updateProgress();

    if (questionCount > 0 && questionsAnswered >= questionCount) {
        setTimeout(() => endQuiz(), 800);
    } else {
        setTimeout(() => generateQuestion(), 800);
    }
}

function endQuiz() {
    isPlaying = false;
    clearInterval(timerInterval);

    playSound('gameover');

    document.getElementById('answer-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;
    document.getElementById('stop-btn').disabled = true;
    document.getElementById('start-btn').textContent = '▶️ Start Quiz';

    const total = totalCorrect + totalWrong;
    const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const xpEarned = score;

    document.getElementById('total-correct').textContent = totalCorrect;
    document.getElementById('total-wrong').textContent = totalWrong;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('total-time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    document.getElementById('xp-earned').textContent = xpEarned;
    document.getElementById('results').classList.remove('hidden');

    // Confetti for good performance
    if (accuracy >= 90) createBigConfetti();
    else if (accuracy >= 70) createConfetti();

    saveStats(total, totalCorrect, bestStreak, xpEarned);
    checkBadges();
}

function updateScoreDisplay() {
    document.getElementById('score-display').textContent = `Score: ${score} | Streak: ${streak} 🔥`;
}

function updateProgress() {
    if (questionCount > 0) {
        const pct = Math.round((questionsAnswered / questionCount) * 100);
        document.getElementById('progress-fill').style.width = pct + '%';
        document.getElementById('progress-text').textContent = pct + '%';
    }
}

// ============================================================
//  TABLES GENERATION (1-35)
// ============================================================
function generateTables() {
    const start = parseInt(document.getElementById('table-start').value);
    const end = parseInt(document.getElementById('table-end').value);
    const multiplier = parseInt(document.getElementById('table-multiplier').value);
    const type = document.getElementById('table-type').value;
    const container = document.getElementById('tables-container');

    container.innerHTML = '';

    for (let n = start; n <= end; n++) {
        const card = document.createElement('div');
        card.className = 'table-card';
        card.setAttribute('data-table-number', n);

        let title = '';
        let rows = '';

        for (let i = 1; i <= multiplier; i++) {
            let expression, result;
            switch (type) {
                case 'multiplication':
                    title = `${n} × Table`;
                    expression = `${n} × ${i}`;
                    result = n * i;
                    break;
                case 'addition':
                    title = `${n} + Table`;
                    expression = `${n} + ${i}`;
                    result = n + i;
                    break;
                case 'subtraction':
                    title = `${n + multiplier} − Table`;
                    expression = `${n + multiplier} − ${i}`;
                    result = (n + multiplier) - i;
                    break;
                case 'division':
                    title = `÷ ${n} Table`;
                    expression = `${n * i} ÷ ${n}`;
                    result = i;
                    break;
            }
            rows += `<tr><td>${expression}</td><td>= ${result}</td></tr>`;
        }

        card.innerHTML = `<h3>${title}</h3><table>${rows}</table>`;
        container.appendChild(card);
    }
}

function searchTable() {
    const searchVal = document.getElementById('table-search-input').value.trim();
    const cards = document.querySelectorAll('.table-card');

    if (!searchVal) {
        cards.forEach(c => c.style.display = 'block');
        return;
    }

    cards.forEach(card => {
        const num = card.getAttribute('data-table-number');
        card.style.display = num === searchVal ? 'block' : 'none';
    });
}

// ============================================================
//  PRINT TABLES
// ============================================================
function printTables() {
    const tablesContent = document.getElementById('tables-container').innerHTML;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Math Tables - Mental Math Trainer</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    color: #333;
                }
                h1 {
                    text-align: center;
                    color: #f7971e;
                    margin-bottom: 20px;
                }
                .tables-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 15px;
                }
                .table-card {
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 12px;
                    break-inside: avoid;
                }
                .table-card h3 {
                    text-align: center;
                    color: #f7971e;
                    margin-bottom: 8px;
                }
                table { width: 100%; border-collapse: collapse; }
                td {
                    padding: 3px 8px;
                    border-bottom: 1px solid #eee;
                    font-size: 0.9rem;
                }
                td:last-child {
                    text-align: right;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #999;
                    font-size: 0.8rem;
                }
                @media print {
                    body { padding: 10px; }
                }
            </style>
        </head>
        <body>
            <h1>🧮 Mental Math Trainer - Tables</h1>
            <div class="tables-grid">${tablesContent}</div>
            <div class="footer">Generated by Mental Math Trainer | ${new Date().toLocaleDateString()}</div>
            <script>window.print();<\/script>
        </body>
        </html>
    `);
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
        for (let col = 1; col <= size; col++) {
            html += `<td>${row * col}</td>`;
        }
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
        for (let p = 2; p <= 6; p++) {
            const val = Math.pow(base, p);
            html += `<td>${val.toLocaleString()}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

// Exponent Practice
let expoPlaying = false;
let expoAnswer = 0;
let expoCorrect = 0;
let expoTotal = 0;

function startExpoPractice() {
    expoPlaying = true;
    expoCorrect = 0;
    expoTotal = 0;
    document.getElementById('expo-answer').disabled = false;
    document.getElementById('expo-submit-btn').disabled = false;
    document.getElementById('expo-stop-btn').disabled = false;
    document.getElementById('expo-start-btn').textContent = '🔄 Restart';
    playSound('click');
    generateExpoQuestion();
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
    const base = randInt(2, 12);
    const exp = randInt(2, 4);
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

    if (isNaN(userAns)) {
        feedback.textContent = '⚠️ Enter a number!';
        feedback.className = 'feedback wrong';
        playSound('wrong');
        return;
    }

    expoTotal++;
    if (userAns === expoAnswer) {
        expoCorrect++;
        feedback.textContent = '✅ Correct!';
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(15);
    } else {
        feedback.textContent = `❌ Wrong! Answer: ${expoAnswer}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    const acc = expoTotal > 0 ? Math.round((expoCorrect / expoTotal) * 100) : 0;
    document.getElementById('expo-score').textContent = `✅ ${expoCorrect}/${expoTotal} | Accuracy: ${acc}%`;

    setTimeout(() => generateExpoQuestion(), 1000);
}

// ============================================================
//  GAME 1: SPEED ROUND
// ============================================================
let speedPlaying = false;
let speedScore = 0;
let speedCorrect = 0;
let speedAnswer = 0;
let speedTimeLeft = 60;
let speedInterval = null;

function startSpeedGame() {
    speedPlaying = true;
    speedScore = 0;
    speedCorrect = 0;
    speedTimeLeft = 60;

    document.getElementById('speed-answer').disabled = false;
    document.getElementById('speed-stop-btn').disabled = false;
    document.getElementById('speed-start-btn').textContent = '🔄 Restart';
    document.getElementById('speed-results').classList.add('hidden');
    document.getElementById('speed-timer-fill').style.background = 'linear-gradient(90deg, #56ab2f, #a8e063)';

    playSound('click');
    generateSpeedQuestion();

    clearInterval(speedInterval);
    speedInterval = setInterval(() => {
        speedTimeLeft -= 0.1;
        document.getElementById('speed-time-left').textContent = `⏱️ ${speedTimeLeft.toFixed(1)}s`;
        document.getElementById('speed-timer-fill').style.width = `${(speedTimeLeft / 60) * 100}%`;

        if (speedTimeLeft <= 10) {
            document.getElementById('speed-timer-fill').style.background = 'linear-gradient(90deg, #e53935, #ff6b6b)';
        }

        if (speedTimeLeft <= 0) {
            stopSpeedGame();
        }
    }, 100);
}

function generateSpeedQuestion() {
    const a = randInt(2, 20);
    const b = randInt(2, 20);
    const ops = ['+', '-', '×'];
    const op = ops[randInt(0, 2)];

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

    if (userAns === speedAnswer) {
        speedCorrect++;
        speedScore += 10;
        feedback.textContent = '✅ Correct!';
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(10);
    } else {
        feedback.textContent = `❌ Answer: ${speedAnswer}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    document.getElementById('speed-score').textContent = `Score: ${speedScore}`;
    document.getElementById('speed-correct-count').textContent = `✅ ${speedCorrect}`;

    setTimeout(() => {
        if (speedPlaying) {
            generateSpeedQuestion();
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
    }, 400);
}

function stopSpeedGame() {
    speedPlaying = false;
    clearInterval(speedInterval);
    document.getElementById('speed-answer').disabled = true;
    document.getElementById('speed-stop-btn').disabled = true;
    document.getElementById('speed-start-btn').textContent = '▶️ Start';

    playSound('gameover');

    document.getElementById('speed-results').innerHTML = `
        <h3>🏆 Speed Round Results</h3>
        <div class="results-grid">
            <div class="result-item"><span class="result-label">Score</span><span class="result-value">${speedScore}</span></div>
            <div class="result-item correct-bg"><span class="result-label">Correct</span><span class="result-value">${speedCorrect}</span></div>
        </div>
    `;
    document.getElementById('speed-results').classList.remove('hidden');

    if (speedCorrect >= 20) createBigConfetti();
    else if (speedCorrect >= 10) createConfetti();

    saveStats(speedCorrect, speedCorrect, speedCorrect, speedScore);
    checkBadges();
}

// ============================================================
//  GAME 2: NUMBER CHAIN
// ============================================================
let chainPlaying = false;
let chainScore = 0;
let chainLength = 0;
let chainCurrent = 0;
let chainAnswer = 0;

function startChainGame() {
    chainPlaying = true;
    chainScore = 0;
    chainLength = 0;
    chainCurrent = randInt(5, 20);

    document.getElementById('chain-answer').disabled = false;
    document.getElementById('chain-submit-btn').disabled = false;
    document.getElementById('chain-stop-btn').disabled = false;
    document.getElementById('chain-start-btn').textContent = '🔄 Restart';

    playSound('click');
    generateChainQuestion();
}

function generateChainQuestion() {
    const ops = ['+', '-', '×'];
    const op = ops[randInt(0, 2)];
    let b;

    switch (op) {
        case '+':
            b = randInt(1, 15);
            chainAnswer = chainCurrent + b;
            break;
        case '-':
            b = randInt(1, Math.min(chainCurrent - 1, 15));
            if (b <= 0) b = 1;
            chainAnswer = chainCurrent - b;
            break;
        case '×':
            b = randInt(2, 5);
            chainAnswer = chainCurrent * b;
            break;
    }

    const opSymbol = op === '-' ? '−' : op;
    document.getElementById('chain-question').textContent = `${chainCurrent} ${opSymbol} ${b} = ?`;
    document.getElementById('chain-answer').value = '';
    document.getElementById('chain-answer').focus();
    document.getElementById('chain-feedback').textContent = '';
    document.getElementById('chain-feedback').className = 'feedback';
}

function checkChainAnswer() {
    if (!chainPlaying) return;
    const userAns = parseFloat(document.getElementById('chain-answer').value);
    const feedback = document.getElementById('chain-feedback');

    if (isNaN(userAns)) {
        feedback.textContent = '⚠️ Enter a number!';
        feedback.className = 'feedback wrong';
        playSound('wrong');
        return;
    }

    if (userAns === chainAnswer) {
        chainLength++;
        chainScore += 15;
        chainCurrent = chainAnswer;
        feedback.textContent = `✅ Correct! Chain: ${chainLength} 🔗`;
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(15);

        if (chainLength === 5) createConfetti();
        if (chainLength === 10) createBigConfetti();

        document.getElementById('chain-length').textContent = `Chain: ${chainLength} 🔗`;
        document.getElementById('chain-score').textContent = `Score: ${chainScore}`;

        setTimeout(() => generateChainQuestion(), 800);
    } else {
        feedback.textContent = `❌ Chain broken! Answer was ${chainAnswer}. Final chain: ${chainLength}`;
        feedback.className = 'feedback wrong';
        playSound('gameover');
        stopChainGame();
    }
}

function stopChainGame() {
    chainPlaying = false;
    document.getElementById('chain-answer').disabled = true;
    document.getElementById('chain-submit-btn').disabled = true;
    document.getElementById('chain-stop-btn').disabled = true;
    document.getElementById('chain-start-btn').textContent = '▶️ Start';
    saveStats(chainLength, chainLength, chainLength, chainScore);
    checkBadges();
}

// ============================================================
//  GAME 3: TRUE OR FALSE
// ============================================================
let tfPlaying = false;
let tfScore = 0;
let tfLives = 3;
let tfStreak = 0;
let tfIsTrue = true;

function startTFGame() {
    tfPlaying = true;
    tfScore = 0;
    tfLives = 3;
    tfStreak = 0;

    document.getElementById('tf-buttons').style.display = 'flex';
    document.getElementById('tf-stop-btn').disabled = false;
    document.getElementById('tf-start-btn').textContent = '🔄 Restart';

    playSound('click');
    updateTFDisplay();
    generateTFQuestion();
}

function generateTFQuestion() {
    const a = randInt(2, 15);
    const b = randInt(2, 15);
    const ops = ['+', '-', '×'];
    const op = ops[randInt(0, 2)];
    let realAnswer;

    switch (op) {
        case '+': realAnswer = a + b; break;
        case '-': realAnswer = a - b; break;
        case '×': realAnswer = a * b; break;
    }

    tfIsTrue = Math.random() > 0.4;
    let shownAnswer = tfIsTrue ? realAnswer : realAnswer + randInt(-5, 5);
    if (shownAnswer === realAnswer) {
        tfIsTrue = true;
    }

    const opSymbol = op === '-' ? '−' : op;
    document.getElementById('tf-question').textContent = `${a} ${opSymbol} ${b} = ${shownAnswer}`;
    document.getElementById('tf-feedback').textContent = '';
    document.getElementById('tf-feedback').className = 'feedback';
}

function checkTFAnswer(userSaysTrue) {
    if (!tfPlaying) return;
    const feedback = document.getElementById('tf-feedback');

    if (userSaysTrue === tfIsTrue) {
        tfScore += 10;
        tfStreak++;
        feedback.textContent = '✅ Correct!';
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(10);

        if (tfStreak === 5) createConfetti();
        if (tfStreak === 10) createBigConfetti();
    } else {
        tfLives--;
        tfStreak = 0;
        feedback.textContent = `❌ Wrong! It was ${tfIsTrue ? 'TRUE' : 'FALSE'}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    updateTFDisplay();

    if (tfLives <= 0) {
        feedback.textContent = `💀 Game Over! Final Score: ${tfScore}`;
        playSound('gameover');
        stopTFGame();
        return;
    }

    setTimeout(() => {
        if (tfPlaying) generateTFQuestion();
    }, 800);
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
    saveStats(tfScore / 10, tfScore / 10, tfStreak, tfScore);
    checkBadges();
}

// ============================================================
//  GAME 4: MISSING NUMBER
// ============================================================
let missingPlaying = false;
let missingScore = 0;
let missingStreak = 0;
let missingAnswer = 0;

function startMissingGame() {
    missingPlaying = true;
    missingScore = 0;
    missingStreak = 0;

    document.getElementById('missing-answer').disabled = false;
    document.getElementById('missing-submit-btn').disabled = false;
    document.getElementById('missing-stop-btn').disabled = false;
    document.getElementById('missing-start-btn').textContent = '🔄 Restart';

    playSound('click');
    generateMissingQuestion();
}

function generateMissingQuestion() {
    const a = randInt(2, 15);
    const b = randInt(2, 15);
    const ops = ['+', '−', '×'];
    const op = ops[randInt(0, 2)];
    let result;
    const position = randInt(0, 2);

    switch (op) {
        case '+': result = a + b; break;
        case '−': result = a - b; break;
        case '×': result = a * b; break;
    }

    let questionText;
    if (position === 0) {
        missingAnswer = a;
        questionText = `? ${op} ${b} = ${result}`;
    } else if (position === 1) {
        missingAnswer = b;
        questionText = `${a} ${op} ? = ${result}`;
    } else {
        missingAnswer = result;
        questionText = `${a} ${op} ${b} = ?`;
    }

    document.getElementById('missing-question').textContent = questionText;
    document.getElementById('missing-answer').value = '';
    document.getElementById('missing-answer').focus();
    document.getElementById('missing-feedback').textContent = '';
    document.getElementById('missing-feedback').className = 'feedback';
}

function checkMissingAnswer() {
    if (!missingPlaying) return;
    const userAns = parseFloat(document.getElementById('missing-answer').value);
    const feedback = document.getElementById('missing-feedback');

    if (isNaN(userAns)) {
        feedback.textContent = '⚠️ Enter a number!';
        feedback.className = 'feedback wrong';
        playSound('wrong');
        return;
    }

    if (userAns === missingAnswer) {
        missingScore += 15;
        missingStreak++;
        feedback.textContent = `✅ Correct! Streak: ${missingStreak} 🔥`;
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(15);

        if (missingStreak === 5) createConfetti();
        if (missingStreak === 10) createBigConfetti();
    } else {
        missingStreak = 0;
        feedback.textContent = `❌ Wrong! Answer: ${missingAnswer}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    document.getElementById('missing-score').textContent = `Score: ${missingScore}`;
    document.getElementById('missing-streak').textContent = `🔥 Streak: ${missingStreak}`;

    setTimeout(() => {
        if (missingPlaying) generateMissingQuestion();
    }, 1000);
}

function stopMissingGame() {
    missingPlaying = false;
    document.getElementById('missing-answer').disabled = true;
    document.getElementById('missing-submit-btn').disabled = true;
    document.getElementById('missing-stop-btn').disabled = true;
    document.getElementById('missing-start-btn').textContent = '▶️ Start';
    playSound('gameover');
    saveStats(missingScore / 15, missingScore / 15, missingStreak, missingScore);
    checkBadges();
}

// ============================================================
//  GAME 5: BEAT THE CLOCK
// ============================================================
let duelPlaying = false;
let duelScore = 0;
let duelAnswered = 0;
let duelTimeLeft = 30;
let duelAnswer = 0;
let duelInterval = null;

function startDuelGame() {
    duelPlaying = true;
    duelScore = 0;
    duelAnswered = 0;
    duelTimeLeft = 30;

    document.getElementById('duel-answer').disabled = false;
    document.getElementById('duel-stop-btn').disabled = false;
    document.getElementById('duel-start-btn').textContent = '🔄 Restart';
    document.getElementById('duel-results').classList.add('hidden');
    document.getElementById('duel-timer-fill').style.background = 'linear-gradient(90deg, #56ab2f, #a8e063)';

    playSound('click');
    generateDuelQuestion();

    clearInterval(duelInterval);
    duelInterval = setInterval(() => {
        duelTimeLeft -= 0.1;
        document.getElementById('duel-time').textContent = `⏱️ ${duelTimeLeft.toFixed(1)}s`;
        const pct = Math.max(0, (duelTimeLeft / 60) * 100);
        document.getElementById('duel-timer-fill').style.width = pct + '%';

        if (duelTimeLeft <= 10) {
            document.getElementById('duel-timer-fill').style.background = 'linear-gradient(90deg, #e53935, #ff6b6b)';
        }

        if (duelTimeLeft <= 0) {
            stopDuelGame();
        }
    }, 100);
}

function generateDuelQuestion() {
    const a = randInt(5, 30);
    const b = randInt(2, 20);
    const ops = ['+', '-', '×'];
    const op = ops[randInt(0, 2)];

    switch (op) {
        case '+': duelAnswer = a + b; break;
        case '-': duelAnswer = a - b; break;
        case '×': duelAnswer = a * b; break;
    }

    const opSymbol = op === '-' ? '−' : op;
    document.getElementById('duel-question').textContent = `${a} ${opSymbol} ${b} = ?`;
    document.getElementById('duel-answer').value = '';
    document.getElementById('duel-answer').focus();
}

function checkDuelAnswer() {
    if (!duelPlaying) return;
    const userAns = parseFloat(document.getElementById('duel-answer').value);
    const feedback = document.getElementById('duel-feedback');

    if (isNaN(userAns)) return;

    duelAnswered++;

    if (userAns === duelAnswer) {
        duelScore += 10;
        duelTimeLeft += 3;
        feedback.textContent = '✅ +3 seconds!';
        feedback.className = 'feedback correct';
        playSound('correct');
        addXP(10);
    } else {
        duelTimeLeft -= 5;
        feedback.textContent = `❌ -5 seconds! Answer: ${duelAnswer}`;
        feedback.className = 'feedback wrong';
        playSound('wrong');
    }

    document.getElementById('duel-score').textContent = `Score: ${duelScore}`;
    document.getElementById('duel-answered').textContent = `Answered: ${duelAnswered}`;

    if (duelTimeLeft <= 0) {
        stopDuelGame();
        return;
    }

    setTimeout(() => {
        if (duelPlaying) {
            generateDuelQuestion();
            feedback.textContent = '';
            feedback.className = 'feedback';
        }
    }, 500);
}

function stopDuelGame() {
    duelPlaying = false;
    clearInterval(duelInterval);
    document.getElementById('duel-answer').disabled = true;
    document.getElementById('duel-stop-btn').disabled = true;
    document.getElementById('duel-start-btn').textContent = '▶️ Start';

    playSound('gameover');

    document.getElementById('duel-results').innerHTML = `
        <h3>⚔️ Beat the Clock Results</h3>
        <div class="results-grid">
            <div class="result-item"><span class="result-label">Score</span><span class="result-value">${duelScore}</span></div>
            <div class="result-item"><span class="result-label">Answered</span><span class="result-value">${duelAnswered}</span></div>
        </div>
    `;
    document.getElementById('duel-results').classList.remove('hidden');

    if (duelScore >= 200) createBigConfetti();
    else if (duelScore >= 100) createConfetti();

    saveStats(duelAnswered, duelScore / 10, duelAnswered, duelScore);
    checkBadges();
}

// ============================================================
//  GAME 6: ESTIMATION MASTER
// ============================================================
let estPlaying = false;
let estScore = 0;
let estRound = 0;
let estMaxRounds = 10;
let estAnswer = 0;

function startEstGame() {
    estPlaying = true;
    estScore = 0;
    estRound = 0;

    document.getElementById('est-answer').disabled = false;
    document.getElementById('est-submit-btn').disabled = false;
    document.getElementById('est-stop-btn').disabled = false;
    document.getElementById('est-start-btn').textContent = '🔄 Restart';
    document.getElementById('est-results').classList.add('hidden');

    playSound('click');
    generateEstQuestion();
}

function generateEstQuestion() {
    estRound++;
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    const ops = ['+', '×'];
    const op = ops[randInt(0, 1)];

    switch (op) {
        case '+': estAnswer = a + b; break;
        case '×': estAnswer = a * b; break;
    }

    document.getElementById('est-question').textContent = `Estimate: ${a} ${op} ${b} = ?`;
    document.getElementById('est-round').textContent = `Round: ${estRound} / ${estMaxRounds}`;
    document.getElementById('est-answer').value = '';
    document.getElementById('est-answer').focus();
    document.getElementById('est-feedback').textContent = '';
    document.getElementById('est-feedback').className = 'feedback';
}

function checkEstAnswer() {
    if (!estPlaying) return;
    const userAns = parseFloat(document.getElementById('est-answer').value);
    const feedback = document.getElementById('est-feedback');

    if (isNaN(userAns)) {
        feedback.textContent = '⚠️ Enter a number!';
        feedback.className = 'feedback wrong';
        playSound('wrong');
        return;
    }

    const diff = Math.abs(userAns - estAnswer);
    const pctOff = (diff / estAnswer) * 100;
    let points = 0;

    if (pctOff === 0) {
        points = 100;
        feedback.textContent = `🎯 PERFECT! Exact answer: ${estAnswer} (+100pts)`;
        createConfetti();
    }
    else if (pctOff <= 5) {
        points = 75;
        feedback.textContent = `🔥 Very close! Answer: ${estAnswer} | Off by ${pctOff.toFixed(1)}% (+75pts)`;
    }
    else if (pctOff <= 10) {
        points = 50;
        feedback.textContent = `👍 Good! Answer: ${estAnswer} | Off by ${pctOff.toFixed(1)}% (+50pts)`;
    }
    else if (pctOff <= 20) {
        points = 25;
        feedback.textContent = `🤏 Not bad. Answer: ${estAnswer} | Off by ${pctOff.toFixed(1)}% (+25pts)`;
    }
    else {
        points = 0;
        feedback.textContent = `😅 Far off. Answer: ${estAnswer} | Off by ${pctOff.toFixed(1)}% (+0pts)`;
    }

    feedback.className = points >= 50 ? 'feedback correct' : 'feedback wrong';
    playSound(points >= 50 ? 'correct' : 'wrong');

    estScore += points;
    addXP(points);
    document.getElementById('est-score').textContent = `Score: ${estScore}`;

    if (estRound >= estMaxRounds) {
        setTimeout(() => {
            const grade = estScore >= 750 ? 'A+' : estScore >= 500 ? 'A' : estScore >= 300 ? 'B' : 'C';

            document.getElementById('est-results').innerHTML = `
                <h3>🎯 Estimation Results</h3>
                <div class="results-grid">
                    <div class="result-item"><span class="result-label">Total Score</span><span class="result-value">${estScore}</span></div>
                    <div class="result-item"><span class="result-label">Max Possible</span><span class="result-value">1000</span></div>
                    <div class="result-item"><span class="result-label">Grade</span><span class="result-value">${grade}</span></div>
                </div>
            `;
            document.getElementById('est-results').classList.remove('hidden');

            if (estScore >= 750) createBigConfetti();
            else if (estScore >= 500) createConfetti();

            playSound('gameover');
            stopEstGame();
        }, 1500);
    } else {
        setTimeout(() => {
            if (estPlaying) generateEstQuestion();
        }, 1500);
    }
}

function stopEstGame() {
    estPlaying = false;
    document.getElementById('est-answer').disabled = true;
    document.getElementById('est-submit-btn').disabled = true;
    document.getElementById('est-stop-btn').disabled = true;
    document.getElementById('est-start-btn').textContent = '▶️ Start';
    saveStats(estRound, estScore / 100, 0, estScore);
    checkBadges();
}

// ============================================================
//  XP & LEVEL SYSTEM
// ============================================================
function addXP(amount) {
    playerXP += amount;
    let leveledUp = false;

    while (playerXP >= playerLevel * XP_PER_LEVEL) {
        playerXP -= playerLevel * XP_PER_LEVEL;
        playerLevel++;
        leveledUp = true;
    }

    if (leveledUp) {
        playSound('levelup');
        createBigConfetti();
    }

    updateXPDisplay();
    savePlayerProgress();
}

function updateXPDisplay() {
    const xpNeeded = playerLevel * XP_PER_LEVEL;
    const pct = Math.min((playerXP / xpNeeded) * 100, 100);

    document.getElementById('player-level').textContent = `🏅 Level ${playerLevel}`;
    document.getElementById('player-xp').textContent = `${playerXP} / ${xpNeeded} XP`;
    document.getElementById('xp-fill').style.width = pct + '%';
}

function savePlayerProgress() {
    localStorage.setItem('mathPlayerXP', playerXP);
    localStorage.setItem('mathPlayerLevel', playerLevel);
}

function loadPlayerProgress() {
    playerXP = parseInt(localStorage.getItem('mathPlayerXP') || '0');
    playerLevel = parseInt(localStorage.getItem('mathPlayerLevel') || '1');
    updateXPDisplay();
}

// ============================================================
//  STATS (localStorage)
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
    const acc = stats.totalQuestions > 0
        ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;
    document.getElementById('stat-accuracy').textContent = acc + '%';
    document.getElementById('stat-streak').textContent = stats.bestStreak || 0;
    document.getElementById('stat-sessions').textContent = stats.sessions || 0;
    document.getElementById('stat-xp').textContent = stats.totalXP || 0;
    document.getElementById('stat-level').textContent = playerLevel;
}

function clearStats() {
    if (confirm('⚠️ Reset ALL stats, XP, levels, and badges?')) {
        localStorage.removeItem('mathStats');
        localStorage.removeItem('mathPlayerXP');
        localStorage.removeItem('mathPlayerLevel');
        localStorage.removeItem('mathBadges');
        playerXP = 0;
        playerLevel = 1;
        updateXPDisplay();
        loadStats();
        renderBadges();
        playSound('click');
    }
}

// ============================================================
//  BADGES SYSTEM
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
];

function checkBadges() {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    const unlocked = JSON.parse(localStorage.getItem('mathBadges') || '[]');
    let newBadge = false;

    ALL_BADGES.forEach(badge => {
        if (!unlocked.includes(badge.id) && badge.check(stats)) {
            unlocked.push(badge.id);
            newBadge = true;
        }
    });

    if (newBadge) {
        playSound('badge');
        createConfetti();
    }

    localStorage.setItem('mathBadges', JSON.stringify(unlocked));
}

function renderBadges() {
    const unlocked = JSON.parse(localStorage.getItem('mathBadges') || '[]');
    const container = document.getElementById('badges-container');

    container.innerHTML = ALL_BADGES.map(badge => {
        const isUnlocked = unlocked.includes(badge.id);
        return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <span class="badge-icon">${badge.icon}</span>
                <h4>${badge.name}</h4>
                <p>${badge.desc}</p>
                <p style="margin-top:5px;font-size:0.7rem;color:${isUnlocked ? '#a8e063' : '#666'}">
                    ${isUnlocked ? '✅ Unlocked!' : '🔒 Locked'}
                </p>
            </div>
        `;
    }).join('');
}

// ============================================================
//  KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isPlaying) stopQuiz();
        if (speedPlaying) stopSpeedGame();
        if (chainPlaying) stopChainGame();
        if (tfPlaying) stopTFGame();
        if (missingPlaying) stopMissingGame();
        if (duelPlaying) stopDuelGame();
        if (estPlaying) stopEstGame();
        if (expoPlaying) stopExpoPractice();
    }
});