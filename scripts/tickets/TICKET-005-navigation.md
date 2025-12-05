# TICKET-005: Fix Navigation & Orphan Pages

## Priority: MEDIUM
## Branch: `fix/navigation`
## Estimated Impact: Better discoverability

---

## Problem Statement
3-4 pages exist but are not discoverable through navigation:
- `/cv` - has `nav: true` in frontmatter but not in config.yaml
- `/contact` - has `nav: true` in frontmatter but not in config.yaml
- `/misc` - exists but commented out in config.yaml
- `/about` - duplicates homepage content

## Acceptance Criteria
- [ ] CV page accessible from navigation
- [ ] Contact page accessible from navigation
- [ ] Misc page decision (add or remove)
- [ ] About page resolved (remove duplicate or differentiate)
- [ ] Footer includes secondary navigation links

## Technical Approach

### Step 1: Update config.yaml navigation
```yaml
navigation:
  items:
    - id: about
      label: About
      href: /
    - id: publications
      label: Publications
      href: /publications
    - id: projects
      label: Projects
      href: /projects
    - id: blog
      label: Blog
      href: /blog
    - id: talks
      label: Talks
      href: /talks
    - id: teaching
      label: Teaching
      href: /teaching
    - id: open-source
      label: Open Source
      href: /open-source
    # ADD these:
    - id: cv
      label: CV
      href: /cv
    - id: contact
      label: Contact
      href: /contact
```

### Step 2: Add footer secondary navigation
```astro
<!-- BaseLayout.astro footer section -->
<footer class="site-footer">
  <div class="footer-links">
    <a href="/cv">CV</a>
    <a href="/contact">Contact</a>
    <a href="/misc">Misc</a>
  </div>
  <p class="copyright">© {new Date().getFullYear()} {config.personal.name}</p>
</footer>
```

### Step 3: Resolve /about duplication
Option A: Remove `src/content/pages/about.md` (homepage is about)
Option B: Differentiate - homepage = brief, /about = detailed

Recommendation: Option A (remove duplicate)

### Step 4: Update navigation.ts documentation
Add comment explaining that navigation is controlled by config.yaml,
not by frontmatter `nav: true` settings.

## Files to Modify
- `config.yaml` - add CV and Contact to navigation
- `src/layouts/BaseLayout.astro` - add footer links
- `src/content/pages/about.md` - delete (duplicate)
- `src/lib/navigation.ts` - add documentation comment

## CSS for Footer Links
```css
.footer-links {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-2);
}

.footer-links a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--color-accent);
}
```

## Testing
- All navigation links work
- Footer links visible and functional
- No 404 errors on any page
- Mobile navigation includes new items
