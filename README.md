# Jack O'Loughlin Scouting Report

WBC 2026 호주 대표 좌완 투수 Jack O'Loughlin (MLB ID: 672552) 스카우팅 리포트 웹앱.

## Demo

Vercel 배포 후 링크 추가 예정

## Features

### 프로필
- 기본 정보, 커리어 타임라인, 주요 에피소드 4건
- 호주 역대 38번째 MLB 선수, 15개 팀 FA 경쟁, WBC 대만전 승리투수

### 구종 분석
- 구종별 카드: FF(포심), SL(슬라이더), ST(스위퍼), CH(체인지업)
- MLB 2024 vs WBC 2026 구속/사용비율 비교
- WBC에서 직구 +1.5mph, 슬라이더 +3.8mph 구속 상승 확인

### 로케이션 맵
- 전체 / vs LHB / vs RHB 스트라이크존 피치맵
- 2스트라이크 결정구 분석 (히트맵 + 구종분포 + 결과)

### KBO 스케일 비교
- 구종별 구속 → KBO 2024 리그 퍼센타일 (전체 + 좌완)
- 20-80 스카우팅 등급표
- 예상 역할, 강점/약점/리스크 평가

## Data Sources

| Source | Content |
|--------|---------|
| MLB Stats API (Statcast) | WBC 2026 Pool C 투구 데이터 (44구) |
| pybaseball | 2024 MLB Regular Season Statcast (176구) |
| KBO DB | 2024 시즌 구종별 구속 분포 (전체 + 좌완) |

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- SVG pitch location charts

## Development

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build → dist/
```

## Deploy (Vercel)

1. Vercel에서 이 레포 연결
2. Framework Preset: Vite
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. `vercel.json` SPA rewrite 설정 포함
