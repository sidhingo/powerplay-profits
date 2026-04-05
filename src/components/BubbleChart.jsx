import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell, Customized
} from 'recharts';
import { ROLE_COLORS } from '../utils/constants';

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{d.name}</strong>
      <div>{d.team} · {d.role}</div>
      <div>₹{d.auction_price_cr}cr · #{d.global_rank} overall · Score {d.global_score}</div>
      {d.season_status === 'in_progress' && d.prediction && (
        <div style={{ color: '#93c5fd' }}>Predicted: {d.prediction.tier}</div>
      )}
    </div>
  );
}

function QuadrantLabels(props) {
  const { xAxisMap, yAxisMap } = props;
  if (!xAxisMap || !yAxisMap) return null;
  const xAxis = xAxisMap[Object.keys(xAxisMap)[0]];
  const yAxis = yAxisMap[Object.keys(yAxisMap)[0]];
  if (!xAxis || !yAxis) return null;

  const top    = yAxis.y;
  const bottom = yAxis.y + yAxis.height;
  const left   = xAxis.x;
  const right  = xAxis.x + xAxis.width;

  const labels = [
    { text: '↖ STEALS',   sub: 'high score · low price',  cx: left  + 10, cy: top    + 16, anchor: 'start', color: '#22c55e' },
    { text: '↗ WORTH IT', sub: 'high score · high price', cx: right - 10, cy: top    + 16, anchor: 'end',   color: '#f59e0b' },
    { text: '↙ CHEAP',    sub: 'low score · low price',   cx: left  + 10, cy: bottom - 28, anchor: 'start', color: '#7a7568' },
    { text: '↘ OVERPAID', sub: 'low score · high price',  cx: right - 10, cy: bottom - 28, anchor: 'end',   color: '#f87171' },
  ];

  return (
    <g>
      {labels.map((l, i) => (
        <g key={i}>
          <text x={l.cx} y={l.cy} fill={l.color} fontSize={11}
            fontFamily="Syne, sans-serif" fontWeight={700}
            textAnchor={l.anchor} opacity={0.45}>{l.text}</text>
          <text x={l.cx} y={l.cy + 14} fill={l.color} fontSize={9}
            fontFamily="JetBrains Mono, monospace"
            textAnchor={l.anchor} opacity={0.28}>{l.sub}</text>
        </g>
      ))}
    </g>
  );
}

// ── Square-root transform: spreads low values, compresses high values ──
// transform(x) maps score 0-100 → plot position 0-100
// inverse(y)   maps plot position 0-100 → display score
function transform(score)  { return Math.sqrt(score) * 10; }
function inverse(plotVal)  { return Math.round((plotVal / 10) ** 2); }

export default function BubbleChart({ players, season }) {
  // Include ALL players — no filtering
  const data = players.map(p => ({
    ...p,
    x:       p.auction_price_cr,
    y:       p.global_score,
    yPlot:   transform(p.global_score),   // transformed Y for plotting
  }));

  const sortedPrices = [...data].map(d => d.x).sort((a, b) => a - b);
  const sortedScores = [...data].map(d => d.y).sort((a, b) => a - b);

  const medPrice    = +(sortedPrices[Math.floor(sortedPrices.length / 2)] || 12).toFixed(1);
  const medScore    = +(sortedScores[Math.floor(sortedScores.length / 2)] || 50).toFixed(1);
  const medScorePlt = transform(medScore);
  const maxPrice    = Math.max(...sortedPrices, 10) + 2;

  // Tick marks on Y axis — show real score values, plot at transformed positions
  const yTicks      = [0, 5, 10, 20, 30, 50, 75, 100];
  const yTicksPlot  = yTicks.map(transform);

  return (
    <div className="chart-wrap">
      <div className="chart-title">
        Value vs Price — {season}{season === 2026 ? ' (Projected)' : ''}
      </div>
      <div className="chart-sub">
        Median price ₹{medPrice}cr · Median score {medScore} · Y axis uses square-root scale to spread low scores
      </div>

      <div className="chart-legend" style={{ marginBottom: 4 }}>
        {['Batter', 'Bowler', 'All-rounder'].map(role => (
          <span key={role} className="legend-item">
            <span className="legend-dot" style={{ background: ROLE_COLORS[role] }} />
            {role}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={440}>
        <ScatterChart margin={{ top: 24, right: 24, bottom: 36, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />

          <XAxis
            dataKey="x"
            type="number"
            domain={[0, maxPrice]}
            tick={{ fill: '#7a7568', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={v => `₹${v}cr`}
            label={{ value: 'Auction Price (₹cr)', position: 'insideBottom', offset: -18, fill: '#7a7568', fontSize: 11 }}
          />
          <YAxis
            dataKey="yPlot"
            type="number"
            domain={[0, 100]}
            ticks={yTicksPlot}
            tickFormatter={v => inverse(v)}
            tick={{ fill: '#7a7568', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            label={{ value: 'Value Score', angle: -90, position: 'insideLeft', fill: '#7a7568', fontSize: 11 }}
          />

          <Tooltip content={<ChartTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.15)' }} />

          <ReferenceLine
            x={medPrice}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <ReferenceLine
            y={medScorePlt}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />

          <Customized component={QuadrantLabels} />

          <Scatter dataKey="yPlot" data={data} r={7}>
            {data.map((d, i) => (
              <Cell key={i} fill={ROLE_COLORS[d.role] || '#888'} opacity={0.85} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}