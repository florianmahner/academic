# TICKET-002: Dynamic Font Loading System

## Priority: HIGH
## Branch: `fix/font-optimization`
## Estimated Impact: -400 KB (80% font reduction)

---

## Problem Statement
Currently loading ALL 10 font families (~500 KB) for 6 typography presets upfront.
This blocks rendering and wastes bandwidth since users only use 1 preset at a time.

## Acceptance Criteria
- [ ] Only load fonts for the active typography preset
- [ ] Implement `font-display: swap` to prevent FOIT
- [ ] Add preload hints for critical fonts
- [ ] Lazy load preset fonts when user switches themes
- [ ] Reduce initial font payload to <100 KB

## Technical Approach

### Step 1: Refactor font loading strategy
Current (BAD):
```html
<link href="ALL_FONTS_URL" rel="stylesheet">
```

Target (GOOD):
```html
<link rel="preload" href="critical-font.woff2" as="font" crossorigin>
<link href="ACTIVE_PRESET_FONTS_ONLY" rel="stylesheet">
```

### Step 2: Update ThemeStyles.astro
- Use `getPresetFontUrl(preset)` instead of `getAllFontsUrl()`
- Add `&display=swap` to Google Fonts URL
- Preload the default preset's fonts

### Step 3: Create dynamic font loader
```typescript
// src/lib/font-loader.ts
export async function loadPresetFonts(preset: string): Promise<void> {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = getPresetFontUrl(preset);
  document.head.appendChild(link);
}
```

### Step 4: Update settings panel
- When user changes typography preset, dynamically load new fonts
- Show loading state while fonts load
- Cache loaded fonts in session

## Files to Modify
- `src/components/ThemeStyles.astro` - refactor font loading
- `src/lib/typography-presets.ts` - add per-preset URL function
- `src/components/SettingsPanel.astro` - dynamic font switching
- `src/lib/font-loader.ts` - create new utility

## Font Subsets
Only load Latin + Latin Extended (covers 99% of use cases):
```
&subset=latin,latin-ext
```

## Testing
- Verify no FOIT (Flash of Invisible Text)
- Check font-display: swap works
- Test preset switching loads correct fonts
- Lighthouse performance improvement
