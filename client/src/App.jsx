import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ─── Pages: Auth (Najmeldeen) ────────────────────
import LoginPage            from './pages/auth/LoginPage';
import RegisterPage         from './pages/auth/RegisterPage';
import ForgotPasswordPage   from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage    from './pages/auth/ResetPasswordPage';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';

// ─── Pages: Profile (Najmeldeen) ─────────────────
import ViewProfilePage      from './pages/profile/ViewProfilePage';
import EditProfilePage      from './pages/profile/EditProfilePage';
import UpdatePhotoPage      from './pages/profile/UpdatePhotoPage';
import OtherProfilePage     from './pages/profile/OtherProfilePage';
import UnauthorizedPage     from './pages/profile/UnauthorizedPage';

// ─── Pages: Listings (Hebatulla) ─────────────────
import CreateListingPage    from './pages/listings/CreateListingPage';
import EditListingPage      from './pages/listings/EditListingPage';
import MyListingsPage       from './pages/listings/MyListingsPage';
import ListingDetailPage    from './pages/listings/ListingDetailPage';
import WishlistPage         from './pages/listings/WishlistPage';

// ─── Pages: Search (Hebatulla) ───────────────────
import SearchPage           from './pages/search/SearchPage';
import NoResultsPage        from './pages/search/NoResultsPage';

// ─── Pages: Map (Hebatulla) ──────────────────────
import MapViewPage          from './pages/map/MapViewPage';
import GetDirectionsPage    from './pages/map/GetDirectionsPage';

// ─── Pages: Chat (Omar) ──────────────────────────
import ChatListPage         from './pages/chat/ChatListPage';
import ChatConversationPage from './pages/chat/ChatConversationPage';

// ─── Pages: Recommendation (Omar) ────────────────
import SetPreferencesPage   from './pages/recommendation/SetPreferencesPage';
import RecommendationResults from './pages/recommendation/RecommendationResults';
import RecommendedListingPage from './pages/recommendation/RecommendedListingPage';

// ─── Pages: Matching (Omar) ──────────────────────
import LifestyleProfilePage from './pages/matching/LifestyleProfilePage';
import MatchResultsPage     from './pages/matching/MatchResultsPage';
import MatchedProfilePage   from './pages/matching/MatchedProfilePage';
import RespondMatchPage     from './pages/matching/RespondMatchPage';

// ─── Pages: Reviews (Farah) ──────────────────────
import SubmitReviewPage     from './pages/reviews/SubmitReviewPage';
import ListingReviewsPage   from './pages/reviews/ListingReviewsPage';
import UserReviewsPage      from './pages/reviews/UserReviewsPage';

// ─── Pages: Admin (Farah) ────────────────────────
import AdminDashboardPage   from './pages/admin/AdminDashboardPage';
import AdminUsersPage       from './pages/admin/AdminUsersPage';
import AdminListingsPage    from './pages/admin/AdminListingsPage';
import AdminReportsPage     from './pages/admin/AdminReportsPage';
import AdminReportDetailPage from './pages/admin/AdminReportDetailPage';
import SuspendUserPage      from './pages/admin/SuspendUserPage';
import ReinstateUserPage    from './pages/admin/ReinstateUserPage';

// ─── Pages: Analytics (Farah) ────────────────────
import AnalyticsOverviewPage from './pages/analytics/AnalyticsOverviewPage';
import UserActivityPage      from './pages/analytics/UserActivityPage';
import ListingTrendsPage     from './pages/analytics/ListingTrendsPage';
import ExportReportPage      from './pages/analytics/ExportReportPage';

// ─── Home ─────────────────────────────────────────
import HomePage from './pages/HomePage';

// ─── Route Guards ─────────────────────────────────
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/unauthorized" />;
  return children;
}

// ─── App ───────────────────────────────────────────
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>

        {/* Public */}
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        <Route path="/forgot-password"    element={<ForgotPasswordPage />} />
        <Route path="/reset-password"     element={<ResetPasswordPage />} />
        <Route path="/verify-email"       element={<EmailVerificationPage />} />
        <Route path="/unauthorized"       element={<UnauthorizedPage />} />

        {/* Protected — Students */}
        <Route path="/"                   element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/profile"            element={<PrivateRoute><ViewProfilePage /></PrivateRoute>} />
        <Route path="/profile/edit"       element={<PrivateRoute><EditProfilePage /></PrivateRoute>} />
        <Route path="/profile/photo"      element={<PrivateRoute><UpdatePhotoPage /></PrivateRoute>} />
        <Route path="/profile/:id"        element={<PrivateRoute><OtherProfilePage /></PrivateRoute>} />

        <Route path="/listings/create"    element={<PrivateRoute><CreateListingPage /></PrivateRoute>} />
        <Route path="/listings/:id/edit"  element={<PrivateRoute><EditListingPage /></PrivateRoute>} />
        <Route path="/my-listings"        element={<PrivateRoute><MyListingsPage /></PrivateRoute>} />
        <Route path="/listings/:id"       element={<PrivateRoute><ListingDetailPage /></PrivateRoute>} />
        <Route path="/wishlist"           element={<PrivateRoute><WishlistPage /></PrivateRoute>} />

        <Route path="/search"             element={<PrivateRoute><SearchPage /></PrivateRoute>} />
        <Route path="/search/no-results"  element={<PrivateRoute><NoResultsPage /></PrivateRoute>} />
        <Route path="/map"                element={<PrivateRoute><MapViewPage /></PrivateRoute>} />
        <Route path="/directions/:id"     element={<PrivateRoute><GetDirectionsPage /></PrivateRoute>} />

        <Route path="/chat"               element={<PrivateRoute><ChatListPage /></PrivateRoute>} />
        <Route path="/chat/:id"           element={<PrivateRoute><ChatConversationPage /></PrivateRoute>} />

        <Route path="/ai-match"           element={<PrivateRoute><RecommendationResults /></PrivateRoute>} />
        <Route path="/ai-match/preferences" element={<PrivateRoute><SetPreferencesPage /></PrivateRoute>} />
        <Route path="/ai-match/room/:id"  element={<PrivateRoute><RecommendedListingPage /></PrivateRoute>} />
        <Route path="/ai-match/lifestyle" element={<PrivateRoute><LifestyleProfilePage /></PrivateRoute>} />
        <Route path="/ai-match/roommates" element={<PrivateRoute><MatchResultsPage /></PrivateRoute>} />
        <Route path="/ai-match/roommates/:id" element={<PrivateRoute><MatchedProfilePage /></PrivateRoute>} />
        <Route path="/ai-match/respond/:id"   element={<PrivateRoute><RespondMatchPage /></PrivateRoute>} />

        <Route path="/reviews/submit/:id" element={<PrivateRoute><SubmitReviewPage /></PrivateRoute>} />
        <Route path="/listings/:id/reviews" element={<PrivateRoute><ListingReviewsPage /></PrivateRoute>} />
        <Route path="/profile/:id/reviews"  element={<PrivateRoute><UserReviewsPage /></PrivateRoute>} />

        {/* Protected — Admin */}
        <Route path="/admin"              element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        <Route path="/admin/users"        element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
        <Route path="/admin/listings"     element={<AdminRoute><AdminListingsPage /></AdminRoute>} />
        <Route path="/admin/reports"      element={<AdminRoute><AdminReportsPage /></AdminRoute>} />
        <Route path="/admin/reports/:id"  element={<AdminRoute><AdminReportDetailPage /></AdminRoute>} />
        <Route path="/admin/suspend/:id"  element={<AdminRoute><SuspendUserPage /></AdminRoute>} />
        <Route path="/admin/reinstate/:id" element={<AdminRoute><ReinstateUserPage /></AdminRoute>} />
        <Route path="/admin/analytics"    element={<AdminRoute><AnalyticsOverviewPage /></AdminRoute>} />
        <Route path="/admin/analytics/users"    element={<AdminRoute><UserActivityPage /></AdminRoute>} />
        <Route path="/admin/analytics/listings" element={<AdminRoute><ListingTrendsPage /></AdminRoute>} />
        <Route path="/admin/analytics/export"   element={<AdminRoute><ExportReportPage /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
