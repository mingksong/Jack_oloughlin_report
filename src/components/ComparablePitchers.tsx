import { RELEASE_POINT, KBO_COMPARABLE_PITCHERS, MOVEMENT_PROFILE } from '../data/oloughlinScoutData';

const BAR_MAX_W = 120;

function Z0ComparisonChart() {
  const olZ0 = RELEASE_POINT.releaseZ;
  const all = [
    { name: "O'Loughlin", z0: olZ0, isOl: true },
    ...KBO_COMPARABLE_PITCHERS.map(p => ({ name: `${p.name} (${p.team})`, z0: p.releaseZ, isOl: false })),
  ];
  const minZ0 = Math.min(...all.map(a => a.z0)) - 0.05;
  const maxZ0 = Math.max(...all.map(a => a.z0)) + 0.05;
  const range = maxZ0 - minZ0;

  return (
    <div className="space-y-1.5">
      <h4 className="text-xs text-gray-500 font-medium mb-2">릴리스 높이(z0) 비교</h4>
      {all.map((item, i) => {
        const pct = ((item.z0 - minZ0) / range) * 100;
        return (
          <div key={i} className="flex items-center gap-2">
            <span className={`text-[10px] w-28 text-right flex-shrink-0 ${item.isOl ? 'font-bold text-blue-700' : 'text-gray-600'}`}>
              {item.name}
            </span>
            <div className="flex-1 h-5 bg-gray-100 rounded-full relative overflow-hidden" style={{ maxWidth: BAR_MAX_W }}>
              <div
                className={`h-full rounded-full ${item.isOl ? 'bg-blue-500' : 'bg-gray-400'}`}
                style={{ width: `${pct}%`, minWidth: 2 }}
              />
            </div>
            <span className={`text-[10px] w-12 ${item.isOl ? 'font-bold text-blue-700' : 'text-gray-500'}`}>
              {item.z0.toFixed(3)}ft
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MovementComparisonTable() {
  const mlb = MOVEMENT_PROFILE.mlb;
  const olFF = mlb.FF;

  return (
    <div className="overflow-x-auto">
      <h4 className="text-xs text-gray-500 font-medium mb-2">주요 구종 무브먼트 비교 (inches)</h4>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="text-gray-400 border-b border-gray-200">
            <th className="text-left py-1.5 px-2">투수</th>
            <th className="text-center py-1.5 px-1">주구종</th>
            <th className="text-center py-1.5 px-1">구속</th>
            <th className="text-center py-1.5 px-1">수평(in)</th>
            <th className="text-center py-1.5 px-1">수직(in)</th>
            <th className="text-center py-1.5 px-1">z0 차이</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-blue-100 bg-blue-50/50">
            <td className="py-1.5 px-2 font-bold text-blue-700">O'Loughlin</td>
            <td className="text-center py-1.5 px-1">FF</td>
            <td className="text-center py-1.5 px-1">147.8km/h</td>
            <td className="text-center py-1.5 px-1 font-semibold">+{olFF.pfxX.toFixed(1)}</td>
            <td className="text-center py-1.5 px-1 font-semibold">+{olFF.pfxZ.toFixed(1)}</td>
            <td className="text-center py-1.5 px-1">-</td>
          </tr>
          {KBO_COMPARABLE_PITCHERS.map((p, i) => {
            const mainPitch = p.pitchTypes[0];
            return (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1.5 px-2 text-gray-700">{p.name} ({p.team})</td>
                <td className="text-center py-1.5 px-1">{mainPitch.type}</td>
                <td className="text-center py-1.5 px-1">{mainPitch.speed}km/h</td>
                <td className="text-center py-1.5 px-1">+{mainPitch.pfxX.toFixed(1)}</td>
                <td className="text-center py-1.5 px-1">+{mainPitch.pfxZ.toFixed(1)}</td>
                <td className="text-center py-1.5 px-1 text-gray-400">{p.z0Diff.toFixed(3)}ft</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PitcherCard({ pitcher }: { pitcher: typeof KBO_COMPARABLE_PITCHERS[number] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">{pitcher.name}</span>
          <span className="text-[10px] text-gray-400 ml-1.5">{pitcher.team} | {pitcher.height}</span>
        </div>
        <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          z0: {pitcher.releaseZ.toFixed(3)}ft ({'\u0394'}{pitcher.z0Diff.toFixed(3)})
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pitcher.pitchTypes.map((pt, i) => (
          <span key={i} className="text-[9px] bg-white border border-gray-200 rounded px-1.5 py-0.5">
            {pt.type} {pt.speed}km/h
            <span className="text-gray-400 ml-1">({pt.count}구)</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ComparablePitchers() {
  const rp = RELEASE_POINT;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          KBO 유사 릴리스 포인트 좌완 투수
        </h3>
        <p className="text-[10px] text-gray-400 mb-4">
          O'Loughlin: 릴리스 {rp.releaseZ}ft / 익스텐션 {rp.extension}ft — z0 기준 가장 유사한 KBO 좌완 5명 비교.
          <b className="text-gray-500"> KBO 데이터는 trajectory 원시 데이터 기반 추정치.</b>
        </p>

        <div className="space-y-3 mb-5">
          {KBO_COMPARABLE_PITCHERS.map((p, i) => (
            <PitcherCard key={i} pitcher={p} />
          ))}
        </div>

        <Z0ComparisonChart />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <MovementComparisonTable />
        <p className="text-[9px] text-gray-400 mt-3">
          * KBO 무브먼트(pfx)는 trajectory 원시 데이터(ax, az, vy0)에서 <b>추정 계산</b>한 수치입니다.
          O'Loughlin 데이터는 MLB Statcast 기반 실측치.
        </p>
      </div>
    </div>
  );
}
