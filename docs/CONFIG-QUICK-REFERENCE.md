# YAML Config - Quick Reference Card 🚀

## 📝 File Location
```
config.yaml  (in project root)
```

## ⚡ Quick Commands
```bash
npm run validate-config  # Check if config is valid
npm run dev              # Start dev server
npm run build            # Build site
```

## 🎯 Basic Structure
```yaml
# Personal info
name:
  first: Jane
  last: Smith
title: Your Title
email: your@email.com

# Social (empty "" = hidden)
social:
  github: ""
  scholar: ""
  linkedin: ""
  twitter: ""
  orcid: ""

# Site
site:
  url: https://yoursite.com
  title: Your Name
  description: About your site

# Navigation
navigation:
  mode: sidebar  # floating, sidebar, inline
  items:
    - id: about
      label: About
      href: /

# Theme
theme:
  preset: editorial-newsreader
  accent_light: ""  # Optional
  accent_dark: ""   # Optional

# Features
features:
  selected_publications: true
  education: true
  dark_mode: true
  animations: true
  settings_panel: true

# About page
about:
  bio: Your bio text
  research_interests: Your research interests
```

## 🎨 Theme Presets
```yaml
theme:
  preset: modern-geist          # Clean sans-serif
  # or:
  preset: editorial-newsreader  # Editorial serif
  preset: crimson-classic       # Harvard-inspired
  preset: classic-playfair      # Traditional serif
  preset: brutalist-space       # Bold monospace
  preset: humanist-inter        # Friendly sans-serif
```

## 🔗 Social Platforms
```yaml
social:
  github: username
  scholar: SCHOLAR_ID
  linkedin: username
  twitter: handle
  orcid: 0000-0001-2345-6789
  researchgate: Name_Surname
```

## 🧭 Navigation Modes
```yaml
navigation:
  mode: sidebar   # Fixed left sidebar (default)
  mode: floating  # Bottom pill, auto-hides
  mode: inline    # Traditional header
```

## 🎯 Common Patterns

### Hide All Social Links
```yaml
social:
  github: ""
  scholar: ""
  linkedin: ""
  twitter: ""
  orcid: ""
  researchgate: ""
```

### Custom Theme Colors
```yaml
theme:
  preset: modern-geist
  accent_light: "#4f46e5"  # Indigo
  accent_dark: "#818cf8"   # Light indigo
```

### Minimal Navigation
```yaml
navigation:
  mode: floating
  items:
    - id: about
      label: About
      href: /
```

### Disable Features
```yaml
features:
  selected_publications: false
  education: false
  dark_mode: true
  animations: false
  settings_panel: false
```

## 🐛 Troubleshooting

### Error: "config.yaml not found"
```bash
# Create config file:
cp config.example.yaml config.yaml
```

### Error: "Invalid email"
```yaml
# Fix:
email: valid@email.com  # Must be valid email format
```

### Error: "Invalid URL"
```yaml
# Fix:
site:
  url: https://example.com  # Must include https://
```

### Error: "Invalid enum value"
```yaml
# Check allowed values:
navigation:
  mode: sidebar  # Must be: floating, sidebar, or inline
```

## 📖 Full Documentation
- Quick start: `README.CONFIG.md`
- Full reference: `docs/CONFIG.md`
- Examples: `config.example.yaml`

## 💡 Tips
1. Use `""` to hide optional fields
2. Run `validate-config` before building
3. HTML is allowed in `about.bio`
4. Keep navigation items under 5 for best UX
5. Test theme changes in dev server

## 🔄 Common Edits

### Change Name
```yaml
name:
  first: NewFirst
  last: NewLast
```

### Update Email
```yaml
email: newemail@domain.com
```

### Switch Theme
```yaml
theme:
  preset: modern-geist
```

### Add Social Link
```yaml
social:
  github: yourusername
```

### Change Navigation
```yaml
navigation:
  mode: floating
```

## ✅ Validation Checklist
- [ ] Valid email format
- [ ] Valid URLs (with https://)
- [ ] Valid theme preset name
- [ ] Valid navigation mode
- [ ] All required fields present
- [ ] Run `npm run validate-config`

## 🚀 Getting Started
1. Copy `config.example.yaml` to `config.yaml`
2. Edit your personal information
3. Run `npm run validate-config`
4. Start dev server: `npm run dev`
5. Build site: `npm run build`

---

**Need more help?** See `docs/CONFIG.md` for complete documentation.
