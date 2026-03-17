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
      <span className="text-[10px] text-gray-400 w-10 text-right flex-shrink-0">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
        {/* Zone markers */}
        <div className="absolute inset-0 flex">
          <div className="w-1/4 border-r border-gray-200" />
          <div className="w-1/4 border-r border-gray-200" />
          <div className="w-1/4 border-r border-gray-200" />
          <div className="w-1/4" />
        </div>
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1.5"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            opacity: 0.85,
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
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          KBO 구속 퍼센타일 비교
        </h3>
        <p className="text-[10px] text-gray-400 mb-4">
          구속(Velocity)만을 기준으로 한 퍼센타일. 무브먼트·커맨드 등 구종의 전체 퀄리티와는 별개 지표입니다.
        </p>

        <div className="space-y-4">
          {rows.map(row => {
            const color = PITCH_COLORS[row.code] ?? '#6b7280';
            return (
              <div key={row.code}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs font-semibold text-gray-900">
                    {PITCH_NAMES_KR[row.code] ?? row.code}
                  </span>
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {row.avgKmh}km/h ({row.avgMph}mph)
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
        <div className="flex justify-between mt-3 text-[9px] text-gray-400 px-12">
          <span>P25</span>
          <span>P50</span>
          <span>P75</span>
          <span>P100</span>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">구종별 KBO 구속 스케일 요약</h3>
        <p className="text-[10px] text-gray-400 mb-3">
          본 퍼센타일은 구속(km/h) 기준이며, 구종의 무브먼트·변화량·커맨드를 포함하지 않습니다.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200">
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
                const gradeColor = row.kboLhpPct >= 95 ? 'text-red-600' :
                  row.kboLhpPct >= 80 ? 'text-orange-600' :
                  row.kboLhpPct >= 60 ? 'text-yellow-600' :
                  row.kboLhpPct >= 40 ? 'text-green-600' : 'text-gray-500';

                return (
                  <tr key={row.code} className="border-b border-gray-100">
                    <td className="py-2 px-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        {PITCH_NAMES_KR[row.code] ?? row.code}
                      </span>
                    </td>
                    <td className="text-center py-2 px-2 text-gray-700">
                      {row.avgKmh} km/h
                    </td>
                    <td className="text-center py-2 px-2 text-gray-700">
                      {row.maxKmh} km/h
                    </td>
                    <td className="text-center py-2 px-2">
                      <span className="font-bold text-gray-900">{row.kboAllPct}</span>
                    </td>
                    <td className="text-center py-2 px-2">
                      <span className="font-bold text-gray-900">{row.kboLhpPct}</span>
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
