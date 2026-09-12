const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// @route   POST /api/ratings
// @desc    Add or update rating for a recipe, and recalculate recipe averages
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { recipeId, rating } = req.body;
    const userId = req.user.id;

    if (!recipeId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Valid recipe ID and rating (1-5) are required' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Upsert the user's rating
    await Rating.findOneAndUpdate(
      { user: userId, recipe: recipe._id },
      { rating: parseInt(rating) },
      { new: true, upsert: true }
    );

    // Calculate average and total ratings via MongoDB aggregation
    const stats = await Rating.aggregate([
      { $match: { recipe: recipe._id } },
      {
        $group: {
          _id: '$recipe',
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      // Keep average rating to 1 decimal place
      recipe.averageRating = Math.round(stats[0].averageRating * 10) / 10;
      recipe.totalRatings = stats[0].totalRatings;
      await recipe.save();
    }

    res.json({
      message: 'Rating saved successfully',
      averageRating: recipe.averageRating,
      totalRatings: recipe.totalRatings,
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ message: 'Server error saving rating' });
  }
});

module.exports = router;
