# 🏠 UTM RoomieHub

> A dedicated web platform for UTM students to find verified accommodation and compatible roommates within the university community.

**Course:** SCSE2243 SEC01 — Application Development Project I  
**Session:** Semester II, 2025/26  
**Team:** AppDev1337

| Name | Matric No. | Role |
|------|-----------|------|
| Omar Nasreldin Mahgoub Shawir | A24CS4031 | Communication & Matching |
| Hebatulla Omer Abdulla Ali | A24CS4014 | Listing & Search |
| Farah Maged Abdelkarim | A24CS0010 | Analytics & Trust |
| Najmeldeen Mohamed Eltigani Salih | A24CS9001 | User Management |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Maps | Google Maps API |
| AI Features | Open-source ML libraries |
| Design | Figma |
| Version Control | Git + GitHub |

---

## 📁 Project Structure

```
UTM-RoomieHub/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── assets/          # Images, icons, fonts
│       ├── components/      # Shared reusable components
│       │   ├── Navbar.jsx
│       │   ├── Button.jsx
│       │   ├── Card.jsx
│       │   ├── Modal.jsx
│       │   ├── Badge.jsx
│       │   └── Input.jsx
│       ├── pages/           # One folder per subsystem
│       │   ├── auth/        # Najmeldeen
│       │   ├── profile/     # Najmeldeen
│       │   ├── listings/    # Hebatulla
│       │   ├── search/      # Hebatulla
│       │   ├── map/         # Hebatulla
│       │   ├── chat/        # Omar
│       │   ├── recommendation/ # Omar
│       │   ├── matching/    # Omar
│       │   ├── reviews/     # Farah
│       │   ├── admin/       # Farah
│       │   └── analytics/   # Farah
│       ├── services/        # Axios API calls
│       ├── context/         # AuthContext, global state
│       ├── hooks/           # Custom React hooks
│       ├── utils/           # Helper functions
│       ├── App.jsx
│       └── main.jsx
├── server/                  # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/OmarShawir/UTM-RoomieHub.git
cd UTM-RoomieHub
```

### 2. Setup environment variables
```bash
cp .env.example .env
# Fill in your values in .env
```

### 3. Install dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 4. Run the development servers
```bash
# Frontend (from /client)
npm run dev

# Backend (from /server)
npm run dev
```

Frontend runs on: `http://localhost:5173`  
Backend runs on: `http://localhost:5000`

---

## 🌿 Branch Strategy

```
main          → production only (protected)
dev           → integration branch — all PRs go here
│
├── feature/omar-chat
├── feature/omar-recommendation
├── feature/omar-matching
├── feature/heba-listings
├── feature/heba-search
├── feature/heba-map
├── feature/najmeldeen-auth
├── feature/najmeldeen-profile
├── feature/farah-reviews
├── feature/farah-admin
└── feature/farah-analytics
```

**Rules:**
- Never push directly to `main` or `dev`
- Always create a pull request to `dev`
- At least one team member must review before merging
- Delete branch after merging

---

## ✍️ Commit Convention

Follow this format for every commit:

```
type: short description
```

| Type | When to use |
|------|------------|
| `feat` | New feature or page |
| `fix` | Bug fix |
| `style` | UI/CSS changes only |
| `refactor` | Code restructure, no feature change |
| `chore` | Config, dependencies, setup |
| `docs` | README or documentation |

**Examples:**
```bash
feat: add chat list page
feat: implement AI room recommendation results
fix: resolve navbar overlap on mobile
style: update button hover color
chore: add axios instance setup
docs: update README with setup instructions
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#7B1E1E` (Crimson) |
| Background | `#F9FAFB` |
| Surface | `#FFFFFF` |
| Text Primary | `#111827` |
| Text Secondary | `#6B7280` |
| Success | `#10B981` |
| Error | `#EF4444` |
| Border | `#E5E7EB` |
| Font | Inter |

Figma Design: [UTM RoomieHub UI](https://www.figma.com/make/EdhDli9VIOLHfeuEyREnpX/)

---

## 👥 Subsystem Ownership

| Subsystem | Pages | Owner |
|-----------|-------|-------|
| User Management | Register, Login, Forgot Password, Reset Password, Email Verification, View/Edit Profile, Update Photo, View Other Profile, 403 Page, Suspend/Reinstate (Admin) | Najmeldeen |
| Listing & Search | Create/Edit/Delete Listing, My Listings, Listing Detail, Wishlist, Search + Filter, No Results, Map View, Pin Popup, Get Directions | Hebatulla |
| Communication & Matching | Chat List, Chat Conversation, Report Modal, Block Modal, Set Room Preferences, Recommendation Results, Recommended Listing Detail, Lifestyle Profile Setup, Match Results, View Matched Profile, Accept/Ignore Match | Omar |
| Analytics & Trust | Submit Review, View Reviews (Listing), View Reviews (Roommate), Admin Dashboard, User Management (Admin), Listing Management (Admin), Report Details, Take Action Modal, Platform Analytics, User Activity Stats, Listing Trends, Export Report | Farah |

---

## 📋 Environment Variables

Create a `.env` file in `/server` based on `.env.example`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=roomiehub
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
CLIENT_URL=http://localhost:5173
```

---

## 📌 Important Notes

- All API calls go through `/src/services/api.js` — never write raw fetch/axios in components
- Use the shared components in `/components` — don't create duplicate UI elements
- Keep pages clean — logic goes in hooks, API calls go in services
- Test your feature on `dev` branch before requesting a merge

---

*© 2026 UTM RoomieHub — Universiti Teknologi Malaysia*
