import { PROFILE } from '../data/oloughlinScoutData';

export default function ProfileCard() {
  return (
    <div className="space-y-6">
      {/* Basic Info Card */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Left: Identity */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl">&#x1F1E6;&#x1F1FA;</span>
              <div>
                <h2 className="text-xl font-bold text-white">{PROFILE.name}</h2>
                <p className="text-sm text-slate-400">{PROFILE.nameKr} | #{PROFILE.number}</p>
              </div>
            </div>
            <p className="text-sm text-blue-400 mt-2 leading-relaxed">{PROFILE.oneLiner}</p>
          </div>
          {/* Right: Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs sm:w-64">
            {[
              ['포지션', PROFILE.position],
              ['투/타', `${PROFILE.throwHand}/${PROFILE.batHand}`],
              ['생년월일', '2000.03.14 (26세)'],
              ['출생지', PROFILE.birthPlace],
              ['신장/체중', `${PROFILE.height} / ${PROFILE.weight}`],
              ['소속', PROFILE.team],
            ].map(([label, value]) => (
              <div key={label} className="bg-slate-900/50 rounded px-2 py-1.5">
                <span className="text-slate-500 block">{label}</span>
                <span className="text-slate-200 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Form */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">최근 성적</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{PROFILE.recentForm}</p>
      </div>

      {/* Career Timeline */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">커리어 타임라인</h3>
        <div className="relative">
          <div className="absolute left-[52px] top-0 bottom-0 w-px bg-slate-700" />
          <div className="space-y-3">
            {PROFILE.timeline.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[10px] text-slate-500 w-12 text-right flex-shrink-0 pt-0.5">
                  {item.year}
                </span>
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 relative z-10" />
                <span className="text-xs text-slate-300">{item.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-300 mb-3">주요 에피소드</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PROFILE.episodes.map((ep, i) => (
            <div key={i} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
              <h4 className="text-xs font-semibold text-blue-400 mb-1">{ep.title}</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ep.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
