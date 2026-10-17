---
name: روضتي Kindergarten OS (Dark Mode)
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#0b0f19'
  surface-container-low: '#111827'
  surface-container: '#1e293b'
  surface-container-high: '#273549'
  surface-container-highest: '#334155'
  on-surface: '#f8fafc'
  on-surface-variant: '#94a3b8'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#334155'
  outline-variant: '#1e293b'
  surface-tint: '#a4c9ff'
  primary: '#a4c9ff'
  on-primary: '#00315d'
  primary-container: '#60a5fa'
  on-primary-container: '#003a6b'
  inverse-primary: '#0060ac'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb2b7'
  on-tertiary: '#67001b'
  tertiary-container: '#ff7886'
  on-tertiary-container: '#780021'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#a4c9ff'
  on-primary-fixed: '#001c39'
  on-primary-fixed-variant: '#004883'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
  status-attendance-present: '#10b981'
  status-attendance-absent: '#f43f5e'
  status-attendance-late: '#f59e0b'
  status-health-exempt: '#38bdf8'
  glow-focus: '#3b82f640'
typography:
  display-lg:
    fontFamily: IBM Plex Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
  display-md:
    fontFamily: IBM Plex Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  caption:
    fontFamily: IBM Plex Sans
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-compact: 0.75rem
  margin: 1.5rem
  margin-window: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system introduces an ergonomic, deep-slate dark mode tailored for the desktop administration suite of early childhood centers. Operating continuously on local management terminals, it alleviates visual strain over prolonged operational sessions (daily attendance queues, health assessments, enrollment audits, and ledger monitoring) while retaining emotional warmth, safety, and institutional trust.

The visual style blends **Slate Neomorphism and Modern Tactile Clarity**:
- Deep obsidian and blue-gray slate foundations replace harsh true blacks, preventing retinal fatigue.
- Deliberate, luminous accent tiers provide clear glanceability across status-heavy surfaces without neon glare.
- Human-centric Arabic craftsmanship pairs crisp geometric layout rigor with soft, rounded contours, preserving the friendly atmosphere of a child-focused learning environment.

## Colors

The dark-mode palette is built upon deep blue-gray slate tonalities that preserve color fidelity and prevent high-contrast glare:

- **Primary (`#60a5fa`):** A soft, luminous cerulean blue calibrated for dark backgrounds. It commands primary action paths, active tabs, focused strokes, and key status toggles with AAA text contrast.
- **Secondary (`#f59e0b`):** Amber gold for pending authorizations, late check-ins, unsynced local drafts, and pending tuition invoices.
- **Tertiary (`#f43f5e`):** Ruby crimson reserved for active medical alerts, unexcused absences, urgent allergies, and destructive confirms.
- **Neutral Core (`#0f172a`):** Rich slate canvas that provides depth beneath elevated panels.

### Surface Elevation Hierarchy
- `surface-container-lowest` (`#0b0f19`): Deep recessed canvas, window chrome drag area, and table head backgrounds.
- `surface-container-low` (`#111827`): Base workspace canvas and structural layouts.
- `surface-container` (`#1e293b`): Primary content cards, side navigation panel, and data-grid rows.
- `surface-container-high` (`#273549`): Hovered states, modal overlays, search panels, and active chips.
- `surface-container-highest` (`#334155`): Dividers, structural outlines, disabled button fills, and popover menus.

### Semantic Status Suite
- **Present / Checked-in:** Soft emerald (`#10b981`) paired with dark emerald tint containers (`#064e3b50`).
- **Absent / Emergency:** Ruby rose (`#f43f5e`) with crimson tint containers (`#88133750`).
- **Late / Pending:** Amber orange (`#f59e0b`) with warm bronze containers (`#78350f50`).
- **Health / Note:** Sky cyan (`#38bdf8`) with blue containers (`#0c4a6e50`).

## Typography

Typography relies on `IBM Plex Sans` (utilizing the Arabic glyph subset) to provide clarity, legibility, and modern structural balance across RTL screens.

### RTL Rules & Font Rendering
- The entire application tree strictly implements `dir="rtl"`.
- Tabular numerals (`font-feature-settings: "tnum" 1`) are mandatory for attendance counts, birth dates, national ID fields, and tuition balances.
- Arabic text must never apply tracking or positive letter-spacing, ensuring glyph cursive ligatures remain unbroken.
- Line heights remain at or above 1.5× for body and display scales to accommodate Arabic diacritics without clipping.
- Muted secondary copy must use `#94a3b8` (Slate 400) to maintain crisp legibility without creating harsh white-on-black halos.

## Layout & Spacing

The layout is built for desktop applications, organized into a multi-pane operational console:

### Structural Breakpoints & Regions
- **Desktop Window Chrome (38px):** Frameless header containing window controls, breadcrumb path, and global sync pill.
- **Collapsible Navigation (Right Side):**
  - Expanded: `260px` fixed width with grouped operational modules (صفوف, أطفال, حضور وغياب, رسوم, تقارير صحية).
  - Compact: `68px` fixed width with tooltips emerging toward the left.
- **Main Workspace Canvas:** Dynamic fluid area conforming to grid margins (`margin: 1.5rem`) with structured internal scroll regions.

### Data Densities
- **Comfortable Mode (Default):** Row height of `52px`, container padding of `space-lg` (`1.25rem`), suited for daily touchpoints and classroom attendance entry.
- **Compact Audit Mode:** Row height of `38px`, padding of `space-sm` (`0.5rem`), suited for semester archive searches and ledger exports.

## Elevation & Depth

In dark mode, depth is expressed via surface brightness steps and subtle borders rather than heavy drop shadows:

- **Level 0 (Canvas Base):** `#0b0f19` and `#111827`. Background canvas with no shadow.
- **Level 1 (Card & Module Panels):** `#1e293b` surface framed by `1px solid #334155`. Subtle ambient drop: `0 1px 3px rgba(0, 0, 0, 0.4)`.
- **Level 2 (Flyouts, Popovers, & Dropdown Menus):** `#273549` with high-contrast `1px solid #475569` border. Shadow: `0 8px 16px -4px rgba(0, 0, 0, 0.6)`.
- **Level 3 (Modal Dialogs & Command Center):** `#1e293b` container elevated with `0 24px 38px 3px rgba(0, 0, 0, 0.7), 0 9px 46px 8px rgba(0, 0, 0, 0.5)`. Backdrop is dimmed using `#0b0f19cc` with a `backdrop-blur-md` filter.
- **Focus & Selection Glows:** Keyboard-focused elements emit a subtle 3px radial glow in `#3b82f640` with a sharp `1px` primary border.

## Shapes

The interface balances soft friendliness with structured organization using `roundedness: 2`:

- **Main Surface Cards & Data Panels:** `12px` to `16px` (`rounded-lg` to `rounded-xl`) for a soft, approachable frame.
- **Form Controls & Action Buttons:** `8px` (`rounded-DEFAULT`) for clear click targets.
- **Status Pills, Tags, and Child Avatars:** Pill radius (`9999px`) for quick visual scanning of health and attendance states.
- **Data-Grid Row Selections:** `6px` internal border radius to soften highlighted records.

## Components

### Buttons
- **Primary:** `#60a5fa` background with `#0f172a` text (`font-semibold`). Hover: `#93c5fd`. Focus: 2px ring `#3b82f640`.
- **Secondary / Ghost:** Surface container `#1e293b`, text `#f8fafc`, outline `1px solid #334155`. Hover: `#273549`.
- **Destructive:** Tinted container `#88133740`, border `1px solid #f43f5e60`, text `#fda4af`. Hover: `#f43f5e` with white text.

### Attendance & Health Status Chips
- **Present (حاضر):** Surface `#064e3b50`, text `#34d399`, border `1px solid #05966960`, leading emerald pulse dot.
- **Absent (غائب):** Surface `#88133750`, text `#fb7185`, border `1px solid #e11d4860`.
- **Late (متأخر):** Surface `#78350f50`, text `#fbbf24`, border `1px solid #d9770660`.
- **Medical Note (حالة صحية):** Surface `#0c4a6e50`, text `#38bdf8`, border `1px solid #0284c760`.

### Data Grid & Attendance Ledgers
- Table head sits on `#0b0f19` with `#94a3b8` text in `label-sm` uppercase.
- Table body rows use alternating `#1e293b` and `#182234`.
- Row hover transitions to `#273549`. Selected state applies `#1e3a8a40` fill with a `2px` right-hand border in `#60a5fa`.
- Column alignments: RTL text aligned right; numbers, dates, and times aligned left with tabular digits.

### Input Fields & Search Bars
- Resting background `#111827`, border `1px solid #334155`, text `#f8fafc`, placeholder `#64748b`.
- Active focus switches border to `#60a5fa` with a soft blue ring glow (`#3b82f630`).
- Integrated keyboard hint badges display in `#334155` with `#94a3b8` text (`Ctrl + K`).

### Offline & Sync Status Bar
- Fixed 32px footer on `#0b0f19` with a top divider `1px solid #1e293b`.
- Operational metrics show sync state, local SQLite record counts, and active educator session profile in muted `#94a3b8`.