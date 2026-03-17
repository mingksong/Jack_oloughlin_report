import { useMemo } from 'react';
import { WBC_PITCHES, MLB_STATCAST, KBO_VELOCITY_DIST, mphToKmh, PITCH_TO_KBO } from '../data/oloughlinScoutData';
import { PITCH_COLORS, PITCH_NAMES_KR } from '../utils/pitchColors';

interface CompRow {
  code: string;
  wbcAvg: number;
  wbcMax: number;
  mlbAvg: number | null;
  kboP50: number;
  kboP75: number;
  kboP95: number;
  wbcKmh: number;
}

export default function VelocityComparison() {
  const rows = useMemo(() => {
    const wbcMap = new Map<string, number[]>();
    for (const p of WBC_PITCHES) {
      if (!wbcMap.has(p.pitchCode)) wbcMap.set(p.pitchCode, []);
      wbcMap.get(p.pitchCode)!.push(p.speed);
    }

    const result: CompRow[] = [];
    for (const [code, speeds] of wbcMap) {
      const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const max = Math.max(...speeds);
      const kboName = PITCH_TO_KBO[code];
      const kbo = kboName ? KBO_VELOCITY_DIST.lhp[kboName as keyof typeof KBO_VELOCITY_DIST.lhp] : null;
      const mlbData = MLB_STATCAST.pitchTypes[code as keyof typeof MLB_STATCAST.pitchTypes];

      result.push({
        code,
        wbcAvg: Math.round(avg * 10) / 10,
        wbcMax: max,
        mlbAvg: mlbData?.avgSpeed ?? null,
        kboP50: kbo?.p50 ?? 0,
        kboP75: kbo?.p75 ?? 0,
        kboP95: kbo?.p95 ?? 0,
        wbcKmh: mphToKmh(avg),
      });
    }
    return result.sort((a, b) => b.wbcAvg - a.wbcAvg);
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">
        구속 비교: MLB vs WBC vs KBO(좌완)
      </h3>

      {/* Visual comparison bars */}
      <div className="space-y-4">
        {rows.map(row => {
          const color = PITCH_COLORS[row.code] ?? '#6b7280';
          // Scale: use KBO range, min = P50-10, max = P95+10
          const scaleMin = row.kboP50 - 10;
          const scaleMax = row.kboP95 + 10;
          const range = scaleMax - scaleMin;
          const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - scaleMin) / range) * 100));

          return (
            <div key={row.code}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold text-white">
                  {PITCH_NAMES_KR[row.code] ?? row.code}
                </span>
              </div>

              {/* Bar chart */}
              <div className="relative h-10 bg-slate-900 rounded-lg overflow-hidden">
                {/* KBO distribution zones */}
                <div
                  className="absolute top-0 h-full bg-slate-700/30"
                  style={{
                    left: `${toPercent(row.kboP50)}%`,
                    width: `${toPercent(row.kboP75) - toPercent(row.kboP50)}%`,
                  }}
                />
                <div
                  className="absolute top-0 h-full bg-slate-600/20"
                  style={{
                    left: `${toPercent(row.kboP75)}%`,
                    width: `${toPercent(row.kboP95) - toPercent(row.kboP75)}%`,
                  }}
                />

                {/* KBO P50 marker */}
                <div
                  className="absolute top-0 h-full w-px bg-slate-500"
                  style={{ left: `${toPercent(row.kboP50)}%` }}
                />
                {/* KBO P95 marker */}
                <div
                  className="absolute top-0 h-full w-px bg-yellow-600/60"
                  style={{ left: `${toPercent(row.kboP95)}%` }}
                />

                {/* MLB marker */}
                {row.mlbAvg && (
                  <div
                    className="absolute top-1 h-3 w-3 rounded-full border-2 border-white bg-slate-800"
                    style={{ left: `calc(${toPercent(mphToKmh(row.mlbAvg))}% - 6px)` }}
                    title={`MLB avg: ${row.mlbAvg}mph`}
                  />
                )}

                {/* WBC marker (main) */}
                <div
                  className="absolute bottom-1 h-4 w-4 rounded-full border-2 border-white"
                  style={{
                    left: `calc(${toPercent(row.wbcKmh)}% - 8px)`,
                    backgroundColor: color,
                  }}
                  title={`WBC avg: ${row.wbcAvg}mph`}
                />

                {/* Labels */}
                <div className="absolute top-0.5 right-2 text-[9px] text-slate-500">
                  KBO P50: {row.kboP50} | P95: {row.kboP95} km/h
                </div>
              </div>

              {/* Numbers */}
              <div className="flex gap-4 mt-1 text-[10px]">
                <span className="text-slate-400">
                  WBC: <span className="text-white font-bold">{row.wbcAvg}mph</span>
                  <span className="text-slate-500"> ({row.wbcKmh}km/h)</span>
                </span>
                {row.mlbAvg && (
                  <span className="text-slate-400">
                    MLB: <span className="text-slate-300">{row.mlbAvg}mph</span>
                    <span className="text-slate-500"> ({mphToKmh(row.mlbAvg)}km/h)</span>
                  </span>
                )}
                {row.mlbAvg && row.wbcAvg > row.mlbAvg && (
                  <span className="text-green-400">+{(row.wbcAvg - row.mlbAvg).toFixed(1)}mph</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-slate-700/50 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-white bg-slate-800 inline-block" />
          MLB 평균
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-white bg-blue-500 inline-block" />
          WBC 평균
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-slate-700/30 inline-block rounded" />
          KBO P50-P75
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-slate-600/20 inline-block rounded" />
          KBO P75-P95
        </span>
      </div>
    </div>
  );
}
