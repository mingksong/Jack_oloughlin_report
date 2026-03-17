import { useMemo } from 'react';
import { WBC_PITCHES, KBO_VELOCITY_DIST, mphToKmh, kboPercentile, PITCH_TO_KBO } from '../data/oloughlinScoutData';
import { PITCH_COLORS, PITCH_NAMES_KR } from '../utils/pitchColors';

interface PctRow {
  code: string;
  avgMph: number;
  avgKmh: number;
  maxMph: number;
  maxKmh: number;
  kboAllPct: number;
  kboLhpPct: number;
}

function PercentileGauge({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-500 w-10 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-slate-900 rounded-full overflow-hidden relative">
        {/* Zone markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-slate-700/50" />
          <div className="w-1/4 border-r border-slate-700/50" />
          <div className="w-1/4 border-r border-slate-700/50" />
          <div className="w-1/4" />
        </div>
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            opacity: 0.9,
          }}
        >
          <span className="text-[10px] font-bold text-white drop-shadow">
            {value}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function KBOScaleChart() {
  const rows = useMemo(() => {
    const wbcMap = new Map<string, number[]>();
    for (const p of WBC_PITCHES) {
      if (!wbcMap.has(p.pitchCode)) wbcMap.set(p.pitchCode, []);
      wbcMap.get(p.pitchCode)!.push(p.speed);
    }

    const result: PctRow[] = [];
    for (const [code, speeds] of wbcMap) {
      const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const max = Math.max(...speeds);
      const avgKmh = mphToKmh(avg);
      const maxKmh = mphToKmh(max);
      const kboName = PITCH_TO_KBO[code];

      let kboAllPct = 0;
      let kboLhpPct = 0;
      if (kboName) {
        const allDist = KBO_VELOCITY_DIST.all[kboName as keyof typeof KBO_VELOCITY_DIST.all];
        const lhpDist = KBO_VELOCITY_DIST.lhp[kboName as keyof typeof KBO_VELOCITY_DIST.lhp];
        if (allDist) kboAllPct = kboPercentile(avgKmh, allDist);
        if (lhpDist) kboLhpPct = kboPercentile(avgKmh, lhpDist);
      }

      result.push({
        code,
        avgMph: Math.round(avg * 10) / 10,
        avgKmh,
        maxMph: max,
        maxKmh,
        kboAllPct,
        kboLhpPct,
      });
    }
    return result.sort((a, b) => b.avgMph - a.avgMph);
  }, []);

  return (
    <div className="space-y-6">
      {/* Percentile Gauges */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">
          KBO 퍼센타일 비교 (평균 구속 기준)
        </h3>
        <p className="text-[10px] text-slate-500 mb-4">
          O'Loughlin WBC 구속을 2024 KBO 리그 구속 분포와 비교
        </p>

        <div className="space-y-4">
          {rows.map(row => {
            const color = PITCH_COLORS[row.code] ?? '#6b7280';
            return (
              <div key={row.code}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold text-white">
                    {PITCH_NAMES_KR[row.code] ?? row.code}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">
                    {row.avgMph}mph = {row.avgKmh}km/h
                  </span>
                </div>
                <div className="space-y-1">
                  <PercentileGauge value={row.kboAllPct} label="전체" color={color} />
                  <PercentileGauge value={row.kboLhpPct} label="좌완" color={color} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Percentile scale */}
        <div className="flex justify-between mt-3 text-[9px] text-slate-600 px-12">
          <span>P25</span>
          <span>P50</span>
          <span>P75</span>
          <span>P100</span>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">구종별 KBO 스케일 요약</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="text-left py-2 px-2">구종</th>
                <th className="text-center py-2 px-2">WBC 평균</th>
                <th className="text-center py-2 px-2">WBC 최고</th>
                <th className="text-center py-2 px-2">KBO 전체 %ile</th>
                <th className="text-center py-2 px-2">KBO 좌완 %ile</th>
                <th className="text-center py-2 px-2">등급</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const color = PITCH_COLORS[row.code] ?? '#6b7280';
                const grade = row.kboLhpPct >= 95 ? 'Elite' :
                  row.kboLhpPct >= 80 ? 'Plus' :
                  row.kboLhpPct >= 60 ? 'Above Avg' :
                  row.kboLhpPct >= 40 ? 'Average' : 'Below Avg';
                const gradeColor = row.kboLhpPct >= 95 ? 'text-red-400' :
                  row.kboLhpPct >= 80 ? 'text-orange-400' :
                  row.kboLhpPct >= 60 ? 'text-yellow-400' :
                  row.kboLhpPct >= 40 ? 'text-green-400' : 'text-slate-400';

                return (
                  <tr key={row.code} className="border-b border-slate-700/50">
                    <td className="py-2 px-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {PITCH_NAMES_KR[row.code] ?? row.code}
                      </span>
                    </td>
                    <td className="text-center py-2 px-2 text-slate-300">
                      {row.avgKmh} km/h
                    </td>
                    <td className="text-center py-2 px-2 text-slate-300">
                      {row.maxKmh} km/h
                    </td>
                    <td className="text-center py-2 px-2">
                      <span className="font-bold text-white">{row.kboAllPct}</span>
                    </td>
                    <td className="text-center py-2 px-2">
                      <span className="font-bold text-white">{row.kboLhpPct}</span>
                    </td>
                    <td className={`text-center py-2 px-2 font-semibold ${gradeColor}`}>
                      {grade}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
