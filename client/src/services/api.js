import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

import listingsData from '../mock/listings.json';
import chatsData from '../mock/chats.json';
import reviewsData from '../mock/reviews.json';
import matchesData from '../mock/matches.json';
import adminData from '../mock/admin.json';
import usersData from '../mock/users.json';

// --- MOCK ADAPTER ---
// This intercepts all axios requests and returns mock JSON data
// to allow the frontend to be fully functional without a backend.
api.defaults.adapter = async function (config) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = config.url || '';
      const method = config.method?.toLowerCase();
      
      let data = {};
      let status = 200;

      // ── LISTINGS ──────────────────────────────────────────────
      if (url.includes('/listings')) {
        if (method === 'get') {
          if (url.includes('/wishlist')) {
            // Return a subset as wishlisted items
            data = { success: true, listings: listingsData.slice(0, 3) };
          } else if (url.includes('/my')) {
            // Return listings owned by user id=5 (Siti Rahmah — example listing owner)
            data = { success: true, listings: listingsData.filter(l => l.owner_id === 5) };
          } else if (url.match(/\/listings\/\d+/)) {
            // Single listing detail — return first matching or first
            const idMatch = url.match(/\/listings\/(\d+)/);
            const listingId = idMatch ? parseInt(idMatch[1]) : 1;
            const found = listingsData.find(l => l.id === listingId) || listingsData[0];
            data = { success: true, listing: found };
          } else {
            // All listings (search / browse)
            const activeListings = listingsData.filter(l => l.status !== 'removed');
            data = {
              success: true,
              listings: activeListings,
              pagination: { total: activeListings.length, page: 1, limit: 20, pages: 1 }
            };
          }
        } else if (method === 'post') {
          data = { success: true, listing: { id: 99, ...JSON.parse(config.data || '{}') } };
        } else if (method === 'put' || method === 'patch') {
          data = { success: true };
        } else if (method === 'delete') {
          data = { success: true };
        }

      // ── CHAT / CONVERSATIONS ──────────────────────────────────
      } else if (url.includes('/chat/conversations')) {
        if (method === 'get') {
          if (url.match(/\/chat\/conversations\/(\d+)\/messages/)) {
            const idMatch = url.match(/\/chat\/conversations\/(\d+)\/messages/);
            const convId = idMatch ? parseInt(idMatch[1]) : 1;
            const conv = chatsData.find(c => c.id === convId) || chatsData[0];
            data = { success: true, messages: conv.messages };
          } else if (url.match(/\/chat\/conversations\/\d+/)) {
            const idMatch = url.match(/\/chat\/conversations\/(\d+)/);
            const convId = idMatch ? parseInt(idMatch[1]) : 1;
            const conv = chatsData.find(c => c.id === convId) || chatsData[0];
            data = { success: true, conversation: conv };
          } else {
            data = { success: true, conversations: chatsData };
          }
        } else if (method === 'post') {
          // Create/start a new conversation — return first chat as placeholder
          data = { success: true, conversation: chatsData[0] };
        }

      // ── REVIEWS ───────────────────────────────────────────────
      } else if (url.includes('/reviews')) {
        if (method === 'get') {
          if (url.match(/\/reviews\/listing\/(\d+)/)) {
            const idMatch = url.match(/\/reviews\/listing\/(\d+)/);
            const listingId = idMatch ? parseInt(idMatch[1]) : 1;
            const filtered = reviewsData.filter(r => r.listing_id === listingId);
            data = { success: true, reviews: filtered };
          } else if (url.match(/\/reviews\/user\/(\d+)/)) {
            const idMatch = url.match(/\/reviews\/user\/(\d+)/);
            const userId = idMatch ? parseInt(idMatch[1]) : 2;
            const filtered = reviewsData.filter(r => r.reviewer_id === userId);
            data = { success: true, reviews: filtered };
          } else {
            data = { success: true, reviews: reviewsData };
          }
        } else if (method === 'post') {
          data = { success: true, review: { id: 99, ...JSON.parse(config.data || '{}') } };
        }

      // ── MATCHING ──────────────────────────────────────────────
      } else if (url.includes('/matching')) {
        if (method === 'get') {
          if (url.includes('preferences')) {
            data = { success: true, preferences: matchesData.preferences };
          } else if (url.includes('recommendations')) {
            data = { success: true, recommendations: matchesData.room_recommendations };
          } else if (url.includes('profile')) {
            data = { success: true, profile: matchesData.roommate_profile };
          } else if (url.includes('matches')) {
            data = { success: true, matches: matchesData.roommate_matches };
          } else if (url.includes('/matching/room/')) {
            data = { success: true, room: matchesData.room_recommendations[0] };
          }
        } else if (method === 'post') {
          data = { success: true };
        }

      // ── ADMIN ─────────────────────────────────────────────────
      } else if (url.includes('/admin')) {
        if (method === 'get') {

          if (url.includes('/admin/analytics/detailed')) {
            data = { success: true, data: adminData.detailed };

          } else if (url.includes('/admin/analytics')) {
            data = {
              success: true,
              stats: {
                total_users: adminData.analytics.total_users,
                active_listings: adminData.analytics.active_listings,
                pending_reports: adminData.analytics.pending_reports,
                avg_price: adminData.analytics.avg_price,
                trends: adminData.analytics.trends,
              },
              activity: adminData.analytics.activity,
              pendingReports: adminData.analytics.pendingReports,
            };

          } else if (url.match(/\/admin\/reports\/\d+/)) {
            const idMatch = url.match(/\/admin\/reports\/(\d+)/);
            const reportId = idMatch ? parseInt(idMatch[1]) : 1;
            const report = adminData.reports.find(r => r.id === reportId) || adminData.reports[0];
            data = { success: true, report };

          } else if (url.includes('/admin/reports')) {
            data = {
              success: true,
              reports: adminData.reports,
              summary: adminData.analytics.summary,
            };

          } else if (url.includes('/admin/users')) {
            data = {
              success: true,
              users: adminData.users,
              pagination: { total: adminData.users.length, page: 1, limit: 20, pages: 1 }
            };

          } else if (url.includes('/admin/listings')) {
            data = {
              success: true,
              listings: adminData.listings,
              pagination: { total: adminData.listings.length, page: 1, limit: 20, pages: 1 }
            };
          }

        } else if (method === 'put' || method === 'patch') {
          data = { success: true };
        } else if (method === 'delete') {
          data = { success: true };
        }

      // ── USERS (profile) ───────────────────────────────────────
      } else if (url.includes('/users')) {
        if (method === 'get') {
          if (url.match(/\/users\/(\d+)/)) {
            const idMatch = url.match(/\/users\/(\d+)/);
            const userId = idMatch ? parseInt(idMatch[1]) : 2;
            const user = usersData.find(u => u.id === userId) || usersData[1];
            data = { success: true, user };
          } else {
            data = { success: true, user: usersData[1] };
          }
        } else if (method === 'put' || method === 'patch') {
          data = { success: true };
        }

      // ── DEFAULT ───────────────────────────────────────────────
      } else {
        data = { success: true };
      }

      // Return simulated successful response for everything
      resolve({
        data,
        status,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }, 80); // simulate network delay
  });
};

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
