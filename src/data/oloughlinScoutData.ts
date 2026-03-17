import { AUS_PITCHES } from './ausPitchData';

// ========== PROFILE ==========
export const PROFILE = {
  name: "Jack O'Loughlin",
  nameKr: '잭 오러클린',
  fullName: 'Jack Te Haki O\'Loughlin',
  mlbId: 672552,
  position: 'LHP',
  throwHand: 'L' as const,
  batHand: 'L' as const,
  dob: '2000-03-14',
  age: 26,
  birthPlace: 'Adelaide, Australia',
  height: "6'5\"",
  weight: '223 lbs',
  number: 37,
  team: 'Colorado Rockies (MiLB)',
  oneLiner: '호주 역대 38번째 MLB 선수, 오클랜드 A\'s에서 데뷔전 3이닝 무실점. 다수 팀의 관심을 받은 FA 좌완으로 2026 WBC 대만전 승리 투수.',
  recentForm: '2024 MLB 데뷔(오클랜드 A\'s): 4G, 9.2IP, ERA 4.66, 6K. 데뷔전 휴스턴전 3이닝 무실점. 2026 WBC 대만전: 3IP, 2H, 0ER, 2K → 승리투수.',
  timeline: [
    { year: '2018', event: 'Detroit Tigers 산하 입단 (10대에 미국 진출)' },
    { year: '2018-23', event: 'Tigers 마이너리그 6년, 커리어 ERA 3.76' },
    { year: '2023', event: 'Triple-A 직행 (Double-A 스킵), 2023 시즌 6-10 (A+ & AAA)' },
    { year: '2023.11', event: 'Oakland A\'s 마이너 계약 (다수 팀 관심)' },
    { year: '2024.5', event: 'MLB 데뷔 — 휴스턴전 3이닝 무실점' },
    { year: '2024', event: 'MLB 4경기, 9.2IP, ERA 4.66, 6K' },
    { year: '2024.11', event: 'Colorado Rockies 마이너 계약' },
    { year: '2026', event: 'WBC 대만전 승리투수 (3IP, 0ER, 2K)' },
  ],
  episodes: [
    {
      title: '호주 역대 38번째 MLB 선수',
      desc: '2024년 5월 오클랜드 A\'s에 콜업. 데뷔전 휴스턴 애스트로스 상대 3이닝 무실점(2안타 1볼넷 2삼진)의 인상적 데뷔.',
    },
    {
      title: '다수 팀이 관심 보인 FA 좌완',
      desc: '2023 시즌 후 Tigers 산하에서 FA. Double-A를 건너뛰고 Triple-A 직행한 성장 속도와 좌완 희소성으로 다수 팀의 관심을 받아 오클랜드 A\'s 선택.',
    },
    {
      title: 'WBC 2026 대만전 좌완 트리오 완봉',
      desc: 'Wells(3IP) → O\'Loughlin(3IP) → Kennedy(3IP) 좌완 3인 릴레이로 대만 3안타 완봉(3-0). 중간 3이닝 무실점으로 승리투수.',
    },
    {
      title: 'Te Haki — 독특한 미들 네임',
      desc: '미들 네임 "Te Haki"는 마오리어 계열 이름으로 추정. Adelaide 출신으로 다문화적 배경을 가진 독특한 정체성의 투수.',
    },
  ],
};

// ========== WBC PITCHES (filtered from ausPitchData) ==========
export const WBC_PITCHES = AUS_PITCHES.filter(p => p.pitcher === "Jack O'Loughlin");

// ========== MLB STATCAST (2024 Regular Season, 4 Games, 176 pitches) ==========
export const MLB_STATCAST = {
  games: [
    { date: '2024-05-26', pitches: 42, opponent: 'HOU', fbAvg: 91.9 },
    { date: '2024-06-01', pitches: 20, opponent: 'ATL', fbAvg: 91.9 },
    { date: '2024-06-08', pitches: 52, opponent: 'TOR', fbAvg: 92.0 },
    { date: '2024-07-06', pitches: 62, opponent: 'BAL', fbAvg: 91.6 },
  ],
  totals: { games: 4, ip: 9.2, era: 4.66, k: 6, pitches: 176 },
  pitchTypes: {
    FF: { count: 92, pct: 52.3, avgSpeed: 91.8, maxSpeed: 93.4, minSpeed: 89.4, avgSpin: 2221, avgPfxX: 0.8, avgPfxZ: 1.2, extension: 6.5 },
    SL: { count: 38, pct: 21.6, avgSpeed: 82.8, maxSpeed: 86.4, minSpeed: 80.4, avgSpin: 2395, avgPfxX: -0.2, avgPfxZ: -0.1, extension: 6.4 },
    CU: { count: 28, pct: 15.9, avgSpeed: 76.0, maxSpeed: 77.9, minSpeed: 72.0, avgSpin: 2421, avgPfxX: -0.9, avgPfxZ: -1.0, extension: 6.3 },
    CH: { count: 17, pct: 9.7, avgSpeed: 84.0, maxSpeed: 85.0, minSpeed: 83.0, avgSpin: 1526, avgPfxX: 1.1, avgPfxZ: 0.6, extension: 6.4 },
  },
};

// ========== KBO 2024 VELOCITY DISTRIBUTION (km/h) ==========
export const KBO_VELOCITY_DIST = {
  all: {
    직구: { p25: 141.0, p50: 144.0, p75: 146.0, p95: 150.0, count: 100000 },
    슬라이더: { p25: 128.0, p50: 131.0, p75: 134.0, p95: 138.0, count: 50533 },
    체인지업: { p25: 124.0, p50: 128.0, p75: 132.0, p95: 137.0, count: 23160 },
    커브: { p25: 115.0, p50: 119.0, p75: 123.0, p95: 128.0, count: 19567 },
    커터: { p25: 134.0, p50: 136.0, p75: 139.0, p95: 142.0, count: 9979 },
  },
  lhp: {
    직구: { p25: 140.0, p50: 143.0, p75: 146.0, p95: 149.0, count: 27958 },
    슬라이더: { p25: 127.0, p50: 130.0, p75: 132.0, p95: 136.0, count: 16472 },
    체인지업: { p25: 126.0, p50: 129.0, p75: 132.0, p95: 137.0, count: 8419 },
    커브: { p25: 114.0, p50: 118.0, p75: 121.0, p95: 126.0, count: 5624 },
    커터: { p25: 134.0, p50: 136.0, p75: 138.0, p95: 141.0, count: 3513 },
  },
};

// Pitch type mapping: Statcast code → KBO name
export const PITCH_TO_KBO: Record<string, string> = {
  FF: '직구',
  SL: '슬라이더',
  ST: '슬라이더', // sweeper → slider category
  CH: '체인지업',
  CU: '커브',
  FC: '커터',
  SI: '직구',
};

// mph → km/h
export function mphToKmh(mph: number): number {
  return Math.round(mph * 1.60934 * 10) / 10;
}

// Calculate KBO percentile for a given km/h speed
export function kboPercentile(kmh: number, dist: { p25: number; p50: number; p75: number; p95: number }): number {
  if (kmh <= dist.p25) return Math.round((kmh / dist.p25) * 25);
  if (kmh <= dist.p50) return 25 + Math.round(((kmh - dist.p25) / (dist.p50 - dist.p25)) * 25);
  if (kmh <= dist.p75) return 50 + Math.round(((kmh - dist.p50) / (dist.p75 - dist.p50)) * 25);
  if (kmh <= dist.p95) return 75 + Math.round(((kmh - dist.p75) / (dist.p95 - dist.p75)) * 20);
  return Math.min(99, 95 + Math.round(((kmh - dist.p95) / 5) * 4));
}

// ========== SCOUTING GRADES (20-80 scale) ==========
export const SCOUTING_GRADES = {
  // Based on MLB regular season + WBC performance
  pitches: [
    {
      code: 'FF',
      name: '포심 패스트볼',
      grade: 55,
      label: 'Average-Plus',
      mlbAvg: 91.8,
      wbcAvg: 93.3,
      desc: 'MLB 평균 91.8mph, WBC에서 93-94mph 터치. 6\'5" 장신의 각도가 강점. KBO 좌완 P95급 구속.',
    },
    {
      code: 'SL',
      name: '슬라이더',
      grade: 55,
      label: 'Average-Plus',
      mlbAvg: 82.8,
      wbcAvg: 86.6,
      desc: 'MLB 82.8mph에서 WBC 86.6mph로 구속 대폭 상승. 수평 무브먼트 활용한 스트라이크 사냥.',
    },
    {
      code: 'ST',
      name: '스위퍼',
      grade: 50,
      label: 'Average',
      mlbAvg: 81.6,
      wbcAvg: 82.2,
      desc: 'WBC에서 주요 아웃 피치로 활용. 좌타자 바깥 큰 횡변화로 헛스윙 유도.',
    },
    {
      code: 'CH',
      name: '체인지업',
      grade: 50,
      label: 'Average',
      mlbAvg: 84.0,
      wbcAvg: 85.6,
      desc: '직구 대비 ~8mph 속도차. 우타자 바깥 낮게 활용. WBC에서 Yu Chang 상대 위력적.',
    },
    {
      code: 'CU',
      name: '커브',
      grade: 45,
      label: 'Below Average',
      mlbAvg: 76.0,
      wbcAvg: null,
      desc: 'MLB에서 15.9% 사용했으나 WBC에서 미사용. 12-6 종변화, 빈도수 줄이는 추세.',
    },
  ],
  overall: {
    role: '5~6이닝급 선발 / 롱릴리프',
    ceiling: '3~4선발',
    strengths: [
      '6\'5" 장신 좌완의 릴리스 각도 (높은 기대 수직 무브먼트)',
      'WBC에서 구속 2-4mph 업 → 성장 시그널',
      '직구-슬라이더-스위퍼 3구종 조합',
      '대만 상대 3이닝 무실점 클린업 능력',
    ],
    weaknesses: [
      '커브 컨트롤 불안정 (WBC 미사용)',
      'MLB 샘플 4경기 9.2이닝 — 소량 데이터',
      '체인지업 커맨드 발전 필요',
    ],
    risks: [
      '마이너리거 (40인 로스터 외)',
      '쿠어스필드 홈구장 환경의 ERA 리스크',
      '부상 이력 및 이닝 제한 가능성',
    ],
  },
};
