# Esther Kung'u · Portfolio

Personal site: one Linux server grows into a fleet as you scroll.

Built with Next.js, TypeScript, Three.js (react-three-fiber) and plain CSS.

## Edit the content

Everything personal lives in `content/`:

- `content/site.ts`: name, links, the scroll story chapters, the NiaTalent section
- `content/projects.ts`: project cards (copy an entry to add one)
- `content/profile.ts`: toolbox, experience, certifications, resumes, team globe locations
- `public/resumes/`: the PDF resumes and their preview images

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy

Import the repo on vercel.com. Every push to `main` redeploys.
