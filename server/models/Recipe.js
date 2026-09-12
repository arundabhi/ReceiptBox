const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    default: '',
  },
});

const instructionSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Recipe description is required'],
    },
    ingredients: {
      type: [ingredientSchema],
      validate: [v => v.length > 0, 'Recipe must have at least one ingredient'],
    },
    instructions: {
      type: [instructionSchema],
      validate: [v => v.length > 0, 'Recipe must have at least one step instruction'],
    },
    cookingTime: {
      type: Number, // in minutes
      required: [true, 'Cooking time is required'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Easy',
    },
    servings: {
      type: Number,
      required: [true, 'Servings count is required'],
    },
    tags: {
      type: [String],
      index: true,
      default: [],
    },
    imageUrl: {
      type: String,
      required: [true, 'Recipe image is required'],
    },
    nutritionInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 }, // in grams
      carbs: { type: Number, default: 0 }, // in grams
      fats: { type: Number, default: 0 }, // in grams
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for title & description to support text search queries
recipeSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
