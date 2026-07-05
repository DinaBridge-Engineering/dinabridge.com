# DinaBridge Design System — v4.1.0

Last updated: 2026-07-04  
Branch: `redesign/v4-engineering-minimal`

---

## Philosophy

Design earns attention through **typography and layout**, not effects.
The site communicates engineering competence by being precise, not decorative.

Every decision should pass this test:
> Does this help the visitor understand what DinaBridge does, who it's for, why it's different, or how to engage? If not, remove it.

---

## Tokens (v4.css `:root`)

| Token | Value | Use |
|---|---|---|
| `--v4-navy` | `#0A192F` | Headings, primary text, buttons |
| `--v4-navy-2` | `#3D5166` | Body text |
| `--v4-ink-3` | `#6B7C93` | Labels, small text, monospace |
| `--v4-blue` | `#1A73E8` | Single accent — diagram lines, links |
| `--v4-paper` | `#FCFDFE` | Default page background |
| `--v4-paper-2` | `#F0F4FA` | One tinted section (How We Engage) |
| `--v4-rule` | `rgba(10,25,47,.08)` | Row dividers |
| `--v4-rule-strong` | `rgba(10,25,47,.14)` | Card borders, section borders |

---

## Typography

- **Font**: Inter 400/500/600 only. Never 700+.
- **Headings**: `font-weight: 600`, negative `letter-spacing`.
- **Body**: `font-weight: 400`, `line-height: 1.75`, `color: var(--v4-navy-2)`.
- **Labels/mono**: `font-family: 'Courier New'`, `font-size: 0.75rem`, `color: var(--v4-ink-3)`.
- **Max line width**: `65ch` for all body paragraphs.
- No gradient text. No italic except `For: ...` audience lines.

### Type Scale
| Class | Size | Weight | Use |
|---|---|---|---|
| `.v4-h1` | `clamp(2.4rem, 4.5vw, 4rem)` | 600 | Page hero |
| `.v4-h2` | `clamp(1.6rem, 2.8vw, 2.25rem)` | 600 | Section headers |
| `.v4-h3` | `1rem` | 600 | Card titles |
| `.v4-section-number` | `0.72rem` | 500 | Editorial section labels |

---

## Numbered Section Header Pattern

Every major section uses a two-part editorial header:

```html
<span class="v4-section-number">01 — What We Do</span>
<h2 class="v4-h2">Section headline.</h2>
```

Rules:
- Number format: `NN — Title Case`
- `v4-section-number`: `0.72rem`, `font-weight: 500`, `letter-spacing: 0.06em`, `text-transform: uppercase`, `color: var(--v4-ink-3)`
- No decorative pills, borders, or lines around the number.
- Number and h2 live in the same `.v4-section-header` container.

---

## Practices Table Pattern

Replaces card grids. Use for listing services/practices.

```html
<div class="v4-practices-table">
  <a href="/page.html" class="v4-practice-row">
    <span class="v4-practice-num">01</span>
    <span class="v4-practice-name">Practice Name</span>
    <span class="v4-practice-desc">One-line description.</span>
    <span class="v4-practice-stack">Tool A · Tool B · Tool C</span>
    <span class="v4-practice-arrow">→</span>
  </a>
</div>
```

Rules:
- Border: `1px solid var(--v4-rule-strong)`, `border-radius: 4px`
- Row hover: `background: rgba(10,25,47,.02)` only — no transform
- Stack tags: monospace, `0.75rem`, `--v4-ink-3`
- Arrow shifts `3px` on hover — the only motion on this element

---

## Three Engagement Card Pattern

Three equal-width cards for Direct / White-label / Embedded engagement modes.

```html
<div class="v4-engage-grid">
  <div class="v4-engage-card">
    <span class="v4-engage-mode">// DIRECT</span>
    <p class="v4-engage-for">For: in-house engineering teams</p>
    <h3 class="v4-h3">Card Title</h3>
    <ul class="v4-engage-list">...</ul>
  </div>
</div>
```

Rules:
- Mode label: monospace, `0.75rem`, `--v4-ink-3`
- For line: italic, `0.8125rem`, `--v4-ink-3`
- No CTA button inside the card
- Hover: border darkens only (`rgba(10,25,47,.28)`) — no transform
- No gradient borders, glow effects, or `::before` decorative lines

---

## Inline SVG Illustration Rules

All illustrations must be inline SVG. No image files for diagrams.

Allowed elements: `rect`, `line`, `polyline`, `path`, `circle`, `text`  
Allowed colors:
- `#0A192F` — primary structure
- `#3D5166` — secondary structure
- `rgba(10,25,47,.08)` — fill tints
- `#1A73E8` — one accent line per diagram (client request, primary shard, etc.)

Forbidden:
- Gradients (`linearGradient`, `radialGradient`)
- Filters (`filter`, `feBlur`, `feDropShadow`)
- Decorative blobs or rounded shapes with no semantic meaning

Font inside SVG: `'Courier New', monospace`, `8–11px`, `fill: var(--v4-ink-3)` or `var(--v4-navy)`

The diagram must explain something real: a pipeline, a topology, a flow. It should look like it belongs in an engineering RFC.

---

## Section Backgrounds

- Default: `var(--v4-paper)` — `#FCFDFE`
- **One section only** may use `var(--v4-paper-2)` (`#F0F4FA`): the process/how-we-engage section.
- No `section-dark`. No full-bleed gradients. No alternating background colors.

---

## Cards

- Background: `#ffffff`
- Border: `1px solid var(--v4-rule-strong)`
- Border-radius: `4px`
- Padding: `32px` (desktop), `20px` (mobile)
- Hover: border-color darkens only
- No: `box-shadow` layers, `transform: translateY`, gradient `::before` accents, glow

---

## Buttons

| Class | Style |
|---|---|
| `.v4-btn-primary` | Navy fill, white text, 4px radius, 9/20px padding |
| `.v4-btn-secondary` | Transparent, navy border, navy text, 4px radius |

Hover: color/border-color transition only. No `transform`. No shadow change.

---

## Motion

- Only `.reveal`: `opacity 0→1` + `translateY(10px)→0`, `0.45s ease`
- No bounce, scale, rotate, or parallax
- Interactive elements: `color` and `border-color` transition at `200ms` only
- The best animation is one visitors barely notice

---

## Removed (v4.0.0 → v4.1.0)

These patterns are permanently removed from the design system:

- `linearGradient` / `radialGradient` fills on UI elements
- `.engage-headline-gradient` (gradient headline text)
- `.why-headline-depth` (gradient headline text)
- Glassmorphism (`backdrop-filter`, `background: rgba(...,.72)`)
- Glow `box-shadow` on cards and icons
- `::before` gradient accent bars on cards
- `transform: translateY` on card hover
- Circular timeline (`timeline`, `timeline-num`) with connector lines
- 4-up practice card grid with colored icon circles
- Fake SaaS dashboard illustrations
- Oversized `font-weight: 800` headings
- Decorative `practices-label-accent` bar
- Two-card engagement grid (Advisory/Delivery only)
- `section-dark` backgrounds
- Photography or people imagery
