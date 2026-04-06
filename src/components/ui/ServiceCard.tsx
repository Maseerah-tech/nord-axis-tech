// src/components/ui/ServiceCard.tsx
import { LucideIcon } from 'lucide-react'

interface ServiceCardProps {
  number: string
  icon: LucideIcon
  title: string
  description: string
  tags: string[]
}

export default function ServiceCard({
  number,
  icon: Icon,
  title,
  description,
  tags,
}: ServiceCardProps) {
  return (
    <div className="group relative bg-card border border-border p-6 overflow-hidden hover:border-cyan/30 transition-all duration-300 hover:-translate-y-1">
      {/* HUD corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan/30 group-hover:border-cyan transition-colors duration-300" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan/30 group-hover:border-cyan transition-colors duration-300" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-amber/20 group-hover:border-amber/50 transition-colors duration-300" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-amber/20 group-hover:border-amber/50 transition-colors duration-300" />

      <span className="font-mono text-xs text-muted tracking-widest">{number}</span>
      <Icon className="w-8 h-8 text-cyan mt-3 mb-4" strokeWidth={1.5} />
      <h3 className="font-display text-xl text-white tracking-wider mb-2">{title}</h3>
      <p className="font-body text-sm text-muted leading-relaxed mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-xs text-muted border border-muted/20 px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
