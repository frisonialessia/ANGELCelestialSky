# ✦ Angel · a celestial dream

A contemplative, interactive web experience. **Seven doors, seven questions, one sky.**
You choose a guardian angel, fly into the sky, and pass through seven crystal doors —
each holding a question to reflect on. Your answers become your own sky of stars.

![preview](preview.png)

## ✧ Features

- **Create your angel** — choose among four beings of light (Leonor, Rosa, Francisca, Irene), each with its own aura.
- **Celestial flight** — a 3D transition through rings and spheres of crystal.
- **Seven doors** — The Garden, The Beloved, Release, A Wish, The Angel, Memories, and Gratitude.
- **Your Sky** — once all seven are complete, your answers gather into a constellation you can **download as an image**.
- **Ambient sound** — an ethereal pad and crystal chimes (synthesized, with a mute button).
- **Your angel follows you**, the doors float, text reveals word by word, and your progress is saved.

## ✧ How to use

It's a single self-contained `angel.html` file. Just:

1. Open `angel.html` in any modern browser (Chrome, Safari, Firefox, Edge).
2. Tap or click once to enable sound (a browser requirement).

No build step, no server, no separate CSS or JS files — everything (styles, scripts, icons) is embedded in the single HTML file. Works on desktop and mobile.

### Publishing on GitHub Pages

1. Add `angel.html` to your repository (rename it to `index.html` if you want it to be the default page).
2. In **Settings → Pages**, enable GitHub Pages from the `main` branch.
3. Your site will be live at `https://USERNAME.github.io/REPO/`.

> For a nice link preview when sharing, add a `preview.png` image (~1200×630 px)
> and update the `og:image` line in `angel.html` with your username and repository.

## ✧ Tech

- Plain HTML, CSS, and JavaScript in a single file.
- [Three.js](https://threejs.org/) — the 3D flight scene (loaded only when needed).
- [Tone.js](https://tonejs.github.io/) — synthesized ambient sound.
- Fonts: Tangerine and Cormorant Garamond (Google Fonts).

If there's no internet connection, the 3D flight and sound are skipped gracefully and the rest keeps working.

## ✧ Accessibility

- Keyboard navigable (Tab + Enter/Space).
- Respects the system *reduce motion* preference.
- Visible focus states and ARIA roles for screen readers.

## ✧ Palette

Lavender and ice blues (`#99abfd` `#cad5f7` `#daeaf6` `#f2fbfd`), mints (`#aff2a2` `#b0f7d0`),
whites and silver grays, with a subtle mystic rose-lilac accent.

---

Made with care. ✦
