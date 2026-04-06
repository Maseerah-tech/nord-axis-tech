// src/components/ui/TrainingCard.tsx
import Button from './Button'

interface TrainingCardProps {
  title: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  variant: 'b2b' | 'b2c'
  enrollLabel: string
  enrollHref: string
}

const levelStyles: Record<string, string> = {
  Beginner: 'text-emerald-400 border-emerald-400/30',
  Intermediate: 'text-cyan border-cyan/30',
  Advanced: 'text-amber border-amber/30',
}

export default function TrainingCard({
  title,
  duration,
  level,
  variant,
  enrollLabel,
  enrollHref,
}: TrainingCardProps) {
  const borderStyle =
    variant === 'b2b'
      ? 'border-cyan/20 hover:border-cyan/40'
      : 'border-amber/20 hover:border-amber/40'

  return (
    <div className={`bg-card border ${borderStyle} p-6 transition-all duration-300 hover:-translate-y-1`}>
      <h3 className="font-display text-lg text-white tracking-wider mb-3">{title}</h3>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <span className="font-mono text-xs text-muted border border-muted/20 px-2 py-1">
          {duration}
        </span>
        <span className={`font-mono text-xs border px-2 py-1 ${levelStyles[level]}`}>
          {level}
        </span>
      </div>
      <Button variant={variant === 'b2b' ? 'primary' : 'secondary'} href={enrollHref}>
        {enrollLabel}
      </Button>
    </div>
  )
}
