# DinaBridge Design System — v4.0.0
> **Version:** 4.0.0 · **Status:** ACTIVE
> Philosophy: Emil Kowalski · Linear · Vercel · Stripe Docs
> Tone: quiet, premium, architectural, engineered.
> Design relies on typography, spacing, alignment, grid, hierarchy — not visual effects.

---

## LAYER A — Design System (NEVER changes without explicit SYSTEM REDESIGN instruction)

### Design Principles
- No gradients anywhere
- No glassmorphism (no backdrop-filter blur)
- No glowing borders or colored shadows on cards
- No decorative ::before / ::after atmospheric layers
- No hover transforms on cards (translateY, scale, hard pop)
- Motion: opacity fade + small translateY (10px) only
- Every visual element must explain something or serve the layout

### Color Tokens
| Token | Value | Role |
|---|---|---|
| `--paper` | `#FCFDFE` | Page background |
| `--paper-2` | `#F0F4FA` | Tinted sections (one max) |
| `--navy` | `#0A192F` | Headings, primary text, buttons |
| `--ink` | `#0A192F` | Body text (same as navy) |
| `--ink-2` | `#3D5166` | Body copy, card text |
| `--ink-3` | `#6B7C93` | Labels, captions, footer, muted |
| `--rule` | `rgba(10,25,47,.07)` | Dividers, internal borders |
| `--rule-strong` | `rgba(10,25,47,.12)` | Card borders, stronger dividers |
| `--blue` | `#1A73E8` | Links, subtle tints only (≤10% opacity) |
| `--blue-mid` | `rgba(26,115,232,.08)` | Badge backgrounds |
| `--teal` | `#006e6b` | Legacy alias only — do not use for new UI |

**Removed in v4:** `--gemini-flare`, `--pink`, `--pink-soft`, `--indigo`, `--magenta`, `--gold`, all `--pg-*` variables.

### Typography
| Role | Font | Weight |
|---|---|---|
| Headings | `Inter` | 600 |
| Body / UI | `Inter` | 400, 500 |

Google Fonts load: `Inter:wght@400;500;600`

### Type Scale
```
--text-xs:   0.75rem
--text-sm:   0.9375rem
--text-base: 1rem
--text-lg:   1.125rem
--h1-size:   clamp(2.6rem, 5vw, 4.2rem)   weight 600  tracking -0.03em
--h2-size:   clamp(1.6rem, 3vw, 2.4rem)   weight 600  tracking -0.025em
--h3-size:   1rem                          weight 600  tracking -0.01em
```

### Spacing Scale (8px grid — strict)
```
--sp-4 through --sp-128
```
Section vertical padding: `var(--sp-80)` standard · Hero: `var(--sp-96)` top · Tight: `var(--sp-48)`

### Grid System
| Class | Columns | Gap |
|---|---|---|
| `.grid-1` | 1 col | sp-32 |
| `.grid-2` | 2 col | sp-32 |
| `.grid-3` | 3 col | sp-32 |
| `.grid-4` | 4 col → 2 col at 1024px → 1 col at 768px | sp-32 |
| `.team-grid` | `auto-fill minmax(260px, 1fr)` | sp-24 |

### Shadow System
```
--shadow-sm: 0 1px 2px rgba(0,0,0,.04), 0 2px 8px rgba(10,25,47,.06)
--shadow-md: 0 1px 4px rgba(0,0,0,.05), 0 8px 24px rgba(10,25,47,.08)
```
No colored shadows. No blue/pink glow shadows on cards.

### Radius System
```
--radius:    4px   (all cards, inputs, buttons)
--radius-md: 4px
--radius-lg: 4px
--radius-xl: 4px
--radius-full: 999px  (pill shapes only — discouraged)
```

### Button Rules
- `.btn-primary`: `background: #0A192F; color: #fff;` — no gradient
- `.btn-secondary`: `background: transparent; border: 1px solid var(--rule-strong);` — no gradient
- No hover transform on buttons
- No glow shadow on buttons

### Card Rules
- Cards: `border: 1px solid var(--rule-strong); background: #fff;`
- Hover: `border-color` darkens only — no transform, no shadow color, no glow
- No ::before / ::after decorative layers
- No gradient tops or bars

### Motion Rules
- `.reveal`: `opacity 0→1 + translateY(10px)→0` over `0.45s`
- No bouncing, scaling, or dramatic animations
- No `will-change: transform` on cards
- Card hover: border color change only

### Navigation Rules
- No backdrop-filter blur
- Brand mark: solid `#0A192F` square, no gradient
- Nav CTA: outlined button, fills on hover
- No gradient underline on links

### Component Inventory (must always exist in global.css)
- `.nav` + `.nav-inner` + `.nav-links` + `.nav-cta` + `.nav-burger` + `.nav-drawer`
- `.btn` + `.btn-primary` + `.btn-secondary`
- `.section` + `.section-tinted` + `.section-hero` + `.section-divider`
- `.card-base` + `.card-featured` + `.practice-card` + `.team-card` + `.trust-card`
- `.how-inner` + `.cta-box` + `.diff-stack`
- `.trust-bar` + `.trust-stat`
- `footer` + `.footer-inner` + `.footer-brand-block` + `.footer-nav`
- `.eyebrow` + `.badge-blue` + `.section-label`
- `.reveal` + `.reveal-delay-1/2/3/4`

---

## LAYER B — Page Content (can change freely)
- Text, headings, paragraphs, section copy
- Team bios, names, titles
- CTA button labels
- Blog posts and case studies
- Meta descriptions and page titles

## LAYER C — Page Behavior Rules (controlled updates only)
- CTA hover states
- Responsive breakpoints
- Animation timing
- Scroll behavior

---

## Page Structure Inventory

| Page | Required Sections |
|---|---|
| `index.html` | Hero · Practice cards · How we engage · How it works · Why DinaBridge · CTA |
| `elastic-consulting.html` | Hero · Practice areas · How section · CTA |
| `about.html` | Hero · Firm section · Stat bar · Team grid · Values · CTA |
| `contact.html` | Hero · Contact form + aside · CTA |
| `industries.html` | Hero · Industry cards · CTA |
| `elastic-migration.html` | Hero · Process · CTA |

---

## Removed in v4.0.0 (Do Not Restore)
- Playfair Display (replaced by Inter)
- `--gemini-flare` gradient and all usages
- Pink glow system (`--pg-*` variables and all ::after atmospheric layers)
- `section-dark` variant
- `backdrop-filter: blur` on nav
- `transform: translateY` hover on cards
- Hard 3D pop hover (`translate(-4px,-4px)` + colored shadow)
- Gradient text on h1/h2
- Decorative eyebrow pills with gradient borders
- `.footer-gem` italic ornament
- `.hero-proof` pill badges
- `.badge-pink` component

*Maintained by DinaBridge Engineering. Any change to Layer A requires explicit `SYSTEM REDESIGN` instruction.*

*v4.0.0 — Engineering Minimal — July 2026*
