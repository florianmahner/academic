#!/bin/bash

# TICKET-003: Apply all accessibility fixes

echo "Applying WCAG AA accessibility fixes..."

# Fix 1: Skip link in BaseLayout
sed -i.bak '144a\
    <a href="#main-content" class="skip-link">Skip to main content</a>
' src/layouts/BaseLayout.astro

# Fix 2: Add id to main content
sed -i.bak 's/<main class="main-content">/<main class="main-content" id="main-content">/' src/layouts/BaseLayout.astro

# Fix 3: Add skip link CSS
sed -i.bak '/Layout Structure/a\
      .skip-link {\
        position: absolute;\
        top: -100%;\
        left: 16px;\
        padding: 8px 16px;\
        background: var(--color-accent);\
        color: white;\
        border-radius: var(--radius-md);\
        z-index: 9999;\
        text-decoration: none;\
        font-weight: 500;\
      }\
\
      .skip-link:focus {\
        top: 16px;\
      }\
' src/layouts/BaseLayout.astro

# Fix 4: Add aria-hidden to mobile menu SVGs
sed -i.bak 's/<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/g' src/layouts/BaseLayout.astro

# Fix 5: Add visually hidden h1 to homepage
sed -i.bak '96a\
      <h1 class="sr-only">{config.personal.name} - Academic Portfolio</h1>
' src/pages/index.astro

# Fix 6: Add sr-only CSS to homepage
sed -i.bak '/^<style>/a\
  .sr-only {\
    position: absolute;\
    width: 1px;\
    height: 1px;\
    padding: 0;\
    margin: -1px;\
    overflow: hidden;\
    clip: rect(0, 0, 0, 0);\
    white-space: nowrap;\
    border-width: 0;\
  }\
' src/pages/index.astro

# Fix 7: Add aria-hidden to PaperCard SVGs
sed -i.bak 's/<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/g' src/components/blocks/PaperCard.astro

# Fix 8: Wrap SettingsPanel sections in fieldsets with legends
sed -i.bak 's/<div class="option-list">/<fieldset class="option-list">\
        <legend class="sr-only">Navigation Style<\/legend>/; s/<\/div>\n    <\/div>\n\n    <!-- Typography Section -->/      <\/fieldset>\
    <\/div>\
\
    <!-- Typography Section -->/' src/components/SettingsPanel.astro

sed -i.bak 's/<div class="theme-toggle-group">/<fieldset class="theme-toggle-group">\
        <legend class="sr-only">Color Theme<\/legend>/; s/<\/div>\n    <\/div>$/      <\/fieldset>\
    <\/div>/' src/components/SettingsPanel.astro

# Fix 9: Add fieldset styling and sr-only CSS
sed -i.bak '/^  \.option-list {$/a\
    border: none;\
    margin: 0;
' src/components/SettingsPanel.astro

sed -i.bak '/^  \.theme-toggle-group {$/a\
    border: none;\
    margin: 0;
' src/components/SettingsPanel.astro

sed -i.bak '/^  \.option-list {$/i\
  .sr-only {\
    position: absolute;\
    width: 1px;\
    height: 1px;\
    padding: 0;\
    margin: -1px;\
    overflow: hidden;\
    clip: rect(0, 0, 0, 0);\
    white-space: nowrap;\
    border-width: 0;\
  }\
' src/components/SettingsPanel.astro

# Fix 10: Add aria-hidden to SettingsPanel theme SVGs
sed -i.bak 's/<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">/g' src/components/SettingsPanel.astro

# Clean up backup files
rm -f src/layouts/BaseLayout.astro.bak src/pages/index.astro.bak src/components/blocks/PaperCard.astro.bak src/components/SettingsPanel.astro.bak

echo "✅ All accessibility fixes applied!"
