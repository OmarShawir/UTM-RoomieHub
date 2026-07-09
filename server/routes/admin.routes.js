const express = require('express');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const {
  getUsers,
  suspendUser,
  reinstateUser,
  getListings,
  removeListing,
  getReports,
  getReportDetail,
  updateReport,
  getAnalytics,
  getDetailedAnalytics,
  deleteUser,
} = require('../controllers/admin.controller');

const router = express.Router();

// All admin routes require login + admin role
router.use(protect, adminOnly);

router.get( '/users',                getUsers);
router.put( '/users/:id/suspend',    suspendUser);
router.put( '/users/:id/reinstate',  reinstateUser);
router.delete('/users/:id',          deleteUser);

router.get(   '/listings',           getListings);
router.delete('/listings/:id',       removeListing);

router.get('/reports',               getReports);
router.get('/reports/:id',           getReportDetail);
router.put('/reports/:id',           updateReport);

router.get('/analytics',             getAnalytics);
router.get('/analytics/detailed',    getDetailedAnalytics);

module.exports = router;
