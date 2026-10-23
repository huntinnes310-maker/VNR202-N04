// Chế độ chơi cá nhân: nhập tên → chơi lần lượt 4 vòng (hết toàn bộ câu hỏi) → xem điểm & bảng xếp hạng
import { ROUNDS_CONFIG, QUESTIONS_DATA } from './questions.js';
import { sound } from './sound.js';
import { ConfettiEngine } from './confetti.js';
import { ParticleEngine } from './particles.js';
import { VietnamVisualEngine } from './vietnamVisuals.js';

// Mô tả luật từng vòng cho chế độ 1 người (ROUNDS_CONFIG.description là luật chia đội)
const SOLO_RULES = {
  1: 'Đọc nhận định và chọn ĐÚNG hoặc SAI.',
  2: 'Chọn 1 đáp án đúng trong 4 lựa chọn A – B – C – D.',
  3: 'Hành vi nào 🟢 VẬN DỤNG bài học lịch sử, hành vi nào 🔴 CẦN TRÁNH?',
  4: 'Vòng Về Đích: tình huống thực tiễn, chọn cách xử lý đúng nhất trong 4 lựa chọn.'
};
const TOTAL_QUESTIONS = ROUNDS_CONFIG.reduce((n, r) => n + (QUESTIONS_DATA[r.id] || []).length, 0);
const LB_KEY = 'VNR202_N04_SOLO_LEADERBOARD';

const app = document.getElementById('app');
const confetti = new ConfettiEngine('confettiCanvas');
new ParticleEngine('particleCanvas');
const visuals = new VietnamVisualEngine();

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Điểm = điểm gốc của vòng × (50% + 50% thời gian còn lại)
const scoreFor = (round, timeLeft) => Math.round(round.pointsPerQuestion * (0.5 + 0.5 * timeLeft / round.timeLimit));

const loadBoard = () => {
  try { return JSON.parse(localStorage.getItem(LB_KEY)) || []; } catch { return []; }
};
const saveBoard = board => {
  try { localStorage.setItem(LB_KEY, JSON.stringify(board)); } catch { /* chế độ ẩn danh: bỏ qua */ }
};

let state = { name: '', questions: [], idx: 0, score: 0, correct: 0, answers: [], timeLeft: 0, timer: null, locked: false };

// Toàn bộ câu hỏi, giữ thứ tự vòng, xáo thứ tự câu trong mỗi vòng
function buildQuiz() {
  return ROUNDS_CONFIG.flatMap(r => shuffle(QUESTIONS_DATA[r.id] || []).map(q => ({ ...q, round: r })));
}

function startGame() {
  state = { ...state, questions: buildQuiz(), idx: 0, score: 0, correct: 0, answers: [] };
  goToRound();
}

// Hiệu ứng chuyển vòng của game cũ rồi vào màn giới thiệu vòng
function goToRound() {
  const round = state.questions[state.idx].round;
  sound.playWhoosh();
  visuals.triggerCloudPart?.();
  const banner = document.getElementById('roundSweepBanner');
  document.getElementById('sweepTitleText').textContent = round.title;
  banner.classList.add('active');
  setTimeout(() => { banner.classList.remove('active'); renderRoundIntro(round); }, 1600);
}

function renderRoundIntro(round) {
  const count = state.questions.filter(q => q.round.id === round.id).length;
  const prev = state.idx > 0 ? state.questions[state.idx - 1].round : null;
  const prevAns = prev ? state.answers.filter(a => a.q.round.id === prev.id) : [];
  app.innerHTML = `
    <section class="card round-card">
      ${prev ? `
        <div class="round-recap">
          Hoàn thành <b>${esc(prev.title)}</b>: đúng <b>${prevAns.filter(a => a.ok).length}/${prevAns.length}</b> câu,
          <b>+${prevAns.reduce((n, a) => n + a.gained, 0)}</b> điểm • Tổng: <b>${state.score}</b> điểm
        </div>` : ''}
      <div class="eyebrow">VÒNG ${round.id}/${ROUNDS_CONFIG.length}</div>
      <h1 class="title">${esc(round.title.replace(/^VÒNG \d+:\s*/, ''))}</h1>
      <p class="sub">${esc(round.subtitle.split('•')[0].trim())}</p>
      <p class="round-rule">${esc(SOLO_RULES[round.id] || '')}</p>
      <div class="round-stats">
        <div><b>${count}</b><span>câu hỏi</span></div>
        <div><b>${round.pointsPerQuestion}</b><span>điểm tối đa / câu</span></div>
        <div><b>${round.timeLimit}s</b><span>mỗi câu</span></div>
      </div>
      <div class="actions"><button class="btn-gold" id="roundGo">BẮT ĐẦU VÒNG ${round.id}</button></div>
    </section>
  `;
  const go = document.getElementById('roundGo');
  go.focus();
  go.onclick = () => { sound.playClick(); renderQuestion(); };
}

// ================= MÀN HÌNH BẮT ĐẦU =================
function renderStart() {
  const board = loadBoard().slice(0, 5);
  app.innerHTML = `
    <section class="card start-card">
      <div class="eyebrow">VNR202 • NHÓM 4</div>
      <h1 class="title">ĐẤU TRƯỜNG LỊCH SỬ</h1>
      <p class="sub">Đảng ra đời: Từ khủng hoảng đường lối đến tổ chức tiên phong (1930 – 1945)</p>

      <form id="startForm" class="start-form">
        <label for="playerName">Tên của bạn</label>
        <input id="playerName" maxlength="30" autocomplete="off" placeholder="Nhập tên để bắt đầu..." value="${esc(state.name)}" required>
        <button class="btn-gold" type="submit">BẮT ĐẦU CHƠI</button>
      </form>

      <ul class="rules">
        <li><b>${ROUNDS_CONFIG.length} vòng • ${TOTAL_QUESTIONS} câu</b>: ${ROUNDS_CONFIG.map(r => esc(r.title.replace(/^VÒNG \d+:\s*/, ''))).join(' → ')}.</li>
        <li>Có giới hạn thời gian mỗi câu. Trả lời càng nhanh, điểm càng cao.</li>
        <li>Sau mỗi câu có giải thích để bạn ôn lại kiến thức.</li>
      </ul>

      ${board.length ? `
        <div class="mini-board">
          <div class="mini-title">BẢNG XẾP HẠNG TRÊN MÁY NÀY</div>
          ${boardHtml(board)}
        </div>` : ''}
    </section>
  `;
  const input = document.getElementById('playerName');
  input.focus();
  document.getElementById('startForm').onsubmit = e => {
    e.preventDefault();
    const name = input.value.trim();
    if (!name) return input.focus();
    sound.playClick();
    state.name = name;
    startGame();
  };
}

// ================= MÀN HÌNH CÂU HỎI =================
function renderQuestion() {
  const q = state.questions[state.idx];
  const inRound = state.questions.filter(x => x.round.id === q.round.id);
  const posInRound = inRound.indexOf(q);
  state.timeLeft = q.round.timeLimit;
  state.locked = false;

  const isBinary = q.type === 'true_false' || q.type === 'build_fight';
  app.innerHTML = `
    <section class="card quiz-card">
      <header class="quiz-head">
        <div class="player">${esc(state.name)}</div>
        <div class="progress-txt">Vòng ${q.round.id} • Câu ${posInRound + 1}/${inRound.length}</div>
        <div class="score-pill">${state.score} điểm</div>
      </header>
      <div class="progress"><div style="width:${(state.idx / state.questions.length) * 100}%"></div></div>

      <div class="q-meta">
        <span class="tag">${esc(q.round.title.replace(/^VÒNG \d+:\s*/, ''))}</span>
        <span class="timer" id="timer">${state.timeLeft}s</span>
      </div>
      <div class="timebar"><div id="timebar"></div></div>

      ${q.scenario ? `<div class="scenario"><b>${esc(q.caseNum || '')}${q.title ? ` — ${esc(q.title)}` : ''}</b><br>${esc(q.scenario)}</div>` : ''}
      <h2 class="question">${esc(q.question || q.situation)}</h2>
      ${q.subtitle ? `<p class="q-sub">${esc(q.subtitle)}</p>` : ''}

      <div class="options ${isBinary ? 'binary' : ''}">
        ${q.options.map((o, i) => `
          <button class="opt ${isBinary ? (i === 0 ? 'opt-yes' : 'opt-no') : ''}" data-key="${esc(o.key)}">
            ${isBinary ? '' : `<span class="key">${esc(o.key)}</span>`}
            <span>${o.icon ? esc(o.icon) + ' ' : ''}${esc(o.text)}</span>
          </button>`).join('')}
      </div>
      <div id="feedback"></div>
    </section>
  `;

  app.querySelectorAll('.opt').forEach(btn => btn.onclick = () => answer(btn.dataset.key));
  clearInterval(state.timer);
  state.timer = setInterval(tick, 1000);
}

function tick() {
  state.timeLeft--;
  const t = document.getElementById('timer');
  const bar = document.getElementById('timebar');
  if (t) t.textContent = `${state.timeLeft}s`;
  if (bar) bar.style.width = `${(state.timeLeft / state.questions[state.idx].round.timeLimit) * 100}%`;
  if (state.timeLeft <= 5 && state.timeLeft > 0) sound.playTick();
  if (state.timeLeft <= 0) answer(null);
}

function answer(key) {
  if (state.locked) return;
  state.locked = true;
  clearInterval(state.timer);

  const q = state.questions[state.idx];
  const ok = key === q.correct;
  const gained = ok ? scoreFor(q.round, state.timeLeft) : 0;
  state.score += gained;
  if (ok) state.correct++;
  state.answers.push({ q, key, ok, gained });

  if (ok) { sound.playCorrect(); confetti.burst(40); }
  else if (key === null) sound.playTimeout();
  else sound.playWrong();

  app.querySelectorAll('.opt').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.key === q.correct) btn.classList.add('correct');
    else if (btn.dataset.key === key) btn.classList.add('wrong');
  });
  app.querySelector('.score-pill').textContent = `${state.score} điểm`;

  const last = state.idx === state.questions.length - 1;
  const roundEnds = !last && state.questions[state.idx + 1].round.id !== q.round.id;
  document.getElementById('feedback').innerHTML = `
    <div class="feedback ${ok ? 'fb-ok' : 'fb-bad'}">
      <div class="fb-title">${ok ? `CHÍNH XÁC! +${gained} điểm` : key === null ? 'HẾT GIỜ!' : 'CHƯA ĐÚNG!'}</div>
      <div><b>Đáp án:</b> ${esc(q.explanation.answerText)}</div>
      <div><b>Vì sao:</b> ${esc(q.explanation.why)}</div>
      <div><b>Bài học:</b> ${esc(q.explanation.lesson)}</div>
      <button class="btn-gold" id="nextBtn">${last ? 'XEM KẾT QUẢ' : roundEnds ? 'SANG VÒNG TIẾP THEO ➔' : 'CÂU TIẾP THEO ➔'}</button>
    </div>
  `;
  const next = document.getElementById('nextBtn');
  next.focus();
  next.onclick = () => {
    sound.playClick();
    if (last) return renderResult();
    state.idx++;
    roundEnds ? goToRound() : renderQuestion();
  };
}

// ================= MÀN HÌNH KẾT QUẢ =================
function boardHtml(board, highlightAt = -1) {
  return `<ol class="board">${board.map((r, i) => `
    <li class="${i === highlightAt ? 'me' : ''}">
      <span class="rank">${i + 1}</span>
      <span class="b-name">${esc(r.name)}</span>
      <span class="b-score">${r.score} đ</span>
    </li>`).join('')}</ol>`;
}

function renderResult() {
  const total = state.questions.length;
  const entry = { name: state.name, score: state.score, correct: state.correct, total, at: Date.now() };
  const board = [...loadBoard(), entry].sort((a, b) => b.score - a.score || a.at - b.at).slice(0, 10);
  saveBoard(board);
  const myRank = board.indexOf(entry);

  const pct = state.correct / total;
  const verdict = pct >= 0.8 ? 'Xuất sắc! Bạn nắm rất chắc bài.' : pct >= 0.5 ? 'Khá tốt! Ôn thêm vài ý là hoàn hảo.' : 'Cần ôn lại bài nhé!';
  sound.playVictory();
  if (pct >= 0.5) { confetti.burst(140); visuals.triggerVictoryFlock?.(); }

  app.innerHTML = `
    <section class="card result-card">
      <div class="eyebrow">KẾT QUẢ CỦA</div>
      <h1 class="title">${esc(state.name)}</h1>
      <div class="big-score">${state.score}<span> điểm</span></div>
      <p class="sub">Đúng <b>${state.correct}/${total}</b> câu • ${verdict}</p>

      <div class="mini-board">
        <div class="mini-title">BẢNG XẾP HẠNG TRÊN MÁY NÀY</div>
        ${boardHtml(board, myRank)}
      </div>

      <details class="review">
        <summary>Xem lại các câu đã làm</summary>
        ${state.answers.map((a, i) => `
          <div class="rv ${a.ok ? 'rv-ok' : 'rv-bad'}">
            <div><b>V${a.q.round.id} • ${i + 1}.</b> ${esc(a.q.question || a.q.situation)}</div>
            <div class="rv-ans">${a.ok ? '✓' : '✗'} Đáp án đúng: ${esc(a.q.explanation.answerText)}</div>
          </div>`).join('')}
      </details>

      <div class="actions">
        <button class="btn-gold" id="againBtn">CHƠI LẠI</button>
        <button class="btn-ghost" id="homeBtn">ĐỔI NGƯỜI CHƠI</button>
      </div>
    </section>
  `;
  document.getElementById('againBtn').onclick = () => {
    sound.playClick();
    startGame();
  };
  document.getElementById('homeBtn').onclick = () => { sound.playClick(); state.name = ''; renderStart(); };
}

renderStart();
