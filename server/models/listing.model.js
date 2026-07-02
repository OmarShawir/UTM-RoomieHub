const db = require('../config/db');

const ListingModel = {

  // Get all listings with optional filters
  findAll: async ({ keyword, room_type, min_price, max_price, max_distance, furnishing, bathroom_type, amenities, limit = 20, offset = 0 }) => {
    let query = `
      SELECT l.*, 
        u.email,
        s.full_name as owner_name,
        s.profile_picture as owner_avatar,
        (SELECT photo_url FROM listing_photos WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as cover_photo,
        (SELECT COUNT(*) FROM reviews WHERE listing_id = l.id) as review_count,
        (SELECT AVG(rating) FROM reviews WHERE listing_id = l.id) as avg_rating
      FROM listings l
      JOIN users u ON u.id = l.user_id
      LEFT JOIN students s ON s.user_id = l.user_id
      WHERE l.status = 'active'
    `;
    const params = [];

    if (keyword) {
      query += ` AND (l.title LIKE ? OR l.description LIKE ? OR l.address LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    if (room_type)    { query += ` AND l.room_type = ?`;             params.push(room_type); }
    if (min_price)    { query += ` AND l.price >= ?`;                params.push(min_price); }
    if (max_price)    { query += ` AND l.price <= ?`;                params.push(max_price); }
    if (max_distance) { query += ` AND l.distance_from_campus <= ?`; params.push(max_distance); }
    if (furnishing)   { query += ` AND l.furnishing = ?`;            params.push(furnishing); }
    if (bathroom_type){ query += ` AND l.bathroom_type = ?`;         params.push(bathroom_type); }

    // Filter by amenities (match listings containing all selected amenities)
    if (Array.isArray(amenities) && amenities.length > 0) {
      query += ` AND (
        SELECT COUNT(DISTINCT name) 
        FROM listing_amenities 
        WHERE listing_id = l.id AND name IN (${amenities.map(() => '?').join(',')})
      ) = ?`;
      params.push(...amenities, amenities.length);
    }

    query += ` ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(query, params);
    return rows;
  },

  // Count listings (for pagination)
  count: async ({ keyword, room_type, min_price, max_price, max_distance, furnishing, bathroom_type, amenities }) => {
    let query = `SELECT COUNT(*) as total FROM listings l WHERE l.status = 'active'`;
    const params = [];

    if (keyword)      { query += ` AND (l.title LIKE ? OR l.address LIKE ?)`; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (room_type)    { query += ` AND l.room_type = ?`;             params.push(room_type); }
    if (min_price)    { query += ` AND l.price >= ?`;                params.push(min_price); }
    if (max_price)    { query += ` AND l.price <= ?`;                params.push(max_price); }
    if (max_distance) { query += ` AND l.distance_from_campus <= ?`; params.push(max_distance); }
    if (furnishing)   { query += ` AND l.furnishing = ?`;            params.push(furnishing); }
    if (bathroom_type){ query += ` AND l.bathroom_type = ?`;         params.push(bathroom_type); }

    if (Array.isArray(amenities) && amenities.length > 0) {
      query += ` AND (
        SELECT COUNT(DISTINCT name) 
        FROM listing_amenities 
        WHERE listing_id = l.id AND name IN (${amenities.map(() => '?').join(',')})
      ) = ?`;
      params.push(...amenities, amenities.length);
    }

    const [[{ total }]] = await db.query(query, params);
    return total;
  },

  // Get single listing by ID
  findById: async (id) => {
    const [[listing]] = await db.query(`
      SELECT l.*,
        u.email,
        s.full_name as owner_name,
        s.profile_picture as owner_avatar,
        s.matric_no as owner_matric,
        (SELECT COUNT(*) FROM reviews WHERE listing_id = l.id) as review_count,
        (SELECT AVG(rating) FROM reviews WHERE listing_id = l.id) as avg_rating
      FROM listings l
      JOIN users u ON u.id = l.user_id
      LEFT JOIN students s ON s.user_id = l.user_id
      WHERE l.id = ?
    `, [id]);

    if (!listing) return null;

    // Get photos
    const [photos] = await db.query(
      'SELECT * FROM listing_photos WHERE listing_id = ? ORDER BY is_primary DESC',
      [id]
    );
    listing.photos = photos;

    // Get amenities
    const [amenities] = await db.query(
      'SELECT name FROM listing_amenities WHERE listing_id = ?',
      [id]
    );
    listing.amenities = amenities.map(a => a.name);

    return listing;
  },

  // Get listings by user
  findByUser: async (userId) => {
    const [rows] = await db.query(`
      SELECT l.*,
        (SELECT photo_url FROM listing_photos WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as cover_photo,
        (SELECT COUNT(*) FROM reviews WHERE listing_id = l.id) as review_count
      FROM listings l
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
    `, [userId]);
    return rows;
  },

  // Create listing
  create: async ({ user_id, title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus }) => {
    const [result] = await db.query(
      `INSERT INTO listings (user_id, title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [user_id, title, description, price, room_type, furnishing, bathroom_type, address, latitude || null, longitude || null, distance_from_campus || null]
    );
    return result.insertId;
  },

  // Add photo
  addPhoto: async (listingId, photoUrl, isPrimary = false) => {
    await db.query(
      'INSERT INTO listing_photos (listing_id, photo_url, is_primary) VALUES (?, ?, ?)',
      [listingId, photoUrl, isPrimary]
    );
  },

  // Add amenity
  addAmenity: async (listingId, name) => {
    await db.query(
      'INSERT INTO listing_amenities (listing_id, name) VALUES (?, ?)',
      [listingId, name]
    );
  },

  // Clear photos
  clearPhotos: async (listingId) => {
    await db.query('DELETE FROM listing_photos WHERE listing_id = ?', [listingId]);
  },

  // Clear amenities
  clearAmenities: async (listingId) => {
    await db.query('DELETE FROM listing_amenities WHERE listing_id = ?', [listingId]);
  },

  // Update listing
  update: async (id, { title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus, status }) => {
    await db.query(
      `UPDATE listings SET title=?, description=?, price=?, room_type=?, furnishing=?, bathroom_type=?, address=?, latitude=?, longitude=?, distance_from_campus=?, status=?, updated_at=NOW()
       WHERE id=?`,
      [title, description, price, room_type, furnishing, bathroom_type, address, latitude || null, longitude || null, distance_from_campus || null, status || 'active', id]
    );
  },

  // Delete listing
  delete: async (id) => {
    await db.query('DELETE FROM listings WHERE id = ?', [id]);
  },

  // Check ownership
  isOwner: async (listingId, userId) => {
    const [[row]] = await db.query('SELECT id FROM listings WHERE id = ? AND user_id = ?', [listingId, userId]);
    return !!row;
  },

  // ─── Wishlist ──────────────────────────────────────────────

  addToWishlist: async (userId, listingId) => {
    await db.query(
      'INSERT IGNORE INTO wishlist (user_id, listing_id) VALUES (?, ?)',
      [userId, listingId]
    );
  },

  removeFromWishlist: async (userId, listingId) => {
    await db.query('DELETE FROM wishlist WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
  },

  getWishlist: async (userId) => {
    const [rows] = await db.query(`
      SELECT l.*,
        (SELECT photo_url FROM listing_photos WHERE listing_id = l.id AND is_primary = 1 LIMIT 1) as cover_photo
      FROM wishlist w
      JOIN listings l ON l.id = w.listing_id
      WHERE w.user_id = ?
      ORDER BY w.saved_at DESC
    `, [userId]);
    return rows;
  },

  isInWishlist: async (userId, listingId) => {
    const [[row]] = await db.query('SELECT id FROM wishlist WHERE user_id = ? AND listing_id = ?', [userId, listingId]);
    return !!row;
  },

  incrementViews: async (id) => {
    await db.query('UPDATE listings SET views = views + 1 WHERE id = ?', [id]);
  },
};

module.exports = ListingModel;
