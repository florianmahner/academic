# Theme Integration - Verification Checklist

**Date**: 2025-12-04
**Server**: http://localhost:4321

---

## Quick Verification Steps

### ✅ Step 1: Config Default Preset
- [ ] Open `config.yaml`
- [ ] Note current preset: `editorial-newsreader`
- [ ] Open http://localhost:4321
- [ ] Verify Newsreader fonts are loaded
- [ ] Check accent color is stone gray

### ✅ Step 2: Change Preset
- [ ] Edit `config.yaml`: Change to `modern-geist`
- [ ] Save file (hot reload should trigger)
- [ ] Verify Geist fonts load
- [ ] Check accent color changes to black/white

### ✅ Step 3: Custom Accent Colors
- [ ] Edit `config.yaml`:
  ```yaml
  theme:
    preset: editorial-newsreader
    accent_light: "#4f46e5"
    accent_dark: "#818cf8"
  ```
- [ ] Save and verify indigo accent color appears
- [ ] Toggle dark mode
- [ ] Verify dark mode uses lighter indigo

### ✅ Step 4: Settings Panel Runtime Switching
- [ ] Open Settings Panel (gear icon bottom-right)
- [ ] Switch to "Crimson Classic"
- [ ] Verify fonts change to Crimson Pro
- [ ] Verify accent changes to crimson red
- [ ] Refresh page
- [ ] Verify choice persisted (localStorage override)

### ✅ Step 5: Dark Mode
- [ ] Click dark mode toggle in Settings Panel
- [ ] Verify smooth transition
- [ ] Verify colors invert appropriately
- [ ] Check accent color switches to dark variant
- [ ] Refresh page
- [ ] Verify dark mode persisted

### ✅ Step 6: Navigation Mode
- [ ] In Settings Panel, switch to "Floating Pill"
- [ ] Verify floating nav appears at bottom
- [ ] Switch to "Inline Header"
- [ ] Verify header nav appears at top
- [ ] Switch back to "Sidebar"
- [ ] Verify left sidebar appears

### ✅ Step 7: Clear Cache Test
- [ ] Open browser console
- [ ] Run: `localStorage.clear()`
- [ ] Refresh page
- [ ] Verify config defaults are restored
- [ ] Check preset matches config.yaml

### ✅ Step 8: All Presets
Test each preset in Settings Panel:

- [ ] **Crimson Classic** - Traditional serif, crimson accent
- [ ] **Editorial Newsreader** - Magazine style, italic headings
- [ ] **Modern Geist** - Tech aesthetic, black/white
- [ ] **Classic Playfair** - High-contrast serif, blue accent
- [ ] **Brutalist Space** - Geometric sans, bold weights
- [ ] **Humanist Inter** - Friendly sans, blue accent

### ✅ Step 9: Mobile Responsive
- [ ] Resize browser to <768px width
- [ ] Verify mobile nav hamburger appears
- [ ] Click hamburger → side panel opens
- [ ] Verify navigation works
- [ ] Verify Settings Panel still accessible

### ✅ Step 10: Production Build
- [ ] Run: `npm run build`
- [ ] Verify build completes without errors
- [ ] Run: `npm run preview`
- [ ] Open preview URL
- [ ] Verify theme works in production mode

---

## Visual Verification

### Typography Changes
Look for these visual differences between presets:

- **Fonts**: Serif vs Sans-serif
- **Heading Style**: Normal vs Italic
- **Letter Spacing**: Tight vs Normal vs Wide
- **Font Weight**: Light (300-400) vs Bold (600-700)

### Color Changes
Look for accent color in:

- Navigation active state
- Link colors
- Button hover states
- Selected items in Settings Panel

### Dark Mode Changes
Verify these colors invert:

- Background: Cream → Dark gray
- Text: Near-black → Light gray
- Borders: Light gray → Dark gray
- Accent: Light variant → Dark variant

---

## Expected Results

### Config Integration
✅ Theme preset loads from config.yaml on first visit
✅ Accent colors can be overridden in config
✅ Feature flags control component visibility

### User Customization
✅ Settings Panel changes persist in localStorage
✅ User choices override config defaults
✅ Clearing localStorage restores config defaults

### Performance
✅ All fonts load in <500ms
✅ Theme switches in <1 frame (16ms)
✅ No layout shift during theme change
✅ Smooth transitions for color changes

---

## Troubleshooting

### Issue: Dev server not responding
```bash
# Stop all node processes
killall node

# Restart dev server
npm run dev
```

### Issue: Theme not changing
```bash
# Clear localhost data
# In browser: DevTools → Application → Clear storage

# Or in console:
localStorage.clear()
location.reload()
```

### Issue: Fonts not loading
```bash
# Check network tab for 403 errors
# Verify fonts.googleapis.com is accessible
# Check browser console for errors
```

---

## Success Criteria

All items checked = Theme integration verified ✅

**If any item fails**:
1. Check browser console for errors
2. Verify config.yaml syntax is valid
3. Clear browser cache and localStorage
4. Review docs/THEME-INTEGRATION-TEST.md

---

## Quick Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear localStorage in console
localStorage.clear()

# Check current theme
localStorage.getItem('typography-preset')
```

---

**Status**: Ready for verification at http://localhost:4321
