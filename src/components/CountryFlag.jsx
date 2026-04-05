/* Country flag SVGs — accurate colour representations, 20x14px default */

const FLAGS = {
  India: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="4.67" fill="#FF9933"/>
      <rect y="4.67" width="20" height="4.67" fill="#FFFFFF"/>
      <rect y="9.33" width="20" height="4.67" fill="#138808"/>
      {/* Ashoka Chakra */}
      <circle cx="10" cy="7" r="2" fill="none" stroke="#000080" strokeWidth="0.5"/>
      <circle cx="10" cy="7" r="0.4" fill="#000080"/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map((a, i) => {
        const r = (a * Math.PI) / 180;
        return <line key={i} x1={10 + 0.4*Math.cos(r)} y1={7 + 0.4*Math.sin(r)} x2={10 + 2*Math.cos(r)} y2={7 + 2*Math.sin(r)} stroke="#000080" strokeWidth="0.35"/>;
      })}
    </svg>
  ),

  Australia: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#00008B"/>
      {/* Union Jack simplified top-left */}
      <rect x="0" y="0" width="10" height="7" fill="#00008B"/>
      <line x1="0" y1="0" x2="10" y2="7" stroke="#FFFFFF" strokeWidth="1.5"/>
      <line x1="10" y1="0" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="1.5"/>
      <line x1="5" y1="0" x2="5" y2="7" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="0" y1="3.5" x2="10" y2="3.5" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="0" y1="0" x2="10" y2="7" stroke="#CC0000" strokeWidth="0.8"/>
      <line x1="10" y1="0" x2="0" y2="7" stroke="#CC0000" strokeWidth="0.8"/>
      {/* Southern Cross — simplified 4 dots */}
      <circle cx="15" cy="4" r="0.8" fill="#FFFFFF"/>
      <circle cx="17" cy="7" r="0.8" fill="#FFFFFF"/>
      <circle cx="15" cy="10" r="0.8" fill="#FFFFFF"/>
      <circle cx="13" cy="7" r="0.8" fill="#FFFFFF"/>
      <circle cx="16.5" cy="5.5" r="0.5" fill="#FFFFFF"/>
    </svg>
  ),

  England: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#FFFFFF"/>
      {/* St George's Cross */}
      <rect x="8.5" y="0" width="3" height="14" fill="#CC0000"/>
      <rect x="0" y="5.5" width="20" height="3" fill="#CC0000"/>
    </svg>
  ),

  'S Africa': ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#007A4D"/>
      <rect y="0" width="20" height="4.67" fill="#007A4D"/>
      <rect y="9.33" width="20" height="4.67" fill="#FF0000"/>
      <rect y="4.67" width="20" height="4.67" fill="#002395"/>
      {/* Diagonal Y shape */}
      <path d="M0 0 L8 7 L0 14" fill="#FFB612"/>
      <path d="M0 0 L7 7 L0 14" fill="#000000"/>
      <path d="M0 2.5 L6 7 L0 11.5" fill="#FFFFFF"/>
      <path d="M0 3.5 L6 7 L0 10.5 L6 7 L8 7" fill="#FFB612"/>
    </svg>
  ),

  'West Indies': ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#009E60"/>
      <rect y="4" width="20" height="6" fill="#FFE900"/>
      <path d="M0 0 L12 7 L0 14" fill="#7B0000"/>
      <path d="M0 0 L10 7 L0 14" fill="#CE1126"/>
    </svg>
  ),

  'New Zealand': ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#00247D"/>
      {/* Union Jack simplified */}
      <rect x="0" y="0" width="10" height="7" fill="#00247D"/>
      <line x1="0" y1="0" x2="10" y2="7" stroke="#FFFFFF" strokeWidth="1.2"/>
      <line x1="10" y1="0" x2="0" y2="7" stroke="#FFFFFF" strokeWidth="1.2"/>
      <line x1="5" y1="0" x2="5" y2="7" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="0" y1="3.5" x2="10" y2="3.5" stroke="#FFFFFF" strokeWidth="2"/>
      <line x1="0" y1="0" x2="10" y2="7" stroke="#CC0000" strokeWidth="0.6"/>
      <line x1="10" y1="0" x2="0" y2="7" stroke="#CC0000" strokeWidth="0.6"/>
      {/* Southern Cross — red stars */}
      <polygon points="15,3 15.4,4.2 16.6,4.2 15.7,5 16,6.2 15,5.5 14,6.2 14.3,5 13.4,4.2 14.6,4.2" fill="#CC0000" transform="scale(0.7) translate(7,1)"/>
      <circle cx="16" cy="5" r="0.7" fill="#CC0000"/>
      <circle cx="14.5" cy="8" r="0.7" fill="#CC0000"/>
      <circle cx="17" cy="9" r="0.7" fill="#CC0000"/>
    </svg>
  ),

  'Sri Lanka': ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#8D153A"/>
      <rect x="0" y="0" width="3" height="14" fill="#FF7300"/>
      <rect x="3" y="0" width="3" height="14" fill="#009A44"/>
      <rect x="6" y="1" width="13" height="12" fill="#FFB612" rx="1"/>
      {/* Lion simplified */}
      <rect x="7" y="2.5" width="9" height="9" fill="#8D153A" rx="0.5"/>
      <text x="11.5" y="9" textAnchor="middle" fontSize="7" fill="#FFB612" fontWeight="bold">♦</text>
    </svg>
  ),

  Afghanistan: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="6.67" height="14" fill="#000000"/>
      <rect x="6.67" width="6.67" height="14" fill="#D32011"/>
      <rect x="13.33" width="6.67" height="14" fill="#009A44"/>
      {/* Emblem centre */}
      <circle cx="10" cy="7" r="2.5" fill="none" stroke="#FFFFFF" strokeWidth="0.7"/>
      <text x="10" y="8.5" textAnchor="middle" fontSize="3.5" fill="#FFFFFF">☪</text>
    </svg>
  ),

  Bangladesh: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#006A4E"/>
      <circle cx="9" cy="7" r="4.5" fill="#F42A41"/>
    </svg>
  ),

  Zimbabwe: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#006400"/>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} y={i*2.33} width="20" height="2.33"
          fill={['#006400','#FFD200','#D21034','#000000','#D21034','#FFD200'][i]}/>
      ))}
      {/* White triangle */}
      <path d="M0 0 L8 7 L0 14" fill="#FFFFFF"/>
      {/* Black star */}
      <polygon points="4,7 4.6,8.8 6.5,8.8 5,9.9 5.6,11.7 4,10.6 2.4,11.7 3,9.9 1.5,8.8 3.4,8.8" fill="#D21034" transform="scale(0.7) translate(1.5, 3)"/>
    </svg>
  ),

  Singapore: ({ w, h }) => (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="7" fill="#EF3340"/>
      <rect y="7" width="20" height="7" fill="#FFFFFF"/>
      <circle cx="6" cy="3.5" r="2.2" fill="#FFFFFF"/>
      <circle cx="7.2" cy="3.5" r="2.2" fill="#EF3340"/>
      {/* Stars */}
      {[0,72,144,216,288].map((a, i) => {
        const r = ((a - 90) * Math.PI) / 180;
        return <circle key={i} cx={5.5 + 1.2*Math.cos(r)} cy={3.5 + 1.2*Math.sin(r)} r="0.4" fill="#FFFFFF"/>;
      })}
    </svg>
  ),
};

// Fallback for unknown nationalities
function DefaultFlag({ w, h, nat }) {
  return (
    <svg width={w} height={h} viewBox="0 0 20 14">
      <rect width="20" height="14" fill="#2a3050" rx="1"/>
      <text x="10" y="10" textAnchor="middle" fontSize="6" fill="#7a7870" fontFamily="monospace">
        {(nat || '??').slice(0, 3).toUpperCase()}
      </text>
    </svg>
  );
}

export default function CountryFlag({ nationality, width = 22, height = 15 }) {
  const Flag = FLAGS[nationality];
  const w = width;
  const h = height;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '2px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.12)',
      flexShrink: 0,
      lineHeight: 0,
    }}>
      {Flag ? <Flag w={w} h={h} /> : <DefaultFlag w={w} h={h} nat={nationality} />}
    </span>
  );
}
