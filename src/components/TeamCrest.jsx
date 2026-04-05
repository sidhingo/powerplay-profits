const LOGO_EXT = {
  KKR:  'jpg',
  MI:   'jpg',
  RCB:  'jpg',
  CSK:  'png',
  DC:   'png',
  GT:   'png',
  LSG:  'png',
  PBKS: 'png',
  RR:   'png',
  SRH:  'png',
};

export default function TeamCrest({ team, size = 48 }) {
  const ext = LOGO_EXT[team] || 'png';
  const src = `/logos/${team}.${ext}`;

  return (
    <div style={{
      width: size,
      height: size,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <img
        src={src}
        alt={team}
        width={size}
        height={size}
        style={{ objectFit: 'contain', borderRadius: 4 }}
        onError={e => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div style={{
        display: 'none',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#2a3050',
        border: '1.5px solid rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: size * 0.28,
        color: '#fff',
        flexShrink: 0,
      }}>
        {team}
      </div>
    </div>
  );
}