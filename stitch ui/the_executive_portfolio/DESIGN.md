---
name: The Executive Portfolio
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#424843'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#727973'
  outline-variant: '#c2c8c1'
  surface-tint: '#486552'
  primary: '#042112'
  on-primary: '#ffffff'
  primary-container: '#1a3626'
  on-primary-container: '#81a08a'
  inverse-primary: '#aeceb7'
  secondary: '#a23e18'
  on-secondary: '#ffffff'
  secondary-container: '#fe8357'
  on-secondary-container: '#6f2000'
  tertiary: '#1e1b13'
  on-tertiary: '#ffffff'
  tertiary-container: '#333027'
  on-tertiary-container: '#9d978b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#caead3'
  primary-fixed-dim: '#aeceb7'
  on-primary-fixed: '#042012'
  on-primary-fixed-variant: '#304d3b'
  secondary-fixed: '#ffdbcf'
  secondary-fixed-dim: '#ffb59c'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#822801'
  tertiary-fixed: '#e9e2d4'
  tertiary-fixed-dim: '#ccc6b8'
  on-tertiary-fixed: '#1e1b13'
  on-tertiary-fixed-variant: '#4a463c'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1120px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is built upon the "Modern Analog" aesthetic—a digital interpretation of a bespoke physical dossier. It targets high-level professionals preparing for career-defining interviews, evoking a sense of gravity, preparation, and tangible quality.

The visual style blends **Tactile Neomorphism** with **Editorial Minimalism**. Every UI element is treated as a physical object with weight and texture. The interface avoids flat digital surfaces in favor of layered paper stocks, embossed lettering, and mechanical interactions. The emotional response is one of "calm authority"—the user should feel like they are opening a high-end leather-bound folder containing their future career path.

## Colors

The palette is grounded in organic, traditional tones that suggest heritage and stability. 

- **Base Surface:** The background utilizes `#F4F1EA` (Off-white paper). It must be accompanied by a subtle noise/grain texture overlay at 3-5% opacity to break digital flatness.
- **Primary (Forest Green):** Used for authoritative elements, success states, and primary actions. It represents growth and professional establishment.
- **Secondary (Terracotta):** Reserved for high-energy accents, notification badges, and active progress indicators. It provides a warm contrast to the cooler green.
- **Neutral (Charcoal):** All typography and structural borders use `#2D2D2D`, ensuring high legibility and a "printed ink" feel.

## Typography

This design system employs a high-contrast typographic pairing to reinforce the "dossier" theme. 

**Playfair Display** provides an editorial, sophisticated tone for headlines. It should be treated like masthead type—generous in size but tight in leading. 

**Inter** serves as the functional workhorse for body copy, ensuring clarity during long reading sessions (e.g., feedback reports). 

**JetBrains Mono** is utilized for metadata, tally marks, and technical UI labels to mimic the output of a typewriter or a high-precision mechanical stamp.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain the "document" feel. Content is centered within a 1120px container, mimicking a large physical folder laid flat.

- **Desktop:** 12-column grid with 24px gutters. Elements should align to "paper edges"—meaning large white space margins are encouraged to emphasize focus.
- **Mobile:** Transition to a fluid single-column layout with 20px side margins. 
- **Rhythm:** Use an 8px base unit. Component internal padding should be generous (min 16px) to allow the tactile effects (shadows/bevels) room to breathe without crowding the content.

## Elevation & Depth

Depth is the defining characteristic of this design system. We move away from flat layers toward **Extruded and Inset surfaces**:

1.  **The Base Surface:** The background paper is the lowest layer.
2.  **Debossed (Inset):** Search bars, input fields, and "wells" are carved into the paper. Use an `inner-shadow` (Top: 2px, Left: 2px, Blur: 4px, Color: rgba(0,0,0,0.1)) to create the "carved" effect.
3.  **Embossed (Raised):** Buttons and active cards sit above the paper. Use two shadows: a dark "drop shadow" at the bottom right and a subtle light "highlight" at the top left to simulate a physical 3D object.
4.  **Tonal Stacking:** When cards overlap, use a "Stacked Files" aesthetic—a sharp 1px border (`#2D2D2D` at 10% opacity) combined with a tight, dark shadow to make elements feel like thick cardstock.

## Shapes

The shape language is disciplined and professional. 
- **Soft Corners:** A base radius of `0.25rem` (4px) is used for most components, mimicking slightly rounded cardstock or cut paper. 
- **Sharp Accents:** Interactive elements like tabs or "stamped" badges may use 0px corners to emphasize a more utilitarian, industrial feel. 
- **Avoid Pills:** Do not use fully rounded pill shapes, as they feel too "digital-native" and break the analog dossier metaphor.

## Components

### Buttons
Primary buttons use the Forest Green background with white text. They must appear physically raised. On `:hover`, the button should shift 1px down and the shadow should shrink, simulating a physical "press." On `:active`, it should appear fully flush with the paper surface.

### Inputs
Text inputs are always debossed. Use the primary text color (Charcoal) for input text and a faded terracotta for focus indicators. The cursor should be a solid block rather than a thin line to match the monospaced UI font.

### Cards & Files
Cards should look like index cards or manila folders. Use a subtle top-border accent in Terracotta or Green to categorize items. When multiple cards are present, offset them slightly (2-3 degrees) to create a "scattered papers" look in decorative sections.

### Progress & Status
Instead of smooth bars, use **Mechanical Tally Marks**. A "70% complete" state should be shown as 7 vertical strokes with a diagonal strike-through for every 5, mimicking hand-marked progress. 

### Stamped Badges
Status indicators (e.g., "Passed", "Scheduled") should look like physical ink stamps. Use a high-contrast color (Terracotta), slightly irregular borders, and a lower opacity (90%) to allow the underlying paper texture to show through the "ink."