// Unified Professional SVG Icon System - Modern Vietnamese Gameshow
// 24x24 viewBox, 2px stroke, strictly constrained dimensions

const createSvg = (content, specificClass = '', viewBox = '0 0 24 24', width = 20, height = 20) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" class="svg-icon ${specificClass}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  ${content}
</svg>
`;

export const ICONS = {
  // ================= 4 UNIFIED TEAM MEDALLION EMBLEMS =================
  // All 4 emblems share identical 40x40 geometric tournament badge frames, Dong Son bronze rims & vector styling
  
  // 1. Đội Nhân Nghĩa: Chim Lạc Đông Sơn sải cánh kiêu hãnh
  teamNhanNghia: `
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
  `,

  // 2. Đội Chính Trực: Cột trụ chính trực & Thanh kiếm hình học
  teamChinhTruc: `
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
  `,

  // 3. Đội Trách Nhiệm: Khiên kỷ luật hình học
  teamTrachNhiem: `
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
  `,

  // 4. Đội Liêm Chính: Vầng thái dương Đông Sơn & Ngọn đuốc liêm khiết
  teamLiemChinh: `
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
  `,

  // 5. Đội Chí Công: Biểu tượng đài sen & ngôi sao chính tâm (Chí công vô tư)
  teamChiCong: `
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
  `,

  // ================= SYSTEM & STATUS SVG ICONS =================
  check: createSvg('<polyline points="20 6 9 17 4 12"/>', 'svg-icon-check', '0 0 24 24', 20, 20),
  x: createSvg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>', 'svg-icon-x', '0 0 24 24', 20, 20),
  clock: createSvg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', 'svg-icon-clock', '0 0 24 24', 20, 20),
  trophy: createSvg('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>', 'svg-icon-trophy', '0 0 24 24', 22, 22),
  medal: createSvg('<path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/>', 'svg-icon-medal', '0 0 24 24', 20, 20),
  zap: createSvg('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>', 'svg-icon-zap', '0 0 24 24', 20, 20),
  target: createSvg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', 'svg-icon-target', '0 0 24 24', 20, 20),
  lock: createSvg('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>', 'svg-icon-lock', '0 0 24 24', 20, 20),
  hourglass: createSvg('<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>', 'svg-icon-hourglass', '0 0 24 24', 16, 16),
  volume: createSvg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>', 'svg-icon-volume', '0 0 24 24', 20, 20),
  volumeMute: createSvg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/>', 'svg-icon-volume-mute', '0 0 24 24', 20, 20),
  maximize: createSvg('<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>', 'svg-icon-maximize', '0 0 24 24', 20, 20),
  play: createSvg('<polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>', 'svg-icon-play', '0 0 24 24', 20, 20),
  pause: createSvg('<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>', 'svg-icon-pause', '0 0 24 24', 20, 20),
  refresh: createSvg('<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>', 'svg-icon-refresh', '0 0 24 24', 18, 18),
  book: createSvg('<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/>', 'svg-icon-book', '0 0 24 24', 20, 20),
  sparkles: createSvg('<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>', 'svg-icon-sparkles', '0 0 24 24', 20, 20),
  brain: createSvg('<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M12 5v13"/>', 'svg-icon-brain', '0 0 24 24', 20, 20),
  layers: createSvg('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>', 'svg-icon-layers', '0 0 24 24', 20, 20),
  eye: createSvg('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', 'svg-icon-eye', '0 0 24 24', 20, 20),
  chevronRight: createSvg('<polyline points="9 18 15 12 9 6"/>', 'svg-icon-chevron', '0 0 24 24', 20, 20),
  home: createSvg('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>', 'svg-icon-home', '0 0 24 24', 20, 20)
};

// Safe helper to always get an emblem even with stale data
export function getTeamEmblem(team, defaultIndex = 0) {
  if (!team) return ICONS.teamNhanNghia;
  const EMBLEM_KEYS = ['teamNhanNghia', 'teamChinhTruc', 'teamTrachNhiem', 'teamLiemChinh', 'teamChiCong'];
  const key = team.emblemKey || EMBLEM_KEYS[defaultIndex % EMBLEM_KEYS.length];
  return ICONS[key] || ICONS.teamNhanNghia;
}
