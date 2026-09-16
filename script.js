// ===== STATE =====
let currentOperation = '+';
let currentDifficulty = 'easy';
let currentAnswer = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let totalCorrect = 0;
let totalWrong = 0;
let timerInterval = null;
let seconds = 0;
let isPlaying = false;

// ===== NAVIGATION =====
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    const section = document.getElementById(sectionId);
    section.classList.remove('hidden');

    if (sectionId === 'tables') {
        generateTables();
        generateReferenceGrid();
    }
    if (sectionId === 'stats') {
        loadStats();
    }
}

// ===== SETTINGS =====
function setOperation(op) {
    currentOperation = op;
    document.querySelectorAll('.op-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.op === op);
    });
}

function setDifficulty(diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.diff === diff);
    });
}

// ===== NUMBER GENERATION =====
function getRange() {
    switch (currentDifficulty) {
        case 'easy':   return { min: 1, max: 12 };
        case 'medium': return { min: 10, max: 50 };
        case 'hard':   return { min: 25, max: 999 };
        default:       return { min: 1, max: 12 };
    }
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateQuestion() {
    const { min, max } = getRange();
    let a, b, questionText;

    switch (currentOperation) {
        case '+':
            a = randInt(min, max);
            b = randInt(min, max);
            currentAnswer = a + b;
            questionText = `${a} + ${b} = ?`;
            break;

        case '-':
            a = randInt(min, max);
            b = randInt(min, Math.min(a, max)); // Ensure no negative results for easy
            if (currentDifficulty === 'easy') {
                if (b > a) [a, b] = [b, a];
            }
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
            currentAnswer = randInt(min, max);
            a = currentAnswer * b; // Ensures clean division
            questionText = `${a} ÷ ${b} = ?`;
            break;
    }

    document.getElementById('question').textContent = questionText;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
}

// ===== QUIZ CONTROL =====
function startQuiz() {
    isPlaying = true;
    score = 0;
    streak = 0;
    bestStreak = 0;
    totalCorrect = 0;
    totalWrong = 0;
    seconds = 0;

    updateScoreDisplay();
    generateQuestion();

    document.getElementById('answer-input').disabled = false;
    document.getElementById('submit-btn').disabled = false;
    document.getElementById('skip-btn').disabled = false;
    document.getElementById('start-btn').textContent = '🔄 Restart';
    document.getElementById('results').classList.add('hidden');

    // Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent =
            `⏱️ ${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function checkAnswer() {
    if (!isPlaying) return;

    const input = document.getElementById('answer-input');
    const userAnswer = parseFloat(input.value);
    const feedback = document.getElementById('feedback');

    if (isNaN(userAnswer)) {
        feedback.textContent = '⚠️ Please enter a number!';
        feedback.className = 'feedback wrong';
        return;
    }

    if (userAnswer === currentAnswer) {
        totalCorrect++;
        streak++;
        score += 10 * (currentDifficulty === 'easy' ? 1 : currentDifficulty === 'medium' ? 2 : 3);
        if (streak > bestStreak) bestStreak = streak;
        feedback.textContent = `✅ Correct! +${10 * (currentDifficulty === 'easy' ? 1 : currentDifficulty === 'medium' ? 2 : 3)} points`;
        feedback.className = 'feedback correct';
    } else {
        totalWrong++;
        streak = 0;
        feedback.textContent = `❌ Wrong! The answer was ${currentAnswer}`;
        feedback.className = 'feedback wrong';
    }

    updateScoreDisplay();
    setTimeout(() => generateQuestion(), 1200);
}

function skipQuestion() {
    if (!isPlaying) return;
    totalWrong++;
    streak = 0;
    const feedback = document.getElementById('feedback');
    feedback.textContent = `⏭️ Skipped! Answer was ${currentAnswer}`;
    feedback.className = 'feedback wrong';
    updateScoreDisplay();
    setTimeout(() => generateQuestion(), 1000);
}

function updateScoreDisplay() {
    document.getElementById('score-display').textContent =
        `Score: ${score} | Streak: ${streak} 🔥`;
}

function endQuiz() {
    isPlaying = false;
    clearInterval(timerInterval);

    document.getElementById('answer-input').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('skip-btn').disabled = true;
    document.getElementById('start-btn').textContent = '▶️ Start';

    const total = totalCorrect + totalWrong;
    const accuracy = total > 0 ? Math.round((totalCorrect / total) * 100) : 0;

    document.getElementById('total-correct').textContent = totalCorrect;
    document.getElementById('total-wrong').textContent = totalWrong;
    document.getElementById('accuracy').textContent = accuracy + '%';
    document.getElementById('best-streak').textContent = bestStreak;
    document.getElementById('results').classList.remove('hidden');

    saveStats(total, totalCorrect, bestStreak);
}

// ===== TABLES GENERATION =====
function generateTables() {
    const start = parseInt(document.getElementById('table-start').value);
    const end = parseInt(document.getElementById('table-end').value);
    const type = document.getElementById('table-type').value;
    const container = document.getElementById('tables-container');

    container.innerHTML = '';

    for (let n = start; n <= end; n++) {
        const card = document.createElement('div');
        card.className = 'table-card';

        let title = '';
        let rows = '';

        for (let i = 1; i <= 10; i++) {
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
                    title = `${n + 10} − Table`;
                    expression = `${n + 10} − ${i}`;
                    result = (n + 10) - i;
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

// ===== REFERENCE GRID =====
function generateReferenceGrid() {
    const container = document.getElementById('reference-grid');
    const size = 12;

    let html = '<table><thead><tr><th class="header-cell">×</th>';
    for (let i = 1; i <= size; i++) {
        html += `<th>${i}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let row = 1; row <= size; row++) {
        html += `<tr><th>${row}</th>`;
        for (let col = 1; col <= size; col++) {
            html += `<td>${row * col}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody></table>';

    container.innerHTML = html;
}

// ===== LOCAL STORAGE STATS =====
function saveStats(totalQuestions, correct, streak) {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    stats.totalQuestions = (stats.totalQuestions || 0) + totalQuestions;
    stats.totalCorrect = (stats.totalCorrect || 0) + correct;
    stats.bestStreak = Math.max(stats.bestStreak || 0, streak);
    stats.sessions = (stats.sessions || 0) + 1;
    localStorage.setItem('mathStats', JSON.stringify(stats));
}

function loadStats() {
    const stats = JSON.parse(localStorage.getItem('mathStats') || '{}');
    document.getElementById('stat-total').textContent = stats.totalQuestions || 0;
    const acc = stats.totalQuestions > 0
        ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
        : 0;
    document.getElementById('stat-accuracy').textContent = acc + '%';
    document.getElementById('stat-streak').textContent = stats.bestStreak || 0;
    document.getElementById('stat-sessions').textContent = stats.sessions || 0;
}

function clearStats() {
    if (confirm('Are you sure you want to reset all stats?')) {
        localStorage.removeItem('mathStats');
        loadStats();
    }
}

// ===== KEYBOARD SHORTCUT (ESC to end quiz) =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isPlaying) {
        endQuiz();
    }
});

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
    // Show practice section by default
    showSection('practice');
});