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

type Tab = 'profile' | 'arsenal' | 'location' | 'kbo';

const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: '프로필' },
  { id: 'arsenal', label: '구종분석' },
  { id: 'location', label: '로케이션' },
  { id: 'kbo', label: 'KBO 스케일' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('profile');

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">&#x1F1E6;&#x1F1FA;</span>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Jack O'Loughlin — Scouting Report
              </h1>
              <p className="text-[11px] text-slate-400">
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
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600'
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
              <h2 className="text-sm font-semibold text-slate-300">
                WBC 2026 투구 로케이션
                <span className="text-slate-500 font-normal ml-2">vs TPE | {WBC_PITCHES.length}구</span>
              </h2>
            </div>
            <PitchLocationChart pitches={WBC_PITCHES} />
            <PitchLegend pitches={WBC_PITCHES} />
            <TwoStrikeAnalysis pitches={WBC_PITCHES} />
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
      <footer className="text-center text-[10px] text-slate-600 py-4 border-t border-slate-800 max-w-5xl mx-auto">
        Data: MLB Stats API (Statcast) | pybaseball | KBO 2024 DB | Pitcher's perspective view
      </footer>
    </div>
  );
}
