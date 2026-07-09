const AdminModel = require('../models/admin.model');

// ─── GET /api/admin/users ───────────────────────────
const getUsers = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [users, total] = await Promise.all([
      AdminModel.getAllUsers({ keyword, limit, offset }),
      AdminModel.countUsers(keyword),
    ]);

    res.json({ success: true, users, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// ─── PUT /api/admin/users/:id/suspend ───────────────
const suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ success: false, message: 'Reason is required' });

    await AdminModel.suspendUser(req.params.id, req.user.id, reason);
    res.json({ success: true, message: 'User suspended successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to suspend user' });
  }
};

// ─── PUT /api/admin/users/:id/reinstate ─────────────
const reinstateUser = async (req, res) => {
  try {
    const { notes } = req.body;
    await AdminModel.reinstateUser(req.params.id, req.user.id, notes);
    res.json({ success: true, message: 'User reinstated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reinstate user' });
  }
};

// ─── GET /api/admin/listings ─────────────────────────
const getListings = async (req, res) => {
  try {
    const { keyword, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const listings = await AdminModel.getAllListings({ keyword, limit, offset });

    const db = require('../config/db');
    const [[{ total }]] = await db.query("SELECT COUNT(*) as total FROM listings");

    res.json({
      success: true,
      listings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      }
    });
  } catch (err) {
    console.error('Error fetching admin listings:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
};

// ─── DELETE /api/admin/listings/:id ──────────────────
const removeListing = async (req, res) => {
  try {
    const { reason } = req.body;
    await AdminModel.removeListing(req.params.id, req.user.id, reason);
    res.json({ success: true, message: 'Listing removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove listing' });
  }
};

// ─── GET /api/admin/reports ───────────────────────────
const getReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    const reports = await AdminModel.getAllReports({ status, limit, offset });

    const db = require('../config/db');
    const [[total]]    = await db.query("SELECT COUNT(*) as count FROM user_reports");
    const [[pending]]  = await db.query("SELECT COUNT(*) as count FROM user_reports WHERE status = 'pending'");
    const [[reviewed]] = await db.query("SELECT COUNT(*) as count FROM user_reports WHERE status = 'reviewed'");
    const [[resolved]] = await db.query("SELECT COUNT(*) as count FROM user_reports WHERE status = 'resolved'");

    res.json({
      success: true,
      reports,
      summary: {
        total: total.count,
        pending: pending.count,
        reviewed: reviewed.count,
        resolved: resolved.count,
      }
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
};

// ─── GET /api/admin/reports/:id ───────────────────────
const getReportDetail = async (req, res) => {
  try {
    const report = await AdminModel.getReportById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
};

// ─── PUT /api/admin/reports/:id ───────────────────────
const updateReport = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'reviewed', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    await AdminModel.updateReportStatus(req.params.id, status);
    res.json({ success: true, message: 'Report updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update report' });
  }
};

// ─── GET /api/admin/analytics ─────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const stats = await AdminModel.getPlatformStats();
    const activity = await AdminModel.getRecentActivity();
    const pendingReports = await AdminModel.getAllReports({ status: 'pending', limit: 5 });
    res.json({ success: true, stats, activity, pendingReports });
  } catch (err) {
    console.error('Failed to get analytics:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

const getDetailedAnalytics = async (req, res) => {
  try {
    const data = await AdminModel.getDetailedAnalytics();
    res.json({ success: true, data });
  } catch (err) {
    console.error('Failed to get detailed analytics:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch detailed analytics' });
  }
};

const deleteUser = async (req, res) => {
  try {
    await AdminModel.deleteUser(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

module.exports = { getUsers, suspendUser, reinstateUser, getListings, removeListing, getReports, getReportDetail, updateReport, getAnalytics, getDetailedAnalytics, deleteUser };
