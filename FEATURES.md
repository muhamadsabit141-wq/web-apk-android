# HabitsXD - Complete Feature Documentation

## 🎯 Overview
HabitsXD adalah aplikasi web produktivitas dan note-taking yang terinspirasi dari Notion. Aplikasi ini dirancang dengan fokus pada mobile-first experience dengan UI yang modern, bersih, dan responsif.

---

## ✨ Core Features

### 1. **📝 Notes & Pages Management**
- Create, edit, dan organize notes dengan hierarchical page structure
- Support untuk parent-child page relationships
- Rich text editing dengan block-based editor
- Favorites dan archive functionality
- Page duplication

**Block Types:**
- Text, Headings (H1, H2, H3)
- Lists (bullet, numbered, toggle)
- Todos dengan checkbox tracking
- Code blocks dengan syntax highlighting
- Quotes, Callouts, Dividers
- Images, Tables

### 2. **✅ Tasks Management** (NEW)
- Create dan manage tasks dengan priority levels
- Task status tracking: Todo → In-Progress → Done
- Due date management dengan visual indicators
- Priority levels: Low, Medium, High, Urgent
- Tag system untuk categorization
- Expandable task cards dengan details
- Filter tasks by status, priority, atau due date
- Sort by due date, priority, atau creation time

### 3. **🔥 Habit Tracking** (ENHANCED)
- Daily habit tracking dengan visual calendar
- Streak counting (current & longest)
- Completion rate calculation (percentage)
- Habit icons dan custom colors
- Two view modes:
  - **Calendar View**: Traditional calendar dengan checkmarks
  - **Stats View**: Comprehensive stats cards dengan metrics
- Habit descriptions untuk konteks
- Habit frequency support (daily, weekly, monthly)

### 4. **📅 Calendar Integration** (NEW)
- Interactive calendar showing tasks dan habits
- Event indicators untuk tasks dan completed habits
- Month navigation
- Mobile-optimized calendar view
- Integration dengan tasks dan habits

---

## 🚀 Notion-Like Features (10+)

### 1. **Database Views**
- Multiple view modes untuk data:
  - Table view untuk structured data
  - List view untuk linear presentation
  - Board view untuk kanban-style
  - Calendar view untuk date-based

### 2. **Advanced Filtering & Sorting**
- Filter tasks by priority, status, due date
- Multiple filter conditions
- Dynamic sort by:
  - Due date
  - Priority
  - Title
  - Creation date
- Save custom filters

### 3. **Page Templates** (NEW)
Pre-built templates untuk quick page creation:
- **Daily Note**: Untuk journal dan reflections
- **Meeting Notes**: Untuk capture meeting info
- **Project Brief**: Untuk project planning
- **Blog Post**: Untuk writing posts
- **Checklist**: Untuk task lists

### 4. **Export Functionality** (NEW)
Export data dalam multiple formats:
- **Markdown (.md)**: Untuk portability
- **CSV (.csv)**: Untuk spreadsheet tools
- **JSON (.json)**: Untuk backup
- Full data export dengan history

### 5. **Reminders & Notifications** (NEW)
- Overdue task alerts
- Due soon notifications (within 24 hours)
- Notification center dengan badge count
- Mark as read/dismiss functionality

### 6. **AI Assistant** (NEW)
- Floating AI button dengan suggestions
- Task title recommendations
- Description auto-generation
- Tag suggestions
- Content ideas
- Confidence scoring untuk suggestions

### 7. **Tags & Labels**
- Color-coded tags
- Multiple tags per task/note
- Tag-based organization
- Tag suggestions via AI

### 8. **Keyboard Shortcuts**
- **Ctrl+K**: Open command palette
- **Ctrl+B**: Toggle sidebar
- **Ctrl+Shift+L**: Toggle dark mode
- **?**: Show shortcuts help
- **Ctrl+Shift+T**: Create new task
- **Ctrl+Z**: Undo
- **Ctrl+Shift+Z**: Redo

### 9. **Data Backup & Export**
- Export all data as JSON
- One-click backup download
- Scheduled auto-backup (future)
- Import from backup

### 10. **Settings & Preferences**
- Dark/Light mode toggle dengan smooth transitions
- Notification preferences
- Privacy & security settings
- Data management (backup, export)
- Help & support

---

## 🎨 UI/UX Features

### Dark Mode (ENHANCED)
- Full dark mode support dengan CSS variables
- Smooth transitions between themes
- Automatic system theme detection
- Custom dark colors: #191919, #1e1e1e, #252525, #2f2f2f

### Mobile-First Design
- **Bottom Navigation**: 5-tab navigation untuk mobile
  - Home Dashboard
  - Search
  - Tasks
  - Habits  
  - Settings
- **Responsive Layout**: Automatic switch dari mobile ke desktop
- **Touch-Optimized**: Large touch targets, proper spacing
- **Safe Area Support**: Works dengan notch devices

### Animations & Transitions
- Smooth page transitions dengan Framer Motion
- Button hover effects
- Expandable card animations
- Tab switching animations
- Dark mode transition effects

### Accessibility
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus states untuk accessibility
- High contrast dalam dark mode

---

## 📊 Data Management

### Local Storage
- Uses Zustand dengan persist middleware
- All data automatically persisted
- No server required untuk development

### State Management
- Zustand store untuk global state
- TypeScript types untuk type safety
- Actions untuk state mutations:
  - CRUD operations untuk pages, tasks, habits
  - Filtering dan sorting
  - Theme management

### Data Structure
```typescript
interface AppState {
  user: User | null
  pages: Record<string, Page>
  habits: Habit[]
  tasks: Task[]
  databases: Record<string, Database>
  mobileTab: MobileTab
  darkMode: boolean
  // ... more state
}
```

---

## 🛠️ Technology Stack

**Frontend:**
- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- Zustand (state management)
- Framer Motion (animations)
- Lucide Icons

**Tools:**
- ESLint untuk code quality
- UUID untuk ID generation
- BlockNote untuk rich text editing

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Usage |
|-----------|-------|-------|
| Mobile | < 768px | Bottom nav, full-width layouts |
| Tablet | 768px - 1024px | Adaptive layouts |
| Desktop | > 1024px | Sidebar, multi-column layouts |

---

## 🎯 Component Structure

```
src/
├── app/
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Landing)
│   └── workspace/
│       └── page.tsx (Main app)
├── components/
│   ├── dashboard/ (Dashboard overview)
│   ├── editor/ (Note editor)
│   ├── tasks/ (Tasks management)
│   ├── habit-tracker/ (Habits tracking)
│   ├── calendar/ (Calendar view)
│   ├── navigation/ (Bottom nav, search, settings)
│   ├── sidebar/ (Sidebar navigation)
│   ├── ui/ (Reusable UI components)
│   ├── notifications/ (Reminders center)
│   ├── templates/ (Templates gallery)
│   └── ai/ (AI assistant)
├── lib/
│   ├── store.ts (Zustand store)
│   ├── types.ts (TypeScript types)
│   ├── utils.ts (Utility functions)
│   ├── export.ts (Export functionality)
│   └── keyboard-shortcuts.ts (Shortcuts)
└── hooks/
    └── useServiceWorker.ts (PWA support)
```

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Start Production
```bash
npm start
```

---

## 📋 Feature Checklist

- [x] Dark/Light mode toggle
- [x] Tasks management system
- [x] Habits tracking dengan streaks
- [x] Calendar integration
- [x] Database views (table, list, board, calendar)
- [x] Advanced filtering & sorting
- [x] Page templates
- [x] Export (Markdown, CSV, JSON)
- [x] Reminders & notifications
- [x] AI assistant
- [x] Keyboard shortcuts
- [x] Mobile-first responsive design
- [x] Tags & labels system
- [x] Settings page
- [x] Data backup & export
- [x] Bottom navigation
- [x] Command palette
- [x] Search functionality

---

## 🎓 Best Practices

### For Developers
1. Use TypeScript untuk type safety
2. Keep components small dan focused
3. Use Tailwind CSS utilities
4. Leverage Zustand actions untuk state updates
5. Add proper error boundaries

### For Users
1. Use templates untuk quick setup
2. Tag tasks untuk better organization
3. Set due dates untuk important tasks
4. Review metrics dalam habits stats
5. Export data regularly untuk backup

---

## 🔮 Future Enhancements

- [ ] Cloud sync & backup
- [ ] Collaborative features
- [ ] Advanced AI dengan real API
- [ ] Mobile app (React Native)
- [ ] Plugin system
- [ ] Custom themes
- [ ] Advanced analytics
- [ ] Time tracking
- [ ] Notifications via email/push
- [ ] Social sharing

---

## 📞 Support

Untuk pertanyaan atau suggestions, silakan buat issue di repository.

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-05  
**License**: MIT
