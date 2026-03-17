import { RELEASE_POINT, MOVEMENT_PROFILE } from '../data/oloughlinScoutData';

function StatBox({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <span className="text-[10px] text-gray-400 block mb-0.5">{label}</span>
      <span className={`text-lg font-bold ${highlight ? 'text-blue-700' : 'text-gray-900'}`}>{value}</span>
      {sub && <span className="text-[10px] text-gray-400 block mt-0.5">{sub}</span>}
    </div>
  );
}

function HeightRatioGauge() {
  const { heightRatio } = RELEASE_POINT;
  const mlbLhpAvgLow = 0.85;
  const mlbLhpAvgHigh = 0.88;
  const scaleMin = 0.80;
  const scaleMax = 0.95;
  const range = scaleMax - scaleMin;
  const toPercent = (v: number) => ((v - scaleMin) / range) * 100;

  return (
    <div>
      <h4 className="text-xs text-gray-500 font-medium mb-2">릴리스 높이 비율 (Release Z / Height)</h4>
      <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
        {/* MLB LHP avg zone */}
        <div
          className="absolute top-0 h-full bg-gray-200/70"
          style={{
            left: `${toPercent(mlbLhpAvgLow)}%`,
            width: `${toPercent(mlbLhpAvgHigh) - toPercent(mlbLhpAvgLow)}%`,
          }}
        />
        <div
          className="absolute top-1 text-[8px] text-gray-400"
          style={{ left: `${toPercent((mlbLhpAvgLow + mlbLhpAvgHigh) / 2)}%`, transform: 'translateX(-50%)' }}
        >
          MLB LHP avg
        </div>

        {/* O'Loughlin marker */}
        <div
          className="absolute bottom-1 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow flex items-center justify-center"
          style={{ left: `calc(${toPercent(heightRatio)}% - 10px)` }}
        >
          <span className="text-[7px] font-bold text-white">JO</span>
        </div>
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-gray-400 px-1">
        <span>{scaleMin}</span>
        <span>0.85</span>
        <span>0.90</span>
        <span>{scaleMax}</span>
      </div>
      <p className="text-[10px] text-gray-500 mt-2">
        O'Loughlin의 릴리스 높이 비율 <span className="font-bold text-blue-700">{heightRatio}</span>은
        MLB 좌완 평균(0.85-0.88) 대비 상위 수준. 6'5" 장신 + 높은 릴리스 포인트 조합으로
        타자가 체감하는 수직 각도가 급격함.
      </p>
    </div>
  );
}

function ExtensionComparison() {
  const { extension } = RELEASE_POINT;
  const kboAvgExt = MOVEMENT_PROFILE.kboLhpRelease.avgExtension;

  return (
    <div>
      <h4 className="text-xs text-gray-500 font-medium mb-2">릴리스 익스텐션</h4>
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <div className="flex items-end gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1">O'Loughlin</span>
              <div
                className="w-12 bg-blue-500 rounded-t"
                style={{ height: `${(extension / 7) * 100}px` }}
              />
              <span className="text-xs font-bold text-blue-700 mt-1">{extension}ft</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1">KBO 좌완 avg</span>
              <div
                className="w-12 bg-gray-300 rounded-t"
                style={{ height: `${(kboAvgExt / 7) * 100}px` }}
              />
              <span className="text-xs font-bold text-gray-600 mt-1">{kboAvgExt}ft</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] text-gray-500 max-w-[200px]">
          <span className="text-blue-600 font-bold">+{(extension - kboAvgExt).toFixed(1)}ft</span> 더 긴 익스텐션.
          타자 체감 구속 상승 효과 (약 1-2mph 체감 증가).
        </div>
      </div>
    </div>
  );
}

export default function ReleasePointAnalysis() {
  const rp = RELEASE_POINT;
  const kboRel = MOVEMENT_PROFILE.kboLhpRelease;

  return (
    <div className="space-y-6">
      {/* Core stats */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          릴리스 포인트 분석
          <span className="text-gray-400 font-normal ml-2">(MLB 2024 Statcast)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatBox label="릴리스 높이" value={`${rp.releaseZ}ft`} sub={`KBO 좌완 avg: ${kboRel.avgReleaseZ}ft`} highlight />
          <StatBox label="수평 릴리스" value={`${rp.releaseX}ft`} sub="1B 방향 (좌완 특성)" />
          <StatBox label="익스텐션" value={`${rp.extension}ft`} sub={`KBO 좌완 avg: ~${kboRel.avgExtension}ft`} highlight />
          <StatBox label="팔 각도" value={`${rp.armAngle}°`} sub="3/4 arm slot" />
        </div>

        <HeightRatioGauge />
      </div>

      {/* Extension comparison */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <ExtensionComparison />
      </div>
    </div>
  );
}
