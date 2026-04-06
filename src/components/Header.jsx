export default function Header({ season, onSeason }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-top">
          <div className="brand">
            <h1>Powerplay <span>Profits</span></h1>
            <p>IPL AUCTION ROI</p>
          </div>
          <nav className="season-tabs">
            {[2023, 2024, 2025, 2026].map(y => (
              <button
                key={y}
                className={`s-tab ${season === y ? 'active' : ''}`}
                onClick={() => onSeason(y)}
              >
                {y}
                {y === 2026 && <span className="live-dot" title="Season in progress" />}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}