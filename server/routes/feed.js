const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// @route   GET /api/feed
// @desc    Get social recipe feed from followed creators (with popular fallback)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let queryObj = {};
    let fallback = false;

    if (user.following && user.following.length > 0) {
      queryObj.author = { $in: user.following };
    } else {
      // Fallback: If not following anyone, return recent recipes as recommendations
      fallback = true;
    }

    const total = await Recipe.countDocuments(queryObj);
    const recipes = await Recipe.find(queryObj)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      recipes,
      page,
      pages: Math.ceil(total / limit) || 1,
      total,
      fallback,
    });
  } catch (error) {
    console.error('Feed generation error:', error);
    res.status(500).json({ message: 'Server error generating social feed' });
  }
});

module.exports = router;
