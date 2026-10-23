// Game State Management - Turn-based Head-to-Head Rotation System
import { ROUNDS_CONFIG, QUESTIONS_DATA, TIE_BREAKER_QUESTIONS } from './questions.js';

const STORAGE_KEY = 'DAU_TRUONG_VNR202_N04_V1';

const DEFAULT_TEAMS = [
  { id: 1, name: "Đội Nhân Nghĩa", emblemKey: "teamNhanNghia", color: "#EF4444", score: 0 },
  { id: 2, name: "Đội Chính Trực", emblemKey: "teamChinhTruc", color: "#F59E0B", score: 0 },
  { id: 3, name: "Đội Trách Nhiệm", emblemKey: "teamTrachNhiem", color: "#3B82F6", score: 0 },
  { id: 4, name: "Đội Liêm Chính", emblemKey: "teamLiemChinh", color: "#10B981", score: 0 },
  { id: 5, name: "Đội Chí Công", emblemKey: "teamChiCong", color: "#8B5CF6", score: 0 }
];

class GameStateManager {
  constructor() {
    this.listeners = new Set();
    this.resetToDefaults();
    this.load();
  }

  resetToDefaults() {
    this.currentScreen = 'home'; // home, setup, round_intro, question, victory, tie_breaker
    this.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
    this.currentRoundId = 1;
    this.currentQuestionIdx = 0;
    this.currentTeamIndex = 0; // Turn index: 0 -> Đội 1, 1 -> Đội 2, etc.

    // Runtime state for current active turn
    this.activeTeamAnswer = null;
    this.isAnswersLocked = false;
    this.isAnswerRevealed = false;
    this.turnResult = null; // 'correct' | 'wrong' | null

    this.timerSeconds = 15;
    this.timerMax = 15;
    this.timerRunning = false;

    // Steal mechanics (active in all rounds if active team is wrong)
    this.stealAvailable = false;
    this.stealingTeamId = null;
    this.disqualifiedStealTeams = []; // teams that failed steal this question

    // Round 5 Finale 3-step state
    this.finaleStep = 1; // 1: Choose option, 2: Debate explanation (30s), 3: MC grade (max 50)
    this.round5Awarded = {};
    this.questionPicks = {};

    // Tie-breaker state
    this.currentTieQuestionIdx = 0;
    this.tieAnswerRevealed = false;
    this.tieSelectedOption = null;
    this.tieCompetingTeamIds = [];

    this.scoreHistory = [];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(eventType, payload) {
    this.save();
    for (const listener of this.listeners) {
      try {
        listener(eventType, payload, this);
      } catch (err) {
        console.error('State listener error:', err);
      }
    }
  }

  save() {
    try {
      const data = {
        currentScreen: this.currentScreen,
        teams: this.teams,
        currentRoundId: this.currentRoundId,
        currentQuestionIdx: this.currentQuestionIdx,
        currentTeamIndex: this.currentTeamIndex,
        activeTeamAnswer: this.activeTeamAnswer,
        isAnswersLocked: this.isAnswersLocked,
        isAnswerRevealed: this.isAnswerRevealed,
        turnResult: this.turnResult,
        timerSeconds: this.timerSeconds,
        timerMax: this.timerMax,
        stealAvailable: this.stealAvailable,
        stealingTeamId: this.stealingTeamId,
        disqualifiedStealTeams: this.disqualifiedStealTeams,
        stealedOptionKeys: this.stealedOptionKeys,
        finaleStep: this.finaleStep,
        round5Awarded: this.round5Awarded,
        questionPicks: this.questionPicks,
        scoreHistory: this.scoreHistory,
        currentTieQuestionIdx: this.currentTieQuestionIdx,
        tieAnswerRevealed: this.tieAnswerRevealed,
        tieSelectedOption: this.tieSelectedOption,
        tieCompetingTeamIds: this.tieCompetingTeamIds
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return false;
      const data = JSON.parse(saved);
      if (data && Array.isArray(data.teams) && data.teams.length >= 2) {
        this.currentScreen = data.currentScreen || 'home';
        this.teams = data.teams.map((t, idx) => ({
          ...t,
          emblemKey: t.emblemKey || DEFAULT_TEAMS[idx % DEFAULT_TEAMS.length].emblemKey
        }));
        this.currentRoundId = Math.min(4, Math.max(1, data.currentRoundId || 1));
        this.currentQuestionIdx = data.currentQuestionIdx || 0;
        this.currentTeamIndex = data.currentTeamIndex || 0;
        this.activeTeamAnswer = data.activeTeamAnswer || null;
        this.isAnswersLocked = !!data.isAnswersLocked;
        this.isAnswerRevealed = !!data.isAnswerRevealed;
        this.turnResult = data.turnResult || null;
        this.timerSeconds = data.timerSeconds || 15;
        this.timerMax = data.timerMax || 15;
        this.stealAvailable = !!data.stealAvailable;
        this.stealingTeamId = data.stealingTeamId || null;
        this.disqualifiedStealTeams = data.disqualifiedStealTeams || [];
        this.stealedOptionKeys = data.stealedOptionKeys || [];
        this.finaleStep = data.finaleStep || 1;
        this.round5Awarded = data.round5Awarded || {};
        this.questionPicks = data.questionPicks || {};
        this.scoreHistory = data.scoreHistory || [];
        this.currentTieQuestionIdx = data.currentTieQuestionIdx || 0;
        this.tieAnswerRevealed = !!data.tieAnswerRevealed;
        this.tieSelectedOption = data.tieSelectedOption || null;
        this.tieCompetingTeamIds = data.tieCompetingTeamIds || [];
        return true;
      }
    } catch (e) {
      console.warn('Could not restore state:', e);
    }
    return false;
  }

  resetAll() {
    localStorage.removeItem(STORAGE_KEY);
    this.resetToDefaults();
    this.notify('RESET');
  }

  resetMatch(keepTeamNames = true) {
    if (keepTeamNames) {
      this.teams.forEach(t => { t.score = 0; });
    } else {
      this.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
    }
    this.currentRoundId = 1;
    this.currentQuestionIdx = 0;
    this.currentTeamIndex = 0;
    this.activeTeamAnswer = null;
    this.isAnswersLocked = false;
    this.isAnswerRevealed = false;
    this.turnResult = null;
    this.timerRunning = false;
    this.stealAvailable = false;
    this.stealingTeamId = null;
    this.disqualifiedStealTeams = [];
    this.stealedOptionKeys = [];
    this.finaleStep = 1;
    this.round5Awarded = {};
    this.questionPicks = {};
    this.scoreHistory = [];
    this.currentTieQuestionIdx = 0;
    this.tieAnswerRevealed = false;
    this.tieSelectedOption = null;
    this.tieCompetingTeamIds = [];
    this.save();
    this.notify('MATCH_RESET');
  }

  resetScoresOnly() {
    this.teams.forEach(t => { t.score = 0; });
    this.scoreHistory = [];
    this.save();
    this.notify('TEAMS_UPDATED', this.teams);
  }

  setScreen(screen) {
    this.currentScreen = screen;
    this.notify('SCREEN_CHANGE', screen);
  }

  getActiveTeam() {
    return this.teams[this.currentTeamIndex % this.teams.length] || this.teams[0];
  }

  setStartingTeam(teamIndex) {
    this.currentTeamIndex = teamIndex % this.teams.length;
    this.notify('ACTIVE_TEAM_CHANGED', this.getActiveTeam());
  }

  advanceTurn() {
    this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
    this.notify('ACTIVE_TEAM_CHANGED', this.getActiveTeam());
  }

  // Số đội 2–5; đổi số đội thì bốc lại câu hỏi cho khớp
  setTeamCount(n) {
    n = Math.max(2, Math.min(DEFAULT_TEAMS.length, n));
    this.teams = DEFAULT_TEAMS.slice(0, n).map((d, i) => this.teams[i] || JSON.parse(JSON.stringify(d)));
    this.currentTeamIndex = 0;
    this.questionPicks = {};
    this.notify('TEAMS_CHANGED', { count: n });
  }

  updateTeam(id, changes) {
    const team = this.teams.find(t => t.id === id);
    if (team) {
      Object.assign(team, changes);
      this.notify('TEAMS_UPDATED', this.teams);
    }
  }

  addScore(teamId, delta, reason = '') {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      team.score += delta;
      this.scoreHistory.push({
        teamId,
        teamName: team.name,
        delta,
        newScore: team.score,
        reason,
        timestamp: Date.now()
      });
      this.notify('SCORE_CHANGED', { teamId, delta, team });
    }
  }

  getSortedTeams() {
    return [...this.teams].sort((a, b) => b.score - a.score);
  }

  getCurrentRound() {
    return ROUNDS_CONFIG.find(r => r.id === this.currentRoundId) || ROUNDS_CONFIG[0];
  }

  // Mỗi vòng: mỗi đội 1 lượt, câu hỏi bốc ngẫu nhiên từ bộ câu (giữ cố định trong cả trận)
  getCurrentQuestionList() {
    const pool = QUESTIONS_DATA[this.currentRoundId] || [];
    let picks = this.questionPicks[this.currentRoundId];
    if (!picks || picks.some(i => i >= pool.length)) {
      const idx = pool.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      picks = this.questionPicks[this.currentRoundId] = idx.slice(0, this.teams.length);
      this.save();
    }
    return picks.map(i => pool[i]);
  }

  getCurrentQuestion() {
    const list = this.getCurrentQuestionList();
    return list[this.currentQuestionIdx] || null;
  }

  // Setup / Start new question
  startQuestion(roundId, questionIdx, customTeamIndex = null) {
    this.currentRoundId = roundId;
    this.currentQuestionIdx = questionIdx;
    if (customTeamIndex !== null) {
      this.currentTeamIndex = customTeamIndex % this.teams.length;
    }

    const round = this.getCurrentRound();
    this.timerMax = round.timeLimit || 15;
    this.timerSeconds = this.timerMax;
    this.timerRunning = false;

    this.activeTeamAnswer = null;
    this.isAnswersLocked = false;
    this.isAnswerRevealed = false;
    this.turnResult = null;

    this.stealAvailable = false;
    this.stealingTeamId = null;
    this.disqualifiedStealTeams = [];
    this.stealedOptionKeys = [];

    this.finaleStep = 1;

    this.notify('QUESTION_STARTED', { roundId, questionIdx, activeTeam: this.getActiveTeam() });
  }

  setActiveTeamAnswer(key) {
    if (this.isAnswersLocked) return;
    this.activeTeamAnswer = key;
    this.notify('ANSWER_SELECTED', { answer: key });
  }

  lockAnswers() {
    this.isAnswersLocked = true;
    this.timerRunning = false;
    this.notify('ANSWERS_LOCKED');
  }

  revealAnswer() {
    this.isAnswerRevealed = true;
    this.isAnswersLocked = true;
    this.timerRunning = false;
    this.notify('ANSWER_REVEALED');
  }

  // Steal System
  activateStealMode() {
    this.stealAvailable = true;
    this.stealingTeamId = null;
    if (this.activeTeamAnswer && !this.stealedOptionKeys.includes(this.activeTeamAnswer)) {
      this.stealedOptionKeys.push(this.activeTeamAnswer);
    }
    this.notify('STEAL_MODE_ACTIVATED');
  }

  setStealingTeam(teamId) {
    this.stealingTeamId = teamId;
    this.notify('STEALING_TEAM_CHOSEN', { teamId });
  }

  resolveSteal(isCorrect, chosenKey = null) {
    if (!this.stealingTeamId) return;
    const team = this.teams.find(t => t.id === this.stealingTeamId);
    if (!team) return;

    if (chosenKey && !this.stealedOptionKeys.includes(chosenKey)) {
      this.stealedOptionKeys.push(chosenKey);
    }

    if (isCorrect) {
      // Steal success: +10 pts
      this.addScore(team.id, 10, 'Cướp điểm thành công (+10đ)');
      this.stealAvailable = false;
      this.stealingTeamId = null;
      this.revealAnswer();
      this.notify('STEAL_RESOLVED', { isCorrect: true, team, delta: 10, chosenKey });
    } else {
      // Steal failed: 0 pts, disqualified for this question
      if (!this.disqualifiedStealTeams.includes(team.id)) {
        this.disqualifiedStealTeams.push(team.id);
      }
      this.stealingTeamId = null;

      // Check if all other non-active teams have attempted steal
      const otherTeams = this.teams.filter(t => t.id !== this.getActiveTeam().id);
      const remainingStealers = otherTeams.filter(t => !this.disqualifiedStealTeams.includes(t.id));
      if (remainingStealers.length === 0) {
        this.stealAvailable = false;
        this.revealAnswer();
      }
      this.notify('STEAL_RESOLVED', { isCorrect: false, team, delta: 0, chosenKey, remainingCount: remainingStealers.length });
    }
  }

  closeStealMode() {
    this.stealAvailable = false;
    this.stealingTeamId = null;
    this.revealAnswer();
    this.notify('STEAL_CLOSED');
  }

  // Round 5 Finale Step Handlers
  setFinaleStep(step) {
    this.finaleStep = step;
    if (step === 2) {
      // 30s explanation countdown timer
      this.timerMax = 30;
      this.timerSeconds = 30;
      this.timerRunning = false;
    }
    this.notify('FINALE_STEP_CHANGED', { step });
  }

  awardRound5(caseIdx, teamId, points) {
    if (!this.round5Awarded[caseIdx]) {
      this.round5Awarded[caseIdx] = {};
    }
    this.round5Awarded[caseIdx][teamId] = points;
    this.addScore(teamId, points, `Chung kết Case ${caseIdx + 1} (+${points}đ)`);
    this.notify('ROUND5_AWARDED', { caseIdx, teamId, points });
  }

  // ================= TIE-BREAKER METHODS =================
  getCurrentTieQuestion() {
    return TIE_BREAKER_QUESTIONS[this.currentTieQuestionIdx] || TIE_BREAKER_QUESTIONS[0];
  }

  getTieBreakerQuestions() {
    return TIE_BREAKER_QUESTIONS;
  }

  startTieBreaker(competingTeamIds = []) {
    this.currentTieQuestionIdx = 0;
    this.tieAnswerRevealed = false;
    this.tieSelectedOption = null;
    this.tieCompetingTeamIds = competingTeamIds;
    this.timerMax = 20;
    this.timerSeconds = 20;
    this.timerRunning = false;
    this.setScreen('tie_breaker');
  }

  setTieSelectedOption(key) {
    this.tieSelectedOption = key;
    this.notify('TIE_OPTION_SELECTED', { key });
  }

  revealTieAnswer() {
    this.tieAnswerRevealed = true;
    this.timerRunning = false;
    this.notify('TIE_ANSWER_REVEALED');
  }

  nextTieQuestion() {
    if (this.currentTieQuestionIdx < TIE_BREAKER_QUESTIONS.length - 1) {
      this.currentTieQuestionIdx++;
      this.tieAnswerRevealed = false;
      this.tieSelectedOption = null;
      this.timerMax = 20;
      this.timerSeconds = 20;
      this.timerRunning = false;
      this.notify('TIE_QUESTION_CHANGED', { idx: this.currentTieQuestionIdx });
    }
  }

  awardTieBreaker(teamId, delta = 10) {
    this.addScore(teamId, delta, `Câu hỏi phụ Tie-Breaker (+${delta}đ)`);
    this.notify('TIE_AWARDED', { teamId, delta });
  }
}

export const gameState = new GameStateManager();
