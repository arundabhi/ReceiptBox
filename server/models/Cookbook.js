const mongoose = require('mongoose');

const cookbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Cookbook title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Cookbook', cookbookSchema);
