import { useState, useMemo } from 'react';
import players2023 from './data/players_2023.json';
import players2024 from './data/players_2024.json';
import players2025 from './data/players_2025.json';
import players2026 from './data/players_2026.json';
import { computeIndex, filterPlayers, getTeams, getVerdict } from './utils/scoring';
import Header      from './components/Header';
import FilterBar   from './components/FilterBar';
import PlayerCard  from './components/PlayerCard';
import BubbleChart from './components/BubbleChart';
import Methodology from './components/Methodology';
import Highlights  from './components/Highlights';

const scored2026    = computeIndex(players2026.filter(p => !p.standout));
const standoutBatters2026 = computeIndex(
  players2026.filter(p => p.standout && p.role === 'Batter')
);
const standoutBowlers2026 = computeIndex(
  players2026.filter(p => p.standout && p.role === 'Bowler')
);
const standoutAllRounders2026 = computeIndex(
  players2026.filter(p => p.standout && p.role === 'All-rounder')
);
const standouts2026 = [
  ...standoutBatters2026,
  ...standoutBowlers2026,
  ...standoutAllRounders2026,
].map(p => ({ ...p, standout: true }));

const SEASONS = {
  2023: { players: computeIndex(players2023), status: 'complete' },
  2024: { players: computeIndex(players2024), status: 'complete' },
  2025: { players: computeIndex(players2025), status: 'complete' },
  2026: { players: [...scored2026, ...standouts2026], status: 'complete' },
};

const DEFAULT_FILTERS = { role: 'All', team: 'All', search: '', sort: 'score' };

export default function App() {
  const [season, setSeason]         = useState(2023);
  const [filters, setFilters]       = useState(DEFAULT_FILTERS);
  const [view, setView]             = useState('cards');
  const [contactSent, setContactSent] = useState(false);
  const [predFilter, setPredFilter]   = useState(null);

  const { players: allPlayers } = SEASONS[season];
  const teams = useMemo(() => getTeams(allPlayers), [allPlayers]);

  const predictionSummary = useMemo(() => {
    if (season !== 2026) return null;
    const tracked = allPlayers.filter(p => !p.standout && p.prediction);
    let hit = 0, missed = 0;
    tracked.forEach(p => {
      const tier = p.prediction.tier;
      const medPrice = 13.2;
      const v = getVerdict(p.global_score, p.auction_price_cr, 13.2, 10.1);
      const cls = v.cls;
      let isHit = false;
      if (tier === 'LIKELY STEAL') {
        isHit = cls === 'v-steal' || cls === 'v-fair';
      } else if (tier === 'LIKELY OVERPAID') {
        isHit = cls === 'v-over' || cls === 'v-cheap';
      } else if (tier === 'FAIR VALUE') {
        isHit = cls === 'v-fair' || cls === 'v-over';
      } else if (tier === 'WATCH') {
        isHit = cls === 'v-cheap' || cls === 'v-over' || cls === 'v-fair';
      }
      if (isHit) hit++;
      else missed++;
    });
    return { hit, missed, total: tracked.length };
  }, [season, allPlayers]);

  const handleSeason = (s) => {
    setSeason(s);
    setFilters(DEFAULT_FILTERS);
    setPredFilter(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleFilter = (patch) => setFilters(f => ({ ...f, ...patch }));

  const filtered = useMemo(() => filterPlayers(allPlayers, filters), [allPlayers, filters]);

  return (
    <div className="app">
      <Header season={season} onSeason={handleSeason} />

      <main className="main">

        {season === 2026 && (
          <>
            <div className="season-complete-banner">
              🏆 <strong>IPL 2026 Complete — RCB retain the title.</strong> Final scores, verdicts and pre-season prediction reviews are now live across all 50 tracked players.
            </div>
            {predictionSummary && (
              <div className="pred-summary-strip">
                <button
                  className={`pred-summary-item pred-summary-btn ${predFilter === 'hit' ? 'pred-summary-active' : ''}`}
                  onClick={() => setPredFilter(f => f === 'hit' ? null : 'hit')}
                >
                  <span className="pred-summary-num" style={{ color: '#22c55e' }}>{predictionSummary.hit}</span>
                  <span className="pred-summary-label">PREDICTIONS HIT</span>
                </button>
                <div className="pred-summary-divider" />
                <button
                  className={`pred-summary-item pred-summary-btn ${predFilter === 'missed' ? 'pred-summary-active' : ''}`}
                  onClick={() => setPredFilter(f => f === 'missed' ? null : 'missed')}
                >
                  <span className="pred-summary-num" style={{ color: '#f87171' }}>{predictionSummary.missed}</span>
                  <span className="pred-summary-label">PREDICTIONS MISSED</span>
                </button>
                <div className="pred-summary-note">
                Pre-season predictions vs final verdicts: assessed across {predictionSummary.total} players before a ball was bowled.
                              </div>
              </div>
            )}
            </>
        )}

        <p className="site-intro">
          In the IPL, every crore spent must yield results. This tool benchmarks auction price against
          on-field impact to identify the season's greatest Steals and most Overpaid picks.
        </p>

        <Methodology season={season} />

        <div className="controls">
          <FilterBar teams={teams} filters={filters} onChange={handleFilter} />
        </div>

        <div className="result-view-row">
          <p className="result-count">
            {season === 2026
              ? `50 tracked + 6 standouts`
              : `${filtered.length} player${filtered.length !== 1 ? 's' : ''} shown`}
          </p>
          <div className="view-toggle">
            <button className={`view-btn ${view === 'cards' ? 'active' : ''}`} onClick={() => setView('cards')}>PLAYERS</button>
            <button className={`view-btn ${view === 'chart' ? 'active' : ''}`} onClick={() => setView('chart')}>VALUE CHART</button>
          </div>
        </div>

        {season === 2026 && view === 'cards' && (
          <>
            <div className="standout-section">
              <div className="standout-banner">
                ✦ Season Standouts — these players were not part of the original tracked cohort. Either retained at base price, uncapped at auction, or signed as replacements. Their on-field output in 2026 earned a place in the data.
              </div>
              <div className="cards-grid">
                {allPlayers.filter(p => p.standout).map(p => <PlayerCard key={p.id} player={p} />)}
              </div>
            </div>
            <div className="standout-divider" />
            <div className="cohort-banner">
              ◎ Original tracked cohort — 50 players selected at the 2026 auction based on price and projected impact. Each card includes a pre-season prediction review.
            </div>
            <Highlights players={filtered.filter(p => !p.standout)} season={season} />
          </>
        )}

        {season !== 2026 && <Highlights players={filtered} season={season} />}

{view === 'chart' ? (
          <BubbleChart players={filtered.filter(p => !p.standout)} season={season} />
        ) : (
          <div className="cards-grid">
            {filtered.filter(p => !p.standout).filter(p => {
              if (season !== 2026 || !predFilter || !p.prediction) return true;
              const tier = p.prediction.tier;
              const medPrice = 11;
              const v = getVerdict(p.global_score, p.auction_price_cr, 13.2, 10.1);
              const cls = v.cls;
              let isHit = false;
              if (tier === 'LIKELY STEAL') {
                isHit = cls === 'v-steal' || cls === 'v-fair';
              } else if (tier === 'LIKELY OVERPAID') {
                isHit = cls === 'v-over' || cls === 'v-cheap';
              } else if (tier === 'FAIR VALUE') {
                isHit = cls === 'v-fair' || cls === 'v-over';
              } else if (tier === 'WATCH') {
                isHit = cls === 'v-cheap' || cls === 'v-over' || cls === 'v-fair';
              }
              return predFilter === 'hit' ? isHit : !isHit;
            }).map(p => <PlayerCard key={p.id} player={p} />)}
            {filtered.filter(p => !p.standout).length === 0 && <div className="empty">No players match these filters.</div>}
          </div>
        )}

        <div className="mobile-banner">ⓘ Best experienced on desktop</div>

        <div className="footer-wrap">
          <p className="footer-disclaimer">
            Powerplay Profits is a fan project. Stats sourced from ESPNCricinfo and public auction records.
            Not affiliated with the BCCI, IPL, or any franchise. Numbers don't capture everything. Cricket isn't a spreadsheet.
          </p>
          <div className="footer-contact">
            <p className="footer-contact-label">Have feedback or a question? Drop a note below.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target;
                const data = new FormData(form);
                data.append('access_key', '598dea31-4d87-48f5-9bd9-4c6c318479cf');
                data.append('subject', 'Powerplay Profits — Contact Form');
                const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
                if (res.ok) { setContactSent(true); form.reset(); }
              }}
              className="footer-form"
            >
              <input type="email" name="email" required placeholder="Your email" className="footer-input" />
              <input type="text" name="message" required placeholder="Your message" className="footer-input footer-input-grow" />
              <button type="submit" className="footer-btn">SEND</button>
            </form>
            {contactSent && <p className="footer-sent">Message received. Thanks for reaching out.</p>}
          </div>
          <div className="footer-byline">
            Built by <a href="https://github.com/sidhingo" target="_blank" rel="noopener noreferrer">sidhingo</a>
          </div>
        </div>

      </main>
    </div>
  );
}