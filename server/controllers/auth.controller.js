const db = require('../config/db');

const UserModel = {

  // Find user by email
  findByEmail: async (email) => {
    const [rows] = await db.query(
      'SELECT u.*, s.id as student_id, s.full_name, s.matric_no, s.display_name, s.faculty, s.year_of_study, s.nationality, s.bio, s.profile_picture, s.account_status, s.email_verified FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query(
      'SELECT u.id, u.email, u.user_type as role, s.full_name, s.matric_no, s.display_name, s.faculty, s.year_of_study, s.nationality, s.bio, s.profile_picture, s.account_status, s.email_verified FROM users u LEFT JOIN students s ON s.user_id = u.id WHERE u.id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Create user + student record
  create: async ({ email, password, full_name, matric_no, email_verification_token, email_token_expiry }) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [userResult] = await conn.query(
        'INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)',
        [email, password, 'student']
      );
      const userId = userResult.insertId;

      await conn.query(
        'INSERT INTO students (user_id, full_name, matric_no, email_verification_token, email_token_expiry) VALUES (?, ?, ?, ?, ?)',
        [userId, full_name, matric_no, email_verification_token, email_token_expiry]
      );

      await conn.commit();
      return userId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },

  // Verify email
  verifyEmail: async (userId) => {
    await db.query(
      'UPDATE students SET email_verified = 1, email_verification_token = NULL, email_token_expiry = NULL WHERE user_id = ?',
      [userId]
    );
  },

  // Find by verification token
  findByVerificationToken: async (token) => {
    const [rows] = await db.query(
      'SELECT s.user_id, s.email_token_expiry FROM students s WHERE s.email_verification_token = ?',
      [token]
    );
    return rows[0] || null;
  },

  // Set reset token
  setResetToken: async (userId, token, expiry) => {
    await db.query(
      'UPDATE students SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?',
      [token, expiry, userId]
    );
  },

  // Set verification token (for resend)
  setVerificationToken: async (userId, token, expiry) => {
    await db.query(
      'UPDATE students SET email_verification_token = ?, email_token_expiry = ? WHERE user_id = ?',
      [token, expiry, userId]
    );
  },

  // Find by reset token
  findByResetToken: async (token) => {
    const [rows] = await db.query(
      'SELECT s.user_id, s.reset_token_expiry FROM students s WHERE s.reset_token = ?',
      [token]
    );
    return rows[0] || null;
  },

  // Update password
  updatePassword: async (userId, hashedPassword) => {
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
    await db.query('UPDATE students SET reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', [userId]);
  },

  // Update last login
  updateLastLogin: async (userId) => {
    await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
  },

  // Increment failed login
  incrementFailedLogin: async (userId) => {
    await db.query(
      'UPDATE users SET failed_login_attempts = failed_login_attempts + 1, last_failed_login = NOW() WHERE id = ?',
      [userId]
    );
  },

  // Lock account
  lockAccount: async (userId, lockUntil) => {
    await db.query('UPDATE users SET locked_until = ? WHERE id = ?', [lockUntil, userId]);
  },

  // Reset failed attempts
  resetFailedAttempts: async (userId) => {
    await db.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?', [userId]);
  },

  // Update profile
  updateProfile: async (userId, { full_name, display_name, faculty, year_of_study, nationality, bio, profile_picture }) => {
    await db.query(
      'UPDATE students SET full_name = ?, display_name = ?, faculty = ?, year_of_study = ?, nationality = ?, bio = ?, profile_picture = ? WHERE user_id = ?',
      [full_name, display_name, faculty, year_of_study, nationality, bio, profile_picture, userId]
    );
  },
};

module.exports = UserModel;
