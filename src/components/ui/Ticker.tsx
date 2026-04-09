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
    <div className="ticker-container overflow-hidden border-y border-border bg-white py-3">
      <div className="ticker-inner flex gap-0 animate-ticker whitespace-nowrap">
        {items.map((kw, i) => (
          <span
            key={i}
            className="font-body text-xs font-medium text-muted tracking-wide px-8 shrink-0"
          >
            {kw}
            <span className="text-muted/40 mx-4">—</span>
          </span>
        ))}
      </div>
    </div>
  )
}
