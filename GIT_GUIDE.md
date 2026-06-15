# Git Guide — UTM RoomieHub

A simple step-by-step guide for team members who are new to Git.

---

## The Big Picture

```
GitHub (online)
    │
    │  git push / git pull
    │
Your Computer (local)
    │
    ├── main      ← final version, never touch
    ├── dev       ← team integration branch
    └── feature/yourname-page  ← your working branch
```

**You only ever work on your own `feature/` branch.**
When your page is done, you push it and open a Pull Request to `dev`.
Omar reviews it and merges it.

---

## First Time Setup (do this once)

### 1. Install Git
Download from: https://git-scm.com/downloads

### 2. Set your name and email
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### 3. Clone the project
```bash
git clone https://github.com/OmarShawir/UTM-RoomieHub.git
cd UTM-RoomieHub
```

### 4. Install dependencies
```bash
cd client
npm install
cd ../server
npm install
```

### 5. Set up your .env file
```bash
cp .env.example .env
```
Ask Omar for the values to put inside `.env`.

---

## Daily Workflow

Every single time you sit down to work, follow these steps in order.

---

### Step 1 — Get the latest code from the team

```bash
git checkout dev
git pull origin dev
```

> This makes sure you have everyone's latest changes before you start.

---

### Step 2 — Create your working branch

```bash
git checkout -b feature/yourname-pagename
```

Real examples:
```bash
git checkout -b feature/omar-chat-list
git checkout -b feature/heba-create-listing
git checkout -b feature/najmeldeen-login
git checkout -b feature/farah-dashboard
```

> You only do this once per page/feature. If you already have a branch, just switch to it:
> ```bash
> git checkout feature/omar-chat-list
> ```

---

### Step 3 — Work on your page

Open VS Code, write your code, save your files normally.

---

### Step 4 — Save your work (commit)

After finishing something meaningful (a page, a section, a fix):

```bash
git add .
git commit -m "feat: add chat list page"
```

**Commit often** — don't wait until you finish everything.

---

### Step 5 — Upload your work to GitHub

```bash
git push origin feature/omar-chat-list
```

---

### Step 6 — Open a Pull Request

1. Go to https://github.com/OmarShawir/UTM-RoomieHub
2. You'll see a yellow banner — click **"Compare & pull request"**
3. Make sure **base** is set to `dev`
4. Write a short title like `Add chat list page`
5. Click **"Create pull request"**
6. Message Omar on WhatsApp to review it

---

## Visual: What Happens Step by Step

```
[dev branch — latest code]
        │
        │ git checkout -b feature/omar-chat-list
        ▼
[your branch — your copy]
        │
        │ write code, git add, git commit
        ▼
[your branch — with your changes]
        │
        │ git push origin feature/omar-chat-list
        ▼
[GitHub — your branch is online]
        │
        │ Open Pull Request → Omar reviews → Merge
        ▼
[dev branch — your code is now in the team]
```

---

## Useful Commands

| Command | What it does |
|---------|-------------|
| `git status` | Shows what files you've changed |
| `git branch` | Shows all branches (current one has `*`) |
| `git log --oneline` | Shows recent commits |
| `git diff` | Shows exact changes you made |
| `git stash` | Temporarily saves your changes |
| `git stash pop` | Brings back your stashed changes |

---

## Common Mistakes and How to Fix Them

### "I forgot to pull before I started working"
```bash
git stash          # save your current work temporarily
git pull origin dev
git stash pop      # bring your work back
```

### "I worked on the wrong branch"
```bash
git stash
git checkout feature/correct-branch
git stash pop
```

### "I want to undo my last commit (but keep the code)"
```bash
git reset --soft HEAD~1
```

### "I don't know what branch I'm on"
```bash
git branch
# The branch with * is your current one
```

### "My push was rejected"
```bash
git pull origin feature/your-branch-name
# Fix any conflicts, then push again
git push origin feature/your-branch-name
```

### "There's a conflict"
**Stop. Message Omar immediately.**
Do not try to resolve conflicts on your own.

---

## Pull Request Checklist

Before opening a PR, make sure:

- [ ] Your page renders without errors
- [ ] You used `var(--color-primary)` not hardcoded colors
- [ ] You used shared components from `/components`
- [ ] You didn't touch other people's files
- [ ] Your commit messages follow the format (`feat:`, `fix:`, etc.)
- [ ] You tested on your local browser

---

## Branch Naming Reference

| Who | Branch format | Example |
|-----|--------------|---------|
| Omar | `feature/omar-pagename` | `feature/omar-chat-list` |
| Hebatulla | `feature/heba-pagename` | `feature/heba-create-listing` |
| Najmeldeen | `feature/najmeldeen-pagename` | `feature/najmeldeen-login` |
| Farah | `feature/farah-pagename` | `feature/farah-dashboard` |

---

## Still Confused?

Message Omar. Seriously — it's better to ask than to break something.

---

*Last updated: June 2026*
