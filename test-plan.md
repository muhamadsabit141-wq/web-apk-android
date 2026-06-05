# Test Plan: Notion-like Block Editor + Native Mobile UI

## What Changed
- Block-based page editor with 13 block types and slash command (/) menu
- Mobile bottom navigation bar (Home/Search/Add/Habits/Settings)
- Sidebar as drawer overlay on mobile
- Mobile search view, settings view
- Touch-optimized responsive layout

## Test Environment
- Local dev server: http://localhost:3000
- Login: any email on /login page (mock auth)
- Desktop test: default browser width (≥768px)
- Mobile test: resize browser to ~375px width

---

## Test 1: Block Editor — Slash Command Inserts Heading Block (Desktop)

**Goal:** Prove the slash command menu works and actually changes block type.

1. Navigate to http://localhost:3000/login
2. Enter email "test@habitsxd.com", click "Sign in"
3. In workspace dashboard, click "Getting Started" page (or any recent page)
4. Page editor should show: title input at top, at least one empty text block below with placeholder "Type '/' for commands..."
5. Click the empty text block textarea to focus it
6. Type "/" character
7. **Assertion:** A floating slash menu appears below the cursor with block type options including "Heading 1", "Bullet List", "To-do", "Code", "Quote", "Callout", etc.
8. Click "Heading 1" in the slash menu (or press Enter since it's first after arrow navigation)
9. **Assertion:** The block transforms to a heading input — the textarea should have class `text-3xl font-bold` and placeholder "Heading 1"
10. Type "My Test Heading" into the heading block
11. Press Enter
12. **Assertion:** A new empty text block appears below the heading block
13. **Assertion:** The heading block still shows "My Test Heading" in large bold text

**Pass criteria:** Slash menu appears, selecting Heading 1 changes the block to large bold text, Enter creates new block below.

---

## Test 2: To-Do Block with Checkbox Toggle

**Goal:** Prove to-do blocks render a functional checkbox.

1. In the new empty text block from Test 1, type "/"
2. Select "To-do" from the slash menu
3. **Assertion:** Block shows a checkbox (unchecked square) on the left, textarea on the right with placeholder "To-do"
4. Type "Buy groceries"
5. Click the checkbox square
6. **Assertion:** Checkbox fills with blue (#0F7DFF) and shows a checkmark (✓), text gets strikethrough styling (line-through class)
7. Click the checkbox again
8. **Assertion:** Checkbox returns to unchecked state, strikethrough removed

**Pass criteria:** Checkbox toggles checked/unchecked state visually.

---

## Test 3: Mobile Bottom Navigation + Drawer Sidebar

**Goal:** Prove mobile UI renders as native app (bottom nav, drawer sidebar, not website).

1. Resize browser window to ~375px width (mobile viewport)
2. **Assertion:** Bottom navigation bar appears at screen bottom with 5 icons: Home, Search, a blue circular "+" button, Habits (calendar icon), Settings (gear icon)
3. **Assertion:** Desktop sidebar is hidden (not visible as side panel)
4. **Assertion:** Mobile header visible at top with hamburger menu icon and "HabitsXD" title
5. Tap the "Search" tab in bottom nav
6. **Assertion:** Search view renders with a search input field ("Search pages...") and list of recent pages
7. Tap "Settings" tab in bottom nav
8. **Assertion:** Settings view shows: user profile card with avatar initial, stats grid (Pages count, Habits count), dark mode toggle switch, logout button
9. Tap the dark mode toggle switch
10. **Assertion:** Background changes to dark (#191919), text becomes light
11. Tap hamburger menu icon in mobile header
12. **Assertion:** Drawer sidebar slides in from the left with backdrop overlay (semi-transparent dark background)
13. **Assertion:** Sidebar shows HabitsXD logo, Dashboard/Habit Tracker nav items, pages list, close (X) button
14. Tap the backdrop (dark overlay area) or X button
15. **Assertion:** Drawer sidebar closes/slides away

**Pass criteria:** Bottom nav renders with 5 tabs, sidebar is drawer overlay (not permanent), search/settings views render correctly, dark mode toggle works.

---

## Test 4: Mobile "Add" Button Creates New Page

**Goal:** Prove the floating "+" button in bottom nav creates a new page and navigates to editor.

1. (Still in mobile view ~375px) Tap the blue "+" circle button in the bottom nav
2. **Assertion:** A new page is created — mobile header shows "Untitled" as page title
3. **Assertion:** Back arrow appears in mobile header (left side)
4. **Assertion:** Page editor is visible with title input and empty block
5. Type "Mobile Test Page" in the title input
6. **Assertion:** Mobile header title updates to "Mobile Test Page"
7. Tap the back arrow in mobile header
8. **Assertion:** Returns to dashboard, "Mobile Test Page" appears in recent pages grid

**Pass criteria:** + button creates page, navigates to editor, back button returns to dashboard.
