import { useState, useMemo } from 'react';
import { Analytics } from '@vercel/analytics/react';
import players2024 from './data/players_2024.json';
import players2025 from './data/players_2025.json';
import players2026 from './data/players_2026.json';
import { computeIndex, filterPlayers, getTeams } from './utils/scoring';
import Header      from './components/Header';
import FilterBar   from './components/FilterBar';
import PlayerCard  from './components/PlayerCard';
import BubbleChart from './components/BubbleChart';
import Methodology from './components/Methodology';
import Highlights  from './components/Highlights';

const SEASONS = {
  2024: { players: computeIndex(players2024), status: 'complete' },
  2025: { players: computeIndex(players2025), status: 'complete' },
  2026: { players: computeIndex(players2026), status: 'in_progress' },
};

const DEFAULT_FILTERS = { role: 'All', team: 'All', search: '', sort: 'score' };

export default function App() {
  const [season, setSeason] = useState(2024);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('cards');

  const { players: allPlayers } = SEASONS[season];
  const teams = useMemo(() => getTeams(allPlayers), [allPlayers]);

  const handleSeason = (s) => { setSeason(s); setFilters(DEFAULT_FILTERS);window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleFilter = (patch) => setFilters(f => ({ ...f, ...patch }));

  const filtered = useMemo(() => filterPlayers(allPlayers, filters), [allPlayers, filters]);

  return (
    <div className="app">
      <Analytics />
      <Header season={season} onSeason={handleSeason} />

      <main className="main">
        {season === 2026 && (
          <div className="live-banner">
            <span>⚡</span>
            <span>
              <strong>IPL 2026 is live — started 28 March.</strong> Cards show predicted value tiers
              based on averaged 2024 + 2025 form vs the 2026 auction price. The wider the confidence band,
              the less prior data we have. Actuals unlock once the season ends in May.
            </span>
          </div>
        )}

        <Methodology season={season} />

        {season !== 2026 && <Highlights players={allPlayers} season={season} />}

        <div className="controls">
          <FilterBar teams={teams} filters={filters} onChange={handleFilter} />
          <div className="view-toggle">
            <button className={`view-btn ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>CARDS</button>
            <button className={`view-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>SCATTER</button>
          </div>
        </div>

        <p className="result-count">{filtered.length} player{filtered.length !== 1 ? 's' : ''} shown</p>

        {view === 'chart' ? (
          <BubbleChart players={filtered} season={season} />
        ) : (
          <div className="cards-grid">
            {filtered.map(p => <PlayerCard key={p.id} player={p} />)}
            {filtered.length === 0 && <div className="empty">No players match these filters.</div>}
          </div>
        )}

        <div className="disclaimer">
          Powerplay Profits is a fan project. Stats sourced from ESPNCricinfo and public auction records.
          Not affiliated with the BCCI, IPL, or any franchise. Numbers don't capture everything. Cricket isn't a spreadsheet.
        </div>
      </main>
    </div>
  );
}
