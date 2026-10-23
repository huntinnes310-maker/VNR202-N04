import{a as e,i as t,n,o as r,r as i,t as a}from"./vietnamVisuals-DI73Jhac.js";var o={1:`Đọc nhận định và chọn ĐÚNG hoặc SAI.`,2:`Chọn 1 đáp án đúng trong 4 lựa chọn A – B – C – D.`,3:`Hành vi nào 🟢 VẬN DỤNG bài học lịch sử, hành vi nào 🔴 CẦN TRÁNH?`,4:`Vòng Về Đích: tình huống thực tiễn, chọn cách xử lý đúng nhất trong 4 lựa chọn.`},s=r.reduce((t,n)=>t+(e[n.id]||[]).length,0),c=`VNR202_N04_SOLO_LEADERBOARD`,l=document.getElementById(`app`),u=new i(`confettiCanvas`);new n(`particleCanvas`);var d=new a,f=e=>String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]),p=e=>{let t=[...e];for(let e=t.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[t[e],t[n]]=[t[n],t[e]]}return t},m=(e,t)=>Math.round(e.pointsPerQuestion*(.5+.5*t/e.timeLimit)),h=()=>{try{return JSON.parse(localStorage.getItem(c))||[]}catch{return[]}},g=e=>{try{localStorage.setItem(c,JSON.stringify(e))}catch{}},_={name:``,questions:[],idx:0,score:0,correct:0,answers:[],timeLeft:0,timer:null,locked:!1};function v(){return r.flatMap(t=>p(e[t.id]||[]).map(e=>({...e,round:t})))}function y(){_={..._,questions:v(),idx:0,score:0,correct:0,answers:[]},b()}function b(){let e=_.questions[_.idx].round;t.playWhoosh(),d.triggerCloudPart?.();let n=document.getElementById(`roundSweepBanner`);document.getElementById(`sweepTitleText`).textContent=e.title,n.classList.add(`active`),setTimeout(()=>{n.classList.remove(`active`),x(e)},1600)}function x(e){let n=_.questions.filter(t=>t.round.id===e.id).length,i=_.idx>0?_.questions[_.idx-1].round:null,a=i?_.answers.filter(e=>e.q.round.id===i.id):[];l.innerHTML=`
    <section class="card round-card">
      ${i?`
        <div class="round-recap">
          Hoàn thành <b>${f(i.title)}</b>: đúng <b>${a.filter(e=>e.ok).length}/${a.length}</b> câu,
          <b>+${a.reduce((e,t)=>e+t.gained,0)}</b> điểm • Tổng: <b>${_.score}</b> điểm
        </div>`:``}
      <div class="eyebrow">VÒNG ${e.id}/${r.length}</div>
      <h1 class="title">${f(e.title.replace(/^VÒNG \d+:\s*/,``))}</h1>
      <p class="sub">${f(e.subtitle.split(`•`)[0].trim())}</p>
      <p class="round-rule">${f(o[e.id]||``)}</p>
      <div class="round-stats">
        <div><b>${n}</b><span>câu hỏi</span></div>
        <div><b>${e.pointsPerQuestion}</b><span>điểm tối đa / câu</span></div>
        <div><b>${e.timeLimit}s</b><span>mỗi câu</span></div>
      </div>
      <div class="actions"><button class="btn-gold" id="roundGo">BẮT ĐẦU VÒNG ${e.id}</button></div>
    </section>
  `;let s=document.getElementById(`roundGo`);s.focus(),s.onclick=()=>{t.playClick(),C()}}function S(){let e=h().slice(0,5);l.innerHTML=`
    <section class="card start-card">
      <div class="eyebrow">VNR202 • NHÓM 4</div>
      <h1 class="title">ĐẤU TRƯỜNG LỊCH SỬ</h1>
      <p class="sub">Đảng ra đời: Từ khủng hoảng đường lối đến tổ chức tiên phong (1930 – 1945)</p>

      <form id="startForm" class="start-form">
        <label for="playerName">Tên của bạn</label>
        <input id="playerName" maxlength="30" autocomplete="off" placeholder="Nhập tên để bắt đầu..." value="${f(_.name)}" required>
        <button class="btn-gold" type="submit">BẮT ĐẦU CHƠI</button>
      </form>

      <ul class="rules">
        <li><b>${r.length} vòng • ${s} câu</b>: ${r.map(e=>f(e.title.replace(/^VÒNG \d+:\s*/,``))).join(` → `)}.</li>
        <li>Có giới hạn thời gian mỗi câu. Trả lời càng nhanh, điểm càng cao.</li>
        <li>Sau mỗi câu có giải thích để bạn ôn lại kiến thức.</li>
      </ul>

      ${e.length?`
        <div class="mini-board">
          <div class="mini-title">BẢNG XẾP HẠNG TRÊN MÁY NÀY</div>
          ${E(e)}
        </div>`:``}
    </section>
  `;let n=document.getElementById(`playerName`);n.focus(),document.getElementById(`startForm`).onsubmit=e=>{e.preventDefault();let r=n.value.trim();if(!r)return n.focus();t.playClick(),_.name=r,y()}}function C(){let e=_.questions[_.idx],t=_.questions.filter(t=>t.round.id===e.round.id),n=t.indexOf(e);_.timeLeft=e.round.timeLimit,_.locked=!1;let r=e.type===`true_false`||e.type===`build_fight`;l.innerHTML=`
    <section class="card quiz-card">
      <header class="quiz-head">
        <div class="player">${f(_.name)}</div>
        <div class="progress-txt">Vòng ${e.round.id} • Câu ${n+1}/${t.length}</div>
        <div class="score-pill">${_.score} điểm</div>
      </header>
      <div class="progress"><div style="width:${_.idx/_.questions.length*100}%"></div></div>

      <div class="q-meta">
        <span class="tag">${f(e.round.title.replace(/^VÒNG \d+:\s*/,``))}</span>
        <span class="timer" id="timer">${_.timeLeft}s</span>
      </div>
      <div class="timebar"><div id="timebar"></div></div>

      ${e.scenario?`<div class="scenario"><b>${f(e.caseNum||``)}${e.title?` — ${f(e.title)}`:``}</b><br>${f(e.scenario)}</div>`:``}
      <h2 class="question">${f(e.question||e.situation)}</h2>
      ${e.subtitle?`<p class="q-sub">${f(e.subtitle)}</p>`:``}

      <div class="options ${r?`binary`:``}">
        ${e.options.map((e,t)=>`
          <button class="opt ${r?t===0?`opt-yes`:`opt-no`:``}" data-key="${f(e.key)}">
            ${r?``:`<span class="key">${f(e.key)}</span>`}
            <span>${e.icon?f(e.icon)+` `:``}${f(e.text)}</span>
          </button>`).join(``)}
      </div>
      <div id="feedback"></div>
    </section>
  `,l.querySelectorAll(`.opt`).forEach(e=>e.onclick=()=>T(e.dataset.key)),clearInterval(_.timer),_.timer=setInterval(w,1e3)}function w(){_.timeLeft--;let e=document.getElementById(`timer`),n=document.getElementById(`timebar`);e&&(e.textContent=`${_.timeLeft}s`),n&&(n.style.width=`${_.timeLeft/_.questions[_.idx].round.timeLimit*100}%`),_.timeLeft<=5&&_.timeLeft>0&&t.playTick(),_.timeLeft<=0&&T(null)}function T(e){if(_.locked)return;_.locked=!0,clearInterval(_.timer);let n=_.questions[_.idx],r=e===n.correct,i=r?m(n.round,_.timeLeft):0;_.score+=i,r&&_.correct++,_.answers.push({q:n,key:e,ok:r,gained:i}),r?(t.playCorrect(),u.burst(40)):e===null?t.playTimeout():t.playWrong(),l.querySelectorAll(`.opt`).forEach(t=>{t.disabled=!0,t.dataset.key===n.correct?t.classList.add(`correct`):t.dataset.key===e&&t.classList.add(`wrong`)}),l.querySelector(`.score-pill`).textContent=`${_.score} điểm`;let a=_.idx===_.questions.length-1,o=!a&&_.questions[_.idx+1].round.id!==n.round.id;document.getElementById(`feedback`).innerHTML=`
    <div class="feedback ${r?`fb-ok`:`fb-bad`}">
      <div class="fb-title">${r?`CHÍNH XÁC! +${i} điểm`:e===null?`HẾT GIỜ!`:`CHƯA ĐÚNG!`}</div>
      <div><b>Đáp án:</b> ${f(n.explanation.answerText)}</div>
      <div><b>Vì sao:</b> ${f(n.explanation.why)}</div>
      <div><b>Bài học:</b> ${f(n.explanation.lesson)}</div>
      <button class="btn-gold" id="nextBtn">${a?`XEM KẾT QUẢ`:o?`SANG VÒNG TIẾP THEO ➔`:`CÂU TIẾP THEO ➔`}</button>
    </div>
  `;let s=document.getElementById(`nextBtn`);s.focus(),s.onclick=()=>{if(t.playClick(),a)return D();_.idx++,o?b():C()}}function E(e,t=-1){return`<ol class="board">${e.map((e,n)=>`
    <li class="${n===t?`me`:``}">
      <span class="rank">${n+1}</span>
      <span class="b-name">${f(e.name)}</span>
      <span class="b-score">${e.score} đ</span>
    </li>`).join(``)}</ol>`}function D(){let e=_.questions.length,n={name:_.name,score:_.score,correct:_.correct,total:e,at:Date.now()},r=[...h(),n].sort((e,t)=>t.score-e.score||e.at-t.at).slice(0,10);g(r);let i=r.indexOf(n),a=_.correct/e,o=a>=.8?`Xuất sắc! Bạn nắm rất chắc bài.`:a>=.5?`Khá tốt! Ôn thêm vài ý là hoàn hảo.`:`Cần ôn lại bài nhé!`;t.playVictory(),a>=.5&&(u.burst(140),d.triggerVictoryFlock?.()),l.innerHTML=`
    <section class="card result-card">
      <div class="eyebrow">KẾT QUẢ CỦA</div>
      <h1 class="title">${f(_.name)}</h1>
      <div class="big-score">${_.score}<span> điểm</span></div>
      <p class="sub">Đúng <b>${_.correct}/${e}</b> câu • ${o}</p>

      <div class="mini-board">
        <div class="mini-title">BẢNG XẾP HẠNG TRÊN MÁY NÀY</div>
        ${E(r,i)}
      </div>

      <details class="review">
        <summary>Xem lại các câu đã làm</summary>
        ${_.answers.map((e,t)=>`
          <div class="rv ${e.ok?`rv-ok`:`rv-bad`}">
            <div><b>V${e.q.round.id} • ${t+1}.</b> ${f(e.q.question||e.q.situation)}</div>
            <div class="rv-ans">${e.ok?`✓`:`✗`} Đáp án đúng: ${f(e.q.explanation.answerText)}</div>
          </div>`).join(``)}
      </details>

      <div class="actions">
        <button class="btn-gold" id="againBtn">CHƠI LẠI</button>
        <button class="btn-ghost" id="homeBtn">ĐỔI NGƯỜI CHƠI</button>
      </div>
    </section>
  `,document.getElementById(`againBtn`).onclick=()=>{t.playClick(),y()},document.getElementById(`homeBtn`).onclick=()=>{t.playClick(),_.name=``,S()}}S();