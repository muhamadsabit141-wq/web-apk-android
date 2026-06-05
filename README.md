# HabitsXD - Complete Productivity & Note-Taking App

<div align="center">

![HabitsXD](public/icons/logo.png)

A **Notion-inspired productivity app** with modern, clean UI designed for mobile-first experience. Features task management, habit tracking, calendar integration, and 10+ Notion-like features with AI assistance.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Documentation](#documentation)

**Status**: ✅ Feature Complete | 🎯 Ready for Production

</div>

---

## ✨ Key Highlights

- 📱 **Mobile-First Design** — Optimized for 375px-1440px screens
- 🎨 **Dark Mode** — Full dark/light theme with smooth transitions  
- ✅ **Task Management** — Priority levels, due dates, filtering, sorting
- 🔥 **Habit Tracking** — Streaks, completion rates, visual calendar
- 📅 **Calendar Integration** — Tasks & habits synced with interactive calendar
- 🤖 **AI Assistant** — Smart suggestions for tasks and content
- 💾 **Data Backup** — Export to JSON, Markdown, or CSV
- ⌨️ **Keyboard Shortcuts** — Power user shortcuts for quick actions
- 🔐 **Local Storage** — All data stored locally, no server required

---

## 🚀 Features

### Core Features

#### 📝 **Notes & Pages** 
- Create unlimited notes/pages with hierarchical structure
- Rich text editing with multiple block types
- Support for sub-pages and favorites
- Archive old notes
- Page icons and emoji support
- Auto-save functionality

**Block Types Supported:**
- Text paragraphs
- Headings (H1, H2, H3)
- Lists (bullet, numbered, toggle)
- Todos with checkboxes
- Code blocks
- Quotes & callouts
- Images & tables
- Dividers

#### ✅ **Task Management** (NEW)
- Create & manage tasks with intuitive UI
- **Priority Levels**: Low, Medium, High, Urgent
- **Status Tracking**: Todo → In-Progress → Done → Completed
- **Due Dates** with visual indicators
- **Tags** for organization
- **Checklists** within tasks
- Filter by status, priority, or due date
- Sort by due date, priority, title, or created date
- Expandable task cards with full details

#### 🔥 **Habit Tracking** (ENHANCED)
- Daily habit tracking with calendar view
- **Streak Tracking**: Current & longest streaks
- **Completion Rate**: Percentage based on history
- **Habit Icons**: 10 emoji options for visual identification
- **Two View Modes**:
  - Calendar view with daily checkmarks
  - Stats view with comprehensive metrics
- Habit frequency support (daily, weekly, monthly)
- Detailed habit descriptions

#### 📅 **Calendar** (NEW)
- Interactive monthly calendar
- Events show on calendar (tasks & completed habits)
- Month navigation (previous/next)
- Today highlight
- Mobile-optimized layout

### Notion-Like Features (10+)

1. **🗂️ Database Views** — Table, List, Board, Calendar views
2. **🔍 Filtering & Sorting** — Advanced filters with multiple conditions
3. **📋 Page Templates** — Daily Note, Meeting, Project, Blog, Checklist
4. **💾 Export Data** — Markdown, CSV, JSON formats
5. **🔔 Reminders & Notifications** — Overdue & due-soon alerts
6. **🤖 AI Assistant** — Smart suggestions with confidence scoring
7. **#️⃣ Tags & Labels** — Color-coded organization
8. **⌨️ Keyboard Shortcuts** — Ctrl+K, Ctrl+B, Ctrl+Shift+L, etc.
9. **💾 Data Backup** — One-click JSON export
10. **⚙️ Settings & Preferences** — Theme, notifications, privacy
11. **🔐 Encryption Ready** — Data structure supports future encryption
12. **📊 Analytics** — Habit completion rates, task statistics

### UI/UX Features

#### 🎨 **Dark Mode**
- Full dark/light theme support
- Smooth CSS transition animations
- System theme detection
- Persistent preference storage
- WCAG AA contrast ratios

#### 📱 **Mobile-First Responsive Design**
- Bottom navigation with 5 tabs
- Touch-optimized buttons (44px minimum)
- Proper safe area support
- Horizontal layout optimization
- No content overlap with bottom nav

#### 🎭 **Animations & Transitions**
- Smooth page transitions
- Button hover effects
- Expandable card animations
- Tab switching animations
- Dark mode transition effects

#### 🔐 **Accessibility**
- Keyboard navigation support
- ARIA labels and roles
- Focus states
- High contrast dark mode
- Semantic HTML structure

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion 12 |
| **State Management** | Zustand 5 |
| **Icons** | Lucide React |
| **Storage** | localStorage (via Zustand persist) |
| **Build Tools** | Webpack (Next.js default) |
| **Linting** | ESLint |
| **Fonts** | Geist (next/font) |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm 9+ or yarn 3+

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd web-apk-android

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build optimized bundle
npm run build

# Start production server
npm start
```

---

## 🎯 Project Structure

```
web-apk-android/
├── public/                  # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # App icons
│
├── src/
│   ├── app/               # Next.js app router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Landing page
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   └── workspace/     # Main workspace
│   │       └── page.tsx   # Workspace layout
│   │
│   ├── components/
│   │   ├── dashboard/     # Dashboard component
│   │   ├── editor/        # Note editor
│   │   ├── tasks/         # Tasks UI
│   │   ├── habit-tracker/ # Habits UI
│   │   ├── calendar/      # Calendar component
│   │   ├── navigation/    # Nav components
│   │   ├── sidebar/       # Sidebar
│   │   ├── ui/            # Reusable UI
│   │   ├── notifications/ # Reminders
│   │   ├── templates/     # Templates
│   │   └── ai/            # AI assistant
│   │
│   ├── lib/
│   │   ├── store.ts       # Zustand store
│   │   ├── types.ts       # TypeScript types
│   │   ├── utils.ts       # Utilities
│   │   ├── export.ts      # Export functions
│   │   └── keyboard-shortcuts.ts
│   │
│   └── hooks/
│       └── useServiceWorker.ts
│
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── FEATURES.md            # Feature documentation
├── TESTING.md             # Test plan
└── README.md              # This file
```

---

## 🚀 Key Features Breakdown

### 1️⃣ Tasks Management
```
✨ Features:
  • Create/Edit/Delete tasks
  • Priority: Low, Medium, High, Urgent
  • Status: Todo, In-Progress, Done, Cancelled
  • Due dates with calendar sync
  • Tags for categorization
  • Task checklists
  • Filter & sort options
  • Quick add via top bar
```

### 2️⃣ Habit Tracking
```
✨ Features:
  • Daily check-in calendar
  • Streak calculations (current & longest)
  • Completion rate percentage
  • Habit icons (10 options)
  • Two view modes (calendar + stats)
  • Frequency options
  • Habit descriptions
```

### 3️⃣ AI Assistant
```
✨ Features:
  • Floating suggestion panel
  • Task title recommendations
  • Description generation
  • Tag suggestions
  • Confidence scoring
  • Quick apply functionality
```

### 4️⃣ Data Management
```
✨ Features:
  • Export as JSON (backup)
  • Export as Markdown (sharing)
  • Export as CSV (spreadsheets)
  • One-click backup download
  • Local storage persistence
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` | Open command palette |
| `Ctrl+B` | Toggle sidebar |
| `Ctrl+Shift+L` | Toggle dark mode |
| `Ctrl+Shift+T` | Create new task |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `?` | Show shortcuts help |

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 768px | Single column, bottom nav |
| Tablet | 768px - 1024px | Adaptive |
| Desktop | > 1024px | Sidebar + multi-column |

---

## 🎨 Color Scheme

### Light Mode
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Border: `#E5E5E5`
- Text: `#191919`
- Primary: `#0F7DFF`

### Dark Mode
- Background: `#191919`
- Surface: `#1E1E1E`
- Border: `#2F2F2F`
- Text: `#F5F5F5`
- Primary: `#0F7DFF`

---

## 📊 Performance

| Metric | Target | Status |
|--------|--------|--------|
| Initial Load | < 2s | ✅ |
| Dark Mode Toggle | < 100ms | ✅ |
| Task Creation | < 50ms | ✅ |
| Scroll Performance | 60 FPS | ✅ |
| Bundle Size | < 200KB | ✅ |

---

## 🔐 Security & Privacy

- ✅ All data stored locally (no server transmission)
- ✅ No external API calls for personal data
- ✅ localStorage encryption ready
- ✅ No tracking or analytics
- ✅ Open source & auditable

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 Documentation

- **[FEATURES.md](./FEATURES.md)** — Detailed feature documentation
- **[TESTING.md](./TESTING.md)** — Test plan & verification guide
- **[AGENTS.md](./AGENTS.md)** — Agent configuration notes

---

## 🐛 Known Issues

None currently reported. Please file issues on GitHub.

---

## 📋 Roadmap

### Planned Features
- [ ] Cloud sync & collaboration
- [ ] Mobile app (React Native)
- [ ] Real-time AI with OpenAI API
- [ ] Advanced analytics
- [ ] Custom themes
- [ ] Plugin system
- [ ] Time tracking
- [ ] Email notifications
- [ ] Social sharing

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 👨‍💻 Author

Built with ❤️ for productivity enthusiasts.

---

## 🙋 Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: support@habitsxd.dev

---

## ✨ Acknowledgments

- Inspired by [Notion](https://notion.so)
- Icons by [Lucide](https://lucide.dev)
- Styling by [Tailwind CSS](https://tailwindcss.com)
- Animations by [Framer Motion](https://www.framer.com/motion)

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-05  
**Status**: ✅ Production Ready


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
