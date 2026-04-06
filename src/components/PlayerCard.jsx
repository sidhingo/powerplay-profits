import { TEAM_COLORS, ROLE_COLORS } from '../utils/constants';
import { getVerdict, PREDICTION_STYLES, SEASON_ECO } from '../utils/scoring';
import TeamCrest from './TeamCrest';
import CountryFlag from './CountryFlag';

const SEASON_MED_PRICE = { 2023: 7, 2024: 7, 2025: 13, 2026: 11 };

// Season average SR for batters — used for context comparison
const SEASON_AVG_SR = { 2023: 138, 2024: 142, 2025: 145, 2026: 143 };

/* ── Value score block ──────────────────────────────────────── */
function ValueBlock({ player, verdictCls, verdictLabel, color }) {
  return (
    <div className="value-block" style={{ borderColor: color + '55' }}>
      <div className="value-block-inner">
        <div>
          <div className="value-label">VALUE SCORE</div>
          <div className="value-num" style={{ color }}>{player.global_score}</div>
        </div>
        <div className="value-ranks">
          <div className="value-rank-line">
            <span className="value-rank-num">#{player.global_rank}</span>
            <span className="value-rank-sub">overall</span>
          </div>
          <div className="value-rank-line">
            <span className="value-rank-num">#{player.role_rank}</span>
            <span className="value-rank-sub">among {player.role.toLowerCase()}s</span>
          </div>
        </div>
        <div className={`verdict ${verdictCls}`}>{verdictLabel}</div>
      </div>
      <div className="value-bar-track">
        <div className="value-bar-fill" style={{ width: `${player.global_score}%`, background: color }} />
      </div>
    </div>
  );
}

/* ── Card header ────────────────────────────────────────────── */
function CardHeader({ player, teamColor, roleColor }) {
  return (
    <div className="card-head">
      <div className="card-crest">
        <TeamCrest team={player.team} size={48} />
      </div>
      <div className="card-meta">
        <div className="card-name">{player.name}</div>
        <div className="card-tags">
          <span className="tag" style={{ background: teamColor }}>{player.team}</span>
          <span className="tag" style={{ background: roleColor }}>{player.role}</span>
          <div className="nat-wrap">
            <CountryFlag nationality={player.nationality} width={22} height={15} />
            <span className="nat-text">{player.nationality}</span>
          </div>
        </div>
      </div>
      <div className="price-badge">
        <span className="price-val">₹{player.auction_price_cr}cr</span>
        <span className="price-sub">AUCTION</span>
        {player.auction_cap_cr && (
          <span className="price-cap">cap ₹{player.auction_cap_cr}cr</span>
        )}
      </div>
    </div>
  );
}

/* ── Context comparison row ─────────────────────────────────── */
function ContextRow({ label, playerVal, seasonVal, unit = '', higherIsBetter = true }) {
  if (!playerVal || playerVal === 0) return null;
  const diff = +(playerVal - seasonVal).toFixed(2);
  const better = higherIsBetter ? diff > 0 : diff < 0;
  const color = better ? '#22c55e' : diff === 0 ? '#7a7568' : '#f87171';
  const sign = diff > 0 ? '+' : '';
  return (
    <div className="ctx-row">
      <span className="ctx-label">{label}</span>
      <span className="ctx-val">{playerVal}{unit}</span>
      <span className="ctx-vs">vs {seasonVal}{unit} avg</span>
      <span className="ctx-diff" style={{ color }}>{sign}{diff}{unit}</span>
    </div>
  );
}

/* ── Complete season card ───────────────────────────────────── */
function CompleteCard({ player }) {
  const tc        = TEAM_COLORS[player.team] || '#555';
  const rc        = ROLE_COLORS[player.role]  || '#888';
  const season    = player.season;
  const medPrice  = SEASON_MED_PRICE[season] || 10;
  const verdict   = getVerdict(player.global_score, player.auction_price_cr, medPrice);
  const bat       = player.batting;
  const bowl      = player.bowling;
  const seasonEco = SEASON_ECO[season] || 9.0;
  const seasonSR  = SEASON_AVG_SR[season] || 140;

  const ecoDelta = bowl?.economy > 0
    ? +(seasonEco - bowl.economy).toFixed(2)
    : null;
  const ecoColor = ecoDelta > 0 ? '#22c55e' : ecoDelta < 0 ? '#f87171' : '#7a7568';

  const hasDual = player.role === 'All-rounder' &&
    (bat?.strike_rate || 0) >= 130 && (bowl?.wickets || 0) >= 8;

  const verdictColor =
    verdict.cls === 'v-steal' ? '#22c55e' :
    verdict.cls === 'v-fair'  ? '#f59e0b' :
    verdict.cls === 'v-cheap' ? '#9ca3af' : '#f87171';

  const showBatCtx  = bat?.matches > 0 && bat?.runs > 0;
  const showBowlCtx = bowl?.matches > 0 && bowl?.wickets > 0;

  return (
    <div className="p-card">
      <div className="card-stripe" style={{ background: tc }} />
      <CardHeader player={player} teamColor={tc} roleColor={rc} />

      <ValueBlock
        player={player}
        verdictCls={verdict.cls}
        verdictLabel={verdict.label}
        color={verdictColor}
      />

      {/* Season context comparison */}
      {(showBatCtx || showBowlCtx) && (
        <div className="ctx-section">
          <div className="ctx-title">
            VS SEASON AVERAGE
            {hasDual && <span className="dual-bonus-badge">+15% DUAL BONUS</span>}
          </div>
          {showBatCtx && (
            <ContextRow
              label="Strike Rate"
              playerVal={bat.strike_rate}
              seasonVal={seasonSR}
              higherIsBetter={true}
            />
          )}
          {showBowlCtx && (
            <ContextRow
              label="Economy"
              playerVal={bowl.economy}
              seasonVal={seasonEco}
              higherIsBetter={false}
            />
          )}
          {showBowlCtx && (
            <ContextRow
              label="Wkts / match"
              playerVal={+(bowl.wickets / bowl.matches).toFixed(2)}
              seasonVal={1.0}
              higherIsBetter={true}
            />
          )}
        </div>
      )}

      {/* Full stats */}
      <div className="stats-row">
        <div className="stat-group">
          <span className="stat-head">BATTING</span>
          {bat?.matches > 0 ? (
            <>
              <span className="stat-line dim">{bat.matches} matches</span>
              <span className="stat-line hi">{bat.runs} runs</span>
              <span className="stat-line">SR {bat.strike_rate}</span>
              <span className="stat-line">Avg {bat.average}</span>
            </>
          ) : (
            <span className="stat-line na">not applicable</span>
          )}
        </div>
        <div className="stat-group">
          <span className="stat-head">BOWLING</span>
          {bowl?.matches > 0 ? (
            <>
              <span className="stat-line dim">{bowl.matches} matches</span>
              <span className="stat-line hi">{bowl.wickets} wickets</span>
              <span className="stat-line">
                Eco {bowl.economy}
                {ecoDelta !== null && (
                  <span style={{ color: ecoColor, fontSize: '11px', marginLeft: 5 }}>
                    ({ecoDelta > 0 ? '-' : '+'}{Math.abs(ecoDelta)} vs avg)
                  </span>
                )}
              </span>
              <span className="stat-line">Avg {bowl.average}</span>
            </>
          ) : (
            <span className="stat-line na">not applicable</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Confidence band ────────────────────────────────────────── */
function ConfidenceBand({ low, high, color }) {
  const mid = (low + high) / 2;
  return (
    <>
      <div className="conf-track">
        <div className="conf-range" style={{ left: `${low}%`, width: `${high - low}%`, background: `${color}22`, borderColor: color }} />
        <div className="conf-needle" style={{ left: `${mid}%`, background: color }} />
      </div>
      <div className="conf-numbers">
        <span>{low}</span>
        <span style={{ color }}>~{Math.round(mid)} projected</span>
        <span>{high}</span>
      </div>
    </>
  );
}

/* ── Data pips ──────────────────────────────────────────────── */
function DataPips({ available }) {
  const label =
    available === 2 ? '2 seasons of data' :
    available === 1 ? '1 season of data'  : 'no prior IPL data';
  return (
    <div className="pips">
      <span className={`pip ${available >= 1 ? 'pip-on' : 'pip-off'}`} />
      <span className={`pip ${available >= 2 ? 'pip-on' : 'pip-off'}`} />
      <span className="pip-text">{label}</span>
    </div>
  );
}

/* ── Prediction card (2026) ─────────────────────────────────── */
function PredictionCard({ player }) {
  const tc        = TEAM_COLORS[player.team] || '#555';
  const rc        = ROLE_COLORS[player.role]  || '#888';
  const pred      = player.prediction;
  const ps        = PREDICTION_STYLES[pred?.tier] || PREDICTION_STYLES['WATCH'];
  const available = pred?.seasons_available ?? 0;

  const b24  = player.prior_2024_batting;
  const w24  = player.prior_2024_bowling;
  const b25  = player.prior_2025_batting;
  const w25  = player.prior_2025_bowling;
  const has24 = (b24?.matches > 0) || (w24?.matches > 0);
  const has25 = (b25?.matches > 0) || (w25?.matches > 0);
  const liveM = Math.max(player.batting?.matches || 0, player.bowling?.matches || 0);

  return (
    <div className="p-card pred-card">
      <div className="card-stripe" style={{ background: tc }} />
      <div className="pred-eyebrow">SEASON IN PROGRESS — PREDICTION</div>

      <CardHeader player={player} teamColor={tc} roleColor={rc} />

      {liveM > 0 && (
        <div className="live-stats-bar">
          <span className="live-dot-sm" /> {liveM} matches played so far in 2026
        </div>
      )}

      <div className="pred-tier-block" style={{ borderColor: ps.color + '44' }}>
        <div className="pred-tier-inner">
          <div>
            <div className="pred-tier-label">PREDICTION</div>
            <div className={`pred-tier-badge ${ps.cls}`}>{pred?.tier}</div>
            <DataPips available={available} />
          </div>
          <div>
            <div className="pred-tier-label">CONFIDENCE</div>
            <div className="pred-tier-conf" style={{ color: ps.color }}>{pred?.confidence}%</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <div className="conf-title-sm">PROJECTED VALUE SCORE (0-100)</div>
          <ConfidenceBand low={pred?.score_low || 0} high={pred?.score_high || 50} color={ps.color} />
        </div>
      </div>

      <div className="prior-grid">
        <div className="prior-col">
          <span className="prior-year" style={{ opacity: has24 ? 1 : 0.4 }}>2024</span>
          {has24 ? (
            <>
              {b24?.matches > 0 && (
                <>
                  <span className="stat-line dim">{b24.matches}M</span>
                  <span className="stat-line">{b24.runs}r · SR {b24.strike_rate}</span>
                </>
              )}
              {w24?.matches > 0 && (
                <>
                  {!(b24?.matches > 0) && <span className="stat-line dim">{w24.matches}M</span>}
                  <span className="stat-line">{w24.wickets}w · {w24.economy}eco</span>
                </>
              )}
            </>
          ) : (
            <span className="stat-line na">{player.prior_note || 'no data'}</span>
          )}
        </div>
        <div className="prior-arrow">→</div>
        <div className="prior-col">
          <span className="prior-year" style={{ opacity: has25 ? 1 : 0.4 }}>2025</span>
          {has25 ? (
            <>
              {b25?.matches > 0 && (
                <>
                  <span className="stat-line dim">{b25.matches}M</span>
                  <span className="stat-line">{b25.runs}r · SR {b25.strike_rate}</span>
                </>
              )}
              {w25?.matches > 0 && (
                <>
                  {!(b25?.matches > 0) && <span className="stat-line dim">{w25.matches}M</span>}
                  <span className="stat-line">{w25.wickets}w · {w25.economy}eco</span>
                </>
              )}
            </>
          ) : (
            <span className="stat-line na">{player.prior_note || 'no data'}</span>
          )}
        </div>
      </div>

      <div className="rationale">
        <span className="rat-label">ANALYST VIEW</span>
        <p className="rat-text">{pred?.rationale}</p>
      </div>
    </div>
  );
}

export default function PlayerCard({ player }) {
  return player.season_status === 'in_progress'
    ? <PredictionCard player={player} />
    : <CompleteCard   player={player} />;
}