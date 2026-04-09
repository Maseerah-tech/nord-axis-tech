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

const levelColors: Record<string, string> = {
  Beginner: 'text-cyan bg-cyan-light',
  Intermediate: 'text-amber bg-amber/10',
  Advanced: 'text-ink-secondary bg-background',
}

export default function TrainingCard({
  title,
  duration,
  level,
  variant,
  enrollLabel,
  enrollHref,
}: TrainingCardProps) {
  const accentBorder =
    variant === 'b2b'
      ? 'border-cyan/20 hover:border-cyan/40'
      : 'border-amber/20 hover:border-amber/40'

  return (
    <div className={`bg-white border ${accentBorder} p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm rounded-sm`}>
      <h3 className="font-display text-xl text-ink tracking-wide mb-4 leading-tight">{title}</h3>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="font-body text-xs font-medium text-muted bg-background border border-border px-2.5 py-1 rounded-sm">
          {duration}
        </span>
        <span className={`font-body text-xs font-semibold px-2.5 py-1 rounded-sm ${levelColors[level]}`}>
          {level}
        </span>
      </div>
      <Button variant={variant === 'b2b' ? 'primary' : 'secondary'} href={enrollHref}>
        {enrollLabel}
      </Button>
    </div>
  )
}
