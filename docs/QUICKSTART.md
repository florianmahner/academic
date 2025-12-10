# 5-Minute Setup

Get your academic website running in just a few steps.

## 1. Install & Run

```bash
npm install
npm run dev
```

Your site is live at **http://localhost:4321** 🎉

## 2. Edit Your Info

Open `config.yaml` and update:

```yaml
name:
  first: Your
  last: Name

title: Your Position or Title
email: you@university.edu

institution:
  name: Your University
  url: https://your-university.edu
```

## 3. Add Your Photo

Replace `public/marie-curie.jpg` with your profile photo.

## 4. Write Your Bio

Edit `src/content/pages/about.md`:

```markdown
I am a [position] at [University]. My research focuses on...

## Research Interests

I am broadly interested in...
```

## 5. Add Publications

Edit `src/content/papers.bib` with your papers:

```bibtex
@article{yourname2024,
  title = {Your Paper Title},
  author = {Your Name and Coauthor Name},
  journal = {Journal Name},
  year = {2024},
  selected = {true}
}
```

## 6. Deploy

Push to GitHub and enable GitHub Pages:
1. Go to **Settings** → **Pages**
2. Set Source to **"GitHub Actions"**
3. Done! Auto-deploys on every push ✨

---

## Optional: Add More Content

| Content Type | Location | Format |
|--------------|----------|--------|
| Blog posts | `src/content/blog/*.md` | Markdown files |
| Projects | `src/content/projects/*.md` | Markdown files |
| Talks | `src/pages/talks.md` | YAML list in frontmatter |
| Teaching | `src/pages/teaching.md` | YAML list in frontmatter |
| Misc/Tools | `src/pages/misc.md` | YAML list in frontmatter |

**Adding talks/teaching:** Just copy an existing item block in the frontmatter and edit!

## Need Help?

- See [CONFIG.md](CONFIG.md) for full configuration options
- See [USER-GUIDE.md](USER-GUIDE.md) for complete documentation
- Check example content files for formatting
