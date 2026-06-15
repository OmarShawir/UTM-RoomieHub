# Contributing Guide — UTM RoomieHub

Read this file fully before writing any code.

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/OmarShawir/UTM-RoomieHub.git
cd UTM-RoomieHub
```

### 2. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
# Fill in the values — ask Omar if unsure
```

### 4. Run the project
Open two terminals:
```bash
# Terminal 1 — Frontend
cd client
npm run dev

# Terminal 2 — Backend
cd server
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## Git Workflow

> **Rule #1: Never push directly to `main` or `dev`.**

### Every time you start working on something new:

**Step 1 — Get the latest code:**
```bash
git checkout dev
git pull origin dev
```

**Step 2 — Create a new branch:**
```bash
git checkout -b feature/yourname-page-name
```

Examples:
```bash
git checkout -b feature/omar-chat-list
git checkout -b feature/heba-create-listing
git checkout -b feature/najmeldeen-login
git checkout -b feature/farah-admin-dashboard
```

**Step 3 — Work normally on your branch.**

**Step 4 — Save your work:**
```bash
git add .
git commit -m "feat: add chat list page"
```

**Step 5 — Push your branch:**
```bash
git push origin feature/omar-chat-list
```

**Step 6 — Open a Pull Request on GitHub:**
1. Go to the repo on GitHub
2. Click "Compare & pull request"
3. Set base branch to `dev`
4. Write a short description
5. Click "Create pull request"
6. **Tell Omar** so he can review it

---

## Commit Message Format

```
type: short description in English
```

| Type | Use when |
|------|----------|
| `feat` | Adding a new page or feature |
| `fix` | Fixing a bug |
| `style` | UI/CSS changes only |
| `refactor` | Restructuring code without changing behavior |
| `chore` | Installing packages, config changes |
| `docs` | Updating documentation |

**Good examples:**
```bash
git commit -m "feat: add chat list page"
git commit -m "feat: implement room preference form"
git commit -m "fix: send button not working on mobile"
git commit -m "style: update active nav link color"
git commit -m "chore: install react-query"
```

**Bad examples:**
```bash
git commit -m "done"
git commit -m "changes"
git commit -m "fix stuff"
git commit -m "aaaaaa"
```

---

## Where to Put Your Files

### Pages
Each page goes in its own folder under `/client/src/pages/`:

```
pages/
├── auth/           → Najmeldeen
├── profile/        → Najmeldeen
├── listings/       → Hebatulla
├── search/         → Hebatulla
├── map/            → Hebatulla
├── chat/           → Omar
├── recommendation/ → Omar
├── matching/       → Omar
├── reviews/        → Farah
├── admin/          → Farah
└── analytics/      → Farah
```

### Shared Components
Already built in `/client/src/components/`. Use them — don't recreate.

```jsx
import Navbar from '../components/Navbar';
```

### API Calls
All backend calls go in `/client/src/services/`. Never write axios directly in a page.

```js
// services/chatService.js
import api from './api';

export const getConversations = () => api.get('/chat/conversations');
export const sendMessage = (id, content) => api.post(`/chat/${id}/messages`, { content });
```

---

## Design Rules

Always use CSS variables — never hardcode colors:

```css
/* Correct */
color: var(--color-primary);

/* Wrong */
color: #7B1E1E;
```

Available variables:
```css
--color-primary         /* #7B1E1E — crimson red */
--color-background      /* #F9FAFB */
--color-surface         /* #FFFFFF */
--color-text-primary    /* #111827 */
--color-text-secondary  /* #6B7280 */
--color-success         /* #10B981 */
--color-error           /* #EF4444 */
--color-border          /* #E5E7EB */
```

See `DESIGN_SYSTEM.md` for the full reference.

---

## Important Rules

1. **Only touch your own files** — don't edit another person's pages
2. **Don't modify shared components** without telling Omar first
3. **Don't install new packages** without asking the team
4. **Commit after each page** — not everything at the end
5. **Git conflict?** — Stop and tell Omar immediately. Don't try to fix it alone.

---

## Common Issues

**`npm install` fails:**
```bash
npm install --legacy-peer-deps
```

**Don't know which branch you're on:**
```bash
git branch   # the current branch has a * next to it
```

**Accidentally worked on the wrong branch:**
```bash
git stash
git checkout feature/correct-branch-name
git stash pop
```

**Want to see what changed:**
```bash
git status
git diff
```

---

## Questions?

Contact Omar before doing anything you're unsure about.
