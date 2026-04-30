/**
 * POWERPLAY PROFITS — Scoring Engine
 * ════════════════════════════════════════════════════════════════
 *
 * BATTERS
 *   contribution = (runs / matches) × (strike_rate / 100) × availability
 *   availability = matches_played / season_max_matches   (max 1.0)
 *
 * BOWLERS
 *   eco_multiplier = clamp(season_avg_eco / bowler_eco, 0.60, 1.30)
 *   contribution   = (wickets / matches) × eco_multiplier × availability
 *
 * ALL-ROUNDERS  (55% bat / 45% bowl)
 *   bat_contrib  = batter formula above
 *   bowl_contrib = bowler formula above
 *   dual_bonus   = 1.15 if meaningful in BOTH disciplines, else 1.0
 *     "meaningful" = batting SR ≥ 130 AND wickets ≥ 8  in the season
 *   contribution = (0.55 × bat_contrib + 0.45 × bowl_contrib) × dual_bonus × availability
 *
 * VALUE SCORE
 *   value_raw = contribution / auction_price_cr
 *
 * NORMALISATION
 *   Global rank  — normalised 0–100 across ALL players in the season
 *   Role rank    — normalised 0–100 within Batter / Bowler / All-rounder
 *   Rank numbers — #1 = best, assigned after sort
 *
 * 2026 IN-PROGRESS
 *   Uses avg of 2024 + 2025 prior contributions ÷ 2026 auction price.
 *   Seasons available drives prediction confidence band width.
 */

// Season-average economy rates (IPL) — used for floating eco benchmark
export const SEASON_ECO = {
  2023: 8.74,
  2024: 8.90,
  2025: 9.10,
  2026: 9.00, // estimated; will update as season progresses
};

const SEASON_MAX_MATCHES = {
  2023: 17,
  2024: 17,
  2025: 17,
  2026: 17,
};

const DUAL_SR_THRESHOLD  = 130;
const DUAL_WKT_THRESHOLD = 8;
const ECO_MULT_MIN       = 0.60;
const ECO_MULT_MAX       = 1.30;

// ── Primitive contributions ─────────────────────────────────────

function ecoMultiplier(bowlerEco, seasonEco) {
  if (!bowlerEco || bowlerEco === 0) return 0;
  return Math.min(ECO_MULT_MAX, Math.max(ECO_MULT_MIN, seasonEco / bowlerEco));
}

function availability(matchesPlayed, season) {
  const maxM = SEASON_MAX_MATCHES[season] || 17;
  return Math.min(1.0, matchesPlayed / maxM);
}

function batterContrib(bat, season) {
  if (!bat?.matches || bat.matches === 0) return 0;
  const perMatch = (bat.runs / bat.matches) * (bat.strike_rate / 100);
  return perMatch * availability(bat.matches, season);
}

function bowlerContrib(bowl, season) {
  if (!bowl?.matches || bowl.matches === 0 || bowl.wickets === 0) return 0;
  const wpm  = bowl.wickets / bowl.matches;
  const ecoM = ecoMultiplier(bowl.economy, SEASON_ECO[season] || 9.0);
  return wpm * ecoM * availability(bowl.matches, season);
}

function allRounderContrib(bat, bowl, season) {
  const bc   = batterContrib(bat, season);
  const wc   = bowlerContrib(bowl, season);
  const avail = availability(Math.max(bat?.matches || 0, bowl?.matches || 0), season);

  const meaningful = (bat?.strike_rate >= DUAL_SR_THRESHOLD && (bowl?.wickets || 0) >= DUAL_WKT_THRESHOLD);
  const dualBonus  = meaningful ? 1.15 : 1.0;

  return (0.55 * bc + 0.45 * wc) * dualBonus * avail;
}

function getContrib(p, batSrc, bowlSrc, season) {
  if (p.role === 'Batter')       return batterContrib(batSrc, season);
  if (p.role === 'Bowler')       return bowlerContrib(bowlSrc, season);
  if (p.role === 'All-rounder')  return allRounderContrib(batSrc, bowlSrc, season);
  return 0;
}

// ── Normalise array to 0–100 ────────────────────────────────────

function normalise(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const rng = max - min || 1;
  return values.map(v => +((v - min) / rng * 100).toFixed(1));
}

// ── Main export ─────────────────────────────────────────────────

export function computeIndex(players) {
  const season = players[0]?.season || 2025;

  const enriched = players.map(p => {
    const isLive   = p.season_status === 'in_progress';
    let contrib = 0;

    if (isLive) {
      // Average 2023 + 2024 + 2025 prior season contributions
      const c23 = getContrib(p, p.prior_2023_batting, p.prior_2023_bowling, 2023);
      const c24 = getContrib(p, p.prior_2024_batting, p.prior_2024_bowling, 2024);
      const c25 = getContrib(p, p.prior_2025_batting, p.prior_2025_bowling, 2025);
      const has23 = c23 > 0;
      const has24 = c24 > 0;
      const has25 = c25 > 0;
      const total = (has23 ? c23 : 0) + (has24 ? c24 : 0) + (has25 ? c25 : 0);
      const count = (has23 ? 1 : 0) + (has24 ? 1 : 0) + (has25 ? 1 : 0);
      contrib = count > 0 ? total / count : 0;
    } else {
      contrib = getContrib(p, p.batting, p.bowling, season);
    }

    const price = Math.max(p.auction_price_cr, 0.10);

    // Individual component scores for contribution bars
    const priorBatCount = isLive ? ([(p.prior_2023_batting?.matches||0)>0,(p.prior_2024_batting?.matches||0)>0,(p.prior_2025_batting?.matches||0)>0].filter(Boolean).length||1) : 1;
    const priorBowlCount = isLive ? ([(p.prior_2023_bowling?.wickets||0)>0,(p.prior_2024_bowling?.wickets||0)>0,(p.prior_2025_bowling?.wickets||0)>0].filter(Boolean).length||1) : 1;
    const batSrcFinal  = isLive
      ? { matches: ((p.prior_2023_batting?.matches||0)+(p.prior_2024_batting?.matches||0)+(p.prior_2025_batting?.matches||0))/priorBatCount,
          runs: ((p.prior_2023_batting?.runs||0)+(p.prior_2024_batting?.runs||0)+(p.prior_2025_batting?.runs||0))/priorBatCount,
          strike_rate: ((p.prior_2023_batting?.strike_rate||0)+(p.prior_2024_batting?.strike_rate||0)+(p.prior_2025_batting?.strike_rate||0))/priorBatCount }
      : p.batting;
    const bowlSrcFinal = isLive
      ? { matches: ((p.prior_2023_bowling?.matches||0)+(p.prior_2024_bowling?.matches||0)+(p.prior_2025_bowling?.matches||0))/priorBowlCount,
          wickets: ((p.prior_2023_bowling?.wickets||0)+(p.prior_2024_bowling?.wickets||0)+(p.prior_2025_bowling?.wickets||0))/priorBowlCount,
          economy: ((p.prior_2023_bowling?.economy||0)+(p.prior_2024_bowling?.economy||0)+(p.prior_2025_bowling?.economy||0))/priorBowlCount }
      : p.bowling;

    const batScore  = +batterContrib(batSrcFinal,  isLive ? 2025 : season).toFixed(4);
    const bowlScore = +bowlerContrib(bowlSrcFinal, isLive ? 2025 : season).toFixed(4);

    return {
      ...p,
      contrib:       +contrib.toFixed(4),
      value_raw:     +(contrib / price).toFixed(5),
      batting_score:  batScore,
      bowling_score:  bowlScore,
    };
  });

  // Global normalise → global_score (0–100)
  const gNorms = normalise(enriched.map(p => p.value_raw));
  enriched.forEach((p, i) => { p.global_score = gNorms[i]; });

  // Sort by global score desc → assign global_rank
  enriched.sort((a, b) => b.global_score - a.global_score);
  enriched.forEach((p, i) => { p.global_rank = i + 1; });

  // Role normalise → role_score + role_rank
  ['Batter', 'Bowler', 'All-rounder'].forEach(role => {
    const grp   = enriched.filter(p => p.role === role).sort((a, b) => b.global_score - a.global_score);
    const norms = normalise(grp.map(p => p.value_raw));
    grp.forEach((p, i) => {
      p.role_score = norms[i];
      p.role_rank  = i + 1;
    });
  });
  ['Batter', 'Bowler', 'All-rounder'].forEach(role => {
    const grp    = enriched.filter(p => p.role === role);
    const maxBat  = Math.max(...grp.map(p => p.batting_score),  0.001);
    const maxBowl = Math.max(...grp.map(p => p.bowling_score), 0.001);
    grp.forEach(p => {
      p.role_max_bat  = maxBat;
      p.role_max_bowl = maxBowl;
    });
  });
  return enriched;
}
// Expose per-role max contribution for normalised bar scaling


// ── Verdict helpers ─────────────────────────────────────────────

export function getVerdict(globalScore, auctionPrice, medianPrice) {
  const highScore = globalScore >= 50;
  const highPrice = auctionPrice >= medianPrice;

  if  (highScore && !highPrice) return { label: 'STEAL',    cls: 'v-steal' };
  if  (highScore &&  highPrice) return { label: 'WORTH IT', cls: 'v-fair'  };
  if (!highScore && !highPrice) return { label: 'CHEAP',    cls: 'v-cheap' };
  return                               { label: 'OVERPAID', cls: 'v-over'  };
}

export const PREDICTION_STYLES = {
  'LIKELY STEAL':    { cls: 'p-steal', color: '#4ade80' },
  'LIKELY OVERPAID': { cls: 'p-over',  color: '#f87171' },
  'FAIR VALUE':      { cls: 'p-fair',  color: '#fbbf24' },
  'WATCH':           { cls: 'p-watch', color: '#93c5fd' },
};

export function getRoles()  { return ['All', 'Batter', 'Bowler', 'All-rounder']; }

export function getTeams(players) {
  return ['All', ...[...new Set(players.map(p => p.team))].sort()];
}

export function filterPlayers(players, { role, team, search, sort }) {
  let out = players.filter(p => {
    if (role   !== 'All' && p.role !== role)   return false;
    if (team   !== 'All' && p.team !== team)   return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sort === 'price_desc') out = [...out].sort((a, b) => b.auction_price_cr - a.auction_price_cr);
  if (sort === 'price_asc')  out = [...out].sort((a, b) => a.auction_price_cr - b.auction_price_cr);
  if (sort === 'score')      out = [...out].sort((a, b) => b.global_score - a.global_score);
  if (sort === 'matches')    out = [...out].sort((a, b) => (b.batting?.matches || b.bowling?.matches || 0) - (a.batting?.matches || a.bowling?.matches || 0));

  return out;
}
