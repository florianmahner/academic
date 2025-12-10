---
layout: ~/layouts/ListLayout.astro
title: "Teaching"
description: "Courses and educational activities"
view: timeline
style: strip
groupBy: year
showDate: true
showRole: true
showInstitution: true
itemType: teaching

# Courses (newest first)
items:
  - date: 2024-01-15
    title: "Introduction to Your Subject"
    code: "SUBJ 101"
    role: "Instructor"
    semester: "Spring 2024"
    institution: "Your University"
    level: "undergraduate"
    students: 120
    description: "An introductory course covering the fundamentals of [your subject]. Replace this with a brief, engaging description."
    tags: ["introductory", "undergraduate"]
    # syllabus: "/teaching/subj101-syllabus.pdf"
    # materials: "https://github.com/yourusername/course-materials"

  - date: 2024-01-15
    title: "Research Seminar"
    code: "SUBJ 799"
    role: "Instructor"
    semester: "Spring 2024"
    institution: "Your University"
    level: "graduate"
    students: 15
    description: "Weekly research seminar for PhD students. We discuss recent papers, practice presentations, and develop research ideas together."
    tags: ["seminar", "research", "phd"]

  - date: 2023-09-01
    title: "Advanced Topics in Your Field"
    code: "SUBJ 501"
    role: "Instructor"
    semester: "Fall 2023"
    institution: "Your University"
    level: "graduate"
    students: 30
    description: "Graduate-level seminar covering cutting-edge research in [your field]. Emphasizes paper reading, critical discussion, and independent research projects."
    tags: ["advanced", "graduate", "research"]
---

Add your courses by editing the `items` list in the frontmatter above. Each course can include:
- `date`: Start date of semester
- `title`: Course name
- `code`: Course code (e.g., "CS 101")
- `role`: Your role (Instructor, TA, etc.)
- `semester`: When taught
- `institution`: University name
- `level`: undergraduate/graduate
- `students`: Class size
- `description`: Brief course description
- `syllabus`: Link to PDF syllabus
- `materials`: Link to course materials
