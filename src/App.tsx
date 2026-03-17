import { useState } from 'react';
import { WBC_PITCHES } from './data/oloughlinScoutData';
import ProfileCard from './components/ProfileCard';
import PitchArsenalCards from './components/PitchArsenalCards';
import VelocityComparison from './components/VelocityComparison';
import PitchLocationChart from './components/PitchLocationChart';
import PitchLegend from './components/PitchLegend';
import TwoStrikeAnalysis from './components/TwoStrikeAnalysis';
import KBOScaleChart from './components/KBOScaleChart';
import ScoutingGradeTable from './components/ScoutingGradeTable';
import ReleasePointAnalysis from './components/ReleasePointAnalysis';
import MovementProfile from './components/MovementProfile';
import ComparablePitchers from './components/ComparablePitchers';

type Tab = 'profile' | 'arsenal' | 'location' | 'movement' | 'kbo';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: '프로필' },
  { id: 'arsenal', label: '구종분석' },
  { id: 'location', label: '로케이션' },
  { id: 'movement', label: '무브먼트' },
  { id: 'kbo', label: 'KBO 스케일' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">&#x1F1E6;&#x1F1FA;</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                Jack O'Loughlin — Scouting Report
              </h1>
              <p className="text-[11px] text-gray-500">
                LHP | 6'5" / 223 lbs | Colorado Rockies org | WBC 2026 Pool C
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex gap-0 -mb-px">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'profile' && <ProfileCard />}

        {tab === 'arsenal' && (
          <div className="space-y-6">
            <PitchArsenalCards />
            <VelocityComparison />
          </div>
        )}

        {tab === 'location' && (
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-sm font-semibold text-gray-700">
                WBC 2026 투구 로케이션
                <span className="text-gray-400 font-normal ml-2">vs TPE | {WBC_PITCHES.length}구</span>
              </h2>
            </div>
            <PitchLocationChart pitches={WBC_PITCHES} />
            <PitchLegend pitches={WBC_PITCHES} />
            <TwoStrikeAnalysis pitches={WBC_PITCHES} />
          </div>
        )}

        {tab === 'movement' && (
          <div className="space-y-6">
            <MovementProfile />
            <ReleasePointAnalysis />
            <ComparablePitchers />
          </div>
        )}

        {tab === 'kbo' && (
          <div className="space-y-6">
            <KBOScaleChart />
            <ScoutingGradeTable />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-gray-400 py-4 border-t border-gray-200 max-w-5xl mx-auto">
        Data: MLB Stats API (Statcast) | pybaseball | KBO 2024 DB | Pitcher's perspective view
      </footer>
    </div>
  );
}
