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
  mlbKmh: number | null;
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
        mlbKmh: mlbData ? mphToKmh(mlbData.avgSpeed) : null,
      });
    }
    return result.sort((a, b) => b.wbcAvg - a.wbcAvg);
  }, []);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        구속 비교: MLB vs WBC vs KBO(좌완)
      </h3>

      {/* Visual comparison bars */}
      <div className="space-y-4">
        {rows.map(row => {
          const color = PITCH_COLORS[row.code] ?? '#6b7280';
          const scaleMin = row.kboP50 - 10;
          const scaleMax = row.kboP95 + 10;
          const range = scaleMax - scaleMin;
          const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - scaleMin) / range) * 100));

          return (
            <div key={row.code}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-xs font-semibold text-gray-900">
                  {PITCH_NAMES_KR[row.code] ?? row.code}
                </span>
              </div>

              {/* Bar chart */}
              <div className="relative h-10 bg-gray-100 rounded-lg overflow-hidden">
                {/* KBO distribution zones */}
                <div
                  className="absolute top-0 h-full bg-gray-200/60"
                  style={{
                    left: `${toPercent(row.kboP50)}%`,
                    width: `${toPercent(row.kboP75) - toPercent(row.kboP50)}%`,
                  }}
                />
                <div
                  className="absolute top-0 h-full bg-gray-300/40"
                  style={{
                    left: `${toPercent(row.kboP75)}%`,
                    width: `${toPercent(row.kboP95) - toPercent(row.kboP75)}%`,
                  }}
                />

                {/* KBO P50 marker */}
                <div
                  className="absolute top-0 h-full w-px bg-gray-400"
                  style={{ left: `${toPercent(row.kboP50)}%` }}
                />
                {/* KBO P95 marker */}
                <div
                  className="absolute top-0 h-full w-px bg-orange-400/60"
                  style={{ left: `${toPercent(row.kboP95)}%` }}
                />

                {/* MLB marker */}
                {row.mlbKmh && (
                  <div
                    className="absolute top-1 h-3 w-3 rounded-full border-2 border-gray-500 bg-white"
                    style={{ left: `calc(${toPercent(row.mlbKmh)}% - 6px)` }}
                    title={`MLB avg: ${row.mlbKmh}km/h`}
                  />
                )}

                {/* WBC marker (main) */}
                <div
                  className="absolute bottom-1 h-4 w-4 rounded-full border-2 border-white shadow"
                  style={{
                    left: `calc(${toPercent(row.wbcKmh)}% - 8px)`,
                    backgroundColor: color,
                  }}
                  title={`WBC avg: ${row.wbcKmh}km/h`}
                />

                {/* Labels */}
                <div className="absolute top-0.5 right-2 text-[9px] text-gray-400">
                  KBO P50: {row.kboP50} | P95: {row.kboP95} km/h
                </div>
              </div>

              {/* Numbers */}
              <div className="flex gap-4 mt-1 text-[10px]">
                <span className="text-gray-500">
                  WBC: <span className="text-gray-900 font-bold">{row.wbcKmh}km/h</span>
                  <span className="text-gray-400"> ({row.wbcAvg}mph)</span>
                </span>
                {row.mlbKmh && (
                  <span className="text-gray-500">
                    MLB: <span className="text-gray-700">{row.mlbKmh}km/h</span>
                    <span className="text-gray-400"> ({row.mlbAvg}mph)</span>
                  </span>
                )}
                {row.mlbAvg && row.wbcAvg > row.mlbAvg && (
                  <span className="text-green-600">+{mphToKmh(row.wbcAvg - row.mlbAvg)}km/h</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-gray-500 bg-white inline-block" />
          MLB 평균
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full border-2 border-white bg-blue-500 inline-block shadow" />
          WBC 평균
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-gray-200/60 inline-block rounded" />
          KBO P50-P75
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-4 bg-gray-300/40 inline-block rounded" />
          KBO P75-P95
        </span>
      </div>
    </div>
  );
}
