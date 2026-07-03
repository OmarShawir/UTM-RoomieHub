# 🏠UTM RoomieHub

> A dedicated web platform for UTM students to find verified accommodation and compatible roommates within the university community.

**Course:** SCSE2243 SEC01 — Application Development Project I  
**Session:** Semester II, 2025/26  
**Team:** AppDev1337

| Name                              | Matric No. | Role                     |
| --------------------------------- | ---------- | ------------------------ |
| Omar Nasreldin Mahgoub Shawir     | A24CS4031  | Communication & Matching |
| Hebatulla Omer Abdulla Ali        | A24CS4014  | Listing & Search         |
| Farah Maged Abdelkarim            | A24CS0010  | Analytics & Trust        |
| Najmeldeen Mohamed Eltigani Salih | A24CS9001  | User Management          |

---

## 🧱 Tech Stack

| Layer           | Technology               |
| --------------- | ------------------------ |
| Frontend        | React.js (Vite)          |
| Backend         | Node.js + Express.js     |
| Database        | MySQL                    |
| Maps            | Google Maps API          |
| AI Features     | Open-source ML libraries |
| Design          | Figma                    |
| Version Control | Git + GitHub             |

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

| Type       | When to use                         |
| ---------- | ----------------------------------- |
| `feat`     | New feature or page                 |
| `fix`      | Bug fix                             |
| `style`    | UI/CSS changes only                 |
| `refactor` | Code restructure, no feature change |
| `chore`    | Config, dependencies, setup         |
| `docs`     | README or documentation             |

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

| Token          | Value               |
| -------------- | ------------------- |
| Primary        | `#7B1E1E` (Crimson) |
| Background     | `#F9FAFB`           |
| Surface        | `#FFFFFF`           |
| Text Primary   | `#111827`           |
| Text Secondary | `#6B7280`           |
| Success        | `#10B981`           |
| Error          | `#EF4444`           |
| Border         | `#E5E7EB`           |
| Font           | Inter               |

Figma Design: [UTM RoomieHub UI](https://www.figma.com/make/EdhDli9VIOLHfeuEyREnpX/)

---

## 👥 Subsystem Ownership

| Subsystem                | Pages                                                                                                                                                                                                                                           | Owner      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| User Management          | Register, Login, Forgot Password, Reset Password, Email Verification, View/Edit Profile, Update Photo, View Other Profile, 403 Page, Suspend/Reinstate (Admin)                                                                                  | Najmeldeen |
| Listing & Search         | Create/Edit/Delete Listing, My Listings, Listing Detail, Wishlist, Search + Filter, No Results, Map View, Pin Popup, Get Directions                                                                                                             | Hebatulla  |
| Communication & Matching | Chat List, Chat Conversation, Report Modal, Block Modal, Set Room Preferences, Recommendation Results, Recommended Listing Detail, Lifestyle Profile Setup, Match Results, View Matched Profile, Accept/Ignore Match                            | Omar       |
| Analytics & Trust        | Submit Review, View Reviews (Listing), View Reviews (Roommate), Admin Dashboard, User Management (Admin), Listing Management (Admin), Report Details, Take Action Modal, Platform Analytics, User Activity Stats, Listing Trends, Export Report | Farah      |

---

## 👥 Member Subsystem Mappings

### Najmeldeen Mohamed Eltigani Salih — User Management

<table width="100%">
<thead>
<tr>
<th align="left">Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">FrontEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">BackEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">Database &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Authentication</b></td>
<td>
<a href="client/src/pages/auth/LoginPage.jsx">LoginPage.jsx</a><br>
<a href="client/src/pages/auth/RegisterPage.jsx">RegisterPage.jsx</a><br>
<a href="client/src/pages/auth/ForgotPasswordPage.jsx">ForgotPasswordPage.jsx</a><br>
<a href="client/src/pages/auth/ResetPasswordPage.jsx">ResetPasswordPage.jsx</a><br>
<a href="client/src/pages/auth/EmailVerificationPage.jsx">EmailVerificationPage.jsx</a>
</td>
<td>
<a href="server/routes/auth.routes.js">auth.routes.js</a><br>
<a href="server/controllers/auth.controller.js">auth.controller.js</a><br>
<a href="server/models/user.model.js">user.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L11">users</a><br>
<a href="server/config/schema.sql#L24">students</a>
</td>
</tr>
<tr>
<td><b>Profile Management</b></td>
<td>
<a href="client/src/pages/profile/ViewProfilePage.jsx">ViewProfilePage.jsx</a><br>
<a href="client/src/pages/profile/EditProfilePage.jsx">EditProfilePage.jsx</a><br>
<a href="client/src/pages/profile/UpdatePhotoPage.jsx">UpdatePhotoPage.jsx</a><br>
<a href="client/src/pages/profile/OtherProfilePage.jsx">OtherProfilePage.jsx</a>
</td>
<td>
<a href="server/routes/user.routes.js">user.routes.js</a><br>
<a href="server/controllers/user.controller.js">user.controller.js</a><br>
<a href="server/models/user.model.js">user.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L24">students</a>
</td>
</tr>
<tr>
<td><b>Access Control</b></td>
<td>
<a href="client/src/pages/profile/UnauthorizedPage.jsx">UnauthorizedPage.jsx</a><br>
<a href="client/src/pages/admin/SuspendUserPage.jsx">SuspendUserPage.jsx</a><br>
<a href="client/src/pages/admin/ReinstateUserPage.jsx">ReinstateUserPage.jsx</a>
</td>
<td>
<a href="server/routes/admin.routes.js">admin.routes.js</a><br>
<a href="server/controllers/admin.controller.js">admin.controller.js</a><br>
<a href="server/models/admin.model.js">admin.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L11">users</a><br>
<a href="server/config/schema.sql#L24">students</a><br>
<a href="server/config/schema.sql#L78">admin_actions</a>
</td>
</tr>
</tbody>
</table>

### Hebatulla Omer Abdulla Ali — Listing & Search

<table width="100%">
<thead>
<tr>
<th align="left">Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">FrontEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">BackEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">Database &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Listings</b></td>
<td>
<a href="client/src/pages/listings/MyListingsPage.jsx">MyListingsPage.jsx</a><br>
<a href="client/src/pages/listings/CreateListingPage.jsx">CreateListingPage.jsx</a><br>
<a href="client/src/pages/listings/EditListingPage.jsx">EditListingPage.jsx</a><br>
<a href="client/src/pages/listings/ListingDetailPage.jsx">ListingDetailPage.jsx</a><br>
<a href="client/src/pages/listings/WishlistPage.jsx">WishlistPage.jsx</a>
</td>
<td>
<a href="server/routes/listing.routes.js">listing.routes.js</a><br>
<a href="server/controllers/listing.controller.js">listing.controller.js</a><br>
<a href="server/models/listing.model.js">listing.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L93">listings</a><br>
<a href="server/config/schema.sql#L112">listing_photos</a><br>
<a href="server/config/schema.sql#L121">wishlist</a>
</td>
</tr>
<tr>
<td><b>Search & Discovery</b></td>
<td>
<a href="client/src/pages/search/SearchPage.jsx">SearchPage.jsx</a><br>
<a href="client/src/pages/search/NoResultsPage.jsx">NoResultsPage.jsx</a>
</td>
<td>
<a href="server/routes/listing.routes.js">listing.routes.js</a><br>
<a href="server/controllers/listing.controller.js">listing.controller.js</a><br>
<a href="server/models/listing.model.js">listing.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L93">listings</a>
</td>
</tr>
<tr>
<td><b>Map & Navigation</b></td>
<td>
<a href="client/src/pages/map/MapViewPage.jsx">MapViewPage.jsx</a><br>
<a href="client/src/pages/map/GetDirectionsPage.jsx">GetDirectionsPage.jsx</a>
</td>
<td>
<a href="server/routes/listing.routes.js">listing.routes.js</a><br>
<a href="server/controllers/listing.controller.js">listing.controller.js</a><br>
<a href="server/models/listing.model.js">listing.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L93">listings</a>
</td>
</tr>
</tbody>
</table>

### Omar Nasreldin Mahgoub Shawir — Communication & Matching

<table width="100%">
<thead>
<tr>
<th align="left">Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">FrontEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">BackEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">Database &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Chat & Communication</b></td>
<td>
<a href="client/src/pages/chat/ChatListPage.jsx">ChatListPage.jsx</a><br>
<a href="client/src/pages/chat/ChatConversationPage.jsx">ChatConversationPage.jsx</a>
</td>
<td>
<a href="server/routes/chat.routes.js">chat.routes.js</a><br>
<a href="server/controllers/chat.controller.js">chat.controller.js</a><br>
<a href="server/models/chat.model.js">chat.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L147">conversations</a><br>
<a href="server/config/schema.sql#L160">messages</a>
</td>
</tr>
<tr>
<td><b>Recommendation System</b></td>
<td>
<a href="client/src/pages/recommendation/SetPreferencesPage.jsx">SetPreferencesPage.jsx</a><br>
<a href="client/src/pages/recommendation/RecommendationResults.jsx">RecommendationResults.jsx</a><br>
<a href="client/src/pages/recommendation/RecommendedListingPage.jsx">RecommendedListingPage.jsx</a>
</td>
<td>
<a href="server/routes/matching.routes.js">matching.routes.js</a><br>
<a href="server/controllers/matching.controller.js">matching.controller.js</a><br>
<a href="server/models/matching.model.js">matching.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L172">room_preferences</a><br>
<a href="server/config/schema.sql#L185">recommendation_sessions</a><br>
<a href="server/config/schema.sql#L195">recommendation_results</a>
</td>
</tr>
<tr>
<td><b>Roommate Matching</b></td>
<td>
<a href="client/src/pages/matching/LifestyleProfilePage.jsx">LifestyleProfilePage.jsx</a><br>
<a href="client/src/pages/matching/MatchResultsPage.jsx">MatchResultsPage.jsx</a><br>
<a href="client/src/pages/matching/MatchedProfilePage.jsx">MatchedProfilePage.jsx</a><br>
<a href="client/src/pages/matching/RespondMatchPage.jsx">RespondMatchPage.jsx</a>
</td>
<td>
<a href="server/routes/matching.routes.js">matching.routes.js</a><br>
<a href="server/controllers/matching.controller.js">matching.controller.js</a><br>
<a href="server/models/matching.model.js">matching.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L205">lifestyle_profiles</a><br>
<a href="server/config/schema.sql#L221">match_sessions</a><br>
<a href="server/config/schema.sql#L231">match_results</a>
</td>
</tr>
</tbody>
</table>

### Farah Maged Abdelkarim — Analytics & Trust

<table width="100%">
<thead>
<tr>
<th align="left">Module &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">FrontEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">BackEnd &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th align="left">Database &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Reviews & Ratings</b></td>
<td>
<a href="client/src/pages/reviews/SubmitReviewPage.jsx">SubmitReviewPage.jsx</a><br>
<a href="client/src/pages/reviews/ListingReviewsPage.jsx">ListingReviewsPage.jsx</a><br>
<a href="client/src/pages/reviews/UserReviewsPage.jsx">UserReviewsPage.jsx</a>
</td>
<td>
<a href="server/routes/review.routes.js">review.routes.js</a><br>
<a href="server/controllers/review.controller.js">review.controller.js</a><br>
<a href="server/models/review.model.js">review.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L244">reviews</a>
</td>
</tr>
<tr>
<td><b>Admin Panel</b></td>
<td>
<a href="client/src/pages/admin/AdminDashboardPage.jsx">AdminDashboardPage.jsx</a><br>
<a href="client/src/pages/admin/AdminUsersPage.jsx">AdminUsersPage.jsx</a><br>
<a href="client/src/pages/admin/AdminListingsPage.jsx">AdminListingsPage.jsx</a><br>
<a href="client/src/pages/admin/AdminReportsPage.jsx">AdminReportsPage.jsx</a><br>
<a href="client/src/pages/admin/AdminReportDetailPage.jsx">AdminReportDetailPage.jsx</a>
</td>
<td>
<a href="server/routes/admin.routes.js">admin.routes.js</a><br>
<a href="server/controllers/admin.controller.js">admin.controller.js</a><br>
<a href="server/models/admin.model.js">admin.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L52">user_reports</a><br>
<a href="server/config/schema.sql#L66">review_reports</a><br>
<a href="server/config/schema.sql#L78">admin_actions</a>
</td>
</tr>
<tr>
<td><b>Analytics</b></td>
<td>
<a href="client/src/pages/analytics/AnalyticsOverviewPage.jsx">AnalyticsOverviewPage.jsx</a><br>
<a href="client/src/pages/analytics/UserActivityPage.jsx">UserActivityPage.jsx</a><br>
<a href="client/src/pages/analytics/ListingTrendsPage.jsx">ListingTrendsPage.jsx</a><br>
<a href="client/src/pages/analytics/ExportReportPage.jsx">ExportReportPage.jsx</a>
</td>
<td>
<a href="server/routes/admin.routes.js">admin.routes.js</a><br>
<a href="server/controllers/admin.controller.js">admin.controller.js</a><br>
<a href="server/models/admin.model.js">admin.model.js</a>
</td>
<td>
<a href="server/config/schema.sql#L258">audit_log</a><br>
<a href="server/config/schema.sql#L269">user_activity_log</a><br>
<a href="server/config/schema.sql#L279">listing_snapshots</a>
</td>
</tr>
</tbody>
</table>

---

## �📋 Environment Variables

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

_© 2026 UTM RoomieHub — Universiti Teknologi Malaysia_
