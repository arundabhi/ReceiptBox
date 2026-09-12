const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/auth');

// @route   POST /api/comments
// @desc    Add a comment to a recipe
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { recipeId, text } = req.body;
    if (!recipeId || !text) {
      return res.status(400).json({ message: 'Recipe ID and text are required' });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = await Comment.create({
      user: req.user.id,
      recipe: recipeId,
      text,
    });

    const populatedComment = await comment.populate('user', 'username avatar');
    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

// @route   DELETE /api/comments/:id
// @desc    Delete a comment (by owner of comment or owner of recipe)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const recipe = await Recipe.findById(comment.recipe);

    // Comment author, Recipe author, or Admin can delete
    if (
      comment.user.toString() !== req.user.id &&
      (!recipe || recipe.author.toString() !== req.user.id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

module.exports = router;
