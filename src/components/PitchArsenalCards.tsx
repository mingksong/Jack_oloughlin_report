import { useMemo } from 'react';
import { WBC_PITCHES, MLB_STATCAST, mphToKmh } from '../data/oloughlinScoutData';
import { PITCH_COLORS, PITCH_NAMES_KR } from '../utils/pitchColors';

interface PitchStats {
  code: string;
  count: number;
  pct: number;
  avgSpeed: number;
  maxSpeed: number;
  minSpeed: number;
  avgSpeedKmh: number;
  maxSpeedKmh: number;
}

export default function PitchArsenalCards() {
  const wbcStats = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const p of WBC_PITCHES) {
      if (!map.has(p.pitchCode)) map.set(p.pitchCode, []);
      map.get(p.pitchCode)!.push(p.speed);
    }
    const total = WBC_PITCHES.length;
    const result: PitchStats[] = [];
    for (const [code, speeds] of map) {
      const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const max = Math.max(...speeds);
      const min = Math.min(...speeds);
      result.push({
        code,
        count: speeds.length,
        pct: (speeds.length / total) * 100,
        avgSpeed: Math.round(avg * 10) / 10,
        maxSpeed: max,
        minSpeed: min,
        avgSpeedKmh: mphToKmh(avg),
        maxSpeedKmh: mphToKmh(max),
      });
    }
    return result.sort((a, b) => b.count - a.count);
  }, []);

  const mlbTypes = MLB_STATCAST.pitchTypes;

  return (
    <div className="space-y-6">
      {/* Summary Bar */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">
          구종 사용 비율
          <span className="text-slate-500 font-normal ml-2">WBC {WBC_PITCHES.length}구 | MLB {MLB_STATCAST.totals.pitches}구</span>
        </h3>
        {/* WBC bar */}
        <div className="mb-2">
          <span className="text-[10px] text-slate-500 mb-1 block">WBC 2026</span>
          <div className="flex h-6 rounded overflow-hidden">
            {wbcStats.map(s => (
              <div
                key={s.code}
                className="flex items-center justify-center text-[10px] font-bold text-white"
                style={{
                  width: `${s.pct}%`,
                  backgroundColor: PITCH_COLORS[s.code] ?? '#6b7280',
                  minWidth: s.pct > 5 ? undefined : '24px',
                }}
              >
                {s.pct >= 8 && `${PITCH_NAMES_KR[s.code] ?? s.code} ${s.pct.toFixed(0)}%`}
              </div>
            ))}
          </div>
        </div>
        {/* MLB bar */}
        <div>
          <span className="text-[10px] text-slate-500 mb-1 block">MLB 2024</span>
          <div className="flex h-6 rounded overflow-hidden">
            {Object.entries(mlbTypes)
              .sort((a, b) => b[1].pct - a[1].pct)
              .map(([code, info]) => (
                <div
                  key={code}
                  className="flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    width: `${info.pct}%`,
                    backgroundColor: PITCH_COLORS[code] ?? '#6b7280',
                    minWidth: info.pct > 5 ? undefined : '24px',
                  }}
                >
                  {info.pct >= 8 && `${PITCH_NAMES_KR[code] ?? code} ${info.pct.toFixed(0)}%`}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Individual Pitch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {wbcStats.map(wbc => {
          const mlb = mlbTypes[wbc.code as keyof typeof mlbTypes];
          const color = PITCH_COLORS[wbc.code] ?? '#6b7280';
          return (
            <div
              key={wbc.code}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                <h4 className="text-sm font-bold text-white">
                  {PITCH_NAMES_KR[wbc.code] ?? wbc.code}
                  <span className="text-slate-500 font-normal ml-1">({wbc.code})</span>
                </h4>
                <span className="ml-auto text-xs text-slate-400">
                  WBC {wbc.count}구 ({wbc.pct.toFixed(0)}%)
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-[10px] text-slate-500">평균 구속</div>
                  <div className="text-lg font-bold" style={{ color }}>
                    {wbc.avgSpeed}
                  </div>
                  <div className="text-[10px] text-slate-500">mph ({wbc.avgSpeedKmh}km/h)</div>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-[10px] text-slate-500">최고 구속</div>
                  <div className="text-lg font-bold text-white">{wbc.maxSpeed}</div>
                  <div className="text-[10px] text-slate-500">mph ({wbc.maxSpeedKmh}km/h)</div>
                </div>
                <div className="bg-slate-900/50 rounded p-2">
                  <div className="text-[10px] text-slate-500">구속 범위</div>
                  <div className="text-sm font-bold text-slate-300 mt-1">
                    {wbc.minSpeed}-{wbc.maxSpeed}
                  </div>
                  <div className="text-[10px] text-slate-500">mph</div>
                </div>
              </div>

              {/* MLB comparison */}
              {mlb && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">MLB 2024 평균</span>
                    <span className="text-slate-300">
                      {mlb.avgSpeed} mph | {mlb.avgSpin} rpm | {mlb.count}구 ({mlb.pct}%)
                    </span>
                  </div>
                  {wbc.avgSpeed > mlb.avgSpeed && (
                    <div className="text-[10px] text-green-400 mt-1">
                      WBC에서 +{(wbc.avgSpeed - mlb.avgSpeed).toFixed(1)}mph 상승
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
