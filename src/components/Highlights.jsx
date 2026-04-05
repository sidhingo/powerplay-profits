import { TEAM_COLORS } from '../utils/constants';

export default function Highlights({ players, season }) {
  if (!players.length) return null;

  const complete = players.filter(p => p.season_status !== 'in_progress');
  if (complete.length === 0) return null;

  const sorted    = [...complete].sort((a, b) => b.global_score - a.global_score);
  const topSteal  = sorted[0];
  const topOver   = sorted[sorted.length - 1];

  // Biggest surprise = best score relative to highest price
  const expensive = [...complete].sort((a, b) => b.auction_price_cr - a.auction_price_cr).slice(0, 8);
  const surprise  = expensive.reduce((best, p) => p.global_score > (best?.global_score || 0) ? p : best, null);

  const cards = [
    { label: '🏆 TOP STEAL',     player: topSteal,  detail: `#${topSteal?.global_rank} overall · ₹${topSteal?.auction_price_cr}cr` },
    { label: '💸 MOST OVERPAID', player: topOver,   detail: `#${topOver?.global_rank} overall · ₹${topOver?.auction_price_cr}cr` },
    { label: '😲 BIGGEST SURPRISE', player: surprise, detail: `Top 8 by price · scored #${surprise?.global_rank}` },
  ];

  return (
    <div className="highlights">
      {cards.map(({ label, player, detail }) => player ? (
        <div key={label} className="hl-card" style={{ borderLeftColor: TEAM_COLORS[player.team] || '#555', borderLeftWidth: 3, borderLeftStyle: 'solid' }}>
          <span className="hl-label">{label}</span>
          <span className="hl-name">{player.name}</span>
          <span className="hl-detail" style={{ color: TEAM_COLORS[player.team] || '#888' }}>{player.team}</span>
          <span className="hl-detail">{detail}</span>
        </div>
      ) : null)}
    </div>
  );
}
