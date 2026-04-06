// src/components/ui/ContactForm.tsx
'use client'
import { useState, FormEvent } from 'react'
import Button from './Button'

interface ContactFormProps {
  labels: {
    name: string
    company: string
    email: string
    phone: string
    service: string
    serviceOptions: string[]
    message: string
    submit: string
    submitting: string
    success: string
    error: string
  }
}

export default function ContactForm({ labels }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch('https://formspree.io/f/mgoprdge', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) { setStatus('success'); form.reset() }
      else setStatus('error')
    } catch { setStatus('error') }
  }

  if (status === 'success') {
    return (
      <div className="bg-card border border-cyan/30 p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-2 h-2 rounded-full bg-cyan animate-pulse mb-4" />
        <p className="font-mono text-sm text-cyan tracking-widest">{labels.success}</p>
      </div>
    )
  }

  const inputClass = 'w-full bg-surface border border-border px-4 py-3 font-body text-sm text-white placeholder:text-muted focus:outline-none focus:border-cyan/50 transition-colors'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="name" required placeholder={labels.name} className={inputClass} />
        <input name="company" placeholder={labels.company} className={inputClass} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="email" type="email" required placeholder={labels.email} className={inputClass} />
        <input name="phone" type="tel" placeholder={labels.phone} className={inputClass} />
      </div>
      <select name="service" className={`${inputClass} cursor-pointer`} defaultValue="">
        <option value="" disabled>{labels.service}</option>
        {labels.serviceOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <textarea name="message" required rows={5} placeholder={labels.message} className={`${inputClass} resize-none`} />
      {status === 'error' && <p className="font-mono text-xs text-red-400">{labels.error}</p>}
      <Button type="submit" variant="primary" disabled={status === 'sending'}>
        {status === 'sending' ? labels.submitting : labels.submit}
      </Button>
    </form>
  )
}
