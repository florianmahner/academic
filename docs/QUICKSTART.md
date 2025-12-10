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

| Content Type | Location |
|--------------|----------|
| Blog posts | `src/content/blog/` |
| Projects | `src/content/projects/` |
| Talks | `src/content/talks/` |
| Teaching | `src/content/teaching/` |
| News items | `src/content/news/` |

To show these in navigation, uncomment the relevant items in `config.yaml`.

## Need Help?

- See [README.md](README.md) for full documentation
- Check example content files for formatting
