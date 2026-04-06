// src/components/ui/Button.tsx
import { ReactNode } from 'react'
import Link from 'next/link'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}

const primaryStyle = {
  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
}

export default function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}: ButtonProps) {
  const base =
    'font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200 inline-block cursor-pointer select-none'
  const primary =
    'bg-cyan text-background font-bold hover:opacity-90 disabled:opacity-50'
  const secondary =
    'border border-cyan/40 text-cyan hover:border-cyan hover:bg-cyan/5 disabled:opacity-50'

  const cls = `${base} ${variant === 'primary' ? primary : secondary} ${className}`
  const style = variant === 'primary' ? primaryStyle : undefined

  if (href) {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} style={style} disabled={disabled}>
      {children}
    </button>
  )
}
