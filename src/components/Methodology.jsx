import { useState } from 'react';
import { SEASON_ECO } from '../utils/scoring';

export default function Methodology({ season }) {
  const [open, setOpen] = useState(false);
  const eco23 = SEASON_ECO[2023];
  const eco24 = SEASON_ECO[2024];
  const eco25 = SEASON_ECO[2025];

  return (
    <div className="method-wrap">
      <button className="method-toggle" onClick={() => setOpen(o => !o)}>
        <span>HOW THE SCORES WORK</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="method-body">

          <div className="method-intro-grid">
            <div className="method-intro-left">
              <div className="method-intro-heading">What is this?</div>
              <div className="method-intro-sub">A value-for-money ranking of IPL auction spending</div>
            </div>
            <ul className="method-intro-bullets">
              <li>The more a player delivers relative to what their franchise paid, the higher they rank.</li>
              <li>Scores are calculated differently for batters, bowlers, and all-rounders based on their role.</li>
              <li>Bowling economy is benchmarked against that season's average, and is not a fixed number, to ensure comparisons are fair across years.</li>
              <li>2026 predictions use averaged 2024 and 2025 form divided by the new auction price.</li>
            </ul>
          </div>

          <div className="method-grid">

            <div className="method-card">
              <h4 style={{ color: '#f59e0b' }}>Batters</h4>
              <div className="method-formula">
                <span className="mf-chip" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>runs / matches</span>
                <span className="mf-op">×</span>
                <span className="mf-chip" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>SR / 100</span>
                <span className="mf-op">×</span>
                <span className="mf-chip" style={{ background: 'rgba(255,255,255,0.08)', color: '#c4bfb4' }}>availability</span>
              </div>
              <ul className="method-bullets">
                <li>Rewards both volume and speed equally.</li>
                <li>45 runs/match at SR 180 outscores 55 runs/match at SR 120.</li>
                <li>Availability adjusts for players who missed games.</li>
              </ul>
            </div>

            <div className="method-card">
              <h4 style={{ color: '#38bdf8' }}>Bowlers</h4>
              <div className="method-formula">
                <span className="mf-chip" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>wickets / match</span>
                <span className="mf-op">×</span>
                <span className="mf-chip" style={{ background: 'rgba(56,189,248,0.15)', color: '#38bdf8' }}>eco multiplier</span>
                <span className="mf-op">×</span>
                <span className="mf-chip" style={{ background: 'rgba(255,255,255,0.08)', color: '#c4bfb4' }}>availability</span>
              </div>
              <ul className="method-bullets">
                <li>Wickets are the primary objective, economy is secondary.</li>
                <li>Economy multiplier ranges from 0.6x (expensive) to 1.3x (economical).</li>
                <li className="method-tooltip-wrap">
                  Benchmarked per season.
                  <span className="method-tooltip">
                    <strong>Season avg economy</strong>
                    <span>2023 — {eco23}</span>
                    <span>2024 — {eco24}</span>
                    <span>2025 — {eco25}</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="method-card">
              <h4 style={{ color: '#a78bfa' }}>All-rounders</h4>
              <div className="method-formula">
                <span className="mf-chip" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>55% batting</span>
                <span className="mf-op">+</span>
                <span className="mf-chip" style={{ background: 'rgba(167,139,250,0.15)', color: '#a78bfa' }}>45% bowling</span>
                <span className="mf-op">×</span>
                <span className="mf-chip" style={{ background: 'rgba(255,255,255,0.08)', color: '#c4bfb4' }}>dual bonus</span>
              </div>
              <ul className="method-bullets">
                <li>Batting weighted slightly higher as it wins more T20 games.</li>
                <li>15% bonus applies when SR is above 130 AND wickets reach 8 or more.</li>
                <li>Rewards players performing dual roles from one roster slot.</li>
              </ul>
            </div>

            <div className="method-card method-card-output">
              <div className="method-output-label">OUTPUT</div>
              <h4>Value Score</h4>
              <div className="method-formula">
                <span className="mf-chip" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>contribution</span>
                <span className="mf-op">÷</span>
                <span className="mf-chip" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>auction price (cr)</span>
              </div>
              <ul className="method-bullets">
                <li>The final output — divides contribution by what was paid.</li>
                <li>Normalised 0-100 across all players for the overall rank.</li>
                <li>Normalised separately within each role for the role rank.</li>
              </ul>
            </div>

          </div>

          <p className="method-caveat">
            Working from season aggregates means we cannot measure death-over impact, clutch performances, or match-to-match consistency. This is a strong first-order value filter, not a complete picture.
          </p>
        </div>
      )}
    </div>
  );
}