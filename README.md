# Mohamed Abdelmaksod - Modern Portfolio

A modern static portfolio rebuilt around Mohamed's current CV and public GitHub profile.

## Highlights

- Responsive dark UI with glass / grid visual language
- GSAP + ScrollTrigger animations
- Animated hero portrait, floating stack chips, marquee, reveal sequences, timeline progress, counters, tilt and magnetic interactions
- Reduced-motion accessibility fallback
- Updated experience, skills, education, projects, GitHub and LinkedIn links
- Downloadable CV
- Optimized WebP profile image

## Run locally

You can open `index.html` directly, but a local server is better:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

The project is static and works on GitHub Pages, Netlify, Vercel, Cloudflare Pages, or any basic web host.

## Animation dependency

GSAP and ScrollTrigger are loaded via CDN. If they fail to load, the site falls back to a lightweight IntersectionObserver reveal system.
