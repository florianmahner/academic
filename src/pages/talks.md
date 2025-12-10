---
layout: ~/layouts/ListLayout.astro
title: "Talks & Presentations"
description: "Conference talks, keynotes, and workshops"
view: timeline
style: alternating
groupBy: year
showDate: true
itemType: talk

# Talks (newest first)
items:
  - date: 2024-06-15
    title: "Your Keynote Title Here"
    event: "Conference Name 2024"
    location: "City, Country"
    description: "Write a compelling abstract for your talk. This should summarize the key points you'll cover."
    tags: ["keynote", "your-field"]
    # slides: "/slides/keynote-2024.pdf"
    # video: "https://youtube.com/watch?v=your-video"

  - date: 2023-11-20
    title: "Your Conference Paper Presentation"
    event: "Academic Conference 2023"
    location: "Another City, Country"
    description: "Summarize your conference presentation here. What problem did you address? What's your key contribution?"
    tags: ["conference", "research"]
    # slides: "/slides/conference-2023.pdf"

  - date: 2023-08-15
    title: "Hands-On Workshop: Your Topic"
    event: "Summer School or Workshop Name"
    location: "University or Venue"
    description: "A practical workshop introducing participants to [your topic]. Includes hands-on exercises and real-world examples."
    tags: ["workshop", "tutorial", "hands-on"]
    # slides: "/slides/workshop-2023.pdf"
---

Add your talks by editing the `items` list in the frontmatter above. Each talk can include:
- `date`: When the talk occurred
- `title`: Talk title
- `event`: Conference or event name
- `location`: Where it was held
- `description`: Brief abstract
- `tags`: Categorization
- `slides`: Link to PDF slides
- `video`: Link to recording
