---
name: روضتي Kindergarten OS
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#424753'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#727784'
  outline-variant: '#c2c6d5'
  surface-tint: '#005bbf'
  primary: '#0059ba'
  on-primary: '#ffffff'
  primary-container: '#2c72d9'
  on-primary-container: '#fefcff'
  inverse-primary: '#acc7ff'
  secondary: '#825500'
  on-secondary: '#ffffff'
  secondary-container: '#fdb64b'
  on-secondary-container: '#704800'
  tertiary: '#a33446'
  on-tertiary: '#ffffff'
  tertiary-container: '#c34c5d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#acc7ff'
  on-primary-fixed: '#001a40'
  on-primary-fixed-variant: '#004492'
  secondary-fixed: '#ffddb3'
  secondary-fixed-dim: '#ffb951'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#633f00'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b8'
  on-tertiary-fixed: '#40000f'
  on-tertiary-fixed-variant: '#861e32'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 44px
  display-md:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  caption:
    fontFamily: IBM Plex Sans, Cairo, system-ui, sans-serif
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

This design system is engineered specifically for mission-critical, offline-first early childhood education administration. Operating on local desktop environments (Electron/Vite/Tailwind), it balances the rigor and data density of administrative enterprise software with the warmth, reassurance, and empathy intrinsic to kindergarten care. 

The aesthetic is Modern Tactile with subtle warm institutional clarity: crisp 1px borders, gentle elevations, humanistic curves, and high-legibility Arabic typography. The UI provides administrative staff and teachers with uninterrupted peace of mind through prominent offline-status feedback, non-intrusive local syncing notifications, and frictionless keyboard-driven workflows (such as rapid global search and hotkeys). The emotional signature is dependable, joyful, and calm—preventing cognitive fatigue during heavy enrollment cycles, fee collections, and daily attendance logging.

## Colors

The palette leverages an inviting, high-trust primary blue alongside energizing warm tones tailored for early childhood spaces, structured for strict WCAG AAA / AA contrast against crisp surface backdrops:

- **Primary (`#4F8EF7` / `#2F62C9` / `#EEF4FF`):** Represents structural reliability and administrative focus. `primary-50` is reserved for table row selections, active navigation nodes, and focused container tints. `primary-500` drives primary buttons, primary toggles, and active state indicators. `primary-700` handles high-contrast interactive states and deep accents.
- **Secondary (`#FFB84D`):** A warm amber gold used for badges, student milestones, quick-highlight tags, and pending administrative tasks.
- **Accent (`#FF7A8A`):** A soft coral pink deployed sparingly for early-childhood developmental markers, health alerts, and visual delights.
- **Semantic Suite:**
  - `success-500` (`#2EB67D`): Confirmed local backups, fee receipts cleared, complete attendance.
  - `warning-500` (`#F5A524`): Unsynced offline edits, pending immunizations, draft records.
  - `danger-500` (`#E5484D`): Destructive actions, urgent medical flags, emergency contact alerts.
- **Neutrals & Surfaces:**
  - `surface` (`#FFFFFF`): Elevated cards, modals, and input fields.
  - `neutral-50` (`#F9FAFB`): Canvas backdrop behind elevated workspaces.
  - `neutral-200` (`#E5E7EB`): Structural 1px containment borders, dividers, and table grids.
  - `neutral-600` (`#4B5563`): Supporting metadata, subheadings, and icon strokes.
  - `neutral-900` (`#1F2937`): High-legibility Arabic titles, primary values, and body text.

## Typography

The design system enforces a strictly optimized RTL typographic hierarchy tailored to native Arabic font rendering. Typography uses `IBM Plex Sans Arabic` paired with fallback `Cairo` to balance geometric precision with legible Naskh-inspired letterforms.

### Direction & OpenType Features
- Base document direction is forced to `dir="rtl"`.
- Use tabular numerals (`font-feature-settings: "tnum" 1`) across all fees, dates, phone numbers, and child counts to maintain alignment in compact tables and dense ledgers.
- Keep generous line-heights (minimum 1.5× for body copy) to prevent ascender/descender collisions common to Arabic diacritics and glyphs.
- Avoid artificial letter-spacing (tracking) on Arabic text, as it fractures ligature connectivity.

## Layout & Spacing

The application implements a desktop-optimized shell with an integrated top chrome, a collapsible primary right sidebar, a contextual workspace canvas, and a persistent operational status footer.

### Window Anatomy & Breakpoints
1. **Desktop Window Chrome (Height: 38px):** Houses frameless drag regions (`-webkit-app-region: drag`), window title, breadcrumbs, and window controls (close, minimize, maximize) positioned on the far top-left or top-right depending on target OS conventions, leaving unobstructed space for search.
2. **Right Navigation Sidebar (RTL Default):**
   - Expanded: Fixed width of `260px`.
   - Collapsed (Icon-only mode): Fixed width of `68px`.
3. **Workspace Canvas:** Fluid container stretching across remaining desktop real estate.
4. **Data Density Modes:**
   - **Comfortable (Default):** Table row height `52px`, standard card padding `1.25rem` (`space-lg`), generous form gaps.
   - **Compact (Auditing / Large Registries):** Table row height `36px`, cell padding `0.5rem` (`space-sm`), card padding `0.75rem` (`space-md`), label sizes shifted down to `label-sm`.

## Elevation & Depth

Visual hierarchy relies on structural containment paired with ambient, tinted drop shadows to deliver tactile presence without visual noise:

- **Level 0 (Base Canvas):** `#F9FAFB`. The grounding canvas upon which workspaces and panels sit.
- **Level 1 (Card & Section Containers):** `#FFFFFF` surface bounded by a crisp `1px solid #E5E7EB` border. Ambient shadow: `0 1px 3px 0 rgba(31, 41, 55, 0.04), 0 1px 2px -1px rgba(31, 41, 55, 0.03)`.
- **Level 2 (Dropdowns, Popovers, Active Side Trays):** `#FFFFFF` surface with `1px solid #E5E7EB`. Shadow: `0 4px 6px -1px rgba(31, 41, 55, 0.07), 0 2px 4px -2px rgba(31, 41, 55, 0.05)`.
- **Level 3 (Command Palette & Modal Dialogs):** `#FFFFFF` surface with `1px solid #E5E7EB`. Elevated shadow: `0 20px 25px -5px rgba(31, 41, 55, 0.1), 0 8px 10px -6px rgba(31, 41, 55, 0.05)`. Overlay backdrop: `rgba(31, 41, 55, 0.45)` with a `backdrop-blur-sm` filter.

## Shapes

The design uses a warm, rounded curvature hierarchy that balances friendliness with systematic efficiency:

- **Cards & Workspace Containers:** `12px` (`rounded-xl` in this scale) to provide soft, comforting edges.
- **Buttons, Selectors, and Input Fields:** `8px` to `10px` (`rounded-md` to `rounded-lg`) for tactile, clickable components.
- **Badges, Tags, and Offline Pills:** Fully rounded pills (`9999px`) to distinguish categorical metadata from interactive rectangular controls.
- **Command Palette (`Ctrl+K`):** `14px` corner radius with unified `1px` crisp border framing.

## Components

### 1. Window Chrome & Navigation Header
- **Electron Title Bar:** Discrete `38px` bar at the very top. Draggable area excluding interactive controls. Contains the kindergarten name (`روضتي - فرع الأمل`), active term (`العام الدراسي 2024-2025`), and window management buttons (Minimize, Maximize, Close).
- **Command Palette Trigger (`Ctrl+K`):** Integrated in the header as a centered input mimic (`بحث سريع عن طالب، ولي أمر، أو صف... Ctrl+K`) flanked by keyboard badge shortcuts.

### 2. Right-Hand Collapsible Navigation Sidebar
- Anchored to the right side of the screen (`right: 0`).
- Displays institutional logo and branch selector at top.
- Navigation links include right-aligned icons with text to the left. Active state: background tinted with `primary-50`, text in `primary-700`, and a `3px` solid accent border on the extreme right edge.
- Collapses via a floating toggle button into an icon-only strip with RTL tooltips appearing on the left side.

### 3. Persistent Offline Health Footer
- Anchored across the entire bottom (`height: 32px`, `bg-neutral-900`, `text-neutral-50`).
- Displays real-time operational state from right to left:
  - **Local Storage / Backup Status:** Green pulse dot + `آخر نسخة احتياطية محلية: اليوم 14:30` (or warning amber if >24 hours).
  - **Database Size & Records:** Monospace count of active records (`142 طفل مسجل`).
  - **Active Session:** User avatar tag (`المسؤول: سارة أحمد`) and quick lock button.

### 4. Command Palette (Modal Dialog)
- Triggered by `Ctrl+K` or search click. Centered modal at `width: 580px`.
- Instant local search filtering across Students, Guardians, Invoices, and Actions (e.g., "تسجيل حضور جديد").
- Arrow-key navigable with highlighted states using `primary-50` and arrow icons flipped for RTL orientation.

### 5. Buttons
- **Primary:** `bg-[#4F8EF7] hover:bg-[#2F62C9] text-white font-medium rounded-[8px] px-4 py-2 text-sm transition-colors`.
- **Secondary:** `bg-[#EEF4FF] hover:bg-[#dce8fe] text-[#2F62C9] font-medium rounded-[8px] px-4 py-2 text-sm`.
- **Destructive:** `bg-white hover:bg-red-50 text-[#E5484D] border border-red-200 rounded-[8px] px-4 py-2 text-sm`.

### 6. Data Tables (Comfortable & Compact)
- Fixed header with subtle border separator.
- RTL cell alignment: text aligned right, financial/numerical data with monospace tabular numbers.
- Hover states: `hover:bg-neutral-50`. Selected state: `bg-primary-50/50`.
- Integrated quick status chips (e.g., "حاضر", "غائب", "معفى", "رسوم متأخرة").

### 7. Form Controls & Inputs
- Text fields include right-aligned embedded icons (e.g., student search, guardian phone number with `+966` prefix on the left).
- Resting state: `border border-[#E5E7EB] bg-white text-neutral-900 rounded-[8px] focus:border-[#4F8EF7] focus:ring-2 focus:ring-[#EEF4FF]`.
- Checkboxes & Radios: Square `rounded-[4px]` with checkmark and radio dot centered, positioned on the right of descriptive labels.