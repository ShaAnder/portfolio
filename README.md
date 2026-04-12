yarn dev

# Shaun Anderton – Portfolio

Welcome to my personal portfolio site! This project is built with Next.js and
showcases my work, skills, and background as a developer and creative. The site
is designed to be clean, modern, and easy to navigate, with each section
highlighting a different aspect of my experience.

## About This Project

This is a single-page application (SPA) using the Next.js app directory. The
layout is organized into clear, scrollable sections:

- **Hero**: The landing section with my profile image, a short intro, and quick
  links to my socials and resume.
- **About**: A brief overview of who I am, my background, and what drives me.
- **Skills**: A visual breakdown of my technical skills and tools I use.
- **Projects**: Highlights of selected projects, each with a summary and links
  for more details.
- **Testimonials**: Feedback and endorsements from people I've worked with.
- **Contact**: A form for visitors to reach out directly. Messages are sent to
  my email and you'll get a confirmation when your message is delivered.

## How Sections Work

Each section is implemented as a React component and imported into the main
HomePage. The layout uses consistent spacing and responsive design, so it looks
great on any device. The `Section` component is used to wrap each area,
providing padding and alignment.

- Navigation is smooth and each section is easy to find.
- The contact form uses serverless API routes to securely send messages to my
  inbox.
- Project and testimonial data are managed in simple TypeScript files for easy
  updates.

## Tech Stack

- Next.js (App Router)
- React 19
- Tailwind CSS
- TypeScript
- Nodemailer (for contact form email delivery)

## Customization

All content, images, and data are easy to update. Just edit the files in the
`src/data` and `public/images` folders, or update the section components in
`src/features`.

## License

This project is for personal portfolio use. Feel free to take inspiration
however.

---

Thanks for visiting my portfolio!
