# Powerplay Profits 🏏

**IPL Auction ROI — ranking every crore spent**

Live at: [powerplay-profits.vercel.app](https://powerplay-profits.vercel.app)

---

## What is this?

Powerplay Profits ranks IPL players by the value they delivered relative to their auction price. The more a player delivers relative to what their franchise paid, the higher they rank.

Four seasons covered: 2023 (complete), 2024 (complete), 2025 (complete), 2026 (live predictions).

---

## How the scores work

**Batters**
`(runs / matches) × (strike rate / 100) × availability`
Rewards volume and speed equally. Availability adjusts for missed games.

**Bowlers**
`(wickets / match) × economy multiplier × availability`
Economy is benchmarked against the season average — not a fixed number — so comparisons are fair across years.

| Season | Avg Economy |
|--------|-------------|
| 2023   | 8.74        |
| 2024   | 8.90        |
| 2025   | 9.10        |

**All-rounders**
`55% batting + 45% bowling × dual-contribution bonus`
A 15% bonus applies when SR ≥ 130 AND wickets ≥ 8. Rewards players doing two roles from one roster slot.

**Value Score**
`contribution ÷ auction price (₹cr)`
Normalized 0–100 across all players for the overall rank. Normalized separately within each role for the role rank.

---

## Verdicts

| Label | Meaning |
|-------|---------|
| STEAL | High score, low price |
| WORTH IT | High score, high price |
| CHEAP | Low score, low price |
| OVERPAID | Low score, high price |

---

## 2026 Predictions

2026 is mid-season. Predictions are derived from averaging each player's 2023, 2024, and 2025 contributions, divided by their 2026 auction price. Data pips on each card show how many prior seasons fed the model.

---

## Stack

- Vite + React
- Recharts (scatter chart)
- Static JSON data — ESPNCricinfo season stats + public auction records
- Deployed on Vercel

---

## Run locally
```bash
npm install
npm run dev
```

---

## Disclaimer

Fan project. Stats sourced from ESPNCricinfo and public auction records. Not affiliated with the BCCI, IPL, or any franchise. Numbers do not capture everything.
