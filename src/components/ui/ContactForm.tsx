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
      <div className="bg-white border border-cyan/25 p-8 flex flex-col items-center justify-center min-h-[400px] text-center rounded-sm">
        <div className="w-8 h-8 rounded-full bg-cyan-light flex items-center justify-center mb-4">
          <div className="w-2 h-2 rounded-full bg-cyan" />
        </div>
        <p className="font-body text-sm font-semibold text-ink mb-1">{labels.success}</p>
        <p className="font-body text-xs text-muted">We will be in touch within 24 hours.</p>
      </div>
    )
  }

  const inputBase =
    'w-full bg-white border border-border px-4 py-3 font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-cyan transition-colors rounded-sm'

  const fields = [
    { id: 'name', name: 'name', type: 'text', label: labels.name, required: true, autoComplete: 'name' },
    { id: 'company', name: 'company', type: 'text', label: labels.company, required: false, autoComplete: 'organization' },
    { id: 'email', name: 'email', type: 'email', label: labels.email, required: true, autoComplete: 'email' },
    { id: 'phone', name: 'phone', type: 'tel', label: labels.phone, required: false, autoComplete: 'tel' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.slice(0, 2).map((f) => (
          <div key={f.id}>
            <label htmlFor={f.id} className="block font-body text-xs font-semibold text-ink-secondary mb-1.5 tracking-wide">
              {f.label}{f.required && <span className="text-cyan ml-0.5">*</span>}
            </label>
            <input
              id={f.id}
              name={f.name}
              type={f.type}
              required={f.required}
              autoComplete={f.autoComplete}
              placeholder={f.label}
              className={inputBase}
            />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.slice(2, 4).map((f) => (
          <div key={f.id}>
            <label htmlFor={f.id} className="block font-body text-xs font-semibold text-ink-secondary mb-1.5 tracking-wide">
              {f.label}{f.required && <span className="text-cyan ml-0.5">*</span>}
            </label>
            <input
              id={f.id}
              name={f.name}
              type={f.type}
              required={f.required}
              autoComplete={f.autoComplete}
              placeholder={f.label}
              className={inputBase}
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="service" className="block font-body text-xs font-semibold text-ink-secondary mb-1.5 tracking-wide">
          {labels.service}
        </label>
        <select id="service" name="service" className={`${inputBase} cursor-pointer`} defaultValue="">
          <option value="" disabled>{labels.service}</option>
          {labels.serviceOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block font-body text-xs font-semibold text-ink-secondary mb-1.5 tracking-wide">
          {labels.message}<span className="text-cyan ml-0.5">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={labels.message}
          className={`${inputBase} resize-none`}
        />
      </div>
      {status === 'error' && (
        <p className="font-body text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-sm" role="alert">
          {labels.error}
        </p>
      )}
      <Button type="submit" variant="primary" disabled={status === 'sending'}>
        {status === 'sending' ? labels.submitting : labels.submit}
      </Button>
    </form>
  )
}
