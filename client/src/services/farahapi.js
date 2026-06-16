import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const farahApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 6.1 Review and Rating Module API Calls
export const submitReview = (reviewData) => farahApi.post('/reviews', reviewData);
export const getListingReviews = (listingId) => farahApi.get(`/reviews/listing/${listingId}`);
export const getUserReviews = (userId) => farahApi.get(`/reviews/user/${userId}`);
export const reportReview = (reviewId, reportData) => farahApi.post(`/reviews/${reviewId}/report`, reportData);

// 6.2 Admin Dashboard Module API Calls
export const getAdminDashboardStats = () => farahApi.get('/admin/stats');
export const getAllUsers = (searchQuery = '') => farahApi.get(`/admin/users?search=${searchQuery}`);
export const updateAccountStatus = (userId, statusData) => farahApi.patch(`/admin/users/${userId}/status`, statusData);
export const getAllActiveListings = () => farahApi.get('/admin/listings');
export const removeListingByAdmin = (listingId) => farahApi.delete(`/admin/listings/${listingId}`);
export const getFlagedReports = () => farahApi.get('/admin/reports');

// 6.3 Analytics and Reports Module API Calls
export const getListingTrends = () => farahApi.get('/analytics/listing-trends');
export const getUserActivityMetrics = () => farahApi.get('/analytics/user-activity');
export const downloadAnalyticsReport = (format) => farahApi.get(`/analytics/export?format=${format}`, { responseType: 'blob' });

export default farahApi;
