import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const farahApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 6.1 Review and Rating Module API Calls
export const submitReview = (reviewData) => farahApi.post('/reviews', reviewData);
export const getListingReviews = (listingId) => farahApi.get(`/reviews/listing/${listingId}`);

// 6.2 Admin Dashboard Module API Calls
export const getAdminDashboardStats = () => farahApi.get('/admin/stats');

// 6.3 Analytics and Reports Module API Calls
export const getListingTrends = () => farahApi.get('/analytics/listing-trends');
export const downloadAnalyticsReport = (format) => farahApi.get(`/analytics/export?format=${format}`, { responseType: 'blob' });
