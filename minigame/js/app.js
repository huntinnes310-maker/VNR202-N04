// Main Application Logic - Turn-based Pro Television Gameshow
import { sound } from './sound.js';
import { ParticleEngine } from './particles.js';
import { ConfettiEngine } from './confetti.js';
import { VietnamVisualEngine } from './vietnamVisuals.js';
import { gameState } from './gameState.js';
import { ROUNDS_CONFIG, QUESTIONS_DATA } from './questions.js';
import { ICONS, getTeamEmblem } from './icons.js';

class GameApp {
  constructor() {
    this.particleEngine = null;
    this.confettiEngine = null;
    this.vietnamEngine = null;
    this.timerInterval = null;
    this.introShown = false;

    this.init();
  }

  init() {
    this.particleEngine = new ParticleEngine('particleCanvas');
    this.confettiEngine = new ConfettiEngine('confettiCanvas');
    this.vietnamEngine = new VietnamVisualEngine();

    gameState.subscribe((event, payload) => {
      this.handleStateChange(event, payload);
    });

    this.initKeyboardShortcuts();
    this.runCinematicIntro();

    this.renderCurrentScreen();
    this.renderTopHud();
  }

  // ================= 3-5s CINEMATIC INTRO =================
  runCinematicIntro() {
    const intro = document.getElementById('cinematicIntro');
    const motif = document.getElementById('introDrumMotif');
    const titleBox = document.getElementById('introTitleBox');
    const lightBeam = document.getElementById('introLightBeam');
    const skipBtn = document.getElementById('btnSkipIntro');

    if (!intro) return;

    const finishIntro = () => {
      if (this.introShown) return;
      this.introShown = true;
      intro.classList.add('fade-out');
      setTimeout(() => {
        intro.style.display = 'none';
      }, 800);
    };

    if (skipBtn) skipBtn.onclick = finishIntro;

    setTimeout(() => {
      if (this.introShown) return;
      sound.playDongSonGong();
    }, 200);

    setTimeout(() => {
      if (this.introShown) return;
      if (motif) {
        motif.style.transition = 'all 1.6s cubic-bezier(0.16, 1, 0.3, 1)';
        motif.style.opacity = '1';
        motif.style.transform = 'scale(1) rotate(0deg)';
      }
      if (lightBeam) {
        lightBeam.style.transition = 'left 1.4s ease-in-out';
        lightBeam.style.left = '140%';
      }
    }, 1100);

    setTimeout(() => {
      if (this.introShown) return;
      if (titleBox) {
        titleBox.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        titleBox.style.opacity = '1';
        titleBox.style.transform = 'translateY(0)';
      }
    }, 2100);

    setTimeout(() => {
      finishIntro();
    }, 4500);
  }

  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.toggleTimer();
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        this.openLeaderboard();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        this.toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        this.toggleFullscreen();
      } else if (e.code === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  handleStateChange(event, payload) {
    if (event === 'SCREEN_CHANGE') {
      this.renderCurrentScreen();
      this.renderTopHud();
    } else if (event === 'SCORE_CHANGED') {
      this.renderTopHud();
      if (payload && payload.delta) {
        this.showFloatingScore(payload.delta, payload.team ? payload.team.name : '');
      }
      this.updateLiveTurnBoard();
    } else if (event === 'ANSWERS_LOCKED') {
      this.stopTimer();
      this.triggerScreenShake();
      sound.playTimeout();
      this.updateQuestionUIState();
    } else if (event === 'ANSWER_REVEALED') {
      this.updateQuestionUIState();
    } else if (event === 'ACTIVE_TEAM_CHANGED') {
      this.renderTopHud();
      this.updateActiveTeamHeader();
      this.updateLiveTurnBoard();
    } else if (event === 'TEAMS_UPDATED' || event === 'MATCH_RESET') {
      this.renderTopHud();
      if (gameState.currentScreen === 'setup') {
        const container = document.getElementById('screenContainer');
        if (container) this.renderSetupScreen(container);
      } else if (gameState.currentScreen === 'question') {
        this.updateLiveTurnBoard();
      }
    } else if (event === 'TIE_OPTION_SELECTED' || event === 'TIE_ANSWER_REVEALED' || event === 'TIE_QUESTION_CHANGED' || event === 'TIE_AWARDED') {
      const container = document.getElementById('screenContainer');
      if (container && gameState.currentScreen === 'tie_breaker') {
        this.renderTieBreakerScreen(container);
      }
    }
  }

  // ================= TIMER ENGINE =================
  startTimer() {
    this.stopTimer();
    if (!gameState.timerSeconds || gameState.timerSeconds <= 0) {
      gameState.timerSeconds = gameState.timerMax || 15;
    }
    gameState.timerRunning = true;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (gameState.timerSeconds > 0) {
        gameState.timerSeconds--;
        this.updateTimerDisplay();

        if (gameState.timerSeconds <= 5 && gameState.timerSeconds > 0) {
          sound.playWarning();
        } else if (gameState.timerSeconds > 5) {
          sound.playTick();
        }

        if (gameState.timerSeconds === 0) {
          this.stopTimer();
          this.triggerScreenShake();
          sound.playTimeout();
          gameState.lockAnswers();
          this.handleTurnTimeout();
        }
      }
    }, 1000);
  }

  stopTimer() {
    gameState.timerRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.updateTimerDisplay();
  }

  toggleTimer() {
    sound.playClick();
    if (gameState.timerRunning) {
      this.stopTimer();
    } else {
      if (gameState.timerSeconds === 0) {
        gameState.timerSeconds = gameState.timerMax;
      }
      this.startTimer();
    }
  }

  resetTimer() {
    sound.playClick();
    this.stopTimer();
    gameState.timerSeconds = gameState.timerMax;
    this.updateTimerDisplay();
  }

  updateTimerDisplay() {
    const box = document.getElementById('timerBox');
    const digits = document.getElementById('timerDigits');
    const banner = document.getElementById('timeoutBanner');
    const toggleBtn = document.getElementById('btnTimerToggle');
    const circle = document.getElementById('timerProgressCircle');

    if (digits) digits.textContent = gameState.timerSeconds;
    
    if (circle) {
      const circumference = 283;
      const fraction = Math.max(0, gameState.timerSeconds / (gameState.timerMax || 15));
      const offset = circumference * (1 - fraction);
      circle.style.strokeDashoffset = offset;
    }

    if (box) {
      if (gameState.timerSeconds <= 3 && gameState.timerSeconds > 0) {
        box.classList.add('warning', 'urgent');
      } else if (gameState.timerSeconds <= 5 && gameState.timerSeconds > 0) {
        box.classList.add('warning');
        box.classList.remove('urgent');
      } else {
        box.classList.remove('warning', 'urgent');
      }
    }

    if (banner) {
      banner.style.display = gameState.timerSeconds === 0 ? 'inline-block' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = gameState.timerRunning 
        ? `${ICONS.pause} <span>Tạm Dừng</span>` 
        : `${ICONS.play} <span>Bắt Đầu Đếm</span>`;
    }

    const tieDigits = document.getElementById('tieTimerDisplay');
    const tieToggleBtn = document.getElementById('btnTieTimerToggle');
    if (tieDigits) tieDigits.textContent = `${gameState.timerSeconds}s`;
    if (tieToggleBtn) {
      tieToggleBtn.innerHTML = gameState.timerRunning ? ICONS.pause : ICONS.play;
    }
  }

  triggerScreenShake() {
    document.body.classList.add('screen-shake');
    setTimeout(() => {
      document.body.classList.remove('screen-shake');
    }, 450);
  }

  // ================= TURN TRANSITION ANIMATION (1-1.5s) =================
  triggerTurnSwitch(team, callback) {
    sound.playWhoosh();
    sound.playDongSonGong();
    if (this.vietnamEngine) this.vietnamEngine.triggerCloudPart();

    const overlay = document.getElementById('turnSwitchOverlay');
    const nameEl = document.getElementById('turnSwitchTeamName');
    const emblemEl = document.getElementById('turnSwitchEmblem');

    if (overlay && nameEl) {
      nameEl.textContent = team.name;
      if (emblemEl) emblemEl.innerHTML = getTeamEmblem(team, gameState.currentTeamIndex);
      overlay.classList.add('active');

      setTimeout(() => {
        overlay.classList.remove('active');
        if (callback) callback();
      }, 1300);
    } else if (callback) {
      callback();
    }
  }

  triggerRoundTransition(roundTitle, callback) {
    sound.playWhoosh();
    if (this.vietnamEngine) this.vietnamEngine.triggerCloudPart();

    const banner = document.getElementById('roundSweepBanner');
    const titleEl = document.getElementById('sweepTitleText');
    if (banner && titleEl) {
      titleEl.textContent = roundTitle;
      banner.classList.add('active');

      setTimeout(() => {
        banner.classList.remove('active');
        if (callback) callback();
      }, 1600);
    } else if (callback) {
      callback();
    }
  }

  showFloatingScore(delta, teamName) {
    sound.playScoreUp();
    const burst = document.createElement('div');
    burst.className = `floating-score-burst ${delta > 0 ? 'plus' : 'minus'}`;
    burst.textContent = `${delta > 0 ? '+' : ''}${delta} ${teamName ? `(${teamName})` : ''}`;
    burst.style.left = `${Math.max(10, Math.random() * 60 + 20)}%`;
    burst.style.top = '40%';
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 1200);
  }

  // ================= TOP BAR HUD RENDERING =================
  renderTopHud() {
    const hud = document.getElementById('topHud');
    if (!hud) return;

    if (gameState.currentScreen === 'home') {
      hud.style.display = 'none';
      return;
    }
    hud.style.display = 'flex';

    const round = gameState.getCurrentRound();
    const questions = gameState.getCurrentQuestionList();

    const roundNumEl = document.getElementById('hudRoundNum');
    const roundTitleEl = document.getElementById('hudRoundTitle');
    const questionPill = document.getElementById('hudQuestionPill');

    if (roundNumEl) roundNumEl.textContent = `VÒNG ${gameState.currentRoundId}`;
    if (roundTitleEl) {
      const cleanTitle = round.title.includes(':') ? round.title.split(':')[1].trim() : round.title;
      roundTitleEl.textContent = cleanTitle;
    }

    if (questionPill) {
      if (gameState.currentScreen === 'question') {
        questionPill.textContent = `CÂU ${String(gameState.currentQuestionIdx + 1).padStart(2, '0')}/${String(questions.length).padStart(2, '0')}`;
        questionPill.style.display = 'inline-block';
      } else if (gameState.currentScreen === 'tie_breaker') {
        questionPill.textContent = `CÂU ${String(gameState.currentTieQuestionIdx + 1).padStart(2, '0')}/${String(gameState.getTieBreakerQuestions().length).padStart(2, '0')}`;
        questionPill.style.display = 'inline-block';
      } else {
        questionPill.style.display = 'none';
      }
    }

    if (gameState.currentScreen === 'tie_breaker') {
      if (roundNumEl) roundNumEl.textContent = 'VÒNG PHỤ';
      if (roundTitleEl) roundTitleEl.textContent = 'CÂU HỎI PHÂN ĐỊNH (TIE-BREAKER)';
    }

    // Active Team in TV Top HUD
    const activeTeam = gameState.getActiveTeam();
    const activeNameEl = document.getElementById('hudActiveTeamName');
    const activeEmblemEl = document.getElementById('hudActiveEmblem');
    if (activeNameEl) activeNameEl.textContent = activeTeam.name;
    if (activeEmblemEl) activeEmblemEl.innerHTML = getTeamEmblem(activeTeam, gameState.currentTeamIndex);

    // Audio & Fullscreen buttons
    const muteBtn = document.getElementById('btnToggleMute');
    if (muteBtn) {
      muteBtn.innerHTML = sound.isMuted ? ICONS.volumeMute : ICONS.volume;
    }

    const fsBtn = document.getElementById('btnToggleFullscreen');
    if (fsBtn) {
      fsBtn.innerHTML = ICONS.maximize;
    }

    const lbBtn = document.getElementById('btnHudLeaderboard');
    if (lbBtn && !lbBtn.querySelector('.svg-icon')) {
      lbBtn.innerHTML = `${ICONS.medal} <span>BẢNG XẾP HẠNG</span>`;
    }

    const resetBtn = document.getElementById('btnHudResetGame');
    if (resetBtn && !resetBtn.querySelector('.svg-icon')) {
      resetBtn.innerHTML = `${ICONS.refresh} <span>MÀN MỚI</span>`;
    }
  }

  // ================= SCREEN ROUTER =================
  renderCurrentScreen() {
    const container = document.getElementById('screenContainer');
    if (!container) return;

    this.stopTimer();

    switch (gameState.currentScreen) {
      case 'home':
        this.renderHomeScreen(container);
        break;
      case 'setup':
        this.renderSetupScreen(container);
        break;
      case 'round_intro':
        this.renderRoundIntroScreen(container);
        break;
      case 'question':
        this.renderQuestionScreen(container);
        break;
      case 'victory':
        this.renderVictoryScreen(container);
        break;
      case 'tie_breaker':
        this.renderTieBreakerScreen(container);
        break;
      default:
        this.renderHomeScreen(container);
        break;
    }
  }

  // 1. HOME SCREEN
  renderHomeScreen(container) {
    container.innerHTML = `
      <div class="screen-home">
        <div class="home-emblem">
          <div style="width: 70px; height: 70px;">
            ${ICONS.trophy}
          </div>
        </div>

        <h1 class="home-title">ĐẤU TRƯỜNG LỊCH SỬ</h1>
        <h2 class="home-sub">Đảng ra đời: Từ khủng hoảng đường lối đến tổ chức tiên phong (1930 – 1945)</h2>
        <p class="home-tagline">
          VNR202 • Nhóm 4 • Gameshow tương tác luân phiên 2 – 5 đội
        </p>

        <div class="home-actions-row">
          <button id="btnStartGame" class="btn btn-gold btn-hero">
            ${ICONS.play} <span>BẮT ĐẦU TRÒ CHƠI</span>
          </button>
          <button id="btnOpenRules" class="btn btn-glass btn-hero">
            ${ICONS.book} <span>LUẬT CHƠI</span>
          </button>
          <button id="btnOpenLeaderboardHero" class="btn btn-glass btn-hero">
            ${ICONS.medal} <span>BẢNG ĐIỂM</span>
          </button>
        </div>

        <div class="home-features-bar">
          <div class="feature-pill">
            ${ICONS.zap} <span>Thi Đấu Trực Tiếp Luân Phiên</span>
          </div>
          <div class="feature-pill">
            ${ICONS.medal} <span>2 – 5 Đội • Mỗi Đội 1 Lượt Mỗi Vòng</span>
          </div>
          <div class="feature-pill">
            ${ICONS.brain} <span>Tình Huống Thực Tiễn</span>
          </div>
          <div class="feature-pill">
            ${ICONS.target} <span>Cơ Chế Cướp Điểm Ở Các Vòng Tình Huống</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnStartGame').onclick = () => {
      sound.playClick();
      gameState.setScreen('setup');
    };
    document.getElementById('btnOpenRules').onclick = () => {
      sound.playClick();
      this.openRulesModal();
    };
    document.getElementById('btnOpenLeaderboardHero').onclick = () => {
      sound.playClick();
      this.openLeaderboard();
    };
  }

  // 2. SETUP SCREEN (5 ĐỘI TRANH TÀI LUÂN PHIÊN)
  renderSetupScreen(container) {
    container.innerHTML = `
      <div class="screen-setup">
        <div class="setup-header-card">
          <div class="setup-supertitle">CHƯƠNG TRÌNH THI ĐẤU LỚP HỌC</div>
          <h2 class="modal-title">${gameState.teams.length} ĐỘI TRANH TÀI TRỰC TIẾP</h2>
          <p class="modal-subtitle">Chọn số đội tham gia — mỗi vòng sẽ bốc ngẫu nhiên số câu hỏi bằng số đội.</p>
          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 14px;">
            <span style="color: var(--gold-300); font-weight: 700;">SỐ ĐỘI:</span>
            ${[2, 3, 4, 5].map(n => `<button class="btn ${gameState.teams.length === n ? 'btn-gold' : 'btn-glass'} btn-team-count" data-count="${n}" style="min-width: 52px;">${n}</button>`).join('')}
          </div>
        </div>

        <div class="teams-config-grid" id="teamsConfigGrid">
          ${gameState.teams.map((t, idx) => `
            <div class="team-config-badge-card">
              <div class="setup-card-top">
                <div class="setup-emblem-wrap">
                  ${getTeamEmblem(t, idx)}
                </div>
                <div class="setup-tag-group">
                  <div class="setup-program-tag">ĐỘI 0${idx + 1}</div>
                  <div class="setup-turn-subtag">${idx === 0 ? 'LƯỢT MỞ MÀN' : `LƯỢT 0${idx + 1}`}</div>
                  <div class="setup-gold-hairline"></div>
                </div>
              </div>

              <div class="setup-input-block">
                <label class="setup-input-label">TÊN ĐỘI THI ĐẤU</label>
                <input type="text" class="team-name-input" data-id="${t.id}" value="${t.name}" placeholder="Nhập tên đội..." />
              </div>

              <div class="setup-score-row">
                <span class="setup-score-lbl">ĐIỂM KHỞI ĐIỂM:</span>
                <span class="setup-score-val">${t.score} ĐIỂM</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="setup-actions-row">
          <button id="btnBackHome" class="btn btn-glass">
            ${ICONS.home} <span>Về Trang Chủ</span>
          </button>
          <button id="btnResetScoresSetup" class="btn btn-crimson" title="Reset toàn bộ điểm khởi điểm về 0">
            ${ICONS.refresh} <span>Reset Điểm Về 0</span>
          </button>
          <button id="btnConfirmTeams" class="btn btn-gold btn-hero">
            ${ICONS.play} <span>XÁC NHẬN & VÀO ĐẤU TRƯỜNG</span>
          </button>
        </div>
      </div>
    `;

    container.querySelectorAll('.btn-team-count').forEach(btn => {
      btn.onclick = () => {
        sound.playClick();
        gameState.setTeamCount(parseInt(btn.dataset.count, 10));
        this.renderSetupScreen(container);
      };
    });

    container.querySelectorAll('.team-name-input').forEach(input => {
      input.onchange = () => {
        const id = parseInt(input.dataset.id, 10);
        gameState.updateTeam(id, { name: input.value.trim() || `Đội ${id}` });
      };
    });

    document.getElementById('btnBackHome').onclick = () => {
      sound.playClick();
      gameState.setScreen('home');
    };

    document.getElementById('btnResetScoresSetup').onclick = () => {
      sound.playClick();
      gameState.resetScoresOnly();
      this.showCelebrationToast('ĐÃ RESET ĐIỂM!', 'Điểm số của các đội đã về 0 đ');
      this.renderSetupScreen(container);
    };

    document.getElementById('btnConfirmTeams').onclick = () => {
      sound.playCorrect();
      gameState.currentTeamIndex = 0;
      gameState.questionPicks = {}; // bốc bộ câu mới cho trận mới
      gameState.startQuestion(1, 0, 0);
      this.triggerRoundTransition('VÒNG 1: ĐÚNG HAY SAI?', () => {
        gameState.setScreen('round_intro');
      });
    };
  }

  // 3. ROUND INTRO SCREEN
  renderRoundIntroScreen(container) {
    const round = gameState.getCurrentRound();
    const questions = gameState.getCurrentQuestionList();
    const activeTeam = gameState.getActiveTeam();

    container.innerHTML = `
      <div class="screen-round-intro">
        <div class="round-intro-box">
          <div class="round-intro-badge">${round.badge}</div>
          <h2 class="round-intro-title">${round.title}</h2>
          <p class="round-intro-sub">${round.subtitle}</p>
          <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 680px; line-height: 1.6;">
            ${round.description}
          </p>

          <div class="round-rules-grid">
            <div class="round-rule-chip">
              <span class="rule-chip-val">${questions.length}</span>
              <span class="rule-chip-lbl">Số câu hỏi</span>
            </div>
            <div class="round-rule-chip">
              <span class="rule-chip-val">+${round.pointsPerQuestion} đ</span>
              <span class="rule-chip-lbl">Điểm mỗi câu</span>
            </div>
            <div class="round-rule-chip">
              <span class="rule-chip-val">${round.timeLimit}s</span>
              <span class="rule-chip-lbl">Thời gian suy nghĩ</span>
            </div>
          </div>

          <!-- Team starting the round -->
          <div style="background: rgba(245, 158, 11, 0.15); border: 2px solid var(--gold-400); border-radius: var(--radius-lg); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                ${getTeamEmblem(activeTeam, gameState.currentTeamIndex)}
              </div>
              <div>
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase;">ĐỘI BẮT ĐẦU CÂU 01:</span>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff;">${activeTeam.name}</div>
              </div>
            </div>

            <button id="btnSwitchStartTeam" class="btn btn-glass" style="font-size: 0.85rem; padding: 8px 16px;">
              ${ICONS.refresh} <span>ĐỔI ĐỘI BẮT ĐẦU VÒNG</span>
            </button>
          </div>

          <div style="display: flex; gap: 16px; margin-top: 20px;">
            <button id="btnStartRoundQuestions" class="btn btn-gold btn-hero">
              ${ICONS.play} <span>BẮT ĐẦU VÒNG ĐẤU</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btnSwitchStartTeam').onclick = () => {
      sound.playClick();
      gameState.advanceTurn();
      gameState.startQuestion(gameState.currentRoundId, 0, gameState.currentTeamIndex);
      this.renderRoundIntroScreen(container);
    };

    document.getElementById('btnStartRoundQuestions').onclick = () => {
      sound.playClick();
      // Khởi tạo trạng thái mới hoàn toàn cho câu đầu tiên của vòng đấu
      gameState.startQuestion(gameState.currentRoundId, 0);
      const currentActive = gameState.getActiveTeam();
      this.triggerTurnSwitch(currentActive, () => {
        gameState.setScreen('question');
        this.startTimer();
      });
    };
  }

  // 4. QUESTION SCREEN (TURN-BASED HEAD-TO-HEAD GAMESHOW)
  renderQuestionScreen(container) {
    const round = gameState.getCurrentRound();
    const questions = gameState.getCurrentQuestionList();
    const q = gameState.getCurrentQuestion();
    const activeTeam = gameState.getActiveTeam();

    if (!q) {
      if (gameState.currentRoundId < 4) {
        gameState.currentRoundId++;
        gameState.currentQuestionIdx = 0;
        gameState.startQuestion(gameState.currentRoundId, 0);
        this.triggerRoundTransition(gameState.getCurrentRound().title, () => {
          gameState.setScreen('round_intro');
        });
      } else {
        gameState.setScreen('victory');
      }
      return;
    }

    container.innerHTML = `
      <div class="screen-question">
        <!-- 1. BROADCAST ACTIVE TEAM SPOTLIGHT BANNER -->
        <div class="active-team-spotlight-bar" id="activeTeamHeader">
          <div class="active-team-indicator">
            <div class="team-program-label">
              <span class="team-program-line1">ĐỘI 0${activeTeam.id}</span>
              <span class="team-program-line2">LƯỢT 0${gameState.currentTeamIndex + 1}</span>
              <div class="team-program-underline"></div>
            </div>
            <div class="active-team-emblem-box">
              ${getTeamEmblem(activeTeam, gameState.currentTeamIndex)}
            </div>
            <div class="active-team-text-group">
              <span class="active-team-badge-tag">LƯỢT THI ĐẤU CHÍNH THỨC</span>
              <h2 class="active-team-name-title">${activeTeam.name}</h2>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="active-team-score-pod">
              <div class="active-team-score-label">ĐIỂM HIỆN TẠI</div>
              <div class="active-team-score-num">${activeTeam.score} Đ</div>
            </div>
            <button id="btnSwitchTurnManual" class="btn btn-glass" style="font-size: 0.8rem; padding: 8px 12px;" title="Chuyển lượt sang đội kế tiếp nếu cần">
              ${ICONS.refresh} <span>Đổi Đội</span>
            </button>
          </div>
        </div>

        <!-- 2. QUESTION MAIN CARD -->
        <div class="question-card-wrapper ${round.id === 4 ? 'ai-round-card' : ''}">
          <div class="question-header-row">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="question-meta-badge">
                <span>VÒNG ${round.id}</span> • <span>CÂU ${String(gameState.currentQuestionIdx + 1).padStart(2, '0')}</span>
              </div>
              <div class="question-points-pill">+${round.pointsPerQuestion} ĐIỂM</div>
              ${round.id === 4 ? `<div class="ai-special-badge">${ICONS.sparkles} CASE THỰC TIỄN</div>` : ''}
            </div>

            <!-- Pro Dong Son Drum Timer Widget -->
            <div class="timer-container">
              <div class="dong-son-timer-wrapper" id="timerBox">
                <div class="timer-drum-bg"></div>
                <svg class="timer-progress-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" stroke-width="4" fill="none"/>
                  <circle class="timer-progress-circle" id="timerProgressCircle" cx="50" cy="50" r="45"/>
                </svg>
                <span class="dong-son-timer-digits" id="timerDigits">${gameState.timerSeconds}</span>
              </div>
              <span class="timeout-banner" id="timeoutBanner" style="display: none;">HẾT GIỜ!</span>
            </div>
          </div>

          <!-- Scenario (if exists) -->
          ${q.scenario ? `
            <div class="scenario-callout">
              <strong>${q.caseNum ? `${q.caseNum}: ` : ''}${q.title ? `"${q.title}" — ` : ''}</strong>${q.scenario}
            </div>
          ` : ''}

          <!-- Question Prompt -->
          <div class="question-title-text">
            ${q.question || q.situation || ''}
          </div>
          ${q.subtitle ? `<div style="font-size: 1.15rem; color: var(--gold-300); font-weight: 600; margin-top: -12px;">${q.subtitle}</div>` : ''}

          <!-- Options Container -->
          <div id="optionsRenderArea">
            ${this.getOptionsHtml(round, q)}
          </div>

          <!-- Universal Steal Area -->
          ${gameState.stealAvailable ? `
            <div class="steal-opportunity-card">
              <div class="steal-title-headline">
                ${ICONS.zap} <span>CƠ HỘI CƯỚP ĐIỂM!</span> ${ICONS.zap}
              </div>
              <p style="color: #fca5a5; font-size: 1.05rem; margin-top: 4px;">
                Đội trong lượt trả lời chưa chính xác. Các đội còn lại bấm chuông / giơ tay nhanh nhất để giành quyền (+10đ nếu đúng, 0đ nếu sai)!
              </p>

              <div class="steal-grid-buzzers">
                ${gameState.teams
                  .filter(t => t.id !== activeTeam.id)
                  .map(t => {
                    const isDisqualified = gameState.disqualifiedStealTeams.includes(t.id);
                    const isChosen = gameState.stealingTeamId === t.id;
                    return `
                      <button class="btn-steal-buzzer ${isChosen ? 'selected' : ''}" 
                              data-team="${t.id}" 
                              ${isDisqualified ? 'disabled' : ''}>
                        <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                          ${getTeamEmblem(t, t.id - 1)}
                        </div>
                        <strong style="font-size: 1.05rem;">${t.name}</strong>
                        <span style="font-size: 0.8rem; color: var(--gold-300);">
                          ${isDisqualified ? 'ĐÃ HẾT LƯỢT' : (isChosen ? 'ĐANG TRẢ LỜI' : 'BẤM CƯỚP ĐIỂM')}
                        </span>
                      </button>
                    `;
                  }).join('')}
              </div>

              ${gameState.stealingTeamId ? `
                <div class="stealing-active-box">
                  <div class="stealing-active-headline">
                    ${ICONS.zap}
                    <span>${gameState.teams.find(t => t.id === gameState.stealingTeamId)?.name || 'ĐỘI CƯỚP ĐIỂM'} ĐÃ GIÀNH QUYỀN!</span>
                  </div>
                  <div class="stealing-active-guide">
                    👉 HÃY BẤM TRỰC TIẾP VÀO 1 ĐÁP ÁN TRÊN MÀN HÌNH ĐỂ TRẢ LỜI
                  </div>
                  <div class="stealing-subnote">
                    (Kết quả Đúng / Sai sẽ hiển thị ngay lập tức: Đúng +10 điểm • Sai 0 điểm)
                  </div>

                  <div style="margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button id="btnStealVerdictCorrect" class="btn btn-gold" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-size: 0.85rem; padding: 7px 14px;">
                      ${ICONS.check} <span>Đánh Dấu Đúng (+10đ)</span>
                    </button>
                    <button id="btnStealVerdictWrong" class="btn btn-crimson" style="font-size: 0.85rem; padding: 7px 14px;">
                      ${ICONS.x} <span>Đánh Dấu Sai (0đ)</span>
                    </button>
                    <button id="btnCancelStealSelect" class="btn btn-glass" style="font-size: 0.85rem; padding: 7px 14px;">
                      ${ICONS.refresh} <span>Đổi Đội Bấm Chuông</span>
                    </button>
                  </div>
                </div>
              ` : `
                <div style="margin-top: 12px;">
                  <button id="btnSkipSteal" class="btn btn-glass" style="font-size: 0.88rem;">
                    <span>Bỏ qua cướp điểm • Xem giải thích ➔</span>
                  </button>
                </div>
              `}
            </div>
          ` : ''}
        </div>

        <!-- 3. PRO BROADCAST "TEAM BADGE CARDS" -->
        <div class="live-teams-turn-grid" id="liveTurnBoard" style="--team-count: ${gameState.teams.length};">
          ${gameState.teams.map((t, idx) => {
            const isActive = t.id === activeTeam.id;
            return `
              <div class="team-badge-card ${isActive ? 'active' : ''}">
                <div class="team-badge-emblem-wrap">
                  ${getTeamEmblem(t, idx)}
                </div>
                <div class="team-badge-name">${t.name}</div>
                <div class="team-badge-turn-tag">
                  ${isActive ? 'ĐANG THI ĐẤU' : `LƯỢT ${idx + 1}`}
                </div>
                <div class="team-badge-divider"></div>
                <div class="team-badge-score">${t.score} ĐIỂM</div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 4. MC FLOATING CONTROLS BAR -->
        <div class="mc-controls-bar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnTimerToggle" class="btn btn-glass">
              <span>${gameState.timerRunning ? 'Tạm Dừng' : 'Bắt Đầu Đếm'}</span>
            </button>
            <button id="btnTimerReset" class="btn btn-glass">
              ${ICONS.refresh} <span>Reset Giờ</span>
            </button>
          </div>

          <div class="mc-shortcuts-hint">
            Phím tắt: <kbd>Space</kbd> Timer • <kbd>L</kbd> Bảng Điểm
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnLockAnswers" class="btn btn-crimson" ${gameState.isAnswersLocked ? 'disabled' : ''}>
              ${ICONS.lock} <span>Khóa Đáp Án</span>
            </button>
            <button id="btnRevealAnswer" class="btn btn-gold">
              ${ICONS.eye} <span>Xem Giải Thích</span>
            </button>
            <button id="btnNextQuestion" class="btn btn-glass">
              ${ICONS.chevronRight} <span>Câu Tiếp Theo (Đổi Đội)</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.attachQuestionEventListeners(round, q, activeTeam);
    this.updateTimerDisplay();
    this.updateQuestionUIState();
  }

  getOptionsHtml(round, q) {
    const selected = gameState.activeTeamAnswer;

    if (round.id === 1) {
      return `
        <div class="duel-tf-container">
          <div class="tf-card true-card ${selected === 'A' ? 'active-selection' : ''}" data-key="A" style="${selected === 'A' ? 'border-color: #10b981; box-shadow: 0 0 35px rgba(16, 185, 129, 0.6);' : ''}">
            <div style="width: 52px; height: 52px; margin-bottom: 10px; color: #34d399;">
              ${ICONS.check}
            </div>
            <div class="tf-label">ĐÚNG</div>
            <div class="tf-sub">Nhận định chính xác</div>
          </div>
          <div class="tf-card false-card ${selected === 'B' ? 'active-selection' : ''}" data-key="B" style="${selected === 'B' ? 'border-color: #ef4444; box-shadow: 0 0 35px rgba(239, 68, 68, 0.6);' : ''}">
            <div style="width: 52px; height: 52px; margin-bottom: 10px; color: #f87171;">
              ${ICONS.x}
            </div>
            <div class="tf-label">SAI</div>
            <div class="tf-sub">Nhận định chưa chính xác</div>
          </div>
        </div>
      `;
    }

    if (round.id === 3) {
      return `
        <div class="duel-xay-chong">
          <div class="xay-card ${selected === 'XAY' ? 'active-selection' : ''}" data-key="XAY" style="${selected === 'XAY' ? 'border-color: #10b981; box-shadow: 0 0 45px rgba(16, 185, 129, 0.8);' : ''}">
            <div style="width: 54px; height: 54px; margin-bottom: 8px; color: #34d399;">
              ${ICONS.check}
            </div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #34d399; letter-spacing: 2px;">${q.options[0].text}</div>
            <div style="font-size: 0.95rem; color: #a7f3d0; margin-top: 4px;">${q.options[0].desc}</div>
          </div>
          <div class="chong-card ${selected === 'CHONG' ? 'active-selection' : ''}" data-key="CHONG" style="${selected === 'CHONG' ? 'border-color: #ef4444; box-shadow: 0 0 45px rgba(239, 68, 68, 0.8);' : ''}">
            <div style="width: 54px; height: 54px; margin-bottom: 8px; color: #f87171;">
              ${ICONS.x}
            </div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #f87171; letter-spacing: 2px;">${q.options[1].text}</div>
            <div style="font-size: 0.95rem; color: #fecaca; margin-top: 4px;">${q.options[1].desc}</div>
          </div>
        </div>
      `;
    }

    const colsClass = q.options && q.options.length <= 2 ? 'cols-2' : (q.options.length <= 4 ? 'cols-4' : 'cols-2');
    return `
      <div class="options-grid ${colsClass}">
        ${(q.options || []).map(opt => {
          const isSelected = selected === opt.key;
          return `
            <div class="option-btn ${isSelected ? 'active-selection' : ''}" data-key="${opt.key}">
              <div class="option-key-badge">${opt.key}</div>
              <div class="option-text">${opt.text}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  attachQuestionEventListeners(round, q, activeTeam) {
    const btnToggle = document.getElementById('btnTimerToggle');
    const btnReset = document.getElementById('btnTimerReset');
    if (btnToggle) btnToggle.onclick = () => this.toggleTimer();
    if (btnReset) btnReset.onclick = () => this.resetTimer();

    const btnSwitchManual = document.getElementById('btnSwitchTurnManual');
    if (btnSwitchManual) btnSwitchManual.onclick = () => {
      sound.playClick();
      gameState.advanceTurn();
    };

    document.querySelectorAll('.option-btn, .tf-card, .xay-card, .chong-card').forEach(el => {
      el.onclick = () => {
        // Nếu đang trong chế độ cướp điểm và đã có đội bấm chuông: cho chọn đáp án ngay
        if (gameState.stealAvailable && gameState.stealingTeamId) {
          const key = el.dataset.key;
          this.handleStealOptionClick(key, q);
          return;
        }

        if (gameState.isAnswersLocked) return;
        sound.playClick();
        const key = el.dataset.key;
        gameState.setActiveTeamAnswer(key);
        // Với các vòng đấu 1, 2, 3, 4: Khi đội bấm chọn đáp án là chốt ngay!
        // Dừng timer ngay lập tức và tính điểm / phân định kết quả liền
        this.stopTimer();
        this.handleLockAnswer(round, q, activeTeam);
      };
    });

    const btnLock = document.getElementById('btnLockAnswers');
    if (btnLock) btnLock.onclick = () => {
      sound.playClick();
      this.handleLockAnswer(round, q, activeTeam);
    };

    const btnReveal = document.getElementById('btnRevealAnswer');
    if (btnReveal) btnReveal.onclick = () => {
      sound.playClick();
      gameState.revealAnswer();
      this.openExplanationModal(round, q);
    };

    const btnNext = document.getElementById('btnNextQuestion');
    if (btnNext) btnNext.onclick = () => {
      sound.playClick();
      this.advanceToNextQuestion();
    };

    document.querySelectorAll('.btn-steal-buzzer').forEach(btn => {
      btn.onclick = () => {
        sound.playSteal();
        const teamId = parseInt(btn.dataset.team, 10);
        gameState.setStealingTeam(teamId);
        const container = document.getElementById('screenContainer');
        if (container) this.renderQuestionScreen(container);
      };
    });

    const btnCancelSteal = document.getElementById('btnCancelStealSelect');
    if (btnCancelSteal) btnCancelSteal.onclick = () => {
      sound.playClick();
      gameState.stealingTeamId = null;
      const container = document.getElementById('screenContainer');
      if (container) this.renderQuestionScreen(container);
    };

    const btnStealCorrect = document.getElementById('btnStealVerdictCorrect');
    if (btnStealCorrect) btnStealCorrect.onclick = () => {
      this.handleStealOptionClick(q.correct, q);
    };

    const btnStealWrong = document.getElementById('btnStealVerdictWrong');
    if (btnStealWrong) btnStealWrong.onclick = () => {
      // Đánh dấu sai thủ công
      const wrongKey = (q.options && q.options.find(o => o.key !== q.correct)?.key) || 'WRONG';
      this.handleStealOptionClick(wrongKey, q);
    };

    const btnSkipSteal = document.getElementById('btnSkipSteal');
    if (btnSkipSteal) btnSkipSteal.onclick = () => {
      sound.playClick();
      gameState.closeStealMode();
      this.openExplanationModal(round, q);
    };
  }

  handleLockAnswer(round, q, activeTeam) {
    gameState.lockAnswers();
    this.stopTimer();

    const selected = gameState.activeTeamAnswer;
    const isCorrect = selected === q.correct;
    // NGUYÊN TẮC CƯỚP ĐIỂM CÔNG BẰNG:
    // Tuyệt đối KHÔNG cướp điểm ở các phần chỉ có 2 đáp án (Vòng 1 Đúng/Sai, Vòng 3 Xây/Chống, hoặc câu <= 2 lựa chọn).
    // Vì khi 1 đội chọn sai ở câu 2 đáp án, đáp án còn lại chắc chắn đúng 100%, cướp điểm là vô lý.
    // Chỉ kích hoạt cướp điểm ở các vòng/câu có từ 3 đến 4 đáp án trở lên (Vòng 2 & Vòng 4)!
    const numOptions = (round.id === 1 || round.id === 3 || round.mode === 'true_false' || round.mode === 'build_fight')
      ? 2
      : ((q.options && q.options.length) || 2);
    const allowSteal = Boolean(round.hasSteal && numOptions > 2);

    if (isCorrect) {
      sound.playCorrect();
      const pts = round.pointsPerQuestion;
      gameState.addScore(activeTeam.id, pts, `Đúng câu ${gameState.currentQuestionIdx + 1} (${round.title})`);
      this.confettiEngine.burst(75);
      this.showCelebrationToast(`CHÍNH XÁC!`, `+${pts} ĐIỂM (${activeTeam.name})`);
      gameState.revealAnswer();
      const container = document.getElementById('screenContainer');
      if (container) this.renderQuestionScreen(container);
    } else {
      sound.playWrong();
      this.showIncorrectToast(`CHƯA CHÍNH XÁC! (0 ĐIỂM)`);
      if (allowSteal) {
        gameState.activateStealMode();
      } else {
        // Đội trả lời sai ở câu chỉ có 2 đáp án -> hiển thị ngay đáp án đúng (không cướp điểm)!
        gameState.revealAnswer();
      }
      const container = document.getElementById('screenContainer');
      if (container) this.renderQuestionScreen(container);
    }
  }

  handleTurnTimeout() {
    const round = gameState.getCurrentRound();
    const q = gameState.getCurrentQuestion();
    const activeTeam = gameState.getActiveTeam();

    // Chỉ tính theo activeTeamAnswer nếu đó là một lựa chọn hợp lệ của câu hỏi hiện tại q!
    const isValidOption = Boolean(
      q && gameState.activeTeamAnswer &&
      ((q.options && q.options.some(opt => opt.key === gameState.activeTeamAnswer)) ||
       (round.id === 1 && (gameState.activeTeamAnswer === 'A' || gameState.activeTeamAnswer === 'B')) ||
       (round.id === 3 && (gameState.activeTeamAnswer === 'XAY' || gameState.activeTeamAnswer === 'CHONG')))
    );

    if (isValidOption) {
      this.handleLockAnswer(round, q, activeTeam);
      return;
    }

    sound.playWrong();
    this.showIncorrectToast(`HẾT GIỜ! (0 ĐIỂM)`);
    const numOptions = (round.id === 1 || round.id === 3 || round.mode === 'true_false' || round.mode === 'build_fight')
      ? 2
      : ((q.options && q.options.length) || 2);
    const allowSteal = Boolean(round.hasSteal && numOptions > 2);
    if (allowSteal) {
      gameState.activateStealMode();
    } else {
      // Hết giờ ở câu 2 đáp án -> hiển thị đáp án đúng ngay lập tức!
      gameState.revealAnswer();
    }
    const container = document.getElementById('screenContainer');
    if (container) this.renderQuestionScreen(container);
  }

  showCelebrationToast(title, pts) {
    const toast = document.createElement('div');
    toast.className = 'correct-celebration-toast';
    toast.innerHTML = `<h3>${ICONS.check} ${title}</h3><div class="pts-tag">${pts}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1600);
  }

  showIncorrectToast(title) {
    const toast = document.createElement('div');
    toast.className = 'incorrect-gentle-toast';
    toast.innerHTML = `<h3>${ICONS.x} ${title}</h3>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 1400);
  }

  updateActiveTeamHeader() {
    const header = document.getElementById('activeTeamHeader');
    if (!header) return;
    const team = gameState.getActiveTeam();
    const titleEl = header.querySelector('.active-team-name-title');
    const emblemBox = header.querySelector('.active-team-emblem-box');
    const scoreNum = header.querySelector('.active-team-score-num');
    const line1 = header.querySelector('.team-program-line1');
    const line2 = header.querySelector('.team-program-line2');
    if (titleEl) titleEl.textContent = team.name;
    if (emblemBox) emblemBox.innerHTML = getTeamEmblem(team, gameState.currentTeamIndex);
    if (scoreNum) scoreNum.textContent = `${team.score} Đ`;
    if (line1) line1.textContent = `ĐỘI 0${team.id}`;
    if (line2) line2.textContent = `LƯỢT 0${gameState.currentTeamIndex + 1}`;
  }

  updateLiveTurnBoard() {
    const board = document.getElementById('liveTurnBoard');
    if (!board) return;
    const activeTeam = gameState.getActiveTeam();
    board.innerHTML = gameState.teams.map((t, idx) => {
      const isActive = t.id === activeTeam.id;
      return `
        <div class="team-badge-card ${isActive ? 'active' : ''}">
          <div class="team-badge-emblem-wrap">
            ${getTeamEmblem(t, idx)}
          </div>
          <div class="team-badge-name">${t.name}</div>
          <div class="team-badge-turn-tag">
            ${isActive ? 'ĐANG THI ĐẤU' : `LƯỢT ${idx + 1}`}
          </div>
          <div class="team-badge-divider"></div>
          <div class="team-badge-score">${t.score} ĐIỂM</div>
        </div>
      `;
    }).join('');
  }

  updateQuestionUIState() {
    const q = gameState.getCurrentQuestion();
    if (!q) return;

    if (gameState.isAnswerRevealed) {
      document.querySelectorAll('.option-btn, .tf-card, .xay-card, .chong-card').forEach(el => {
        const key = el.dataset.key;
        if (key === q.correct) {
          el.classList.add('correct');
          el.classList.remove('incorrect', 'steal-ready', 'already-failed');
        } else {
          el.classList.add('incorrect');
          el.classList.remove('correct', 'steal-ready');
        }
      });
      return;
    }

    // Nếu đang trong chế độ cướp điểm và đã có đội bấm chuông: highlight các lựa chọn sẵn sàng bấm
    if (gameState.stealAvailable && gameState.stealingTeamId) {
      document.querySelectorAll('.option-btn, .tf-card, .xay-card, .chong-card').forEach(el => {
        const key = el.dataset.key;
        if (gameState.stealedOptionKeys && gameState.stealedOptionKeys.includes(key)) {
          el.classList.add('already-failed');
          el.classList.remove('steal-ready');
        } else {
          el.classList.add('steal-ready');
          el.classList.remove('already-failed');
        }
      });
    } else if (gameState.stealAvailable) {
      // Đang trong lượt cướp điểm nhưng chưa có đội nào bấm chuông
      document.querySelectorAll('.option-btn, .tf-card, .xay-card, .chong-card').forEach(el => {
        const key = el.dataset.key;
        if (gameState.stealedOptionKeys && gameState.stealedOptionKeys.includes(key)) {
          el.classList.add('already-failed');
        }
        el.classList.remove('steal-ready');
      });
    }
  }

  handleStealOptionClick(key, q) {
    if (!gameState.stealingTeamId) return;
    const stealingTeam = gameState.teams.find(t => t.id === gameState.stealingTeamId);
    if (!stealingTeam) return;

    const isCorrect = (key === q.correct);

    if (isCorrect) {
      sound.playCorrect();
      this.confettiEngine.burst(85);
      this.showCelebrationToast(`CHÍNH XÁC! CƯỚP ĐIỂM THÀNH CÔNG`, `+10 ĐIỂM (${stealingTeam.name})`);
      gameState.resolveSteal(true, key);
    } else {
      sound.playWrong();
      this.triggerScreenShake();
      this.showIncorrectToast(`CHƯA CHÍNH XÁC! (0 ĐIỂM - ${stealingTeam.name})`);
      gameState.resolveSteal(false, key);
    }

    const container = document.getElementById('screenContainer');
    if (container) this.renderQuestionScreen(container);
  }

  advanceToNextQuestion() {
    const questions = gameState.getCurrentQuestionList();

    if (gameState.currentQuestionIdx < questions.length - 1) {
      gameState.advanceTurn();
      const nextTeam = gameState.getActiveTeam();

      this.triggerTurnSwitch(nextTeam, () => {
        gameState.startQuestion(gameState.currentRoundId, gameState.currentQuestionIdx + 1);
        const container = document.getElementById('screenContainer');
        if (container) this.renderQuestionScreen(container);
        this.startTimer();
      });
    } else {
      if (gameState.currentRoundId < 4) {
        gameState.currentRoundId++;
        gameState.currentQuestionIdx = 0;
        gameState.advanceTurn();
        // Khởi tạo sạch sẽ trạng thái câu 0 cho vòng mới
        gameState.startQuestion(gameState.currentRoundId, 0);
        this.triggerRoundTransition(gameState.getCurrentRound().title, () => {
          gameState.setScreen('round_intro');
        });
      } else {
        gameState.setScreen('victory');
      }
    }
  }

  // ================= MODALS =================
  openExplanationModal(round, q) {
    const exp = q.explanation || (q.analysis ? {
      answerText: q.analysis.recommended,
      why: q.analysis.why,
      lesson: q.analysis.lesson
    } : null);

    const modal = document.getElementById('explanationModal');
    const content = document.getElementById('explanationContent');
    if (!modal || !content || !exp) return;

    content.innerHTML = `
      <div class="explanation-modal-content">
        <div class="debrief-card ans-card">
          <div class="debrief-header">
            <span class="debrief-badge">${ICONS.check} ĐÁP ÁN CHÍNH XÁC</span>
          </div>
          <div class="debrief-body-text debrief-highlight">
            ${exp.answerText || ''}
          </div>
        </div>

        <div class="debrief-card why-card">
          <div class="debrief-header">
            <span class="debrief-badge">${ICONS.brain} VÌ SAO? (CƠ SỞ LÝ LUẬN & THỰC TIỄN)</span>
          </div>
          <div class="debrief-body-text">
            ${exp.why || ''}
          </div>
        </div>

        <div class="debrief-card lesson-card">
          <div class="debrief-header">
            <span class="debrief-badge">${ICONS.book} BÀI HỌC RÚT RA</span>
          </div>
          <div class="debrief-body-text">
            ${exp.lesson || ''}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  openLeaderboard() {
    sound.playClick();
    const modal = document.getElementById('leaderboardModal');
    const container = document.getElementById('leaderboardContent');
    if (!modal || !container) return;

    const sorted = gameState.getSortedTeams();

    container.innerHTML = `
      <!-- Podium Top 3 -->
      <div class="podium-container">
        ${sorted[1] ? `
          <div class="podium-slot rank-2">
            <div style="width: 50px; height: 50px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(sorted[1], 1)}</div>
            <div class="podium-team-name">${sorted[1].name}</div>
            <div class="podium-score">${sorted[1].score} đ</div>
            <div class="podium-bar">2</div>
          </div>
        ` : ''}

        ${sorted[0] ? `
          <div class="podium-slot rank-1">
            <div style="width: 65px; height: 65px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(sorted[0], 0)}</div>
            <div class="podium-team-name">${sorted[0].name}</div>
            <div class="podium-score">${sorted[0].score} đ</div>
            <div class="podium-bar">1</div>
          </div>
        ` : ''}

        ${sorted[2] ? `
          <div class="podium-slot rank-3">
            <div style="width: 46px; height: 46px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(sorted[2], 2)}</div>
            <div class="podium-team-name">${sorted[2].name}</div>
            <div class="podium-score">${sorted[2].score} đ</div>
            <div class="podium-bar">3</div>
          </div>
        ` : ''}
      </div>

      <!-- Full Standings Table -->
      <div class="leaderboard-table">
        ${sorted.map((t, idx) => `
          <div class="lb-row">
            <div class="lb-left">
              <span class="lb-rank-badge">#${idx + 1}</span>
              <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(t, idx)}</div>
              <span class="lb-team-name">${t.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="display: flex; gap: 4px;">
                <button class="choice-mini-btn" data-team="${t.id}" data-delta="-5" title="Trừ 5 điểm">-5</button>
                <button class="choice-mini-btn" data-team="${t.id}" data-delta="+5" title="Cộng 5 điểm">+5</button>
                <button class="choice-mini-btn" data-team="${t.id}" data-delta="+10" title="Cộng 10 điểm">+10</button>
                <button class="choice-mini-btn" data-team="${t.id}" data-action="reset-team" title="Reset điểm đội này về 0" style="color: #fca5a5; font-weight: 800;">0đ</button>
              </div>
              <span class="lb-score-val">${t.score} đ</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.choice-mini-btn').forEach(btn => {
      btn.onclick = () => {
        const teamId = parseInt(btn.dataset.team, 10);
        if (btn.dataset.action === 'reset-team') {
          sound.playClick();
          const team = gameState.teams.find(t => t.id === teamId);
          if (team) {
            team.score = 0;
            gameState.save();
            gameState.notify('TEAMS_UPDATED', gameState.teams);
            this.openLeaderboard();
            this.showCelebrationToast('ĐÃ RESET ĐIỂM ĐỘI', `${team.name} về 0 điểm`);
          }
          return;
        }
        const delta = parseInt(btn.dataset.delta, 10);
        gameState.addScore(teamId, delta, 'MC điều chỉnh trực tiếp');
        this.openLeaderboard();
      };
    });

    modal.classList.add('active');
  }

  openRulesModal() {
    const modal = document.getElementById('rulesModal');
    if (modal) modal.classList.add('active');
  }

  closeAllModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }

  // 6. VICTORY SCREEN
  renderVictoryScreen(container) {
    sound.playVictory();
    if (this.vietnamEngine) this.vietnamEngine.triggerVictoryFlock();
    this.confettiEngine.continuous(6500);

    const sorted = gameState.getSortedTeams();
    const maxScore = sorted[0]?.score ?? 0;
    const topTeams = sorted.filter(t => t.score === maxScore);
    const isTie = topTeams.length > 1;
    const isAllTie = isTie && topTeams.length === sorted.length;
    const winner = sorted[0] || { name: 'Đội Xuất Sắc', score: 0, emblemKey: 'teamNhanNghia' };

    container.innerHTML = `
      <div class="screen-victory">
        ${isTie ? `
          <div class="victory-champion-banner">
            <div style="width: 84px; height: 84px; margin: 0 auto 16px;">
              ${ICONS.trophy}
            </div>
            <h1 class="victory-title" style="${isAllTie ? 'font-size: 2.7rem;' : ''}">
              ${isAllTie ? `ĐẠI ĐOÀN KẾT — CẢ ${gameState.teams.length} ĐỘI ĐỒNG VÔ ĐỊCH!` : 'CHÚC MỪNG CÁC ĐỘI ĐỒNG QUÁN QUÂN!'}
            </h1>
            <p style="color: var(--gold-300); font-size: 1.25rem; font-weight: 700; margin: 10px 0 16px;">
              ${isAllTie ? '“Đoàn kết, đoàn kết, đại đoàn kết — Thành công, thành công, đại thành công!”' : `Điểm số kỷ lục ngang tài ngang sức: <span style="color: #fff; font-family: var(--font-mono); font-weight: 900; font-size: 1.4rem;">${maxScore} ĐIỂM</span>`}
            </p>
            <div class="co-champions-grid">
              ${topTeams.map((t, idx) => `
                <div class="co-champion-card" style="border-color: ${t.color};">
                  <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                    ${getTeamEmblem(t, idx)}
                  </div>
                  <div style="text-align: left;">
                    <div class="co-champion-name">${t.name}</div>
                    <div style="font-family: var(--font-mono); font-weight: 800; color: var(--gold-400); font-size: 1.1rem;">${t.score} ĐIỂM</div>
                  </div>
                  <span class="co-champion-badge">ĐỒNG QUÁN QUÂN</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="victory-champion-banner">
            <div style="width: 100px; height: 100px; margin: 0 auto 16px;">
              ${ICONS.trophy}
            </div>
            <h1 class="victory-title">CHÚC MỪNG NHÀ VÔ ĐỊCH!</h1>
            <div class="victory-champion-name" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
              <div style="width: 54px; height: 54px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(winner, 0)}</div>
              <span>${winner.name}</span>
            </div>
            <div style="font-size: 1.8rem; font-family: var(--font-mono); font-weight: 900; color: #fff;">
              Điểm số kỷ lục: <span style="color: var(--gold-400);">${winner.score} ĐIỂM</span>
            </div>
          </div>
        `}

        <div class="victory-quote-card">
          <p class="quote-text">
            “Đảng ta thật là vĩ đại!”
          </p>
          <p class="quote-author">— Hồ Chí Minh —</p>
        </div>

        <!-- Final Podium -->
        <div class="podium-container" style="margin: 20px 0 40px;">
          ${sorted[1] ? `
            <div class="podium-slot rank-2">
              <div style="width: 48px; height: 48px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(sorted[1], 1)}</div>
              <div class="podium-team-name">${sorted[1].name}</div>
              <div class="podium-score">${sorted[1].score} đ</div>
              <div class="podium-bar">${sorted[1].score === sorted[0].score ? '1' : '2'}</div>
            </div>
          ` : ''}

          <div class="podium-slot rank-1">
            <div style="width: 68px; height: 68px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(winner, 0)}</div>
            <div class="podium-team-name">${winner.name}</div>
            <div class="podium-score">${winner.score} đ</div>
            <div class="podium-bar">1</div>
          </div>

          ${sorted[2] ? `
            <div class="podium-slot rank-3">
              <div style="width: 44px; height: 44px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(sorted[2], 2)}</div>
              <div class="podium-team-name">${sorted[2].name}</div>
              <div class="podium-score">${sorted[2].score} đ</div>
              <div class="podium-bar">${sorted[2].score === sorted[0].score ? '1' : '3'}</div>
            </div>
          ` : ''}

          ${sorted.slice(3).map((otherTeam, otherIdx) => `
            <div style="display: flex; flex-direction: column; align-items: center; width: 140px; margin-top: 50px;">
              <div style="width: 36px; height: 36px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(otherTeam, 3 + otherIdx)}</div>
              <div style="font-weight: 700; color: #fff;">${otherTeam.name}</div>
              <div style="font-family: var(--font-mono); font-weight: 800; color: var(--gold-400);">${otherTeam.score} đ</div>
              <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">${otherTeam.score === sorted[0].score ? 'Hạng 01' : `Hạng 0${4 + otherIdx}`}</div>
            </div>
          `).join('')}
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
          <button id="btnStartTieBreaker" class="${isTie ? 'btn btn-tie-breaker-launch btn-hero' : 'btn btn-glass btn-hero'}" style="${!isTie ? 'border-color: var(--gold-400); color: var(--gold-300);' : ''}">
            ${ICONS.zap} <span>${isTie ? '⚡ ĐẤU CÂU HỎI PHỤ (TIE-BREAKER)' : '⚡ CÂU HỎI PHỤ GIAO LƯU'}</span>
          </button>
          <button id="btnPlayAgain" class="btn btn-gold btn-hero">
            ${ICONS.refresh} <span>CHƠI LẠI</span>
          </button>
          <button id="btnHomeFromVictory" class="btn btn-glass btn-hero">
            ${ICONS.home} <span>VỀ TRANG CHỦ</span>
          </button>
        </div>
      </div>
    `;

    const btnTie = document.getElementById('btnStartTieBreaker');
    if (btnTie) {
      btnTie.onclick = () => {
        sound.playDongSonGong();
        const competing = isTie ? topTeams.map(t => t.id) : sorted.map(t => t.id);
        gameState.startTieBreaker(competing);
      };
    }

    document.getElementById('btnPlayAgain').onclick = () => {
      this.promptResetMatch();
    };

    document.getElementById('btnHomeFromVictory').onclick = () => {
      sound.playClick();
      gameState.setScreen('home');
    };
  }

  // 7. TIE-BREAKER SCREEN
  renderTieBreakerScreen(container) {
    const q = gameState.getCurrentTieQuestion();
    const tieQuestions = gameState.getTieBreakerQuestions();
    const competingTeams = gameState.teams.filter(t => gameState.tieCompetingTeamIds.length === 0 || gameState.tieCompetingTeamIds.includes(t.id));

    container.innerHTML = `
      <div class="screen-tie-breaker">
        <div class="tie-header">
          <div class="round-intro-badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-color: #ef4444; display: inline-flex; align-items: center; gap: 6px;">
            ${ICONS.zap} VÒNG CÂU HỎI PHỤ • TIE-BREAKER
          </div>
          <h1 style="font-size: 2.3rem; font-weight: 900; margin: 12px 0 6px; color: #fff; text-transform: uppercase;">
            PHÂN ĐỊNH NGÔI VỊ QUÁN QUÂN
          </h1>
          <p style="font-size: 1rem; color: var(--text-secondary); max-width: 650px; margin: 0 auto;">
            Dành cho các đội đang hòa điểm cao nhất. Bấm chuông/giơ tay giành quyền trả lời!
          </p>

          <div class="tie-competing-strip">
            ${competingTeams.map((t, idx) => `
              <div class="tie-competing-chip" style="border-color: ${t.color};">
                <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                  ${getTeamEmblem(t, idx)}
                </div>
                <span>${t.name}</span>
                <span style="font-family: var(--font-mono); font-weight: 900; color: var(--gold-400);">(${t.score}đ)</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="tie-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <span class="hud-pill" style="font-size: 0.95rem; font-weight: 800; color: var(--gold-300);">
              ${q.badge} • CÂU ${gameState.currentTieQuestionIdx + 1}/${tieQuestions.length}
            </span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Đếm ngược:</span>
              <span id="tieTimerDisplay" style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 900; color: var(--gold-400); min-width: 45px;">
                ${gameState.timerSeconds}s
              </span>
              <button id="btnTieTimerToggle" class="btn btn-glass" style="padding: 6px 12px; font-size: 0.85rem;">
                ${gameState.timerRunning ? ICONS.pause : ICONS.play}
              </button>
            </div>
          </div>

          <div style="font-size: 1.2rem; font-weight: 800; color: var(--gold-400); margin-bottom: 12px;">
            ${q.title}
          </div>

          <div class="tie-scenario">
            ${q.scenario}
          </div>

          <div class="tie-question-text">
            ${q.question}
          </div>

          <!-- 4 Options -->
          <div class="tie-options-grid">
            ${q.options.map(opt => {
              let cls = 'tie-option-btn';
              if (gameState.tieSelectedOption === opt.key) cls += ' selected';
              if (gameState.tieAnswerRevealed) {
                if (opt.key === q.correct) cls += ' correct';
                else if (gameState.tieSelectedOption === opt.key) cls += ' wrong';
              }
              return `
                <button class="${cls}" data-key="${opt.key}">
                  <span class="tie-option-key">${opt.key}</span>
                  <span style="line-height: 1.5;">${opt.text}</span>
                </button>
              `;
            }).join('')}
          </div>

          <!-- Reveal Button -->
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 10px;">
            ${!gameState.tieAnswerRevealed ? `
              <button id="btnRevealTieAnswer" class="btn btn-gold btn-hero">
                ${ICONS.eye} <span>CÔNG BỐ ĐÁP ÁN</span>
              </button>
            ` : ''}
          </div>

          <!-- Explanation Debrief Box -->
          ${gameState.tieAnswerRevealed ? `
            <div style="margin-top: 24px; background: rgba(0, 0, 0, 0.45); border: 1px solid var(--border-glass); border-left: 4px solid #34d399; border-radius: var(--radius-md); padding: 18px 24px; text-align: left;">
              <div style="font-size: 1.15rem; font-weight: 800; color: #34d399; margin-bottom: 8px;">
                ✓ ĐÁP ÁN ĐÚNG: ${q.explanation.answerText}
              </div>
              <div style="font-size: 1rem; color: #fff; margin-bottom: 8px; line-height: 1.5;">
                <strong>Vì sao:</strong> ${q.explanation.why}
              </div>
              <div style="font-size: 0.95rem; color: var(--gold-200); line-height: 1.5;">
                <strong>Bài học cốt lõi:</strong> ${q.explanation.lesson}
              </div>
            </div>

            <!-- Award Points Panel -->
            <div class="tie-award-panel">
              <h4 style="color: var(--gold-300); font-size: 1.1rem; margin-bottom: 6px; text-transform: uppercase;">
                🏆 CỘNG ĐIỂM QUYẾT ĐỊNH CHO ĐỘI TRẢ LỜI ĐÚNG:
              </h4>
              <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 14px;">
                Bấm chọn đội giành được quyền trả lời đúng để cộng +10đ phân định ngôi vô địch:
              </p>
              <div class="tie-award-buttons">
                ${competingTeams.map((t, idx) => `
                  <button class="btn btn-gold btn-tie-award-team" data-teamid="${t.id}" style="padding: 10px 18px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${getTeamEmblem(t, idx)}</span>
                    <span>+10đ cho ${t.name}</span>
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button id="btnBackToVictory" class="btn btn-hero btn-gold">
            ${ICONS.trophy} <span>XEM KẾT QUẢ CHUNG CUỘC</span>
          </button>
          ${gameState.currentTieQuestionIdx < tieQuestions.length - 1 ? `
            <button id="btnNextTieQuestion" class="btn btn-hero btn-glass">
              <span>CÂU HỎI TIẾP THEO</span> ${ICONS.chevronRight}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    // Bind Option Clicks
    container.querySelectorAll('.tie-option-btn').forEach(btn => {
      btn.onclick = () => {
        if (gameState.tieAnswerRevealed) return;
        sound.playClick();
        const key = btn.dataset.key;
        gameState.setTieSelectedOption(key);
      };
    });

    // Reveal Answer
    const btnReveal = document.getElementById('btnRevealTieAnswer');
    if (btnReveal) {
      btnReveal.onclick = () => {
        sound.playDongSonGong();
        this.stopTimer();
        gameState.revealTieAnswer();
      };
    }

    // Timer Toggle
    const btnTimer = document.getElementById('btnTieTimerToggle');
    if (btnTimer) {
      btnTimer.onclick = () => {
        if (gameState.timerRunning) {
          this.stopTimer();
        } else {
          this.startTimer();
        }
      };
    }

    // Award Points
    container.querySelectorAll('.btn-tie-award-team').forEach(btn => {
      btn.onclick = () => {
        const teamId = parseInt(btn.dataset.teamid, 10);
        const team = gameState.teams.find(t => t.id === teamId);
        sound.playVictory();
        this.confettiEngine.burst(85);
        gameState.awardTieBreaker(teamId, 10);
        this.showCelebrationToast('CẬP NHẬT ĐIỂM QUYẾT ĐỊNH!', `+10đ cho ${team ? team.name : 'đội thi'}!`);
        this.renderTieBreakerScreen(container);
      };
    });

    // Back to Victory
    const btnBack = document.getElementById('btnBackToVictory');
    if (btnBack) {
      btnBack.onclick = () => {
        sound.playClick();
        this.stopTimer();
        gameState.setScreen('victory');
      };
    }

    // Next Tie Question
    const btnNext = document.getElementById('btnNextTieQuestion');
    if (btnNext) {
      btnNext.onclick = () => {
        sound.playWhoosh();
        this.stopTimer();
        gameState.nextTieQuestion();
      };
    }
  }

  promptResetMatch() {
    sound.playClick();
    const confirmed = confirm(
      'BẠN CÓ CHẮC CHẮN MUỐN RESET TOÀN BỘ ĐIỂM VỀ 0 ĐỂ CHƠI MÀN MỚI?\n\n' +
      '• Điểm số của tất cả các đội sẽ được đưa về 0\n' +
      '• Quay về màn hình chọn số đội & đặt tên đội\n' +
      '• Câu hỏi sẽ được bốc ngẫu nhiên lại'
    );
    if (!confirmed) return;

    sound.playDongSonGong();
    gameState.resetMatch(true);
    this.closeAllModals();
    this.showCelebrationToast('ĐÃ RESET ĐIỂM VỀ 0!', 'Chọn số đội để bắt đầu màn mới');
    gameState.setScreen('setup');
  }

  promptResetScoresOnly() {
    sound.playClick();
    const confirmed = confirm('Bạn có chắc muốn đặt lại điểm số của tất cả các đội về 0 (giữ nguyên câu hỏi hiện tại)?');
    if (!confirmed) return;

    sound.playScoreUp();
    gameState.resetScoresOnly();
    this.openLeaderboard();
    this.showCelebrationToast('ĐÃ ĐẶT LẠI ĐIỂM VỀ 0', 'Tất cả các đội hiện có 0 điểm');
  }

  toggleMute() {
    const isMuted = sound.toggleMute();
    this.renderTopHud();
    return isMuted;
  }

  toggleFullscreen() {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen().catch(err => console.log(err));
    }
  }
}

window.gameApp = new GameApp();
