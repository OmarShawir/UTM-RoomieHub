# Design System — UTM RoomieHub

This file defines all visual rules for the project.
**Use only these values — never invent your own colors or sizes.**

---

## Colors

```css
/* Primary */
--color-primary:        #7B1E1E;   /* Crimson — main buttons, active states */
--color-primary-hover:  #6B1717;   /* Button hover */

/* Backgrounds */
--color-background:     #F9FAFB;   /* Page background */
--color-surface:        #FFFFFF;   /* Cards, panels, modals */

/* Text */
--color-text-primary:   #111827;   /* Main text */
--color-text-secondary: #6B7280;   /* Subtitles, placeholders */

/* Status */
--color-success:        #10B981;   /* Active, verified */
--color-error:          #EF4444;   /* Error, suspended */
--color-warning:        #F59E0B;   /* Pending */
--color-info:           #3B82F6;   /* Info badges */

/* Border */
--color-border:         #E5E7EB;   /* Input borders, card borders */
```

---

## Typography

```css
font-family: 'Inter', sans-serif;

/* Sizes */
12px  → xs     (tiny labels)
14px  → sm     (captions, helper text)
16px  → base   (body text)
20px  → lg     (H3)
24px  → xl     (H2)
32px  → 2xl    (H1)

/* Weights */
400 → normal
500 → medium
600 → semibold
700 → bold
```

---

## Spacing

All spacing is in multiples of 4px:

```
4px   → --space-1
8px   → --space-2
12px  → --space-3
16px  → --space-4
20px  → --space-5
24px  → --space-6
32px  → --space-8
48px  → --space-12
```

---

## Components

### Button

```jsx
<button className="btn btn-primary">Create Account</button>
<button className="btn btn-secondary">Cancel</button>
<button className="btn btn-danger">Delete</button>
```

| Class | Use |
|-------|-----|
| `btn btn-primary` | Main action (submit, confirm) |
| `btn btn-secondary` | Cancel, secondary action |
| `btn btn-danger` | Delete, suspend |

---

### Input

```jsx
<div className="form-group">
  <label>UTM Email *</label>
  <input type="email" placeholder="yourname@utm.my" />
  <span className="error-msg">Email is required</span>
</div>
```

- Normal border: `var(--color-border)`
- Focus border: `var(--color-primary)`
- Error border: `var(--color-error)`

---

### Card

```jsx
<div className="card">
  content here
</div>
```

---

### Badge

```jsx
<span className="badge badge-active">Active</span>
<span className="badge badge-pending">Pending</span>
<span className="badge badge-suspended">Suspended</span>
<span className="badge badge-info">Verified</span>
```

---

### Modal

```jsx
<div className="modal-overlay">
  <div className="modal">
    <h2>Confirm Action</h2>
    <p>Are you sure you want to do this?</p>
    <div className="modal-actions">
      <button className="btn btn-secondary">Cancel</button>
      <button className="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## Layout

```css
/* Page content max width */
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;

/* Top padding to offset fixed navbar */
padding-top: 88px;
```

Use the `.page-wrapper` class on every page:
```jsx
<div className="page-wrapper">
  page content
</div>
```

---

## Images

```css
/* Listing photos */
aspect-ratio: 16 / 9;
object-fit: cover;
border-radius: 8px;

/* Profile picture — navbar */
width: 40px;
height: 40px;
border-radius: 50%;

/* Profile picture — profile page */
width: 96px;
height: 96px;
border-radius: 50%;
```

---

## Navbar

**Student:**
```
Home | Search | AI Match | My Listings | Chat    [avatar]
```

**Admin (sidebar):**
```
Dashboard | Users | Listings | Reports | Analytics | Back to Site
```

---

## Naming Conventions

| Type | Format | Example |
|------|--------|---------|
| Components | PascalCase | `ChatList.jsx` |
| Pages | PascalCase | `ChatConversationPage.jsx` |
| Services | camelCase | `chatService.js` |
| Hooks | camelCase | `useChat.js` |
| CSS files | match component | `ChatList.css` |

---

## Do's and Don'ts

### ✅ Do
- Use CSS variables for all colors
- Use shared components from `/components`
- Follow the spacing system
- Use `Inter` font

### ❌ Don't
- Hardcode hex colors in components
- Create a new Button or Input if one already exists
- Use any font other than Inter
- Change values defined in this file without telling the team

---

*Last updated: June 2026*
