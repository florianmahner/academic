# TICKET-001: High-Quality Image Optimization

## Priority: CRITICAL
## Branch: `fix/image-optimization`
## Estimated Impact: -22 MB (65% size reduction)

---

## Problem Statement
The `/public/previews/` directory contains 20 animated GIF files totaling 27 MB.
These account for 79% of the total build size and severely impact load times.

## Acceptance Criteria
- [ ] All GIF files converted to WebP format with animation support
- [ ] Quality maintained at 90%+ visual fidelity
- [ ] Light/dark variants consolidated where possible using CSS
- [ ] Total previews folder reduced to <5 MB
- [ ] Lazy loading implemented for all preview images
- [ ] Fallback for browsers without WebP support

## Technical Approach

### Step 1: Create conversion script
```bash
# Install sharp for high-quality conversion
npm install --save-dev sharp
```

### Step 2: Conversion utility (`scripts/convert-images.js`)
- Use sharp library for best quality
- Maintain animation frames
- Target quality: 85-90 (high quality)
- Generate both WebP and fallback

### Step 3: Update image references
- Create `<Picture>` component for responsive images
- Add `loading="lazy"` and `decoding="async"`
- Implement dark mode via CSS `filter: invert()` where applicable

### Step 4: Cleanup
- Remove original GIF files after verification
- Update any hardcoded references

## Files to Modify
- `public/previews/*.gif` → convert to `.webp`
- `src/components/blocks/PaperCard.astro` - update image handling
- `src/components/ui/Picture.astro` - create new component
- `package.json` - add sharp dependency

## Quality Requirements
- WebP quality setting: 85-90
- Preserve all animation frames
- No visible quality degradation
- Support for transparent backgrounds

## Testing
- Visual comparison before/after
- File size verification (<5 MB total)
- Browser compatibility check (Safari, Chrome, Firefox)
- Lighthouse performance score improvement
