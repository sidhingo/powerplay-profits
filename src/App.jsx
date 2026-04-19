import { useState, useMemo } from 'react';
import players2023 from './data/players_2023.json';
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
  2023: { players: computeIndex(players2023), status: 'complete' },
  2024: { players: computeIndex(players2024), status: 'complete' },
  2025: { players: computeIndex(players2025), status: 'complete' },
  2026: { players: computeIndex(players2026), status: 'in_progress' },
};

const DEFAULT_FILTERS = { role: 'All', team: 'All', search: '', sort: 'score' };

export default function App() {
  const [season, setSeason] = useState(2023);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState('cards');

  const { players: allPlayers } = SEASONS[season];
  const teams = useMemo(() => getTeams(allPlayers), [allPlayers]);

  const handleSeason = (s) => {
    setSeason(s);
    setFilters(DEFAULT_FILTERS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleFilter = (patch) => setFilters(f => ({ ...f, ...patch }));

  const filtered = useMemo(() => filterPlayers(allPlayers, filters), [allPlayers, filters]);

  return (
    <div className="app">
      <Header season={season} onSeason={handleSeason} />

      <main className="main">
        {season === 2026 && (
          <div className="live-banner">
            <span>⚡</span>
            <span>
            <strong>IPL 2026 is live — started 28 March.</strong> Predictions are based on averaged 2023, 2024 and 2025 prior form vs the 2026 auction price. Live match stats shown on each card are informational only and do not affect the value scores. <strong>Stats last updated: April 8, 2026 — 14 matches played.</strong> Full season scores unlock in May.
            </span>
          </div>
        )}

<p className="site-intro">
          In the IPL, every crore spent must yield results. This tool benchmarks auction price against
          on-field impact to identify the season's greatest <i>Steals</i> and most <i>Overpaid</i> picks.
        </p>

        <Methodology season={season} />

        <div className="controls">
          <FilterBar teams={teams} filters={filters} onChange={handleFilter} />
        </div>

        <div className="result-view-row">
          <p className="result-count">{filtered.length} player{filtered.length !== 1 ? 's' : ''} shown</p>
          <div className="view-toggle">
            <button className={`view-btn ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>PLAYERS</button>
            <button className={`view-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>VALUE CHART</button>
          </div>
        </div>

        
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
          <br /><br />
          Built by <a href="https://github.com/sidhingo" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-3)', textDecoration: 'underline' }}>sidhingo</a>
        </div>
      </main>
    </div>
  );
}