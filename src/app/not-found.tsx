// src/app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ background: '#080B0F', color: '#E8EDF2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00C8B4', letterSpacing: '3px', marginBottom: '16px' }}>404 — NOT FOUND</p>
          <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>LOST IN SPACE</h1>
          <Link href="/en" style={{ fontFamily: 'monospace', fontSize: '12px', color: '#00C8B4', border: '1px solid rgba(0,200,180,0.4)', padding: '12px 24px' }}>
            RETURN TO BASE
          </Link>
        </div>
      </body>
    </html>
  )
}
