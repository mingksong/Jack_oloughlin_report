import { MOVEMENT_PROFILE, PITCH_TO_KBO } from '../data/oloughlinScoutData';
import { PITCH_COLORS, PITCH_NAMES_KR } from '../utils/pitchColors';

const SVG_W = 320;
const SVG_H = 320;
const CENTER_X = SVG_W / 2;
const CENTER_Y = SVG_H / 2;
const SCALE = 8; // pixels per inch

function toSvgX(pfxX: number): number {
  return CENTER_X + pfxX * SCALE;
}

function toSvgY(pfxZ: number): number {
  return CENTER_Y - pfxZ * SCALE; // invert Y for SVG
}

function MovementChart() {
  const mlb = MOVEMENT_PROFILE.mlb;
  const kbo = MOVEMENT_PROFILE.kboLhp;
  const pitchCodes = Object.keys(mlb) as (keyof typeof mlb)[];

  return (
    <div className="flex flex-col items-center">
      <svg width={SVG_W} height={SVG_H} className="rounded-lg">
        <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="#f8fafc" rx={8} stroke="#e2e8f0" strokeWidth={1} />

        {/* Grid lines */}
        {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map(v => (
          <g key={`grid-${v}`}>
            <line
              x1={toSvgX(v)} y1={0} x2={toSvgX(v)} y2={SVG_H}
              stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 1.5 : 0.5}
            />
            <line
              x1={0} y1={toSvgY(v)} x2={SVG_W} y2={toSvgY(v)}
              stroke={v === 0 ? '#94a3b8' : '#e2e8f0'} strokeWidth={v === 0 ? 1.5 : 0.5}
            />
          </g>
        ))}

        {/* Axis labels */}
        <text x={SVG_W - 5} y={CENTER_Y - 5} textAnchor="end" fill="#94a3b8" fontSize={9}>Arm Side (in)</text>
        <text x={CENTER_X + 5} y={12} textAnchor="start" fill="#94a3b8" fontSize={9}>Rise (in)</text>
        <text x={CENTER_X + 5} y={SVG_H - 5} textAnchor="start" fill="#94a3b8" fontSize={9}>Drop</text>
        <text x={5} y={CENTER_Y - 5} textAnchor="start" fill="#94a3b8" fontSize={9}>Glove Side</text>

        {/* KBO LHP avg dots (grey, background) + std dev circles */}
        {pitchCodes.map(code => {
          const kboName = PITCH_TO_KBO[code];
          if (!kboName) return null;
          const kboData = kbo[kboName as keyof typeof kbo];
          if (!kboData) return null;

          return (
            <g key={`kbo-${code}`}>
              {/* Std dev ellipse */}
              <ellipse
                cx={toSvgX(kboData.pfxX)} cy={toSvgY(kboData.pfxZ)}
                rx={kboData.stdX * SCALE} ry={kboData.stdZ * SCALE}
                fill="#94a3b8" fillOpacity={0.08} stroke="#94a3b8" strokeWidth={0.5} strokeDasharray="3,3"
              />
              {/* KBO avg dot */}
              <circle
                cx={toSvgX(kboData.pfxX)} cy={toSvgY(kboData.pfxZ)}
                r={5} fill="#d1d5db" stroke="#9ca3af" strokeWidth={1}
              />
            </g>
          );
        })}

        {/* O'Loughlin MLB dots */}
        {pitchCodes.map(code => {
          const data = mlb[code];
          const color = PITCH_COLORS[code] ?? '#6b7280';
          return (
            <g key={`mlb-${code}`}>
              {/* Connector line from KBO avg to O'Loughlin */}
              {(() => {
                const kboName = PITCH_TO_KBO[code];
                if (!kboName) return null;
                const kboData = kbo[kboName as keyof typeof kbo];
                if (!kboData) return null;
                return (
                  <line
                    x1={toSvgX(kboData.pfxX)} y1={toSvgY(kboData.pfxZ)}
                    x2={toSvgX(data.pfxX)} y2={toSvgY(data.pfxZ)}
                    stroke={color} strokeWidth={1} strokeDasharray="4,3" opacity={0.5}
                  />
                );
              })()}
              {/* O'Loughlin dot */}
              <circle
                cx={toSvgX(data.pfxX)} cy={toSvgY(data.pfxZ)}
                r={8} fill={color} stroke="white" strokeWidth={2}
              />
              <text
                x={toSvgX(data.pfxX)} y={toSvgY(data.pfxZ) - 12}
                textAnchor="middle" fill={color} fontSize={9} fontWeight="bold"
              >
                {PITCH_NAMES_KR[code] ?? code}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-2 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow inline-block" />
          O'Loughlin (MLB)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-gray-300 border border-gray-400 inline-block" />
          KBO 좌완 avg
        </span>
        <span className="flex items-center gap-1">
          <span className="w-6 h-3 border border-dashed border-gray-400 rounded inline-block" />
          KBO ±1 SD
        </span>
      </div>
    </div>
  );
}

function MovementTable() {
  const mlb = MOVEMENT_PROFILE.mlb;
  const kbo = MOVEMENT_PROFILE.kboLhp;
  const codes = Object.keys(mlb) as (keyof typeof mlb)[];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-gray-400 border-b border-gray-200">
            <th className="text-left py-2 px-2">구종</th>
            <th className="text-center py-2 px-1" colSpan={2}>수평 무브먼트 (in)</th>
            <th className="text-center py-2 px-1" colSpan={2}>수직 무브먼트 (in)</th>
            <th className="text-center py-2 px-2">스핀</th>
            <th className="text-center py-2 px-2">KBO 대비</th>
          </tr>
          <tr className="text-[9px] text-gray-300 border-b border-gray-100">
            <th />
            <th className="text-center px-1">O'L</th>
            <th className="text-center px-1">KBO</th>
            <th className="text-center px-1">O'L</th>
            <th className="text-center px-1">KBO</th>
            <th className="text-center px-1">rpm</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {codes.map(code => {
            const m = mlb[code];
            const kboName = PITCH_TO_KBO[code];
            const k = kboName ? kbo[kboName as keyof typeof kbo] : null;
            const color = PITCH_COLORS[code] ?? '#6b7280';

            // Calculate how many SDs away from KBO avg
            let sdNote = '';
            if (k) {
              const xDiff = Math.abs(m.pfxX - k.pfxX);
              const zDiff = Math.abs(m.pfxZ - k.pfxZ);
              const xSd = k.stdX > 0 ? xDiff / k.stdX : 0;
              const zSd = k.stdZ > 0 ? zDiff / k.stdZ : 0;
              const maxSd = Math.max(xSd, zSd);
              if (maxSd >= 2) sdNote = 'Outlier';
              else if (maxSd >= 1.5) sdNote = 'Unique';
              else if (maxSd >= 1) sdNote = 'Different';
              else sdNote = 'Similar';
            }

            const noteColor = sdNote === 'Outlier' ? 'text-red-600' :
              sdNote === 'Unique' ? 'text-orange-600' :
              sdNote === 'Different' ? 'text-yellow-600' : 'text-green-600';

            return (
              <tr key={code} className="border-b border-gray-100">
                <td className="py-2 px-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {PITCH_NAMES_KR[code] ?? code}
                  </span>
                </td>
                <td className="text-center py-2 px-1 font-bold text-gray-900">{m.pfxX > 0 ? '+' : ''}{m.pfxX.toFixed(1)}</td>
                <td className="text-center py-2 px-1 text-gray-400">{k ? `${k.pfxX > 0 ? '+' : ''}${k.pfxX.toFixed(1)}` : '-'}</td>
                <td className="text-center py-2 px-1 font-bold text-gray-900">{m.pfxZ > 0 ? '+' : ''}{m.pfxZ.toFixed(1)}</td>
                <td className="text-center py-2 px-1 text-gray-400">{k ? `${k.pfxZ > 0 ? '+' : ''}${k.pfxZ.toFixed(1)}` : '-'}</td>
                <td className="text-center py-2 px-2 text-gray-600">{m.spin.toLocaleString()}</td>
                <td className={`text-center py-2 px-2 font-semibold text-[10px] ${noteColor}`}>{sdNote}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MovementInsights() {
  const mlb = MOVEMENT_PROFILE.mlb;
  const kbo = MOVEMENT_PROFILE.kboLhp;

  const ffVbDiff = mlb.FF.pfxZ - kbo['직구'].pfxZ;
  const ffHbDiff = mlb.FF.pfxX - kbo['직구'].pfxX;
  const chArmDiff = mlb.CH.pfxX - kbo['체인지업'].pfxX;

  const insights = [
    {
      title: '직구: 수직 무브먼트 상위',
      desc: `유도 수직 변화 ${mlb.FF.pfxZ.toFixed(1)}in (KBO 좌완 avg ${kbo['직구'].pfxZ.toFixed(1)}in 대비 +${ffVbDiff.toFixed(1)}in). 높은 릴리스 + 강한 백스핀 조합으로 떠오르는 직구 효과.`,
      type: 'strength' as const,
    },
    {
      title: '직구: 수평 런 역시 상위',
      desc: `Arm-side run ${mlb.FF.pfxX.toFixed(1)}in (KBO avg ${kbo['직구'].pfxX.toFixed(1)}in 대비 +${ffHbDiff.toFixed(1)}in). 좌타자 몸쪽 테일링 패스트볼 효과적.`,
      type: 'strength' as const,
    },
    {
      title: '체인지업: 직구 미러링 우수',
      desc: `Arm-side fade ${mlb.CH.pfxX.toFixed(1)}in으로 직구(${mlb.FF.pfxX.toFixed(1)}in)와 유사한 수평 궤적 + 속도차로 타자 기만. KBO 좌완 대비 +${chArmDiff.toFixed(1)}in.`,
      type: 'strength' as const,
    },
    {
      title: '커브: KBO와 유사 프로파일',
      desc: `수직 드롭 ${mlb.CU.pfxZ.toFixed(1)}in, 글러브 사이드 ${mlb.CU.pfxX.toFixed(1)}in. KBO 좌완과 큰 차이 없으나 MLB 경험 부족으로 커맨드 불안정.`,
      type: 'neutral' as const,
    },
  ];

  return (
    <div className="space-y-2">
      <h4 className="text-xs text-gray-500 font-medium mb-2">무브먼트 인사이트</h4>
      {insights.map((ins, i) => {
        const borderColor = ins.type === 'strength' ? 'border-green-200 bg-green-50/50' :
          ins.type === 'neutral' ? 'border-gray-200 bg-gray-50/50' : 'border-red-200 bg-red-50/50';
        const icon = ins.type === 'strength' ? '+' : ins.type === 'neutral' ? '=' : '-';
        const iconColor = ins.type === 'strength' ? 'text-green-500' : ins.type === 'neutral' ? 'text-gray-400' : 'text-red-500';

        return (
          <div key={i} className={`rounded-lg p-3 border ${borderColor}`}>
            <div className="flex items-start gap-2">
              <span className={`font-bold text-sm flex-shrink-0 ${iconColor}`}>{icon}</span>
              <div>
                <span className="text-xs font-semibold text-gray-800">{ins.title}</span>
                <p className="text-[10px] text-gray-500 mt-0.5">{ins.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function MovementProfile() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          무브먼트 프로파일
          <span className="text-gray-400 font-normal ml-2">(MLB Statcast vs KBO 좌완)</span>
        </h3>
        <p className="text-[10px] text-gray-400 mb-4">
          Induced movement in inches. 점선 원 = KBO 좌완 ±1 표준편차.
        </p>
        <MovementChart />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">구종별 무브먼트 비교</h3>
        <MovementTable />
      </div>

      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <MovementInsights />
      </div>
    </div>
  );
}
