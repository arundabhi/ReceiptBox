const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');
const { upload, uploadImage } = require('../middleware/upload');

// @route   GET /api/recipes/search
// @desc    Advanced search recipes with filters (include, exclude, time, difficulty, tags, author)
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { query, include, exclude, tags, time, difficulty, author } = req.query;
    const pipeline = [];
    const match = {};

    // 1. Keyword search (regex search on title or description)
    if (query) {
      match.$or = [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }

    // 2. Cooking Time filter
    if (time) {
      match.cookingTime = { $lte: parseInt(time) };
    }

    // 3. Difficulty filter
    if (difficulty) {
      match.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }

    // 4. Tags filter (All matching tags)
    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase());
      match.tags = { $all: tagList.map((t) => new RegExp(`^${t}$`, 'i')) };
    }

    // Include the base matches first
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // 5. Include / Exclude ingredients filtering
    if (include || exclude) {
      const includeList = include ? include.split(',').map((i) => i.trim().toLowerCase()) : [];
      const excludeList = exclude ? exclude.split(',').map((i) => i.trim().toLowerCase()) : [];
      
      const ingredientMatch = {};
      const matchConditions = [];

      if (includeList.length > 0) {
        includeList.forEach((ing) => {
          matchConditions.push({ 'ingredients.name': { $regex: ing, $options: 'i' } });
        });
      }

      if (excludeList.length > 0) {
        excludeList.forEach((ing) => {
          matchConditions.push({ 'ingredients.name': { $not: { $regex: ing, $options: 'i' } } });
        });
      }

      if (matchConditions.length > 0) {
        ingredientMatch.$and = matchConditions;
        pipeline.push({ $match: ingredientMatch });
      }
    }

    // 6. Join with Author User details
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorInfo',
      },
    });

    pipeline.push({ $unwind: { path: '$authorInfo', preserveNullAndEmptyArrays: true } });

    // 7. Author filter by username
    if (author) {
      pipeline.push({
        $match: {
          'authorInfo.username': { $regex: author, $options: 'i' },
        },
      });
    }

    // 8. Projection
    pipeline.push({
      $project: {
        title: 1,
        description: 1,
        ingredients: 1,
        instructions: 1,
        cookingTime: 1,
        difficulty: 1,
        servings: 1,
        tags: 1,
        imageUrl: 1,
        nutritionInfo: 1,
        averageRating: 1,
        totalRatings: 1,
        createdAt: 1,
        author: {
          id: '$authorInfo._id',
          username: '$authorInfo.username',
          avatar: '$authorInfo.avatar',
        },
      },
    });

    // 9. Sort by creation date
    pipeline.push({ $sort: { createdAt: -1 } });

    const results = await Recipe.aggregate(pipeline);
    res.json(results);
  } catch (error) {
    console.error('Advanced Search error:', error);
    res.status(500).json({ message: 'Server error during search aggregation' });
  }
});

// @route   GET /api/recipes
// @desc    Get all recipes (with optional tag or difficulty filtering & pagination)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { tag, difficulty, sort } = req.query;

    const queryObj = {};
    if (tag) queryObj.tags = { $regex: new RegExp(tag, 'i') };
    if (difficulty) queryObj.difficulty = difficulty;

    let sortObj = { createdAt: -1 };
    if (sort === 'popular') sortObj = { averageRating: -1, totalRatings: -1 };

    const total = await Recipe.countDocuments(queryObj);
    const recipes = await Recipe.find(queryObj)
      .populate('author', 'username avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({
      recipes,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ message: 'Server error retrieving recipes' });
  }
});

// @route   GET /api/recipes/:id
// @desc    Get single recipe by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username avatar bio followers following');
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Get recipe comments
    const comments = await Comment.find({ recipe: req.params.id })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({ recipe, comments });
  } catch (error) {
    console.error('Get recipe details error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(500).json({ message: 'Server error retrieving recipe details' });
  }
});

// @route   POST /api/recipes
// @desc    Create a new recipe
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, difficulty, servings, tags, nutritionInfo } = req.body;

    if (!title || !description || !ingredients || !instructions || !cookingTime || !difficulty || !servings) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a recipe image' });
    }

    // Parse text arrays/objects (since they are sent via Form Data)
    const parsedIngredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    const parsedInstructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
    const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    const parsedNutrition = typeof nutritionInfo === 'string' ? JSON.parse(nutritionInfo) : nutritionInfo;

    // Upload image
    const imageUrl = await uploadImage(req.file, 'recipebox_recipes');

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      cookingTime: parseInt(cookingTime),
      difficulty,
      servings: parseInt(servings),
      tags: parsedTags || [],
      imageUrl,
      nutritionInfo: parsedNutrition || { calories: 0, protein: 0, carbs: 0, fats: 0 },
      author: req.user.id,
    });

    const populatedRecipe = await recipe.populate('author', 'username avatar');
    res.status(201).json(populatedRecipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: error.message || 'Server error creating recipe' });
  }
});

// @route   PUT /api/recipes/:id
// @desc    Update an existing recipe
// @access  Private
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to edit this recipe' });
    }

    const { title, description, ingredients, instructions, cookingTime, difficulty, servings, tags, nutritionInfo } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (cookingTime) updateData.cookingTime = parseInt(cookingTime);
    if (difficulty) updateData.difficulty = difficulty;
    if (servings) updateData.servings = parseInt(servings);
    
    if (ingredients) updateData.ingredients = typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients;
    if (instructions) updateData.instructions = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;
    if (tags) updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    if (nutritionInfo) updateData.nutritionInfo = typeof nutritionInfo === 'string' ? JSON.parse(nutritionInfo) : nutritionInfo;

    // Handle new image upload if provided
    if (req.file) {
      updateData.imageUrl = await uploadImage(req.file, 'recipebox_recipes');
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate('author', 'username avatar');

    res.json(recipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ message: error.message || 'Server error updating recipe' });
  }
});

// @route   DELETE /api/recipes/:id
// @desc    Delete a recipe
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check ownership
    if (recipe.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this recipe' });
    }

    await Recipe.deleteOne({ _id: req.params.id });
    // Clean up comments for this recipe
    await Comment.deleteMany({ recipe: req.params.id });

    res.json({ message: 'Recipe and comments deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Server error deleting recipe' });
  }
});

module.exports = router;
