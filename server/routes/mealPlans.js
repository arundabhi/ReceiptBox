const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const { protect } = require('../middleware/auth');

// Helper to get Monday of the week for a given date
const getMondayOfWeek = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  // Adjust day (0 is Sunday, 1 is Monday, etc.) to calculate difference to Monday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
};

// @route   GET /api/mealplans
// @desc    Get meal plan for a specific week
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { weekStartDate } = req.query;
    if (!weekStartDate) {
      return res.status(400).json({ message: 'weekStartDate query parameter is required' });
    }

    const monday = getMondayOfWeek(weekStartDate);

    let mealPlan = await MealPlan.findOne({ user: req.user.id, weekStartDate: monday })
      .populate('plans.recipe', 'title imageUrl cookingTime difficulty servings');

    if (!mealPlan) {
      // Return empty skeleton instead of error
      return res.json({
        user: req.user.id,
        weekStartDate: monday,
        plans: [],
      });
    }

    res.json(mealPlan);
  } catch (error) {
    console.error('Get meal plan error:', error);
    res.status(500).json({ message: 'Server error retrieving meal plan' });
  }
});

// @route   POST /api/mealplans
// @desc    Save/add a recipe to a specific day in the meal plan
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { weekStartDate, day, recipeId } = req.body;
    if (!weekStartDate || !day || !recipeId) {
      return res.status(400).json({ message: 'Please provide weekStartDate, day, and recipeId' });
    }

    const monday = getMondayOfWeek(weekStartDate);

    // Find existing plan or initialize a new one
    let mealPlan = await MealPlan.findOne({ user: req.user.id, weekStartDate: monday });

    if (!mealPlan) {
      mealPlan = new MealPlan({
        user: req.user.id,
        weekStartDate: monday,
        plans: [],
      });
    }

    // Add new plan item
    mealPlan.plans.push({ day, recipe: recipeId });
    await mealPlan.save();

    const populated = await mealPlan.populate('plans.recipe', 'title imageUrl cookingTime difficulty servings');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Save meal plan error:', error);
    res.status(500).json({ message: 'Server error saving meal plan' });
  }
});

// @route   DELETE /api/mealplans/item
// @desc    Remove a specific recipe plan item from a week
// @access  Private
router.delete('/item', protect, async (req, res) => {
  try {
    const { weekStartDate, planItemId } = req.query;
    if (!weekStartDate || !planItemId) {
      return res.status(400).json({ message: 'weekStartDate and planItemId are required' });
    }

    const monday = getMondayOfWeek(weekStartDate);

    let mealPlan = await MealPlan.findOne({ user: req.user.id, weekStartDate: monday });
    if (!mealPlan) {
      return res.status(404).json({ message: 'Meal plan not found' });
    }

    // Pull item
    mealPlan.plans = mealPlan.plans.filter((p) => p._id.toString() !== planItemId);
    await mealPlan.save();

    const populated = await mealPlan.populate('plans.recipe', 'title imageUrl cookingTime difficulty servings');
    res.json(populated);
  } catch (error) {
    console.error('Delete meal plan item error:', error);
    res.status(500).json({ message: 'Server error deleting meal plan item' });
  }
});

// @route   DELETE /api/mealplans/clear
// @desc    Clear entire weekly meal plan
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const { weekStartDate } = req.query;
    if (!weekStartDate) {
      return res.status(400).json({ message: 'weekStartDate is required' });
    }

    const monday = getMondayOfWeek(weekStartDate);

    await MealPlan.findOneAndDelete({ user: req.user.id, weekStartDate: monday });

    res.json({
      message: 'Weekly meal plan cleared successfully',
      plans: [],
    });
  } catch (error) {
    console.error('Clear meal plan error:', error);
    res.status(500).json({ message: 'Server error clearing weekly meal plan' });
  }
});

module.exports = router;
