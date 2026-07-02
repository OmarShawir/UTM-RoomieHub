const ListingModel = require('../models/listing.model');

// ─── GET /api/listings ────────────────────────────
const getListings = async (req, res) => {
  try {
    const { keyword, room_type, min_price, max_price, max_distance, furnishing, bathroom_type, amenities, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    // Handle parsed array if passed as string/comma-separated, or check array
    let amenitiesFilter = null;
    if (typeof amenities === 'string') {
      amenitiesFilter = amenities.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(amenities)) {
      amenitiesFilter = amenities;
    }

    const filters = { keyword, room_type, min_price, max_price, max_distance, furnishing, bathroom_type, amenities: amenitiesFilter, limit, offset };

    const [listings, total] = await Promise.all([
      ListingModel.findAll(filters),
      ListingModel.count(filters),
    ]);

    // Check wishlist status for each listing
    let updatedListings = listings;
    if (req.user) {
      const wishlist = await ListingModel.getWishlist(req.user.id);
      const wishlistIds = new Set(wishlist.map(l => l.id));
      updatedListings = listings.map(l => ({
        ...l,
        in_wishlist: wishlistIds.has(l.id) ? 1 : 0
      }));
    }

    res.json({
      success: true,
      listings: updatedListings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get listings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch listings' });
  }
};

// ─── GET /api/listings/my ─────────────────────────
const getMyListings = async (req, res) => {
  try {
    const listings = await ListingModel.findByUser(req.user.id);
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch your listings' });
  }
};

// ─── GET /api/listings/:id ────────────────────────
const getListing = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    // Check wishlist status if user is logged in
    let inWishlist = false;
    if (req.user) {
      inWishlist = await ListingModel.isInWishlist(req.user.id, listing.id);
    }

    // Increment view count if viewer is not the owner
    if (req.user && req.user.id !== listing.user_id) {
      await ListingModel.incrementViews(listing.id);
      listing.views = (listing.views || 0) + 1;
    }

    res.json({ success: true, listing: { ...listing, in_wishlist: inWishlist } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch listing' });
  }
};

// ─── POST /api/listings ───────────────────────────
const createListing = async (req, res) => {
  try {
    const { title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus, photos, amenities } = req.body;

    if (!title || !description || !price || !room_type || !address) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
    }

    const listingId = await ListingModel.create({
      user_id: req.user.id,
      title,
      description,
      price,
      room_type,
      furnishing,
      bathroom_type,
      address,
      latitude,
      longitude,
      distance_from_campus,
    });

    // Save photos if provided
    if (Array.isArray(photos) && photos.length > 0) {
      for (let i = 0; i < photos.length; i++) {
        await ListingModel.addPhoto(listingId, photos[i], i === 0);
      }
    }

    // Save amenities if provided
    if (Array.isArray(amenities) && amenities.length > 0) {
      for (let i = 0; i < amenities.length; i++) {
        await ListingModel.addAmenity(listingId, amenities[i]);
      }
    }

    const listing = await ListingModel.findById(listingId);
    res.status(201).json({ success: true, listing });
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ success: false, message: 'Failed to create listing' });
  }
};

// ─── PUT /api/listings/:id ────────────────────────
const updateListing = async (req, res) => {
  try {
    const isOwner = await ListingModel.isOwner(req.params.id, req.user.id);
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });

    const { title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus, status, photos, amenities } = req.body;

    await ListingModel.update(req.params.id, { title, description, price, room_type, furnishing, bathroom_type, address, latitude, longitude, distance_from_campus, status });

    // Handle photo updates if passed in
    if (Array.isArray(photos)) {
      // Clear old photos
      await ListingModel.clearPhotos(req.params.id);
      // Insert updated photo set
      for (let i = 0; i < photos.length; i++) {
        await ListingModel.addPhoto(req.params.id, photos[i], i === 0);
      }
    }

    // Handle amenity updates if passed in
    if (Array.isArray(amenities)) {
      // Clear old amenities
      await ListingModel.clearAmenities(req.params.id);
      // Insert updated amenities set
      for (let i = 0; i < amenities.length; i++) {
        await ListingModel.addAmenity(req.params.id, amenities[i]);
      }
    }

    const updated = await ListingModel.findById(req.params.id);
    res.json({ success: true, listing: updated });
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ success: false, message: 'Failed to update listing' });
  }
};

// ─── DELETE /api/listings/:id ─────────────────────
const deleteListing = async (req, res) => {
  try {
    const isOwner = await ListingModel.isOwner(req.params.id, req.user.id);
    if (!isOwner) return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });

    await ListingModel.delete(req.params.id);
    res.json({ success: true, message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete listing' });
  }
};

// ─── POST /api/listings/:id/wishlist ─────────────
const addToWishlist = async (req, res) => {
  try {
    const listing = await ListingModel.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found' });

    await ListingModel.addToWishlist(req.user.id, req.params.id);
    res.json({ success: true, message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to add to wishlist' });
  }
};

// ─── DELETE /api/listings/:id/wishlist ────────────
const removeFromWishlist = async (req, res) => {
  try {
    await ListingModel.removeFromWishlist(req.user.id, req.params.id);
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist' });
  }
};

// ─── GET /api/listings/wishlist ───────────────────
const getWishlist = async (req, res) => {
  try {
    const listings = await ListingModel.getWishlist(req.user.id);
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch wishlist' });
  }
};

module.exports = { getListings, getMyListings, getListing, createListing, updateListing, deleteListing, addToWishlist, removeFromWishlist, getWishlist };
