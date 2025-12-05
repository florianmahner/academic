# TICKET-004: Dead Code Removal

## Priority: MEDIUM
## Branch: `fix/dead-code-removal`
## Estimated Impact: Cleaner codebase, faster builds

---

## Problem Statement
16 unused files/components identified that add cognitive load and slow builds.

## Acceptance Criteria
- [ ] All unused components removed
- [ ] Unused npm dependencies removed
- [ ] Orphaned CSS files removed
- [ ] Build still succeeds after removal
- [ ] No runtime errors

## Items to Remove

### Unused UI Components (8 files)
```
src/components/ui/Card.astro          - 0 imports
src/components/ui/Icon.astro          - 0 imports
src/components/layout/Container.astro - 0 imports
src/components/layout/TwoColumn.astro - 0 imports
src/components/layout/Grid.astro      - 0 imports
src/components/layout/Section.astro   - 0 imports
src/components/Sidenote.astro         - 0 imports
src/components/ThemeToggle.astro      - 0 imports (moved to SettingsPanel)
```

### Legacy Aliases (2 files)
```
src/components/blocks/BlogPostCard.astro  - alias for BlogCard
src/components/blocks/CourseCard.astro    - alias for TeachingCard
```
Also update `src/components/blocks/index.ts` to remove exports.

### Unused Library (1 file)
```
src/lib/sections.ts - not imported anywhere
```

### Orphaned CSS (1 file)
```
src/styles/components/project-card.css - not imported
```

### Unused npm Dependencies (2 packages)
```json
// Remove from package.json devDependencies:
"canvas": "^3.2.0",
"gif-encoder-2": "^1.0.5"
```

## Safety Protocol

### Step 1: Create removal script
```bash
#!/bin/bash
# scripts/remove-dead-code.sh

# Backup first
git stash

# Remove files
rm -f src/components/ui/Card.astro
rm -f src/components/ui/Icon.astro
# ... etc
```

### Step 2: Update index exports
```typescript
// src/components/blocks/index.ts
// REMOVE these lines:
// export { default as BlogPostCard } from './BlogCard.astro';
// export { default as CourseCard } from './TeachingCard.astro';
```

### Step 3: Remove dependencies
```bash
npm uninstall canvas gif-encoder-2
```

### Step 4: Verify build
```bash
npm run build
npm run dev
# Test all pages load correctly
```

## Files to Delete
- `src/components/ui/Card.astro`
- `src/components/ui/Icon.astro`
- `src/components/layout/Container.astro`
- `src/components/layout/TwoColumn.astro`
- `src/components/layout/Grid.astro`
- `src/components/layout/Section.astro`
- `src/components/Sidenote.astro`
- `src/components/ThemeToggle.astro`
- `src/components/blocks/BlogPostCard.astro`
- `src/components/blocks/CourseCard.astro`
- `src/lib/sections.ts`
- `src/styles/components/project-card.css`

## Files to Modify
- `src/components/blocks/index.ts` - remove legacy exports
- `package.json` - remove unused devDependencies

## Testing
- `npm run build` succeeds
- `npm run dev` - all pages render
- No console errors
- No broken imports
