// src/components/ui/SectionLabel.tsx
interface SectionLabelProps {
  number: string
  label: string
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="font-mono text-xs text-cyan tracking-widest uppercase">
        {number} — {label}
      </span>
      <div
        className="section-label-line flex-1 h-px max-w-[120px]"
        style={{
          background: 'linear-gradient(to right, rgba(0,200,180,0.3), transparent)',
        }}
      />
    </div>
  )
}
