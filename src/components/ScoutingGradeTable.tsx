import { SCOUTING_GRADES } from '../data/oloughlinScoutData';
import { PITCH_COLORS } from '../utils/pitchColors';

function GradeBar({ grade }: { grade: number }) {
  const pct = ((grade - 20) / 60) * 100;
  const color =
    grade >= 70 ? '#ef4444' :
    grade >= 60 ? '#f97316' :
    grade >= 55 ? '#eab308' :
    grade >= 50 ? '#22c55e' :
    grade >= 45 ? '#60a5fa' : '#94a3b8';

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden relative">
        {/* Scale markers */}
        {[30, 40, 50, 60, 70].map(g => (
          <div
            key={g}
            className="absolute top-0 h-full w-px bg-gray-200"
            style={{ left: `${((g - 20) / 60) * 100}%` }}
          />
        ))}
        <div
          className="h-full rounded-full flex items-center justify-end pr-1"
          style={{ width: `${pct}%`, backgroundColor: color }}
        >
          <span className="text-[10px] font-bold text-white drop-shadow">{grade}</span>
        </div>
      </div>
    </div>
  );
}

export default function ScoutingGradeTable() {
  const { pitches, overall } = SCOUTING_GRADES;

  return (
    <div className="space-y-6">
      {/* Grade Table */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          20-80 스카우팅 등급
        </h3>

        <div className="space-y-3">
          {pitches.map(p => (
            <div key={p.code}>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: PITCH_COLORS[p.code] ?? '#6b7280' }}
                />
                <span className="text-xs font-semibold text-gray-900 w-28">{p.name}</span>
                <span className="text-[10px] text-gray-400 flex-shrink-0">{p.label}</span>
              </div>
              <GradeBar grade={p.grade} />
              <p className="text-[10px] text-gray-500 mt-0.5 ml-5">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Grade Scale Legend */}
        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100 text-[9px] text-gray-400 px-0">
          <span>20</span>
          <span>30</span>
          <span>40</span>
          <span>50 (Avg)</span>
          <span>60</span>
          <span>70</span>
          <span>80</span>
        </div>
      </div>

      {/* Role Assessment */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">투수 평가</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <span className="text-[10px] text-gray-400 block mb-1">예상 역할</span>
            <span className="text-sm font-bold text-blue-700">{overall.role}</span>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
            <span className="text-[10px] text-gray-400 block mb-1">성장 상한</span>
            <span className="text-sm font-bold text-amber-700">{overall.ceiling}</span>
          </div>
        </div>
      </div>

      {/* Strengths / Weaknesses / Risks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
          <h4 className="text-xs font-semibold text-green-700 mb-2">강점</h4>
          <ul className="space-y-1.5">
            {overall.strengths.map((s, i) => (
              <li key={i} className="text-[11px] text-gray-600 flex gap-1.5">
                <span className="text-green-500 flex-shrink-0">+</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
          <h4 className="text-xs font-semibold text-yellow-700 mb-2">약점</h4>
          <ul className="space-y-1.5">
            {overall.weaknesses.map((w, i) => (
              <li key={i} className="text-[11px] text-gray-600 flex gap-1.5">
                <span className="text-yellow-500 flex-shrink-0">-</span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <h4 className="text-xs font-semibold text-red-700 mb-2">리스크</h4>
          <ul className="space-y-1.5">
            {overall.risks.map((r, i) => (
              <li key={i} className="text-[11px] text-gray-600 flex gap-1.5">
                <span className="text-red-500 flex-shrink-0">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
