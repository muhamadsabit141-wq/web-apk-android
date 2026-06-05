# HabitsXD

A Notion-inspired productivity and note-taking app with a clean, modern UI. Works on desktop, mobile web, and Android via PWA.

## Features

- **Block-based page editor** — rich text editing with emoji icons and nested pages
- **Habit tracker** — monthly grid, streak counter, color-coded habits
- **Dashboard** — quick stats, recent pages, daily habit summary
- **Collapsible sidebar** — Notion-style tree navigation with favorites and recents
- **Dark mode** — toggle between light and dark themes
- **PWA** — installable as an Android app via PWABuilder or Bubblewrap
- **Responsive** — works on 375px screens and up

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **State:** Zustand (persisted to localStorage)
- **Icons:** Lucide React
- **Font:** Geist (via `next/font`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx            # Landing page
    login/page.tsx      # Login
    register/page.tsx   # Register
    workspace/page.tsx  # Main workspace
    layout.tsx          # Root layout with PWA metadata
    globals.css         # Global styles + Tailwind
  components/
    dashboard/          # Dashboard widgets
    editor/             # Page editor
    habit-tracker/      # Habit tracker grid
    sidebar/            # Sidebar navigation + page tree
    ui/                 # Reusable UI (Button, Input, Modal, ThemeProvider)
  hooks/
    useServiceWorker.ts
  lib/
    store.ts            # Zustand store
    types.ts            # TypeScript types
    utils.ts            # Utilities
public/
  manifest.json         # PWA manifest
  sw.js                 # Service worker
  icons/                # PWA icons (192x192, 512x512)
```

## Building for Production

```bash
npm run build
npm start
```

## Building an Android APK

HabitsXD is PWA-ready. To create an Android APK:

### Option 1: PWABuilder (recommended)

1. Deploy the app to a public URL (e.g., Vercel)
2. Go to [PWABuilder](https://www.pwabuilder.com/)
3. Enter your deployed URL
4. Click **Build My PWA** → **Android**
5. Download the generated APK/AAB

### Option 2: Bubblewrap CLI

```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://your-deployed-url.com/manifest.json
bubblewrap build
```

This generates a signed APK in the output directory. See the [Bubblewrap docs](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start) for details.

## Deployment

Deploy to [Vercel](https://vercel.com) for the easiest setup:

```bash
npx vercel
```

## License

MIT
