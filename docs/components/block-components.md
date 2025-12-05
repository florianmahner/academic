# Block Component Library

Complete documentation for the academic template's block components.

## Card Components

### PaperCard

Display academic publications with preview images, metadata, and links.

**Props:**
```typescript
interface Props {
  title: string;              // Paper title
  authors: string[];          // List of author names
  venue?: string;             // Journal/conference name
  year?: number;              // Publication year
  preview?: string;           // Preview image URL
  pdf?: string;               // PDF link
  html?: string;              // HTML/web version link
  code?: string;              // Code repository link
  highlightAuthor?: string;   // Author name to highlight (default: 'Mahner')
  class?: string;             // Additional CSS classes
}
```

**Usage:**
```astro
<PaperCard
  title="Understanding Neural Networks"
  authors={["John Doe", "Jane Smith"]}
  venue="NeurIPS"
  year={2024}
  preview="/images/paper-preview.gif"
  pdf="/papers/neural-nets.pdf"
  code="https://github.com/user/repo"
/>
```

---

### ProjectCard

Display projects with images, descriptions, and tags.

**Props:**
```typescript
interface Props {
  title: string;              // Project title
  description?: string;       // Project description
  image?: string;             // Project image
  tags?: string[];            // Technology tags
  url?: string;               // Project URL (makes card clickable)
  featured?: boolean;         // Highlight as featured
  class?: string;
}
```

**Usage:**
```astro
<ProjectCard
  title="ML Framework"
  description="A lightweight machine learning framework"
  tags={["Python", "PyTorch", "ML"]}
  url="https://github.com/user/ml-framework"
  featured={true}
/>
```

---

### BlogCard

Display blog post previews with dates and tags.

**Props:**
```typescript
interface Props {
  title: string;              // Post title
  description?: string;       // Post excerpt
  date: Date;                 // Publication date
  tags?: string[];            // Post tags
  slug: string;               // URL slug (e.g., "my-post")
  image?: string;             // Featured image
  class?: string;
}
```

**Usage:**
```astro
<BlogCard
  title="Getting Started with Astro"
  description="Learn how to build fast websites with Astro"
  date={new Date('2024-01-15')}
  slug="getting-started-astro"
  tags={["Astro", "Web Dev"]}
/>
```

---

### TalkCard

Display talks and presentations with event details.

**Props:**
```typescript
interface Props {
  title: string;              // Talk title
  event: string;              // Event name
  date: string;               // Date (formatted string)
  location?: string;          // Event location
  type?: 'conference' | 'workshop' | 'seminar' | 'invited';
  slides?: string;            // Slides link
  video?: string;             // Video recording link
  abstract?: string;          // Talk abstract
  class?: string;
}
```

**Usage:**
```astro
<TalkCard
  title="Advances in Deep Learning"
  event="AI Conference 2024"
  date="March 15, 2024"
  location="San Francisco, CA"
  type="conference"
  slides="/slides/deep-learning.pdf"
  video="https://youtube.com/watch?v=..."
/>
```

---

### TeachingCard

Display teaching experience and courses.

**Props:**
```typescript
interface Props {
  title: string;              // Course title
  role: string;               // Teaching role (e.g., "Instructor", "TA")
  institution: string;        // University/institution name
  semester: string;           // Semester (e.g., "Fall 2024")
  year?: string | number;     // Year (optional if included in semester)
  description?: string;       // Course description
  materials?: string;         // Link to course materials
  class?: string;
}
```

**Usage:**
```astro
<TeachingCard
  title="Introduction to Machine Learning"
  role="Teaching Assistant"
  institution="Stanford University"
  semester="Fall"
  year={2024}
  materials="/teaching/cs229"
/>
```

---

### RepoCard

Display GitHub repositories with language and stats.

**Props:**
```typescript
interface Props {
  name: string;               // Repository name
  description?: string;       // Repository description
  url: string;                // GitHub URL
  language?: string;          // Primary language
  stars?: number;             // Star count
  forks?: number;             // Fork count
  class?: string;
}
```

**Usage:**
```astro
<RepoCard
  name="awesome-ml"
  description="A curated list of ML resources"
  url="https://github.com/user/awesome-ml"
  language="Python"
  stars={1234}
  forks={56}
/>
```

---

### TimelineItem

Display experience or education in timeline format.

**Props:**
```typescript
interface Props {
  title: string;              // Position/degree title
  subtitle: string;           // Organization/institution
  location?: string;          // Location
  startDate: string;          // Start date
  endDate?: string;           // End date (omit for current)
  description?: string;       // Description
  highlights?: string[];      // Bullet points
  class?: string;
}
```

**Usage:**
```astro
<TimelineItem
  title="PhD Student"
  subtitle="MIT"
  location="Cambridge, MA"
  startDate="2020"
  endDate="Present"
  highlights={[
    "Researching deep learning methods",
    "Published 5 papers at top venues"
  ]}
/>
```

---

## List Components

### PublicationList

Renders publications grouped by year.

**Props:**
```typescript
interface Props {
  publications: Publication[]; // Array of publications
  groupByYear?: boolean;        // Group by year (default: true)
  highlightAuthor?: string;     // Author to highlight
  showPreviews?: boolean;       // Show preview images (default: true)
  class?: string;
}
```

**Usage:**
```astro
<PublicationList
  publications={allPubs}
  highlightAuthor="Smith"
/>
```

---

### ProjectGrid

Renders projects in a responsive grid.

**Props:**
```typescript
interface Props {
  projects: Project[];        // Array of projects
  columns?: 2 | 3 | 4;       // Grid columns (default: 3)
  class?: string;
}
```

**Usage:**
```astro
<ProjectGrid
  projects={myProjects}
  columns={3}
/>
```

---

### BlogList

Renders blog posts in a list.

**Props:**
```typescript
interface Props {
  posts: BlogPost[];         // Array of blog posts
  class?: string;
}
```

**Usage:**
```astro
<BlogList posts={recentPosts} />
```

---

### TalkList

Renders talks in a list.

**Props:**
```typescript
interface Props {
  talks: Talk[];             // Array of talks
  class?: string;
}
```

**Usage:**
```astro
<TalkList talks={upcomingTalks} />
```

---

## Design Features

All components include:
- **Typed Props**: Full TypeScript interfaces for type safety
- **Dark Mode**: Automatic theme support via CSS variables
- **Animations**: Data attributes for animation on scroll
- **Responsive**: Mobile-first responsive design
- **Accessibility**: Semantic HTML and proper ARIA labels
- **Hover States**: Smooth transitions and interactive feedback

## Importing Components

```astro
// Individual imports
import PaperCard from '../components/blocks/PaperCard.astro';
import PublicationList from '../components/blocks/PublicationList.astro';

// Or use the barrel export
import { PaperCard, PublicationList } from '../components/blocks';
```

## Customization

All components accept a `class` prop for custom styling:

```astro
<PaperCard
  title="My Paper"
  authors={["Author"]}
  class="custom-styling"
/>
```

Then add custom CSS:
```css
.custom-styling {
  border: 2px solid var(--color-accent);
}
```
