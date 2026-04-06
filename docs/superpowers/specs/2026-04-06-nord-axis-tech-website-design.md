# Nord Axis Tech — Website Design Spec
**Date:** 2026-04-06  
**Author:** AnassElk (anasselkettani@gmail.com)  
**Status:** Approved

---

## 1. Project Overview

A complete multi-page marketing website for **Nord Axis Tech** — an industrial technology company specialising in AI, Industry 4.0/5.0, Predictive Maintenance, Robotics, Sustainable Energy, and B2B/B2C Training.

**Domain:** nord-axis-tech.com  
**GitHub:** AnassElk/nord-axis-tech  
**Deployment:** Self-hosted Coolify instance, auto-deploy on push to `main`

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, RSC, image optimisation |
| Styling | Tailwind CSS | Utility-first, `rtl:` variant for Arabic |
| Animations | Framer Motion | Scroll-triggered, reduced-motion support |
| Icons | Lucide React | Consistent SVG icon set |
| i18n | next-intl | Best App Router support, typed translations |
| Forms | Formspree (`mgoprdge`) | Zero-backend contact form |
| Fonts | Google Fonts (Bebas Neue, DM Sans, Space Mono) | |
| Deployment | Coolify + Docker (multi-stage) | Self-hosted, Let's Encrypt SSL, auto-deploy |

---

## 3. i18n Architecture

**Approach:** `next-intl` with locale-prefix routing.

- **Supported locales:** `en` (default), `fr`, `ar`
- **URL structure:** `/en/...`, `/fr/...`, `/ar/...`
- **Root `/`** → redirected to `/en` via middleware
- **RTL:** `<html dir="rtl" lang="ar">` injected for Arabic locale; Tailwind `rtl:` variants used for layout mirroring
- **hreflang:** alternate links injected in `<head>` on every page for SEO
- **Language switcher:** in Navbar, preserves current path segment across locales

**Translation file structure:**
```
messages/
  en/  common.json  home.json  services.json  about.json  training.json  contact.json
  fr/  (same)
  ar/  (same — RTL strings)
```

---

## 4. Design System

### 4.1 Color Palette (Tailwind `extend.colors`)

| Token | Hex | Usage |
|---|---|---|
| `background` | `#080B0F` | Page background |
| `surface` | `#0D1117` | Sections, containers |
| `card` | `#111820` | Cards, panels |
| `cyan` | `#00C8B4` | Primary accent, CTA, headings |
| `amber` | `#F59E0B` | Secondary accent, B2C, CO₂ stat |
| `white` | `#E8EDF2` | Body text |
| `muted` | `#6B7A8D` | Secondary text, labels |
| `border` | `rgba(0,200,180,0.15)` | Card borders, dividers |

### 4.2 Typography

| Role | Font | Weight |
|---|---|---|
| Display / H1–H3 | Bebas Neue | 400 (inherently bold) |
| Body / paragraphs | DM Sans | 300, 400, 500 |
| Labels / mono / HUD | Space Mono | 400 |

Loaded via `next/font/google` in root `layout.tsx` and passed as CSS variables.

### 4.3 HUD Signature Elements

All sections use a "tactical interface" aesthetic:

- **Background texture:** CSS grid overlay (32px grid, `rgba(0,200,180,0.04)` lines) + SVG noise filter at very low opacity
- **Corner brackets:** Absolute-positioned `::before`/`::after` or `<div>` elements — cyan top corners, amber bottom corners — wrap hero and CTA sections
- **Scan-line:** 1px horizontal gradient (`transparent → cyan → transparent`) that animates top→bottom on hero, 4s infinite loop
- **System tag:** Pulsing dot + `SYS.ONLINE // INDUSTRY 4.0→5.0` in Space Mono above hero headline
- **Section labels:** `01 — SECTION NAME` in Space Mono cyan + fading horizontal rule
- **Cut-corner button:** `clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)` — primary cyan fill, secondary outlined
- **Hexagons:** Used as decorative SVG shapes in service cards and about page

### 4.4 Motion Rules

| Element | Animation | Duration |
|---|---|---|
| Section entries | FadeUp (y: 24→0, opacity 0→1) | 0.5s easeOut |
| Stagger children | 0.08s delay between siblings | — |
| Ticker strip | CSS `translateX` infinite loop | 30s linear |
| Scan line | keyframe top→bottom | 4s infinite |
| Hover states | scale 1.02, border glow | 0.2s |
| `prefers-reduced-motion` | All animations disabled via `useReducedMotion()` | — |

### 4.5 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| 375px (mobile) | Stacked layout, hero stats hidden, hamburger nav |
| 768px (tablet) | 2-col grids, stats appear below headline |
| 1280px+ (desktop) | Full side-by-side hero, 4-col service grid |
| RTL (ar) | Tailwind `rtl:` variants flip padding, margin, text-align |

---

## 5. Logo

Text-only logo: **`NORD <cyan>AXIS</cyan> TECH`** in Bebas Neue.  
- "NORD" and "TECH" in `#E8EDF2`  
- "AXIS" in `#00C8B4` (cyan)  
- Thin 1px vertical separator between NORD and AXIS  
- Rendered as a `<span>` element — no image file required  
- Placeholder `<Image>` slot left in `Navbar.tsx` for future SVG logo

---

## 6. File & Route Structure

```
src/
  app/
    [locale]/
      layout.tsx          ← sets <html lang dir>, loads fonts, wraps Navbar + Footer
      page.tsx            ← Homepage
      services/page.tsx
      about/page.tsx
      training/page.tsx
      contact/page.tsx
    layout.tsx            ← root layout (minimal)
    not-found.tsx
  components/
    layout/
      Navbar.tsx          ← fixed top, blur backdrop, logo, links, locale switcher, CTA
      Footer.tsx          ← logo, nav links, copyright
    ui/
      Button.tsx          ← primary (cyan cut-corner) + secondary (outlined) variants
      SectionLabel.tsx    ← "01 — LABEL" mono tag with fading rule
      ServiceCard.tsx     ← number, icon, title, description, tags, CTA
      TrainingCard.tsx    ← title, duration badge, level badge, enroll CTA
      Ticker.tsx          ← infinite scroll keyword strip
      FadeUp.tsx          ← Framer Motion scroll-triggered wrapper
    sections/             ← per-page section sub-components
  lib/
    i18n.ts               ← next-intl config
  middleware.ts           ← locale detection + redirect
messages/
  en/ fr/ ar/             ← JSON translation namespaces
public/
  favicon.ico             ← "N" monogram placeholder
  fonts/                  ← (if self-hosting fonts)
docs/
  superpowers/specs/      ← this file
Dockerfile                ← multi-stage build
docker-compose.yml        ← optional local dev
next.config.ts            ← output: 'standalone', next-intl plugin
tailwind.config.ts        ← extended color tokens
.gitignore
```

---

## 7. Pages — Content Specification

### 7.1 Homepage (`/`)

| Section | Content |
|---|---|
| **Hero** | System tag `SYS.ONLINE // INDUSTRY 4.0→5.0` · H1: INDUSTRIAL / **INTELLIGENCE** (cyan) / REDEFINED (ghost) · Subtext · 2 CTAs · Floating stats: 4.0→5.0 / 360° / 0 CO₂ · Corner brackets · Scan-line |
| **Ticker** | AI · Predictive Maintenance · Industrial IoT · Robotics & Automation · Energy 2.0 · Digital Twins · Supply Chain AI · Cobot Integration · ESG Compliance · Data Science |
| **Services Preview** | 4 cards: Industrial Intelligence · Maintenance 4.0→5.0 · Engineering & Automation · Sustainable Energy |
| **Why Nord Axis** | 3 features: Integrated Approach · Sustainability by Design · Future-Proof Architecture |
| **Training Teaser** | 2 cards side-by-side: B2B Corporate (cyan) · B2C Individual (amber) |
| **CTA Banner** | Quote: "Navigating the Nexus of Industry and Intelligence." · Start a Project + View Services |

### 7.2 Services (`/services`)

Four service pillars, each with:
- 3–4 paragraph detailed description
- Key capabilities as tags
- Use case examples
- "Get a quote" CTA

**Pillars:**
1. Industrial Intelligence — AI Models, Data Science, Predictive Analytics
2. Maintenance 4.0→5.0 — IoT Sensors, Cobots, Condition Monitoring
3. Engineering & Automation — Robotics, Digital Twins, Smart Lines
4. Sustainable Energy — Energy 2.0, ESG, Real-Time Monitoring

Layout: alternating left/right image+text on desktop, stacked on mobile.

### 7.3 About (`/about`)

| Section | Content |
|---|---|
| **Mission Statement** | Full-width large-text quote |
| **What We Stand For** | 3 pillars: Innovation · Intelligence · Sustainability |
| **Team / Culture** | Placeholder cards: CEO, CTO, Lead Engineer, Data Scientist, Energy Specialist |
| **Timeline** | "Our Journey" — vertical milestone line with placeholder dates/milestones |

### 7.4 Training (`/training`)

**B2B Programs** (cyan accent):
- AI & Machine Learning for Industry · Predictive Maintenance Certification · Automation & Cobot Operations · Energy Management 4.0

**B2C Programs** (amber accent):
- Industry 4.0 Fundamentals · Industrial Data Science · IoT & Sensor Systems · Sustainable Engineering Practices

Each card: title · duration (placeholder) · level badge (Beginner / Intermediate / Advanced) · Enroll CTA

### 7.5 Contact (`/contact`)

**Form fields:** Name · Company · Email · Phone · Service Interest (dropdown) · Message  
**Action:** POST to `https://formspree.io/f/mgoprdge`  
**Side panel:** Email · LinkedIn · Location · Response time note

---

## 8. SEO & Metadata

Each page exports a `generateMetadata()` function:

```ts
{
  title: "Nord Axis Tech | [Page Name]",
  description: "[155-char page description]",
  openGraph: { title, description, type: "website" },
  alternates: { languages: { en: "/en/...", fr: "/fr/...", ar: "/ar/..." } }
}
```

---

## 9. Deployment

### Dockerfile (multi-stage)
```
deps    → node:20-alpine, npm ci
builder → copy deps, copy source, npm run build
runner  → copy public + .next/standalone + .next/static, EXPOSE 3000, CMD node server.js
```

### next.config.ts
```ts
output: 'standalone'
```

### Coolify Setup
1. New Resource → Application → GitHub → AnassElk/nord-axis-tech
2. Build Pack: Dockerfile
3. Branch: main · Port: 3000
4. Domain: nord-axis-tech.com · HTTPS: enabled (Let's Encrypt auto)
5. Auto Deploy: enabled

### Git Workflow
```
git init
git remote add origin https://github.com/AnassElk/nord-axis-tech.git
git add .
git commit -m "feat: initial Nord Axis Tech website"
git branch -M main
git push -u origin main
```

### .gitignore additions
```
node_modules/
.next/
.env.local
.vercel/
.superpowers/
```

---

## 10. Quality Constraints

- All components TypeScript (`.tsx`)
- No inline styles — Tailwind classes only
- No placeholder "Lorem ipsum" — real Nord Axis Tech content throughout
- `<Image>` component for all images with `width`/`height`
- Lighthouse target: Performance ≥ 90, Accessibility ≥ 90
- `prefers-reduced-motion` respected via `useReducedMotion()` on all animations
- RTL fully supported via Tailwind `rtl:` variants and `dir="rtl"` on `<html>`
