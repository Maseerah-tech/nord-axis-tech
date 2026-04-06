// src/components/ui/Ticker.tsx
'use client'

const KEYWORDS = [
  'Artificial Intelligence',
  'Predictive Maintenance',
  'Industrial IoT',
  'Robotics & Automation',
  'Energy 2.0',
  'Digital Twins',
  'Supply Chain AI',
  'Cobot Integration',
  'ESG Compliance',
  'Data Science',
]

export default function Ticker() {
  const items = [...KEYWORDS, ...KEYWORDS]

  return (
    <div className="ticker-container overflow-hidden border-y border-border py-3 bg-surface/60 backdrop-blur-sm">
      <div className="ticker-inner flex gap-0 animate-ticker whitespace-nowrap">
        {items.map((kw, i) => (
          <span
            key={i}
            className="font-mono text-xs text-muted tracking-widest uppercase px-8 shrink-0"
          >
            {kw}{' '}
            <span className="text-cyan mx-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
