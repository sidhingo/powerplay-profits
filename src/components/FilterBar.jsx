import { getRoles } from '../utils/scoring';

export default function FilterBar({ teams, filters, onChange }) {
  const roles = getRoles();
  const { role, team, search, sort } = filters;

  return (
    <div className="filters">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="filter-label">ROLE</span>
        <div className="pills">
          {roles.map(r => (
            <button
              key={r}
              className={`pill ${role === r ? 'active' : ''}`}
              onClick={() => onChange({ role: r })}
            >{r}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="filter-label">TEAM</span>
        <select className="team-select" value={team} onChange={e => onChange({ team: e.target.value })}>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="filter-label">SORT</span>
        <select className="sort-select" value={sort} onChange={e => onChange({ sort: e.target.value })}>
          <option value="score">Value Score</option>
          <option value="price_desc">Price ↓</option>
          <option value="price_asc">Price ↑</option>
          <option value="matches">Matches</option>
        </select>
      </div>

      <div className="search-wrap">
        <span className="search-icon">⌕</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search player…"
          value={search}
          onChange={e => onChange({ search: e.target.value })}
        />
      </div>
    </div>
  );
}
