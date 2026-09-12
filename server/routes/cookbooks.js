const express = require('express');
const router = express.Router();
const Cookbook = require('../models/Cookbook');
const { protect } = require('../middleware/auth');

// @route   GET /api/cookbooks
// @desc    Get all cookbooks of the current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cookbooks = await Cookbook.find({ owner: req.user.id }).populate('recipes', 'title imageUrl averageRating');
    res.json(cookbooks);
  } catch (error) {
    console.error('Get cookbooks error:', error);
    res.status(500).json({ message: 'Server error retrieving cookbooks' });
  }
});

// @route   GET /api/cookbooks/:id
// @desc    Get single cookbook details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const cookbook = await Cookbook.findOne({ _id: req.params.id, owner: req.user.id })
      .populate({
        path: 'recipes',
        populate: { path: 'author', select: 'username' }
      });

    if (!cookbook) {
      return res.status(404).json({ message: 'Cookbook not found' });
    }

    res.json(cookbook);
  } catch (error) {
    console.error('Get cookbook details error:', error);
    res.status(500).json({ message: 'Server error retrieving cookbook details' });
  }
});

// @route   POST /api/cookbooks
// @desc    Create a new cookbook
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const cookbook = await Cookbook.create({
      title,
      description: description || '',
      owner: req.user.id,
      recipes: [],
    });

    res.status(201).json(cookbook);
  } catch (error) {
    console.error('Create cookbook error:', error);
    res.status(500).json({ message: 'Server error creating cookbook' });
  }
});

// @route   PUT /api/cookbooks/:id
// @desc    Update cookbook metadata
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    let cookbook = await Cookbook.findOne({ _id: req.params.id, owner: req.user.id });
    if (!cookbook) {
      return res.status(404).json({ message: 'Cookbook not found' });
    }

    if (title) cookbook.title = title;
    if (description !== undefined) cookbook.description = description;

    await cookbook.save();
    res.json(cookbook);
  } catch (error) {
    console.error('Update cookbook error:', error);
    res.status(500).json({ message: 'Server error updating cookbook' });
  }
});

// @route   DELETE /api/cookbooks/:id
// @desc    Delete a cookbook
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const cookbook = await Cookbook.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!cookbook) {
      return res.status(404).json({ message: 'Cookbook not found' });
    }
    res.json({ message: 'Cookbook deleted successfully' });
  } catch (error) {
    console.error('Delete cookbook error:', error);
    res.status(500).json({ message: 'Server error deleting cookbook' });
  }
});

// @route   POST /api/cookbooks/:id/recipes
// @desc    Add a recipe to a cookbook
// @access  Private
router.post('/:id/recipes', protect, async (req, res) => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      return res.status(400).json({ message: 'Recipe ID is required' });
    }

    const cookbook = await Cookbook.findOne({ _id: req.params.id, owner: req.user.id });
    if (!cookbook) {
      return res.status(404).json({ message: 'Cookbook not found' });
    }

    // Check if recipe already in cookbook
    if (cookbook.recipes.includes(recipeId)) {
      return res.status(400).json({ message: 'Recipe already in this cookbook' });
    }

    cookbook.recipes.push(recipeId);
    await cookbook.save();
    
    const updated = await cookbook.populate('recipes', 'title imageUrl averageRating');
    res.json(updated);
  } catch (error) {
    console.error('Add recipe to cookbook error:', error);
    res.status(500).json({ message: 'Server error adding recipe to cookbook' });
  }
});

// @route   DELETE /api/cookbooks/:id/recipes/:recipeId
// @desc    Remove a recipe from a cookbook
// @access  Private
router.delete('/:id/recipes/:recipeId', protect, async (req, res) => {
  try {
    const { id, recipeId } = req.params;

    const cookbook = await Cookbook.findOne({ _id: id, owner: req.user.id });
    if (!cookbook) {
      return res.status(404).json({ message: 'Cookbook not found' });
    }

    cookbook.recipes = cookbook.recipes.filter((r) => r.toString() !== recipeId);
    await cookbook.save();

    const updated = await cookbook.populate('recipes', 'title imageUrl averageRating');
    res.json(updated);
  } catch (error) {
    console.error('Remove recipe from cookbook error:', error);
    res.status(500).json({ message: 'Server error removing recipe from cookbook' });
  }
});

module.exports = router;
