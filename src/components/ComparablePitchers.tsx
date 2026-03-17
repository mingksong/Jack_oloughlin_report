import { KBO_COMPARABLE_PITCHERS } from '../data/oloughlinScoutData';

function PitcherCard({ pitcher }: { pitcher: typeof KBO_COMPARABLE_PITCHERS[number] }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-xs font-bold text-gray-900">{pitcher.name}</span>
          <span className="text-[10px] text-gray-400 ml-1.5">{pitcher.team} | {pitcher.height}</span>
        </div>
        <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          {pitcher.seasons} | {pitcher.pitchCount}구
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
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          KBO 유사 좌완 투수
        </h3>
        <p className="text-[10px] text-gray-400 mb-4">
          릴리스 높이(z0) 기준 가장 유사한 KBO 좌완 5명.
          <b className="text-gray-500"> KBO 데이터는 trajectory 원시 데이터 기반 추정치.</b>
        </p>

        <div className="space-y-3">
          {KBO_COMPARABLE_PITCHERS.map((p, i) => (
            <PitcherCard key={i} pitcher={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
