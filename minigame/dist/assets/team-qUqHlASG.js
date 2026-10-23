import{a as e,i as t,n,o as r,r as i,s as a,t as o}from"./vietnamVisuals-DI73Jhac.js";var s=`DAU_TRUONG_VNR202_N04_V1`,c=[{id:1,name:`Đội Nhân Nghĩa`,emblemKey:`teamNhanNghia`,color:`#EF4444`,score:0},{id:2,name:`Đội Chính Trực`,emblemKey:`teamChinhTruc`,color:`#F59E0B`,score:0},{id:3,name:`Đội Trách Nhiệm`,emblemKey:`teamTrachNhiem`,color:`#3B82F6`,score:0},{id:4,name:`Đội Liêm Chính`,emblemKey:`teamLiemChinh`,color:`#10B981`,score:0},{id:5,name:`Đội Chí Công`,emblemKey:`teamChiCong`,color:`#8B5CF6`,score:0}],l=new class{constructor(){this.listeners=new Set,this.resetToDefaults(),this.load()}resetToDefaults(){this.currentScreen=`home`,this.teams=JSON.parse(JSON.stringify(c)),this.currentRoundId=1,this.currentQuestionIdx=0,this.currentTeamIndex=0,this.activeTeamAnswer=null,this.isAnswersLocked=!1,this.isAnswerRevealed=!1,this.turnResult=null,this.timerSeconds=15,this.timerMax=15,this.timerRunning=!1,this.stealAvailable=!1,this.stealingTeamId=null,this.disqualifiedStealTeams=[],this.finaleStep=1,this.round5Awarded={},this.questionPicks={},this.currentTieQuestionIdx=0,this.tieAnswerRevealed=!1,this.tieSelectedOption=null,this.tieCompetingTeamIds=[],this.scoreHistory=[]}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}notify(e,t){this.save();for(let n of this.listeners)try{n(e,t,this)}catch(e){console.error(`State listener error:`,e)}}save(){try{let e={currentScreen:this.currentScreen,teams:this.teams,currentRoundId:this.currentRoundId,currentQuestionIdx:this.currentQuestionIdx,currentTeamIndex:this.currentTeamIndex,activeTeamAnswer:this.activeTeamAnswer,isAnswersLocked:this.isAnswersLocked,isAnswerRevealed:this.isAnswerRevealed,turnResult:this.turnResult,timerSeconds:this.timerSeconds,timerMax:this.timerMax,stealAvailable:this.stealAvailable,stealingTeamId:this.stealingTeamId,disqualifiedStealTeams:this.disqualifiedStealTeams,stealedOptionKeys:this.stealedOptionKeys,finaleStep:this.finaleStep,round5Awarded:this.round5Awarded,questionPicks:this.questionPicks,scoreHistory:this.scoreHistory,currentTieQuestionIdx:this.currentTieQuestionIdx,tieAnswerRevealed:this.tieAnswerRevealed,tieSelectedOption:this.tieSelectedOption,tieCompetingTeamIds:this.tieCompetingTeamIds};localStorage.setItem(s,JSON.stringify(e))}catch(e){console.warn(`Could not save to localStorage:`,e)}}load(){try{let e=localStorage.getItem(s);if(!e)return!1;let t=JSON.parse(e);if(t&&Array.isArray(t.teams)&&t.teams.length>=2)return this.currentScreen=t.currentScreen||`home`,this.teams=t.teams.map((e,t)=>({...e,emblemKey:e.emblemKey||c[t%c.length].emblemKey})),this.currentRoundId=Math.min(4,Math.max(1,t.currentRoundId||1)),this.currentQuestionIdx=t.currentQuestionIdx||0,this.currentTeamIndex=t.currentTeamIndex||0,this.activeTeamAnswer=t.activeTeamAnswer||null,this.isAnswersLocked=!!t.isAnswersLocked,this.isAnswerRevealed=!!t.isAnswerRevealed,this.turnResult=t.turnResult||null,this.timerSeconds=t.timerSeconds||15,this.timerMax=t.timerMax||15,this.stealAvailable=!!t.stealAvailable,this.stealingTeamId=t.stealingTeamId||null,this.disqualifiedStealTeams=t.disqualifiedStealTeams||[],this.stealedOptionKeys=t.stealedOptionKeys||[],this.finaleStep=t.finaleStep||1,this.round5Awarded=t.round5Awarded||{},this.questionPicks=t.questionPicks||{},this.scoreHistory=t.scoreHistory||[],this.currentTieQuestionIdx=t.currentTieQuestionIdx||0,this.tieAnswerRevealed=!!t.tieAnswerRevealed,this.tieSelectedOption=t.tieSelectedOption||null,this.tieCompetingTeamIds=t.tieCompetingTeamIds||[],!0}catch(e){console.warn(`Could not restore state:`,e)}return!1}resetAll(){localStorage.removeItem(s),this.resetToDefaults(),this.notify(`RESET`)}resetMatch(e=!0){e?this.teams.forEach(e=>{e.score=0}):this.teams=JSON.parse(JSON.stringify(c)),this.currentRoundId=1,this.currentQuestionIdx=0,this.currentTeamIndex=0,this.activeTeamAnswer=null,this.isAnswersLocked=!1,this.isAnswerRevealed=!1,this.turnResult=null,this.timerRunning=!1,this.stealAvailable=!1,this.stealingTeamId=null,this.disqualifiedStealTeams=[],this.stealedOptionKeys=[],this.finaleStep=1,this.round5Awarded={},this.questionPicks={},this.scoreHistory=[],this.currentTieQuestionIdx=0,this.tieAnswerRevealed=!1,this.tieSelectedOption=null,this.tieCompetingTeamIds=[],this.save(),this.notify(`MATCH_RESET`)}resetScoresOnly(){this.teams.forEach(e=>{e.score=0}),this.scoreHistory=[],this.save(),this.notify(`TEAMS_UPDATED`,this.teams)}setScreen(e){this.currentScreen=e,this.notify(`SCREEN_CHANGE`,e)}getActiveTeam(){return this.teams[this.currentTeamIndex%this.teams.length]||this.teams[0]}setStartingTeam(e){this.currentTeamIndex=e%this.teams.length,this.notify(`ACTIVE_TEAM_CHANGED`,this.getActiveTeam())}advanceTurn(){this.currentTeamIndex=(this.currentTeamIndex+1)%this.teams.length,this.notify(`ACTIVE_TEAM_CHANGED`,this.getActiveTeam())}setTeamCount(e){e=Math.max(2,Math.min(c.length,e)),this.teams=c.slice(0,e).map((e,t)=>this.teams[t]||JSON.parse(JSON.stringify(e))),this.currentTeamIndex=0,this.questionPicks={},this.notify(`TEAMS_CHANGED`,{count:e})}updateTeam(e,t){let n=this.teams.find(t=>t.id===e);n&&(Object.assign(n,t),this.notify(`TEAMS_UPDATED`,this.teams))}addScore(e,t,n=``){let r=this.teams.find(t=>t.id===e);r&&(r.score+=t,this.scoreHistory.push({teamId:e,teamName:r.name,delta:t,newScore:r.score,reason:n,timestamp:Date.now()}),this.notify(`SCORE_CHANGED`,{teamId:e,delta:t,team:r}))}getSortedTeams(){return[...this.teams].sort((e,t)=>t.score-e.score)}getCurrentRound(){return r.find(e=>e.id===this.currentRoundId)||r[0]}getCurrentQuestionList(){let t=e[this.currentRoundId]||[],n=this.questionPicks[this.currentRoundId];if(!n||n.some(e=>e>=t.length)){let e=t.map((e,t)=>t);for(let t=e.length-1;t>0;t--){let n=Math.floor(Math.random()*(t+1));[e[t],e[n]]=[e[n],e[t]]}n=this.questionPicks[this.currentRoundId]=e.slice(0,this.teams.length),this.save()}return n.map(e=>t[e])}getCurrentQuestion(){return this.getCurrentQuestionList()[this.currentQuestionIdx]||null}startQuestion(e,t,n=null){this.currentRoundId=e,this.currentQuestionIdx=t,n!==null&&(this.currentTeamIndex=n%this.teams.length);let r=this.getCurrentRound();this.timerMax=r.timeLimit||15,this.timerSeconds=this.timerMax,this.timerRunning=!1,this.activeTeamAnswer=null,this.isAnswersLocked=!1,this.isAnswerRevealed=!1,this.turnResult=null,this.stealAvailable=!1,this.stealingTeamId=null,this.disqualifiedStealTeams=[],this.stealedOptionKeys=[],this.finaleStep=1,this.notify(`QUESTION_STARTED`,{roundId:e,questionIdx:t,activeTeam:this.getActiveTeam()})}setActiveTeamAnswer(e){this.isAnswersLocked||(this.activeTeamAnswer=e,this.notify(`ANSWER_SELECTED`,{answer:e}))}lockAnswers(){this.isAnswersLocked=!0,this.timerRunning=!1,this.notify(`ANSWERS_LOCKED`)}revealAnswer(){this.isAnswerRevealed=!0,this.isAnswersLocked=!0,this.timerRunning=!1,this.notify(`ANSWER_REVEALED`)}activateStealMode(){this.stealAvailable=!0,this.stealingTeamId=null,this.activeTeamAnswer&&!this.stealedOptionKeys.includes(this.activeTeamAnswer)&&this.stealedOptionKeys.push(this.activeTeamAnswer),this.notify(`STEAL_MODE_ACTIVATED`)}setStealingTeam(e){this.stealingTeamId=e,this.notify(`STEALING_TEAM_CHOSEN`,{teamId:e})}resolveSteal(e,t=null){if(!this.stealingTeamId)return;let n=this.teams.find(e=>e.id===this.stealingTeamId);if(n){if(t&&!this.stealedOptionKeys.includes(t)&&this.stealedOptionKeys.push(t),e)this.addScore(n.id,10,`Cướp điểm thành công (+10đ)`),this.stealAvailable=!1,this.stealingTeamId=null,this.revealAnswer(),this.notify(`STEAL_RESOLVED`,{isCorrect:!0,team:n,delta:10,chosenKey:t});else{this.disqualifiedStealTeams.includes(n.id)||this.disqualifiedStealTeams.push(n.id),this.stealingTeamId=null;let e=this.teams.filter(e=>e.id!==this.getActiveTeam().id).filter(e=>!this.disqualifiedStealTeams.includes(e.id));e.length===0&&(this.stealAvailable=!1,this.revealAnswer()),this.notify(`STEAL_RESOLVED`,{isCorrect:!1,team:n,delta:0,chosenKey:t,remainingCount:e.length})}}}closeStealMode(){this.stealAvailable=!1,this.stealingTeamId=null,this.revealAnswer(),this.notify(`STEAL_CLOSED`)}setFinaleStep(e){this.finaleStep=e,e===2&&(this.timerMax=30,this.timerSeconds=30,this.timerRunning=!1),this.notify(`FINALE_STEP_CHANGED`,{step:e})}awardRound5(e,t,n){this.round5Awarded[e]||(this.round5Awarded[e]={}),this.round5Awarded[e][t]=n,this.addScore(t,n,`Chung kết Case ${e+1} (+${n}đ)`),this.notify(`ROUND5_AWARDED`,{caseIdx:e,teamId:t,points:n})}getCurrentTieQuestion(){return a[this.currentTieQuestionIdx]||a[0]}getTieBreakerQuestions(){return a}startTieBreaker(e=[]){this.currentTieQuestionIdx=0,this.tieAnswerRevealed=!1,this.tieSelectedOption=null,this.tieCompetingTeamIds=e,this.timerMax=20,this.timerSeconds=20,this.timerRunning=!1,this.setScreen(`tie_breaker`)}setTieSelectedOption(e){this.tieSelectedOption=e,this.notify(`TIE_OPTION_SELECTED`,{key:e})}revealTieAnswer(){this.tieAnswerRevealed=!0,this.timerRunning=!1,this.notify(`TIE_ANSWER_REVEALED`)}nextTieQuestion(){this.currentTieQuestionIdx<a.length-1&&(this.currentTieQuestionIdx++,this.tieAnswerRevealed=!1,this.tieSelectedOption=null,this.timerMax=20,this.timerSeconds=20,this.timerRunning=!1,this.notify(`TIE_QUESTION_CHANGED`,{idx:this.currentTieQuestionIdx}))}awardTieBreaker(e,t=10){this.addScore(e,t,`Câu hỏi phụ Tie-Breaker (+${t}đ)`),this.notify(`TIE_AWARDED`,{teamId:e,delta:t})}},u=(e,t=``,n=`0 0 24 24`,r=20,i=20)=>`
<svg xmlns="http://www.w3.org/2000/svg" width="${r}" height="${i}" viewBox="${n}" class="svg-icon ${t}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  ${e}
</svg>
`,d={teamNhanNghia:`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" class="team-emblem-svg" fill="none">
      <defs>
        <linearGradient id="emblemGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="35%" stop-color="#E5B942"/>
          <stop offset="70%" stop-color="#B8861B"/>
          <stop offset="100%" stop-color="#78530D"/>
        </linearGradient>
        <linearGradient id="emblemCoreGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE382"/>
          <stop offset="100%" stop-color="#C28A18"/>
        </linearGradient>
      </defs>
      <!-- Tournament Medallion Outer Rim (Octagonal Bevel) -->
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" 
               fill="#0E131E" stroke="url(#emblemGoldRim)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="13.5,4 26.5,4 36,13.5 36,26.5 26.5,36 13.5,36 4,26.5 4,13.5" 
               fill="none" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Inner Chim Lạc Motif -->
      <path d="M32 10 C26 10.5 20 14 15 19 C12 15 8 13 5 12 C7 17 10 21 14 24 C13 27 10 30 7 32 C13 31 18 27 21 23 C25 23 29 19 33 14 C34 12 33 10.5 32 10 Z" 
            fill="url(#emblemCoreGlow)" stroke="#FFF0B5" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M15 19 L25 16 M13 23 L21 20" stroke="#0E131E" stroke-width="1.2" stroke-linecap="round"/>
      <circle cx="28.5" cy="12.5" r="1.3" fill="#0E131E"/>
      <circle cx="20" cy="35" r="1.2" fill="#D4AF37"/>
    </svg>
  `,teamChinhTruc:`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" class="team-emblem-svg" fill="none">
      <defs>
        <linearGradient id="emblemGoldRim2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="35%" stop-color="#E5B942"/>
          <stop offset="70%" stop-color="#B8861B"/>
          <stop offset="100%" stop-color="#78530D"/>
        </linearGradient>
        <linearGradient id="emblemCoreGlow2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE382"/>
          <stop offset="100%" stop-color="#C28A18"/>
        </linearGradient>
      </defs>
      <!-- Tournament Medallion Outer Rim (Octagonal Bevel) -->
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" 
               fill="#0E131E" stroke="url(#emblemGoldRim2)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="13.5,4 26.5,4 36,13.5 36,26.5 26.5,36 13.5,36 4,26.5 4,13.5" 
               fill="none" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Inner Geometric Pillar / Sword of Rectitude Motif -->
      <path d="M20 7 L23.5 12 L23.5 24 L20 26.5 L16.5 24 L16.5 12 Z" 
            fill="url(#emblemCoreGlow2)" stroke="#FFF0B5" stroke-width="1.2" stroke-linejoin="round"/>
      <line x1="20" y1="9" x2="20" y2="25" stroke="#0E131E" stroke-width="1.2"/>
      <polygon points="11,26 29,26 27,29 13,29" fill="#FFF0B5" stroke="#B8861B" stroke-width="1"/>
      <rect x="18.5" y="29" width="3" height="4" fill="#E5B942"/>
      <polygon points="20,33 17,35 23,35" fill="#FFF0B5"/>
      <line x1="10" y1="18" x2="14" y2="18" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="26" y1="18" x2="30" y2="18" stroke="#D4AF37" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,teamTrachNhiem:`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" class="team-emblem-svg" fill="none">
      <defs>
        <linearGradient id="emblemGoldRim3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="35%" stop-color="#E5B942"/>
          <stop offset="70%" stop-color="#B8861B"/>
          <stop offset="100%" stop-color="#78530D"/>
        </linearGradient>
        <linearGradient id="emblemCoreGlow3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE382"/>
          <stop offset="100%" stop-color="#C28A18"/>
        </linearGradient>
      </defs>
      <!-- Tournament Medallion Outer Rim (Octagonal Bevel) -->
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" 
               fill="#0E131E" stroke="url(#emblemGoldRim3)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="13.5,4 26.5,4 36,13.5 36,26.5 26.5,36 13.5,36 4,26.5 4,13.5" 
               fill="none" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Inner Shield of Responsibility Motif -->
      <path d="M20 8 L30 12 C30 22 25 28 20 32 C15 28 10 22 10 12 Z" 
            fill="url(#emblemCoreGlow3)" stroke="#FFF0B5" stroke-width="1.2" stroke-linejoin="round"/>
      <!-- Shield Chevron Core -->
      <polygon points="20,13 24,19 20,25 16,19" fill="#0E131E"/>
      <circle cx="20" cy="19" r="1.8" fill="#FFF0B5"/>
      <path d="M14 16 L20 14 L26 16" stroke="#0E131E" stroke-width="1" fill="none"/>
    </svg>
  `,teamLiemChinh:`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" class="team-emblem-svg" fill="none">
      <defs>
        <linearGradient id="emblemGoldRim4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="35%" stop-color="#E5B942"/>
          <stop offset="70%" stop-color="#B8861B"/>
          <stop offset="100%" stop-color="#78530D"/>
        </linearGradient>
        <linearGradient id="emblemCoreGlow4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="100%" stop-color="#C28A18"/>
        </linearGradient>
      </defs>
      <!-- Tournament Medallion Outer Rim (Octagonal Bevel) -->
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" 
               fill="#0E131E" stroke="url(#emblemGoldRim4)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="13.5,4 26.5,4 36,13.5 36,26.5 26.5,36 13.5,36 4,26.5 4,13.5" 
               fill="none" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Inner Dong Son Sunburst & Torch of Integrity Motif -->
      <circle cx="20" cy="20" r="5.5" fill="url(#emblemCoreGlow4)" stroke="#FFF0B5" stroke-width="1.2"/>
      <!-- 8-Directional Geometric Sunrays -->
      <line x1="20" y1="8" x2="20" y2="12" stroke="#FFF0B5" stroke-width="2" stroke-linecap="round"/>
      <line x1="20" y1="28" x2="20" y2="32" stroke="#FFF0B5" stroke-width="2" stroke-linecap="round"/>
      <line x1="8" y1="20" x2="12" y2="20" stroke="#FFF0B5" stroke-width="2" stroke-linecap="round"/>
      <line x1="28" y1="20" x2="32" y2="20" stroke="#FFF0B5" stroke-width="2" stroke-linecap="round"/>
      <line x1="11.5" y1="11.5" x2="14.5" y2="14.5" stroke="#E5B942" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="25.5" y1="25.5" x2="28.5" y2="28.5" stroke="#E5B942" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="11.5" y1="28.5" x2="14.5" y2="25.5" stroke="#E5B942" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="25.5" y1="14.5" x2="28.5" y2="11.5" stroke="#E5B942" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="20" cy="20" r="2.2" fill="#0E131E"/>
    </svg>
  `,teamChiCong:`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" class="team-emblem-svg" fill="none">
      <defs>
        <linearGradient id="emblemGoldRim5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFF0B5"/>
          <stop offset="35%" stop-color="#E5B942"/>
          <stop offset="70%" stop-color="#B8861B"/>
          <stop offset="100%" stop-color="#78530D"/>
        </linearGradient>
        <linearGradient id="emblemCoreGlow5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E9D5FF"/>
          <stop offset="50%" stop-color="#A855F7"/>
          <stop offset="100%" stop-color="#6B21A8"/>
        </linearGradient>
      </defs>
      <!-- Tournament Medallion Outer Rim (Octagonal Bevel) -->
      <polygon points="12,2 28,2 38,12 38,28 28,38 12,38 2,28 2,12" 
               fill="#0E131E" stroke="url(#emblemGoldRim5)" stroke-width="2" stroke-linejoin="round"/>
      <polygon points="13.5,4 26.5,4 36,13.5 36,26.5 26.5,36 13.5,36 4,26.5 4,13.5" 
               fill="none" stroke="rgba(212, 175, 55, 0.35)" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Inner Lotus Petals of Impartiality (Chí Công Vô Tư) -->
      <path d="M20 9 C22 14 26 19 26 25 C26 28.5 23.5 31 20 31 C16.5 31 14 28.5 14 25 C14 19 18 14 20 9 Z" 
            fill="url(#emblemCoreGlow5)" stroke="#FFF0B5" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="M20 22 C23 18 29 19 30 24 C30 27 27 29.5 23 29.5 C21 27 20 24 20 22 Z" 
            fill="url(#emblemGoldRim5)" opacity="0.8"/>
      <path d="M20 22 C17 18 11 19 10 24 C10 27 13 29.5 17 29.5 C19 27 20 24 20 22 Z" 
            fill="url(#emblemGoldRim5)" opacity="0.8"/>
      <!-- Central Star of Truth -->
      <polygon points="20,16 21.5,19.5 25,19.8 22.3,22.2 23.1,25.6 20,23.8 16.9,25.6 17.7,22.2 15,19.8 18.5,19.5" 
               fill="#FFF0B5"/>
    </svg>
  `,check:u(`<polyline points="20 6 9 17 4 12"/>`,`svg-icon-check`,`0 0 24 24`,20,20),x:u(`<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>`,`svg-icon-x`,`0 0 24 24`,20,20),clock:u(`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,`svg-icon-clock`,`0 0 24 24`,20,20),trophy:u(`<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,`svg-icon-trophy`,`0 0 24 24`,22,22),medal:u(`<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/>`,`svg-icon-medal`,`0 0 24 24`,20,20),zap:u(`<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,`svg-icon-zap`,`0 0 24 24`,20,20),target:u(`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,`svg-icon-target`,`0 0 24 24`,20,20),lock:u(`<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,`svg-icon-lock`,`0 0 24 24`,20,20),hourglass:u(`<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>`,`svg-icon-hourglass`,`0 0 24 24`,16,16),volume:u(`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,`svg-icon-volume`,`0 0 24 24`,20,20),volumeMute:u(`<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>`,`svg-icon-volume-mute`,`0 0 24 24`,20,20),maximize:u(`<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`,`svg-icon-maximize`,`0 0 24 24`,20,20),play:u(`<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>`,`svg-icon-play`,`0 0 24 24`,20,20),pause:u(`<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`,`svg-icon-pause`,`0 0 24 24`,20,20),refresh:u(`<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>`,`svg-icon-refresh`,`0 0 24 24`,18,18),book:u(`<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/>`,`svg-icon-book`,`0 0 24 24`,20,20),sparkles:u(`<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>`,`svg-icon-sparkles`,`0 0 24 24`,20,20),brain:u(`<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>`,`svg-icon-brain`,`0 0 24 24`,20,20),layers:u(`<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>`,`svg-icon-layers`,`0 0 24 24`,20,20),eye:u(`<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,`svg-icon-eye`,`0 0 24 24`,20,20),chevronRight:u(`<polyline points="9 18 15 12 9 6"/>`,`svg-icon-chevron`,`0 0 24 24`,20,20),home:u(`<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,`svg-icon-home`,`0 0 24 24`,20,20)};function f(e,t=0){if(!e)return d.teamNhanNghia;let n=[`teamNhanNghia`,`teamChinhTruc`,`teamTrachNhiem`,`teamLiemChinh`,`teamChiCong`];return d[e.emblemKey||n[t%n.length]]||d.teamNhanNghia}window.gameApp=new class{constructor(){this.particleEngine=null,this.confettiEngine=null,this.vietnamEngine=null,this.timerInterval=null,this.introShown=!1,this.init()}init(){this.particleEngine=new n(`particleCanvas`),this.confettiEngine=new i(`confettiCanvas`),this.vietnamEngine=new o,l.subscribe((e,t)=>{this.handleStateChange(e,t)}),this.initKeyboardShortcuts(),this.runCinematicIntro(),this.renderCurrentScreen(),this.renderTopHud()}runCinematicIntro(){let e=document.getElementById(`cinematicIntro`),n=document.getElementById(`introDrumMotif`),r=document.getElementById(`introTitleBox`),i=document.getElementById(`introLightBeam`),a=document.getElementById(`btnSkipIntro`);if(!e)return;let o=()=>{this.introShown||(this.introShown=!0,e.classList.add(`fade-out`),setTimeout(()=>{e.style.display=`none`},800))};a&&(a.onclick=o),setTimeout(()=>{this.introShown||t.playDongSonGong()},200),setTimeout(()=>{this.introShown||(n&&(n.style.transition=`all 1.6s cubic-bezier(0.16, 1, 0.3, 1)`,n.style.opacity=`1`,n.style.transform=`scale(1) rotate(0deg)`),i&&(i.style.transition=`left 1.4s ease-in-out`,i.style.left=`140%`))},1100),setTimeout(()=>{this.introShown||r&&(r.style.transition=`all 1.2s cubic-bezier(0.16, 1, 0.3, 1)`,r.style.opacity=`1`,r.style.transform=`translateY(0)`)},2100),setTimeout(()=>{o()},4500)}initKeyboardShortcuts(){window.addEventListener(`keydown`,e=>{e.target.tagName!==`INPUT`&&e.target.tagName!==`TEXTAREA`&&(e.code===`Space`?(e.preventDefault(),this.toggleTimer()):e.code===`KeyL`?(e.preventDefault(),this.openLeaderboard()):e.code===`KeyM`?(e.preventDefault(),this.toggleMute()):e.code===`KeyF`?(e.preventDefault(),this.toggleFullscreen()):e.code===`Escape`&&this.closeAllModals())})}handleStateChange(e,n){if(e===`SCREEN_CHANGE`)this.renderCurrentScreen(),this.renderTopHud();else if(e===`SCORE_CHANGED`)this.renderTopHud(),n&&n.delta&&this.showFloatingScore(n.delta,n.team?n.team.name:``),this.updateLiveTurnBoard();else if(e===`ANSWERS_LOCKED`)this.stopTimer(),this.triggerScreenShake(),t.playTimeout(),this.updateQuestionUIState();else if(e===`ANSWER_REVEALED`)this.updateQuestionUIState();else if(e===`ACTIVE_TEAM_CHANGED`)this.renderTopHud(),this.updateActiveTeamHeader(),this.updateLiveTurnBoard();else if(e===`TEAMS_UPDATED`||e===`MATCH_RESET`){if(this.renderTopHud(),l.currentScreen===`setup`){let e=document.getElementById(`screenContainer`);e&&this.renderSetupScreen(e)}else l.currentScreen===`question`&&this.updateLiveTurnBoard()}else if(e===`TIE_OPTION_SELECTED`||e===`TIE_ANSWER_REVEALED`||e===`TIE_QUESTION_CHANGED`||e===`TIE_AWARDED`){let e=document.getElementById(`screenContainer`);e&&l.currentScreen===`tie_breaker`&&this.renderTieBreakerScreen(e)}}startTimer(){this.stopTimer(),(!l.timerSeconds||l.timerSeconds<=0)&&(l.timerSeconds=l.timerMax||15),l.timerRunning=!0,this.updateTimerDisplay(),this.timerInterval=setInterval(()=>{l.timerSeconds>0&&(l.timerSeconds--,this.updateTimerDisplay(),l.timerSeconds<=5&&l.timerSeconds>0?t.playWarning():l.timerSeconds>5&&t.playTick(),l.timerSeconds===0&&(this.stopTimer(),this.triggerScreenShake(),t.playTimeout(),l.lockAnswers(),this.handleTurnTimeout()))},1e3)}stopTimer(){l.timerRunning=!1,this.timerInterval&&=(clearInterval(this.timerInterval),null),this.updateTimerDisplay()}toggleTimer(){t.playClick(),l.timerRunning?this.stopTimer():(l.timerSeconds===0&&(l.timerSeconds=l.timerMax),this.startTimer())}resetTimer(){t.playClick(),this.stopTimer(),l.timerSeconds=l.timerMax,this.updateTimerDisplay()}updateTimerDisplay(){let e=document.getElementById(`timerBox`),t=document.getElementById(`timerDigits`),n=document.getElementById(`timeoutBanner`),r=document.getElementById(`btnTimerToggle`),i=document.getElementById(`timerProgressCircle`);if(t&&(t.textContent=l.timerSeconds),i){let e=283*(1-Math.max(0,l.timerSeconds/(l.timerMax||15)));i.style.strokeDashoffset=e}e&&(l.timerSeconds<=3&&l.timerSeconds>0?e.classList.add(`warning`,`urgent`):l.timerSeconds<=5&&l.timerSeconds>0?(e.classList.add(`warning`),e.classList.remove(`urgent`)):e.classList.remove(`warning`,`urgent`)),n&&(n.style.display=l.timerSeconds===0?`inline-block`:`none`),r&&(r.innerHTML=l.timerRunning?`${d.pause} <span>Tạm Dừng</span>`:`${d.play} <span>Bắt Đầu Đếm</span>`);let a=document.getElementById(`tieTimerDisplay`),o=document.getElementById(`btnTieTimerToggle`);a&&(a.textContent=`${l.timerSeconds}s`),o&&(o.innerHTML=l.timerRunning?d.pause:d.play)}triggerScreenShake(){document.body.classList.add(`screen-shake`),setTimeout(()=>{document.body.classList.remove(`screen-shake`)},450)}triggerTurnSwitch(e,n){t.playWhoosh(),t.playDongSonGong(),this.vietnamEngine&&this.vietnamEngine.triggerCloudPart();let r=document.getElementById(`turnSwitchOverlay`),i=document.getElementById(`turnSwitchTeamName`),a=document.getElementById(`turnSwitchEmblem`);r&&i?(i.textContent=e.name,a&&(a.innerHTML=f(e,l.currentTeamIndex)),r.classList.add(`active`),setTimeout(()=>{r.classList.remove(`active`),n&&n()},1300)):n&&n()}triggerRoundTransition(e,n){t.playWhoosh(),this.vietnamEngine&&this.vietnamEngine.triggerCloudPart();let r=document.getElementById(`roundSweepBanner`),i=document.getElementById(`sweepTitleText`);r&&i?(i.textContent=e,r.classList.add(`active`),setTimeout(()=>{r.classList.remove(`active`),n&&n()},1600)):n&&n()}showFloatingScore(e,n){t.playScoreUp();let r=document.createElement(`div`);r.className=`floating-score-burst ${e>0?`plus`:`minus`}`,r.textContent=`${e>0?`+`:``}${e} ${n?`(${n})`:``}`,r.style.left=`${Math.max(10,Math.random()*60+20)}%`,r.style.top=`40%`,document.body.appendChild(r),setTimeout(()=>r.remove(),1200)}renderTopHud(){let e=document.getElementById(`topHud`);if(!e)return;if(l.currentScreen===`home`){e.style.display=`none`;return}e.style.display=`flex`;let n=l.getCurrentRound(),r=l.getCurrentQuestionList(),i=document.getElementById(`hudRoundNum`),a=document.getElementById(`hudRoundTitle`),o=document.getElementById(`hudQuestionPill`);i&&(i.textContent=`VÒNG ${l.currentRoundId}`),a&&(a.textContent=n.title.includes(`:`)?n.title.split(`:`)[1].trim():n.title),o&&(l.currentScreen===`question`?(o.textContent=`CÂU ${String(l.currentQuestionIdx+1).padStart(2,`0`)}/${String(r.length).padStart(2,`0`)}`,o.style.display=`inline-block`):l.currentScreen===`tie_breaker`?(o.textContent=`CÂU ${String(l.currentTieQuestionIdx+1).padStart(2,`0`)}/${String(l.getTieBreakerQuestions().length).padStart(2,`0`)}`,o.style.display=`inline-block`):o.style.display=`none`),l.currentScreen===`tie_breaker`&&(i&&(i.textContent=`VÒNG PHỤ`),a&&(a.textContent=`CÂU HỎI PHÂN ĐỊNH (TIE-BREAKER)`));let s=l.getActiveTeam(),c=document.getElementById(`hudActiveTeamName`),u=document.getElementById(`hudActiveEmblem`);c&&(c.textContent=s.name),u&&(u.innerHTML=f(s,l.currentTeamIndex));let p=document.getElementById(`btnToggleMute`);p&&(p.innerHTML=t.isMuted?d.volumeMute:d.volume);let m=document.getElementById(`btnToggleFullscreen`);m&&(m.innerHTML=d.maximize);let h=document.getElementById(`btnHudLeaderboard`);h&&!h.querySelector(`.svg-icon`)&&(h.innerHTML=`${d.medal} <span>BẢNG XẾP HẠNG</span>`);let g=document.getElementById(`btnHudResetGame`);g&&!g.querySelector(`.svg-icon`)&&(g.innerHTML=`${d.refresh} <span>MÀN MỚI</span>`)}renderCurrentScreen(){let e=document.getElementById(`screenContainer`);if(e)switch(this.stopTimer(),l.currentScreen){case`home`:this.renderHomeScreen(e);break;case`setup`:this.renderSetupScreen(e);break;case`round_intro`:this.renderRoundIntroScreen(e);break;case`question`:this.renderQuestionScreen(e);break;case`victory`:this.renderVictoryScreen(e);break;case`tie_breaker`:this.renderTieBreakerScreen(e);break;default:this.renderHomeScreen(e)}}renderHomeScreen(e){e.innerHTML=`
      <div class="screen-home">
        <div class="home-emblem">
          <div style="width: 70px; height: 70px;">
            ${d.trophy}
          </div>
        </div>

        <h1 class="home-title">ĐẤU TRƯỜNG LỊCH SỬ</h1>
        <h2 class="home-sub">Đảng ra đời: Từ khủng hoảng đường lối đến tổ chức tiên phong (1930 – 1945)</h2>
        <p class="home-tagline">
          VNR202 • Nhóm 4 • Gameshow tương tác luân phiên 2 – 5 đội
        </p>

        <div class="home-actions-row">
          <button id="btnStartGame" class="btn btn-gold btn-hero">
            ${d.play} <span>BẮT ĐẦU TRÒ CHƠI</span>
          </button>
          <button id="btnOpenRules" class="btn btn-glass btn-hero">
            ${d.book} <span>LUẬT CHƠI</span>
          </button>
          <button id="btnOpenLeaderboardHero" class="btn btn-glass btn-hero">
            ${d.medal} <span>BẢNG ĐIỂM</span>
          </button>
        </div>

        <div class="home-features-bar">
          <div class="feature-pill">
            ${d.zap} <span>Thi Đấu Trực Tiếp Luân Phiên</span>
          </div>
          <div class="feature-pill">
            ${d.medal} <span>2 – 5 Đội • Mỗi Đội 1 Lượt Mỗi Vòng</span>
          </div>
          <div class="feature-pill">
            ${d.brain} <span>Tình Huống Thực Tiễn</span>
          </div>
          <div class="feature-pill">
            ${d.target} <span>Cơ Chế Cướp Điểm Ở Các Vòng Tình Huống</span>
          </div>
        </div>
      </div>
    `,document.getElementById(`btnStartGame`).onclick=()=>{t.playClick(),l.setScreen(`setup`)},document.getElementById(`btnOpenRules`).onclick=()=>{t.playClick(),this.openRulesModal()},document.getElementById(`btnOpenLeaderboardHero`).onclick=()=>{t.playClick(),this.openLeaderboard()}}renderSetupScreen(e){e.innerHTML=`
      <div class="screen-setup">
        <div class="setup-header-card">
          <div class="setup-supertitle">CHƯƠNG TRÌNH THI ĐẤU LỚP HỌC</div>
          <h2 class="modal-title">${l.teams.length} ĐỘI TRANH TÀI TRỰC TIẾP</h2>
          <p class="modal-subtitle">Chọn số đội tham gia — mỗi vòng sẽ bốc ngẫu nhiên số câu hỏi bằng số đội.</p>
          <div style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 14px;">
            <span style="color: var(--gold-300); font-weight: 700;">SỐ ĐỘI:</span>
            ${[2,3,4,5].map(e=>`<button class="btn ${l.teams.length===e?`btn-gold`:`btn-glass`} btn-team-count" data-count="${e}" style="min-width: 52px;">${e}</button>`).join(``)}
          </div>
        </div>

        <div class="teams-config-grid" id="teamsConfigGrid">
          ${l.teams.map((e,t)=>`
            <div class="team-config-badge-card">
              <div class="setup-card-top">
                <div class="setup-emblem-wrap">
                  ${f(e,t)}
                </div>
                <div class="setup-tag-group">
                  <div class="setup-program-tag">ĐỘI 0${t+1}</div>
                  <div class="setup-turn-subtag">${t===0?`LƯỢT MỞ MÀN`:`LƯỢT 0${t+1}`}</div>
                  <div class="setup-gold-hairline"></div>
                </div>
              </div>

              <div class="setup-input-block">
                <label class="setup-input-label">TÊN ĐỘI THI ĐẤU</label>
                <input type="text" class="team-name-input" data-id="${e.id}" value="${e.name}" placeholder="Nhập tên đội..." />
              </div>

              <div class="setup-score-row">
                <span class="setup-score-lbl">ĐIỂM KHỞI ĐIỂM:</span>
                <span class="setup-score-val">${e.score} ĐIỂM</span>
              </div>
            </div>
          `).join(``)}
        </div>

        <div class="setup-actions-row">
          <button id="btnBackHome" class="btn btn-glass">
            ${d.home} <span>Về Trang Chủ</span>
          </button>
          <button id="btnResetScoresSetup" class="btn btn-crimson" title="Reset toàn bộ điểm khởi điểm về 0">
            ${d.refresh} <span>Reset Điểm Về 0</span>
          </button>
          <button id="btnConfirmTeams" class="btn btn-gold btn-hero">
            ${d.play} <span>XÁC NHẬN & VÀO ĐẤU TRƯỜNG</span>
          </button>
        </div>
      </div>
    `,e.querySelectorAll(`.btn-team-count`).forEach(n=>{n.onclick=()=>{t.playClick(),l.setTeamCount(parseInt(n.dataset.count,10)),this.renderSetupScreen(e)}}),e.querySelectorAll(`.team-name-input`).forEach(e=>{e.onchange=()=>{let t=parseInt(e.dataset.id,10);l.updateTeam(t,{name:e.value.trim()||`Đội ${t}`})}}),document.getElementById(`btnBackHome`).onclick=()=>{t.playClick(),l.setScreen(`home`)},document.getElementById(`btnResetScoresSetup`).onclick=()=>{t.playClick(),l.resetScoresOnly(),this.showCelebrationToast(`ĐÃ RESET ĐIỂM!`,`Điểm số của các đội đã về 0 đ`),this.renderSetupScreen(e)},document.getElementById(`btnConfirmTeams`).onclick=()=>{t.playCorrect(),l.currentTeamIndex=0,l.questionPicks={},l.startQuestion(1,0,0),this.triggerRoundTransition(`VÒNG 1: ĐÚNG HAY SAI?`,()=>{l.setScreen(`round_intro`)})}}renderRoundIntroScreen(e){let n=l.getCurrentRound(),r=l.getCurrentQuestionList(),i=l.getActiveTeam();e.innerHTML=`
      <div class="screen-round-intro">
        <div class="round-intro-box">
          <div class="round-intro-badge">${n.badge}</div>
          <h2 class="round-intro-title">${n.title}</h2>
          <p class="round-intro-sub">${n.subtitle}</p>
          <p style="font-size: 1.15rem; color: var(--text-secondary); max-width: 680px; line-height: 1.6;">
            ${n.description}
          </p>

          <div class="round-rules-grid">
            <div class="round-rule-chip">
              <span class="rule-chip-val">${r.length}</span>
              <span class="rule-chip-lbl">Số câu hỏi</span>
            </div>
            <div class="round-rule-chip">
              <span class="rule-chip-val">+${n.pointsPerQuestion} đ</span>
              <span class="rule-chip-lbl">Điểm mỗi câu</span>
            </div>
            <div class="round-rule-chip">
              <span class="rule-chip-val">${n.timeLimit}s</span>
              <span class="rule-chip-lbl">Thời gian suy nghĩ</span>
            </div>
          </div>

          <!-- Team starting the round -->
          <div style="background: rgba(245, 158, 11, 0.15); border: 2px solid var(--gold-400); border-radius: var(--radius-lg); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                ${f(i,l.currentTeamIndex)}
              </div>
              <div>
                <span style="font-size: 0.78rem; font-weight: 800; color: var(--gold-400); text-transform: uppercase;">ĐỘI BẮT ĐẦU CÂU 01:</span>
                <div style="font-size: 1.4rem; font-weight: 900; color: #fff;">${i.name}</div>
              </div>
            </div>

            <button id="btnSwitchStartTeam" class="btn btn-glass" style="font-size: 0.85rem; padding: 8px 16px;">
              ${d.refresh} <span>ĐỔI ĐỘI BẮT ĐẦU VÒNG</span>
            </button>
          </div>

          <div style="display: flex; gap: 16px; margin-top: 20px;">
            <button id="btnStartRoundQuestions" class="btn btn-gold btn-hero">
              ${d.play} <span>BẮT ĐẦU VÒNG ĐẤU</span>
            </button>
          </div>
        </div>
      </div>
    `,document.getElementById(`btnSwitchStartTeam`).onclick=()=>{t.playClick(),l.advanceTurn(),l.startQuestion(l.currentRoundId,0,l.currentTeamIndex),this.renderRoundIntroScreen(e)},document.getElementById(`btnStartRoundQuestions`).onclick=()=>{t.playClick(),l.startQuestion(l.currentRoundId,0);let e=l.getActiveTeam();this.triggerTurnSwitch(e,()=>{l.setScreen(`question`),this.startTimer()})}}renderQuestionScreen(e){let t=l.getCurrentRound();l.getCurrentQuestionList();let n=l.getCurrentQuestion(),r=l.getActiveTeam();if(!n){l.currentRoundId<4?(l.currentRoundId++,l.currentQuestionIdx=0,l.startQuestion(l.currentRoundId,0),this.triggerRoundTransition(l.getCurrentRound().title,()=>{l.setScreen(`round_intro`)})):l.setScreen(`victory`);return}e.innerHTML=`
      <div class="screen-question">
        <!-- 1. BROADCAST ACTIVE TEAM SPOTLIGHT BANNER -->
        <div class="active-team-spotlight-bar" id="activeTeamHeader">
          <div class="active-team-indicator">
            <div class="team-program-label">
              <span class="team-program-line1">ĐỘI 0${r.id}</span>
              <span class="team-program-line2">LƯỢT 0${l.currentTeamIndex+1}</span>
              <div class="team-program-underline"></div>
            </div>
            <div class="active-team-emblem-box">
              ${f(r,l.currentTeamIndex)}
            </div>
            <div class="active-team-text-group">
              <span class="active-team-badge-tag">LƯỢT THI ĐẤU CHÍNH THỨC</span>
              <h2 class="active-team-name-title">${r.name}</h2>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 16px;">
            <div class="active-team-score-pod">
              <div class="active-team-score-label">ĐIỂM HIỆN TẠI</div>
              <div class="active-team-score-num">${r.score} Đ</div>
            </div>
            <button id="btnSwitchTurnManual" class="btn btn-glass" style="font-size: 0.8rem; padding: 8px 12px;" title="Chuyển lượt sang đội kế tiếp nếu cần">
              ${d.refresh} <span>Đổi Đội</span>
            </button>
          </div>
        </div>

        <!-- 2. QUESTION MAIN CARD -->
        <div class="question-card-wrapper ${t.id===4?`ai-round-card`:``}">
          <div class="question-header-row">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div class="question-meta-badge">
                <span>VÒNG ${t.id}</span> • <span>CÂU ${String(l.currentQuestionIdx+1).padStart(2,`0`)}</span>
              </div>
              <div class="question-points-pill">+${t.pointsPerQuestion} ĐIỂM</div>
              ${t.id===4?`<div class="ai-special-badge">${d.sparkles} CASE THỰC TIỄN</div>`:``}
            </div>

            <!-- Pro Dong Son Drum Timer Widget -->
            <div class="timer-container">
              <div class="dong-son-timer-wrapper" id="timerBox">
                <div class="timer-drum-bg"></div>
                <svg class="timer-progress-svg" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" stroke-width="4" fill="none"/>
                  <circle class="timer-progress-circle" id="timerProgressCircle" cx="50" cy="50" r="45"/>
                </svg>
                <span class="dong-son-timer-digits" id="timerDigits">${l.timerSeconds}</span>
              </div>
              <span class="timeout-banner" id="timeoutBanner" style="display: none;">HẾT GIỜ!</span>
            </div>
          </div>

          <!-- Scenario (if exists) -->
          ${n.scenario?`
            <div class="scenario-callout">
              <strong>${n.caseNum?`${n.caseNum}: `:``}${n.title?`"${n.title}" — `:``}</strong>${n.scenario}
            </div>
          `:``}

          <!-- Question Prompt -->
          <div class="question-title-text">
            ${n.question||n.situation||``}
          </div>
          ${n.subtitle?`<div style="font-size: 1.15rem; color: var(--gold-300); font-weight: 600; margin-top: -12px;">${n.subtitle}</div>`:``}

          <!-- Options Container -->
          <div id="optionsRenderArea">
            ${this.getOptionsHtml(t,n)}
          </div>

          <!-- Universal Steal Area -->
          ${l.stealAvailable?`
            <div class="steal-opportunity-card">
              <div class="steal-title-headline">
                ${d.zap} <span>CƠ HỘI CƯỚP ĐIỂM!</span> ${d.zap}
              </div>
              <p style="color: #fca5a5; font-size: 1.05rem; margin-top: 4px;">
                Đội trong lượt trả lời chưa chính xác. Các đội còn lại bấm chuông / giơ tay nhanh nhất để giành quyền (+10đ nếu đúng, 0đ nếu sai)!
              </p>

              <div class="steal-grid-buzzers">
                ${l.teams.filter(e=>e.id!==r.id).map(e=>{let t=l.disqualifiedStealTeams.includes(e.id),n=l.stealingTeamId===e.id;return`
                      <button class="btn-steal-buzzer ${n?`selected`:``}" 
                              data-team="${e.id}" 
                              ${t?`disabled`:``}>
                        <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                          ${f(e,e.id-1)}
                        </div>
                        <strong style="font-size: 1.05rem;">${e.name}</strong>
                        <span style="font-size: 0.8rem; color: var(--gold-300);">
                          ${t?`ĐÃ HẾT LƯỢT`:n?`ĐANG TRẢ LỜI`:`BẤM CƯỚP ĐIỂM`}
                        </span>
                      </button>
                    `}).join(``)}
              </div>

              ${l.stealingTeamId?`
                <div class="stealing-active-box">
                  <div class="stealing-active-headline">
                    ${d.zap}
                    <span>${l.teams.find(e=>e.id===l.stealingTeamId)?.name||`ĐỘI CƯỚP ĐIỂM`} ĐÃ GIÀNH QUYỀN!</span>
                  </div>
                  <div class="stealing-active-guide">
                    👉 HÃY BẤM TRỰC TIẾP VÀO 1 ĐÁP ÁN TRÊN MÀN HÌNH ĐỂ TRẢ LỜI
                  </div>
                  <div class="stealing-subnote">
                    (Kết quả Đúng / Sai sẽ hiển thị ngay lập tức: Đúng +10 điểm • Sai 0 điểm)
                  </div>

                  <div style="margin-top: 14px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                    <button id="btnStealVerdictCorrect" class="btn btn-gold" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; font-size: 0.85rem; padding: 7px 14px;">
                      ${d.check} <span>Đánh Dấu Đúng (+10đ)</span>
                    </button>
                    <button id="btnStealVerdictWrong" class="btn btn-crimson" style="font-size: 0.85rem; padding: 7px 14px;">
                      ${d.x} <span>Đánh Dấu Sai (0đ)</span>
                    </button>
                    <button id="btnCancelStealSelect" class="btn btn-glass" style="font-size: 0.85rem; padding: 7px 14px;">
                      ${d.refresh} <span>Đổi Đội Bấm Chuông</span>
                    </button>
                  </div>
                </div>
              `:`
                <div style="margin-top: 12px;">
                  <button id="btnSkipSteal" class="btn btn-glass" style="font-size: 0.88rem;">
                    <span>Bỏ qua cướp điểm • Xem giải thích ➔</span>
                  </button>
                </div>
              `}
            </div>
          `:``}
        </div>

        <!-- 3. PRO BROADCAST "TEAM BADGE CARDS" -->
        <div class="live-teams-turn-grid" id="liveTurnBoard" style="--team-count: ${l.teams.length};">
          ${l.teams.map((e,t)=>{let n=e.id===r.id;return`
              <div class="team-badge-card ${n?`active`:``}">
                <div class="team-badge-emblem-wrap">
                  ${f(e,t)}
                </div>
                <div class="team-badge-name">${e.name}</div>
                <div class="team-badge-turn-tag">
                  ${n?`ĐANG THI ĐẤU`:`LƯỢT ${t+1}`}
                </div>
                <div class="team-badge-divider"></div>
                <div class="team-badge-score">${e.score} ĐIỂM</div>
              </div>
            `}).join(``)}
        </div>

        <!-- 4. MC FLOATING CONTROLS BAR -->
        <div class="mc-controls-bar">
          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnTimerToggle" class="btn btn-glass">
              <span>${l.timerRunning?`Tạm Dừng`:`Bắt Đầu Đếm`}</span>
            </button>
            <button id="btnTimerReset" class="btn btn-glass">
              ${d.refresh} <span>Reset Giờ</span>
            </button>
          </div>

          <div class="mc-shortcuts-hint">
            Phím tắt: <kbd>Space</kbd> Timer • <kbd>L</kbd> Bảng Điểm
          </div>

          <div style="display: flex; align-items: center; gap: 12px;">
            <button id="btnLockAnswers" class="btn btn-crimson" ${l.isAnswersLocked?`disabled`:``}>
              ${d.lock} <span>Khóa Đáp Án</span>
            </button>
            <button id="btnRevealAnswer" class="btn btn-gold">
              ${d.eye} <span>Xem Giải Thích</span>
            </button>
            <button id="btnNextQuestion" class="btn btn-glass">
              ${d.chevronRight} <span>Câu Tiếp Theo (Đổi Đội)</span>
            </button>
          </div>
        </div>
      </div>
    `,this.attachQuestionEventListeners(t,n,r),this.updateTimerDisplay(),this.updateQuestionUIState()}getOptionsHtml(e,t){let n=l.activeTeamAnswer;return e.id===1?`
        <div class="duel-tf-container">
          <div class="tf-card true-card ${n===`A`?`active-selection`:``}" data-key="A" style="${n===`A`?`border-color: #10b981; box-shadow: 0 0 35px rgba(16, 185, 129, 0.6);`:``}">
            <div style="width: 52px; height: 52px; margin-bottom: 10px; color: #34d399;">
              ${d.check}
            </div>
            <div class="tf-label">ĐÚNG</div>
            <div class="tf-sub">Nhận định chính xác</div>
          </div>
          <div class="tf-card false-card ${n===`B`?`active-selection`:``}" data-key="B" style="${n===`B`?`border-color: #ef4444; box-shadow: 0 0 35px rgba(239, 68, 68, 0.6);`:``}">
            <div style="width: 52px; height: 52px; margin-bottom: 10px; color: #f87171;">
              ${d.x}
            </div>
            <div class="tf-label">SAI</div>
            <div class="tf-sub">Nhận định chưa chính xác</div>
          </div>
        </div>
      `:e.id===3?`
        <div class="duel-xay-chong">
          <div class="xay-card ${n===`XAY`?`active-selection`:``}" data-key="XAY" style="${n===`XAY`?`border-color: #10b981; box-shadow: 0 0 45px rgba(16, 185, 129, 0.8);`:``}">
            <div style="width: 54px; height: 54px; margin-bottom: 8px; color: #34d399;">
              ${d.check}
            </div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #34d399; letter-spacing: 2px;">${t.options[0].text}</div>
            <div style="font-size: 0.95rem; color: #a7f3d0; margin-top: 4px;">${t.options[0].desc}</div>
          </div>
          <div class="chong-card ${n===`CHONG`?`active-selection`:``}" data-key="CHONG" style="${n===`CHONG`?`border-color: #ef4444; box-shadow: 0 0 45px rgba(239, 68, 68, 0.8);`:``}">
            <div style="width: 54px; height: 54px; margin-bottom: 8px; color: #f87171;">
              ${d.x}
            </div>
            <div style="font-size: 2.2rem; font-weight: 900; color: #f87171; letter-spacing: 2px;">${t.options[1].text}</div>
            <div style="font-size: 0.95rem; color: #fecaca; margin-top: 4px;">${t.options[1].desc}</div>
          </div>
        </div>
      `:`
      <div class="options-grid ${t.options&&t.options.length<=2?`cols-2`:t.options.length<=4?`cols-4`:`cols-2`}">
        ${(t.options||[]).map(e=>`
            <div class="option-btn ${n===e.key?`active-selection`:``}" data-key="${e.key}">
              <div class="option-key-badge">${e.key}</div>
              <div class="option-text">${e.text}</div>
            </div>
          `).join(``)}
      </div>
    `}attachQuestionEventListeners(e,n,r){let i=document.getElementById(`btnTimerToggle`),a=document.getElementById(`btnTimerReset`);i&&(i.onclick=()=>this.toggleTimer()),a&&(a.onclick=()=>this.resetTimer());let o=document.getElementById(`btnSwitchTurnManual`);o&&(o.onclick=()=>{t.playClick(),l.advanceTurn()}),document.querySelectorAll(`.option-btn, .tf-card, .xay-card, .chong-card`).forEach(i=>{i.onclick=()=>{if(l.stealAvailable&&l.stealingTeamId){let e=i.dataset.key;this.handleStealOptionClick(e,n);return}if(l.isAnswersLocked)return;t.playClick();let a=i.dataset.key;l.setActiveTeamAnswer(a),this.stopTimer(),this.handleLockAnswer(e,n,r)}});let s=document.getElementById(`btnLockAnswers`);s&&(s.onclick=()=>{t.playClick(),this.handleLockAnswer(e,n,r)});let c=document.getElementById(`btnRevealAnswer`);c&&(c.onclick=()=>{t.playClick(),l.revealAnswer(),this.openExplanationModal(e,n)});let u=document.getElementById(`btnNextQuestion`);u&&(u.onclick=()=>{t.playClick(),this.advanceToNextQuestion()}),document.querySelectorAll(`.btn-steal-buzzer`).forEach(e=>{e.onclick=()=>{t.playSteal();let n=parseInt(e.dataset.team,10);l.setStealingTeam(n);let r=document.getElementById(`screenContainer`);r&&this.renderQuestionScreen(r)}});let d=document.getElementById(`btnCancelStealSelect`);d&&(d.onclick=()=>{t.playClick(),l.stealingTeamId=null;let e=document.getElementById(`screenContainer`);e&&this.renderQuestionScreen(e)});let f=document.getElementById(`btnStealVerdictCorrect`);f&&(f.onclick=()=>{this.handleStealOptionClick(n.correct,n)});let p=document.getElementById(`btnStealVerdictWrong`);p&&(p.onclick=()=>{let e=n.options&&n.options.find(e=>e.key!==n.correct)?.key||`WRONG`;this.handleStealOptionClick(e,n)});let m=document.getElementById(`btnSkipSteal`);m&&(m.onclick=()=>{t.playClick(),l.closeStealMode(),this.openExplanationModal(e,n)})}handleLockAnswer(e,n,r){l.lockAnswers(),this.stopTimer();let i=l.activeTeamAnswer===n.correct,a=e.id===1||e.id===3||e.mode===`true_false`||e.mode===`build_fight`?2:n.options&&n.options.length||2,o=!!(e.hasSteal&&a>2);if(i){t.playCorrect();let n=e.pointsPerQuestion;l.addScore(r.id,n,`Đúng câu ${l.currentQuestionIdx+1} (${e.title})`),this.confettiEngine.burst(75),this.showCelebrationToast(`CHÍNH XÁC!`,`+${n} ĐIỂM (${r.name})`),l.revealAnswer();let i=document.getElementById(`screenContainer`);i&&this.renderQuestionScreen(i)}else{t.playWrong(),this.showIncorrectToast(`CHƯA CHÍNH XÁC! (0 ĐIỂM)`),o?l.activateStealMode():l.revealAnswer();let e=document.getElementById(`screenContainer`);e&&this.renderQuestionScreen(e)}}handleTurnTimeout(){let e=l.getCurrentRound(),n=l.getCurrentQuestion(),r=l.getActiveTeam();if(n&&l.activeTeamAnswer&&(n.options&&n.options.some(e=>e.key===l.activeTeamAnswer)||e.id===1&&(l.activeTeamAnswer===`A`||l.activeTeamAnswer===`B`)||e.id===3&&(l.activeTeamAnswer===`XAY`||l.activeTeamAnswer===`CHONG`))){this.handleLockAnswer(e,n,r);return}t.playWrong(),this.showIncorrectToast(`HẾT GIỜ! (0 ĐIỂM)`);let i=e.id===1||e.id===3||e.mode===`true_false`||e.mode===`build_fight`?2:n.options&&n.options.length||2;e.hasSteal&&i>2?l.activateStealMode():l.revealAnswer();let a=document.getElementById(`screenContainer`);a&&this.renderQuestionScreen(a)}showCelebrationToast(e,t){let n=document.createElement(`div`);n.className=`correct-celebration-toast`,n.innerHTML=`<h3>${d.check} ${e}</h3><div class="pts-tag">${t}</div>`,document.body.appendChild(n),setTimeout(()=>n.remove(),1600)}showIncorrectToast(e){let t=document.createElement(`div`);t.className=`incorrect-gentle-toast`,t.innerHTML=`<h3>${d.x} ${e}</h3>`,document.body.appendChild(t),setTimeout(()=>t.remove(),1400)}updateActiveTeamHeader(){let e=document.getElementById(`activeTeamHeader`);if(!e)return;let t=l.getActiveTeam(),n=e.querySelector(`.active-team-name-title`),r=e.querySelector(`.active-team-emblem-box`),i=e.querySelector(`.active-team-score-num`),a=e.querySelector(`.team-program-line1`),o=e.querySelector(`.team-program-line2`);n&&(n.textContent=t.name),r&&(r.innerHTML=f(t,l.currentTeamIndex)),i&&(i.textContent=`${t.score} Đ`),a&&(a.textContent=`ĐỘI 0${t.id}`),o&&(o.textContent=`LƯỢT 0${l.currentTeamIndex+1}`)}updateLiveTurnBoard(){let e=document.getElementById(`liveTurnBoard`);if(!e)return;let t=l.getActiveTeam();e.innerHTML=l.teams.map((e,n)=>{let r=e.id===t.id;return`
        <div class="team-badge-card ${r?`active`:``}">
          <div class="team-badge-emblem-wrap">
            ${f(e,n)}
          </div>
          <div class="team-badge-name">${e.name}</div>
          <div class="team-badge-turn-tag">
            ${r?`ĐANG THI ĐẤU`:`LƯỢT ${n+1}`}
          </div>
          <div class="team-badge-divider"></div>
          <div class="team-badge-score">${e.score} ĐIỂM</div>
        </div>
      `}).join(``)}updateQuestionUIState(){let e=l.getCurrentQuestion();if(e){if(l.isAnswerRevealed){document.querySelectorAll(`.option-btn, .tf-card, .xay-card, .chong-card`).forEach(t=>{t.dataset.key===e.correct?(t.classList.add(`correct`),t.classList.remove(`incorrect`,`steal-ready`,`already-failed`)):(t.classList.add(`incorrect`),t.classList.remove(`correct`,`steal-ready`))});return}l.stealAvailable&&l.stealingTeamId?document.querySelectorAll(`.option-btn, .tf-card, .xay-card, .chong-card`).forEach(e=>{let t=e.dataset.key;l.stealedOptionKeys&&l.stealedOptionKeys.includes(t)?(e.classList.add(`already-failed`),e.classList.remove(`steal-ready`)):(e.classList.add(`steal-ready`),e.classList.remove(`already-failed`))}):l.stealAvailable&&document.querySelectorAll(`.option-btn, .tf-card, .xay-card, .chong-card`).forEach(e=>{let t=e.dataset.key;l.stealedOptionKeys&&l.stealedOptionKeys.includes(t)&&e.classList.add(`already-failed`),e.classList.remove(`steal-ready`)})}}handleStealOptionClick(e,n){if(!l.stealingTeamId)return;let r=l.teams.find(e=>e.id===l.stealingTeamId);if(!r)return;e===n.correct?(t.playCorrect(),this.confettiEngine.burst(85),this.showCelebrationToast(`CHÍNH XÁC! CƯỚP ĐIỂM THÀNH CÔNG`,`+10 ĐIỂM (${r.name})`),l.resolveSteal(!0,e)):(t.playWrong(),this.triggerScreenShake(),this.showIncorrectToast(`CHƯA CHÍNH XÁC! (0 ĐIỂM - ${r.name})`),l.resolveSteal(!1,e));let i=document.getElementById(`screenContainer`);i&&this.renderQuestionScreen(i)}advanceToNextQuestion(){let e=l.getCurrentQuestionList();if(l.currentQuestionIdx<e.length-1){l.advanceTurn();let e=l.getActiveTeam();this.triggerTurnSwitch(e,()=>{l.startQuestion(l.currentRoundId,l.currentQuestionIdx+1);let e=document.getElementById(`screenContainer`);e&&this.renderQuestionScreen(e),this.startTimer()})}else l.currentRoundId<4?(l.currentRoundId++,l.currentQuestionIdx=0,l.advanceTurn(),l.startQuestion(l.currentRoundId,0),this.triggerRoundTransition(l.getCurrentRound().title,()=>{l.setScreen(`round_intro`)})):l.setScreen(`victory`)}openExplanationModal(e,t){let n=t.explanation||(t.analysis?{answerText:t.analysis.recommended,why:t.analysis.why,lesson:t.analysis.lesson}:null),r=document.getElementById(`explanationModal`),i=document.getElementById(`explanationContent`);r&&i&&n&&(i.innerHTML=`
      <div class="explanation-modal-content">
        <div class="debrief-card ans-card">
          <div class="debrief-header">
            <span class="debrief-badge">${d.check} ĐÁP ÁN CHÍNH XÁC</span>
          </div>
          <div class="debrief-body-text debrief-highlight">
            ${n.answerText||``}
          </div>
        </div>

        <div class="debrief-card why-card">
          <div class="debrief-header">
            <span class="debrief-badge">${d.brain} VÌ SAO? (CƠ SỞ LÝ LUẬN & THỰC TIỄN)</span>
          </div>
          <div class="debrief-body-text">
            ${n.why||``}
          </div>
        </div>

        <div class="debrief-card lesson-card">
          <div class="debrief-header">
            <span class="debrief-badge">${d.book} BÀI HỌC RÚT RA</span>
          </div>
          <div class="debrief-body-text">
            ${n.lesson||``}
          </div>
        </div>
      </div>
    `,r.classList.add(`active`))}openLeaderboard(){t.playClick();let e=document.getElementById(`leaderboardModal`),n=document.getElementById(`leaderboardContent`);if(!e||!n)return;let r=l.getSortedTeams();n.innerHTML=`
      <!-- Podium Top 3 -->
      <div class="podium-container">
        ${r[1]?`
          <div class="podium-slot rank-2">
            <div style="width: 50px; height: 50px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(r[1],1)}</div>
            <div class="podium-team-name">${r[1].name}</div>
            <div class="podium-score">${r[1].score} đ</div>
            <div class="podium-bar">2</div>
          </div>
        `:``}

        ${r[0]?`
          <div class="podium-slot rank-1">
            <div style="width: 65px; height: 65px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(r[0],0)}</div>
            <div class="podium-team-name">${r[0].name}</div>
            <div class="podium-score">${r[0].score} đ</div>
            <div class="podium-bar">1</div>
          </div>
        `:``}

        ${r[2]?`
          <div class="podium-slot rank-3">
            <div style="width: 46px; height: 46px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(r[2],2)}</div>
            <div class="podium-team-name">${r[2].name}</div>
            <div class="podium-score">${r[2].score} đ</div>
            <div class="podium-bar">3</div>
          </div>
        `:``}
      </div>

      <!-- Full Standings Table -->
      <div class="leaderboard-table">
        ${r.map((e,t)=>`
          <div class="lb-row">
            <div class="lb-left">
              <span class="lb-rank-badge">#${t+1}</span>
              <div style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">${f(e,t)}</div>
              <span class="lb-team-name">${e.name}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="display: flex; gap: 4px;">
                <button class="choice-mini-btn" data-team="${e.id}" data-delta="-5" title="Trừ 5 điểm">-5</button>
                <button class="choice-mini-btn" data-team="${e.id}" data-delta="+5" title="Cộng 5 điểm">+5</button>
                <button class="choice-mini-btn" data-team="${e.id}" data-delta="+10" title="Cộng 10 điểm">+10</button>
                <button class="choice-mini-btn" data-team="${e.id}" data-action="reset-team" title="Reset điểm đội này về 0" style="color: #fca5a5; font-weight: 800;">0đ</button>
              </div>
              <span class="lb-score-val">${e.score} đ</span>
            </div>
          </div>
        `).join(``)}
      </div>
    `,n.querySelectorAll(`.choice-mini-btn`).forEach(e=>{e.onclick=()=>{let n=parseInt(e.dataset.team,10);if(e.dataset.action===`reset-team`){t.playClick();let e=l.teams.find(e=>e.id===n);e&&(e.score=0,l.save(),l.notify(`TEAMS_UPDATED`,l.teams),this.openLeaderboard(),this.showCelebrationToast(`ĐÃ RESET ĐIỂM ĐỘI`,`${e.name} về 0 điểm`));return}let r=parseInt(e.dataset.delta,10);l.addScore(n,r,`MC điều chỉnh trực tiếp`),this.openLeaderboard()}}),e.classList.add(`active`)}openRulesModal(){let e=document.getElementById(`rulesModal`);e&&e.classList.add(`active`)}closeAllModals(){document.querySelectorAll(`.modal-backdrop`).forEach(e=>e.classList.remove(`active`))}renderVictoryScreen(e){t.playVictory(),this.vietnamEngine&&this.vietnamEngine.triggerVictoryFlock(),this.confettiEngine.continuous(6500);let n=l.getSortedTeams(),r=n[0]?.score??0,i=n.filter(e=>e.score===r),a=i.length>1,o=a&&i.length===n.length,s=n[0]||{name:`Đội Xuất Sắc`,score:0,emblemKey:`teamNhanNghia`};e.innerHTML=`
      <div class="screen-victory">
        ${a?`
          <div class="victory-champion-banner">
            <div style="width: 84px; height: 84px; margin: 0 auto 16px;">
              ${d.trophy}
            </div>
            <h1 class="victory-title" style="${o?`font-size: 2.7rem;`:``}">
              ${o?`ĐẠI ĐOÀN KẾT — CẢ ${l.teams.length} ĐỘI ĐỒNG VÔ ĐỊCH!`:`CHÚC MỪNG CÁC ĐỘI ĐỒNG QUÁN QUÂN!`}
            </h1>
            <p style="color: var(--gold-300); font-size: 1.25rem; font-weight: 700; margin: 10px 0 16px;">
              ${o?`“Đoàn kết, đoàn kết, đại đoàn kết — Thành công, thành công, đại thành công!”`:`Điểm số kỷ lục ngang tài ngang sức: <span style="color: #fff; font-family: var(--font-mono); font-weight: 900; font-size: 1.4rem;">${r} ĐIỂM</span>`}
            </p>
            <div class="co-champions-grid">
              ${i.map((e,t)=>`
                <div class="co-champion-card" style="border-color: ${e.color};">
                  <div style="width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
                    ${f(e,t)}
                  </div>
                  <div style="text-align: left;">
                    <div class="co-champion-name">${e.name}</div>
                    <div style="font-family: var(--font-mono); font-weight: 800; color: var(--gold-400); font-size: 1.1rem;">${e.score} ĐIỂM</div>
                  </div>
                  <span class="co-champion-badge">ĐỒNG QUÁN QUÂN</span>
                </div>
              `).join(``)}
            </div>
          </div>
        `:`
          <div class="victory-champion-banner">
            <div style="width: 100px; height: 100px; margin: 0 auto 16px;">
              ${d.trophy}
            </div>
            <h1 class="victory-title">CHÚC MỪNG NHÀ VÔ ĐỊCH!</h1>
            <div class="victory-champion-name" style="display: flex; align-items: center; justify-content: center; gap: 16px;">
              <div style="width: 54px; height: 54px; display: flex; align-items: center; justify-content: center;">${f(s,0)}</div>
              <span>${s.name}</span>
            </div>
            <div style="font-size: 1.8rem; font-family: var(--font-mono); font-weight: 900; color: #fff;">
              Điểm số kỷ lục: <span style="color: var(--gold-400);">${s.score} ĐIỂM</span>
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
          ${n[1]?`
            <div class="podium-slot rank-2">
              <div style="width: 48px; height: 48px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(n[1],1)}</div>
              <div class="podium-team-name">${n[1].name}</div>
              <div class="podium-score">${n[1].score} đ</div>
              <div class="podium-bar">${n[1].score===n[0].score?`1`:`2`}</div>
            </div>
          `:``}

          <div class="podium-slot rank-1">
            <div style="width: 68px; height: 68px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(s,0)}</div>
            <div class="podium-team-name">${s.name}</div>
            <div class="podium-score">${s.score} đ</div>
            <div class="podium-bar">1</div>
          </div>

          ${n[2]?`
            <div class="podium-slot rank-3">
              <div style="width: 44px; height: 44px; margin-bottom: 8px; display: flex; align-items: center; justify-content: center;">${f(n[2],2)}</div>
              <div class="podium-team-name">${n[2].name}</div>
              <div class="podium-score">${n[2].score} đ</div>
              <div class="podium-bar">${n[2].score===n[0].score?`1`:`3`}</div>
            </div>
          `:``}

          ${n.slice(3).map((e,t)=>`
            <div style="display: flex; flex-direction: column; align-items: center; width: 140px; margin-top: 50px;">
              <div style="width: 36px; height: 36px; margin-bottom: 6px; display: flex; align-items: center; justify-content: center;">${f(e,3+t)}</div>
              <div style="font-weight: 700; color: #fff;">${e.name}</div>
              <div style="font-family: var(--font-mono); font-weight: 800; color: var(--gold-400);">${e.score} đ</div>
              <div style="font-size: 0.75rem; color: var(--gold-400); font-weight: 800; text-transform: uppercase;">${e.score===n[0].score?`Hạng 01`:`Hạng 0${4+t}`}</div>
            </div>
          `).join(``)}
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
          <button id="btnStartTieBreaker" class="${a?`btn btn-tie-breaker-launch btn-hero`:`btn btn-glass btn-hero`}" style="${a?``:`border-color: var(--gold-400); color: var(--gold-300);`}">
            ${d.zap} <span>${a?`⚡ ĐẤU CÂU HỎI PHỤ (TIE-BREAKER)`:`⚡ CÂU HỎI PHỤ GIAO LƯU`}</span>
          </button>
          <button id="btnPlayAgain" class="btn btn-gold btn-hero">
            ${d.refresh} <span>CHƠI LẠI</span>
          </button>
          <button id="btnHomeFromVictory" class="btn btn-glass btn-hero">
            ${d.home} <span>VỀ TRANG CHỦ</span>
          </button>
        </div>
      </div>
    `;let c=document.getElementById(`btnStartTieBreaker`);c&&(c.onclick=()=>{t.playDongSonGong();let e=a?i.map(e=>e.id):n.map(e=>e.id);l.startTieBreaker(e)}),document.getElementById(`btnPlayAgain`).onclick=()=>{this.promptResetMatch()},document.getElementById(`btnHomeFromVictory`).onclick=()=>{t.playClick(),l.setScreen(`home`)}}renderTieBreakerScreen(e){let n=l.getCurrentTieQuestion(),r=l.getTieBreakerQuestions(),i=l.teams.filter(e=>l.tieCompetingTeamIds.length===0||l.tieCompetingTeamIds.includes(e.id));e.innerHTML=`
      <div class="screen-tie-breaker">
        <div class="tie-header">
          <div class="round-intro-badge" style="background: rgba(239, 68, 68, 0.2); color: #fca5a5; border-color: #ef4444; display: inline-flex; align-items: center; gap: 6px;">
            ${d.zap} VÒNG CÂU HỎI PHỤ • TIE-BREAKER
          </div>
          <h1 style="font-size: 2.3rem; font-weight: 900; margin: 12px 0 6px; color: #fff; text-transform: uppercase;">
            PHÂN ĐỊNH NGÔI VỊ QUÁN QUÂN
          </h1>
          <p style="font-size: 1rem; color: var(--text-secondary); max-width: 650px; margin: 0 auto;">
            Dành cho các đội đang hòa điểm cao nhất. Bấm chuông/giơ tay giành quyền trả lời!
          </p>

          <div class="tie-competing-strip">
            ${i.map((e,t)=>`
              <div class="tie-competing-chip" style="border-color: ${e.color};">
                <div style="width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
                  ${f(e,t)}
                </div>
                <span>${e.name}</span>
                <span style="font-family: var(--font-mono); font-weight: 900; color: var(--gold-400);">(${e.score}đ)</span>
              </div>
            `).join(``)}
          </div>
        </div>

        <div class="tie-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <span class="hud-pill" style="font-size: 0.95rem; font-weight: 800; color: var(--gold-300);">
              ${n.badge} • CÂU ${l.currentTieQuestionIdx+1}/${r.length}
            </span>
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Đếm ngược:</span>
              <span id="tieTimerDisplay" style="font-family: var(--font-mono); font-size: 1.4rem; font-weight: 900; color: var(--gold-400); min-width: 45px;">
                ${l.timerSeconds}s
              </span>
              <button id="btnTieTimerToggle" class="btn btn-glass" style="padding: 6px 12px; font-size: 0.85rem;">
                ${l.timerRunning?d.pause:d.play}
              </button>
            </div>
          </div>

          <div style="font-size: 1.2rem; font-weight: 800; color: var(--gold-400); margin-bottom: 12px;">
            ${n.title}
          </div>

          <div class="tie-scenario">
            ${n.scenario}
          </div>

          <div class="tie-question-text">
            ${n.question}
          </div>

          <!-- 4 Options -->
          <div class="tie-options-grid">
            ${n.options.map(e=>{let t=`tie-option-btn`;return l.tieSelectedOption===e.key&&(t+=` selected`),l.tieAnswerRevealed&&(e.key===n.correct?t+=` correct`:l.tieSelectedOption===e.key&&(t+=` wrong`)),`
                <button class="${t}" data-key="${e.key}">
                  <span class="tie-option-key">${e.key}</span>
                  <span style="line-height: 1.5;">${e.text}</span>
                </button>
              `}).join(``)}
          </div>

          <!-- Reveal Button -->
          <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-top: 10px;">
            ${l.tieAnswerRevealed?``:`
              <button id="btnRevealTieAnswer" class="btn btn-gold btn-hero">
                ${d.eye} <span>CÔNG BỐ ĐÁP ÁN</span>
              </button>
            `}
          </div>

          <!-- Explanation Debrief Box -->
          ${l.tieAnswerRevealed?`
            <div style="margin-top: 24px; background: rgba(0, 0, 0, 0.45); border: 1px solid var(--border-glass); border-left: 4px solid #34d399; border-radius: var(--radius-md); padding: 18px 24px; text-align: left;">
              <div style="font-size: 1.15rem; font-weight: 800; color: #34d399; margin-bottom: 8px;">
                ✓ ĐÁP ÁN ĐÚNG: ${n.explanation.answerText}
              </div>
              <div style="font-size: 1rem; color: #fff; margin-bottom: 8px; line-height: 1.5;">
                <strong>Vì sao:</strong> ${n.explanation.why}
              </div>
              <div style="font-size: 0.95rem; color: var(--gold-200); line-height: 1.5;">
                <strong>Bài học cốt lõi:</strong> ${n.explanation.lesson}
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
                ${i.map((e,t)=>`
                  <button class="btn btn-gold btn-tie-award-team" data-teamid="${e.id}" style="padding: 10px 18px; font-weight: 800; display: flex; align-items: center; gap: 8px;">
                    <span style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">${f(e,t)}</span>
                    <span>+10đ cho ${e.name}</span>
                  </button>
                `).join(``)}
              </div>
            </div>
          `:``}
        </div>

        <!-- Navigation Buttons -->
        <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
          <button id="btnBackToVictory" class="btn btn-hero btn-gold">
            ${d.trophy} <span>XEM KẾT QUẢ CHUNG CUỘC</span>
          </button>
          ${l.currentTieQuestionIdx<r.length-1?`
            <button id="btnNextTieQuestion" class="btn btn-hero btn-glass">
              <span>CÂU HỎI TIẾP THEO</span> ${d.chevronRight}
            </button>
          `:``}
        </div>
      </div>
    `,e.querySelectorAll(`.tie-option-btn`).forEach(e=>{e.onclick=()=>{if(l.tieAnswerRevealed)return;t.playClick();let n=e.dataset.key;l.setTieSelectedOption(n)}});let a=document.getElementById(`btnRevealTieAnswer`);a&&(a.onclick=()=>{t.playDongSonGong(),this.stopTimer(),l.revealTieAnswer()});let o=document.getElementById(`btnTieTimerToggle`);o&&(o.onclick=()=>{l.timerRunning?this.stopTimer():this.startTimer()}),e.querySelectorAll(`.btn-tie-award-team`).forEach(n=>{n.onclick=()=>{let r=parseInt(n.dataset.teamid,10),i=l.teams.find(e=>e.id===r);t.playVictory(),this.confettiEngine.burst(85),l.awardTieBreaker(r,10),this.showCelebrationToast(`CẬP NHẬT ĐIỂM QUYẾT ĐỊNH!`,`+10đ cho ${i?i.name:`đội thi`}!`),this.renderTieBreakerScreen(e)}});let s=document.getElementById(`btnBackToVictory`);s&&(s.onclick=()=>{t.playClick(),this.stopTimer(),l.setScreen(`victory`)});let c=document.getElementById(`btnNextTieQuestion`);c&&(c.onclick=()=>{t.playWhoosh(),this.stopTimer(),l.nextTieQuestion()})}promptResetMatch(){t.playClick(),confirm(`BẠN CÓ CHẮC CHẮN MUỐN RESET TOÀN BỘ ĐIỂM VỀ 0 ĐỂ CHƠI MÀN MỚI?

• Điểm số của tất cả các đội sẽ được đưa về 0
• Quay về màn hình chọn số đội & đặt tên đội
• Câu hỏi sẽ được bốc ngẫu nhiên lại`)&&(t.playDongSonGong(),l.resetMatch(!0),this.closeAllModals(),this.showCelebrationToast(`ĐÃ RESET ĐIỂM VỀ 0!`,`Chọn số đội để bắt đầu màn mới`),l.setScreen(`setup`))}promptResetScoresOnly(){t.playClick(),confirm(`Bạn có chắc muốn đặt lại điểm số của tất cả các đội về 0 (giữ nguyên câu hỏi hiện tại)?`)&&(t.playScoreUp(),l.resetScoresOnly(),this.openLeaderboard(),this.showCelebrationToast(`ĐÃ ĐẶT LẠI ĐIỂM VỀ 0`,`Tất cả các đội hiện có 0 điểm`))}toggleMute(){let e=t.toggleMute();return this.renderTopHud(),e}toggleFullscreen(){t.playClick(),document.fullscreenElement?document.exitFullscreen().catch(e=>console.log(e)):document.documentElement.requestFullscreen().catch(e=>console.log(e))}};