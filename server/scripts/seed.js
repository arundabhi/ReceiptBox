const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const Cookbook = require('../models/Cookbook');
const MealPlan = require('../models/MealPlan');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const usersData = [
  {
    username: 'chef_mario',
    email: 'mario@recipebox.com',
    password: 'Password123',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&h=150&fit=crop',
    bio: 'Executive Chef of Mario Trattoria. Pasta lover, sourdough baker, and olive oil enthusiast.',
  },
  {
    username: 'sushi_queen',
    email: 'yuki@recipebox.com',
    password: 'Password123',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    bio: 'Tokyo-born home cook sharing the secrets of traditional sushi and Japanese home cooking.',
  },
  {
    username: 'healthy_hanna',
    email: 'hanna@recipebox.com',
    password: 'Password123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    bio: 'Registered Dietitian. Vegan, keto-friendly, and gluten-free recipes that actually taste amazing.',
  },
  {
    username: 'baker_bob',
    email: 'bob@recipebox.com',
    password: 'Password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    bio: 'Pastry chef. Making complex French pastries and sourdough bread accessible for home bakers.',
  },
  {
    username: 'spicy_sam',
    email: 'sam@recipebox.com',
    password: 'Password123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
    bio: 'Exploring world cuisine. Obsessed with tacos, curry, hot sauces, and bold, punchy flavors.',
  },
];

const recipesData = [
  {
    title: 'Creamy Tuscan Chicken',
    description: 'Tender chicken breasts seared and simmered in a luscious creamy sauce with sun-dried tomatoes, spinach, and garlic.',
    cookingTime: 30,
    difficulty: 'Easy',
    servings: 4,
    tags: ['chicken', 'italian', 'dinner', 'creamy', 'keto'],
    imageUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 420, protein: 35, carbs: 8, fats: 28 },
    ingredients: [
      { name: 'Chicken breasts', quantity: '4', unit: 'pieces' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'Garlic cloves, minced', quantity: '3', unit: 'cloves' },
      { name: 'Sun-dried tomatoes, chopped', quantity: '1/2', unit: 'cup' },
      { name: 'Fresh baby spinach', quantity: '3', unit: 'cups' },
      { name: 'Heavy cream', quantity: '1', unit: 'cup' },
      { name: 'Chicken broth', quantity: '1/2', unit: 'cup' },
      { name: 'Parmesan cheese, grated', quantity: '1/2', unit: 'cup' },
      { name: 'Italian seasoning', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Season chicken breasts with Italian seasoning, salt, and pepper on both sides.' },
      { stepNumber: 2, description: 'Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5-6 minutes per side until golden and cooked through. Remove chicken and set aside.' },
      { stepNumber: 3, description: 'In the same skillet, add garlic and cook for 1 minute until fragrant. Add sun-dried tomatoes and chicken broth. Bring to a simmer.' },
      { stepNumber: 4, description: 'Reduce heat to low, add heavy cream and Parmesan cheese. Simmer for 2-3 minutes until slightly thickened.' },
      { stepNumber: 5, description: 'Add baby spinach and allow it to wilt in the sauce. Return chicken and its juices to the skillet. Spoon sauce over chicken. Simmer for another 2 minutes and serve.' },
    ],
  },
  {
    title: 'Classic Margherita Pizza',
    description: 'The ultimate Italian flatbread with a simple homemade dough, rich tomato sauce, fresh mozzarella, and fresh basil leaves.',
    cookingTime: 45,
    difficulty: 'Medium',
    servings: 3,
    tags: ['pizza', 'italian', 'vegetarian', 'baking'],
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 350, protein: 14, carbs: 45, fats: 12 },
    ingredients: [
      { name: 'Pizza dough', quantity: '1', unit: 'portion' },
      { name: 'San Marzano tomatoes, crushed', quantity: '1/2', unit: 'cup' },
      { name: 'Fresh mozzarella cheese, sliced', quantity: '4', unit: 'oz' },
      { name: 'Fresh basil leaves', quantity: '6-8', unit: 'leaves' },
      { name: 'Extra virgin olive oil', quantity: '1', unit: 'tbsp' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 500°F (260°C) with a pizza stone inside, or preheat a heavy baking sheet.' },
      { stepNumber: 2, description: 'Roll out the pizza dough on a floured parchment paper to a 12-inch circle.' },
      { stepNumber: 3, description: 'Spread crushed San Marzano tomatoes evenly over the dough, leaving a 1-inch border. Season with salt.' },
      { stepNumber: 4, description: 'Top with fresh mozzarella slices and drizzle with extra virgin olive oil.' },
      { stepNumber: 5, description: 'Transfer pizza into the oven. Bake for 10-12 minutes until the crust is charred and cheese is bubbling.' },
      { stepNumber: 6, description: 'Garnish with fresh basil leaves immediately after baking. Slice and enjoy.' },
    ],
  },
  {
    title: 'Salmon Avocado Sushi Roll',
    description: 'Fresh sushi grade salmon, creamy avocado, and seasoned sushi rice wrapped in crispy nori seaweed sheets.',
    cookingTime: 40,
    difficulty: 'Hard',
    servings: 2,
    tags: ['sushi', 'japanese', 'salmon', 'seafood', 'rice'],
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 280, protein: 12, carbs: 38, fats: 9 },
    ingredients: [
      { name: 'Sushi rice (cooked and seasoned)', quantity: '2', unit: 'cups' },
      { name: 'Sushi-grade salmon, sliced', quantity: '4', unit: 'oz' },
      { name: 'Avocado, sliced', quantity: '1/2', unit: 'piece' },
      { name: 'Nori (seaweed) sheets', quantity: '2', unit: 'sheets' },
      { name: 'Rice vinegar', quantity: '2', unit: 'tbsp' },
      { name: 'Soy sauce and Wasabi', quantity: '1', unit: 'to serve' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Place a sheet of nori, shiny side down, on a bamboo sushi rolling mat.' },
      { stepNumber: 2, description: 'Wet your hands with vinegared water. Spread 1 cup of sushi rice evenly over the nori, leaving a 1-inch margin at the top.' },
      { stepNumber: 3, description: 'Lay salmon slices and avocado slices horizontally across the center of the rice.' },
      { stepNumber: 4, description: 'Hold the edge of the mat and roll it tightly away from you, pressing gently to form a uniform roll.' },
      { stepNumber: 5, description: 'Using a very sharp, wet knife, cut the roll into 8 equal pieces. Serve with soy sauce, ginger, and wasabi.' },
    ],
  },
  {
    title: 'Vegan Buddha Bowl',
    description: 'A colorful, nutrient-dense meal prep bowl featuring quinoa, roasted sweet potatoes, crispy chickpeas, avocado, and tahini dressing.',
    cookingTime: 35,
    difficulty: 'Easy',
    servings: 2,
    tags: ['vegan', 'vegetarian', 'healthy', 'gluten-free', 'quinoa'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 480, protein: 14, carbs: 62, fats: 18 },
    ingredients: [
      { name: 'Quinoa, cooked', quantity: '1', unit: 'cup' },
      { name: 'Sweet potato, cubed', quantity: '1', unit: 'medium' },
      { name: 'Canned chickpeas, drained', quantity: '1', unit: 'can' },
      { name: 'Avocado, sliced', quantity: '1', unit: 'piece' },
      { name: 'Tahini', quantity: '3', unit: 'tbsp' },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'Paprika and Cumin', quantity: '1', unit: 'tsp each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 400°F (200°C). Toss sweet potatoes and chickpeas in olive oil, paprika, cumin, salt, and pepper.' },
      { stepNumber: 2, description: 'Spread on a baking sheet in a single layer and roast for 20-25 minutes until potatoes are tender and chickpeas are crispy.' },
      { stepNumber: 3, description: 'Make dressing by whisking tahini, lemon juice, garlic powder, and warm water together until smooth and pourable.' },
      { stepNumber: 4, description: 'Assemble bowls by dividing cooked quinoa, roasted sweet potatoes, roasted chickpeas, and avocado slices.' },
      { stepNumber: 5, description: 'Drizzle the creamy tahini dressing over the top. Garnish with sesame seeds if desired.' },
    ],
  },
  {
    title: 'Artisan Sourdough Bread',
    description: 'Crispy, crusty, sourdough boule with an open crumb and that classic tang, made using a natural wild yeast starter.',
    cookingTime: 180,
    difficulty: 'Hard',
    servings: 10,
    tags: ['bread', 'baking', 'sourdough', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 160, protein: 5, carbs: 32, fats: 1 },
    ingredients: [
      { name: 'Bread flour', quantity: '500', unit: 'grams' },
      { name: 'Water', quantity: '350', unit: 'grams' },
      { name: 'Active Sourdough Starter', quantity: '100', unit: 'grams' },
      { name: 'Fine sea salt', quantity: '10', unit: 'grams' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Autolyse: Mix flour and water in a bowl. Let rest for 45 minutes.' },
      { stepNumber: 2, description: 'Mix in starter and salt. Knead briefly to combine. Perform bulk fermentation for 4 hours, doing stretch-and-folds every 30 minutes for the first 2 hours.' },
      { stepNumber: 3, description: 'Shape the dough into a tight ball (boule) and place in a bannton proofing basket. Cold ferment in the fridge overnight (12-15 hours).' },
      { stepNumber: 4, description: 'Preheat a Dutch oven inside the oven at 500°F (260°C) for 45 minutes.' },
      { stepNumber: 5, description: 'Flip dough onto parchment paper, score the top with a razor, and carefully transfer to the hot Dutch oven. Bake covered for 20 minutes.' },
      { stepNumber: 6, description: 'Remove lid, lower temperature to 450°F (230°C), and bake for another 20-25 minutes until dark golden and crispy.' },
    ],
  },
  {
    title: 'Spicy Shrimp Tacos',
    description: 'Quick-seared spicy chili lime shrimp in warm corn tortillas with avocado crema and a fresh, crunchy cabbage slaw.',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 3,
    tags: ['seafood', 'shrimp', 'tacos', 'mexican', 'spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 310, protein: 22, carbs: 24, fats: 13 },
    ingredients: [
      { name: 'Shrimp, peeled and deveined', quantity: '1', unit: 'lb' },
      { name: 'Chili powder', quantity: '1', unit: 'tbsp' },
      { name: 'Lime juice', quantity: '2', unit: 'tbsp' },
      { name: 'Shredded cabbage', quantity: '2', unit: 'cups' },
      { name: 'Sour cream', quantity: '1/2', unit: 'cup' },
      { name: 'Avocado', quantity: '1', unit: 'piece' },
      { name: 'Corn tortillas', quantity: '8', unit: 'pieces' },
      { name: 'Cilantro', quantity: '1/4', unit: 'cup' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Toss shrimp with chili powder, cumin, garlic powder, lime juice, salt, and olive oil.' },
      { stepNumber: 2, description: 'Make avocado crema by blending avocado, sour cream, lime juice, and cilantro until smooth.' },
      { stepNumber: 3, description: 'Heat a skillet over high heat. Cook shrimp for 2 minutes per side until pink and charred. Remove from heat.' },
      { stepNumber: 4, description: 'Warm corn tortillas on a flat skillet.' },
      { stepNumber: 5, description: 'Assemble tacos with shrimp, cabbage slaw, a dollop of avocado crema, and extra fresh cilantro leaves.' },
    ],
  },
  {
    title: 'Spicy Butter Chicken (Murgh Makhani)',
    description: 'An authentic recipe for tender chicken thighs cooked in a rich, velvety, spiced tomato, butter, and cream sauce.',
    cookingTime: 45,
    difficulty: 'Medium',
    servings: 4,
    tags: ['indian', 'chicken', 'curry', 'spicy', 'creamy'],
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 510, protein: 32, carbs: 12, fats: 38 },
    ingredients: [
      { name: 'Chicken thighs, chopped', quantity: '1.5', unit: 'lbs' },
      { name: 'Yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Garam masala', quantity: '2', unit: 'tsp' },
      { name: 'Butter', quantity: '4', unit: 'tbsp' },
      { name: 'Onion, finely chopped', quantity: '1', unit: 'large' },
      { name: 'Ginger-garlic paste', quantity: '2', unit: 'tbsp' },
      { name: 'Canned tomato puree', quantity: '1.5', unit: 'cups' },
      { name: 'Heavy cream', quantity: '3/4', unit: 'cup' },
      { name: 'Kashmiri chili powder', quantity: '1.5', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Marinate chicken thighs in yogurt, garam masala, ginger-garlic paste, lemon juice, and salt for at least 30 minutes.' },
      { stepNumber: 2, description: 'Heat butter in a deep skillet. Sear marinated chicken pieces until browned, then remove (they do not need to be fully cooked yet).' },
      { stepNumber: 3, description: 'In the same skillet, saute onions, ginger, and garlic paste until soft. Add tomato puree, chili powder, and cumin.' },
      { stepNumber: 4, description: 'Simmer the tomato sauce for 10 minutes. Blend sauce until perfectly smooth, then return to skillet.' },
      { stepNumber: 5, description: 'Add chicken back, stir in heavy cream and butter. Simmer for 10 minutes until chicken is tender. Serve with hot garlic naan.' },
    ],
  },
  {
    title: 'Keto Avocado Bacon Salad',
    description: 'A crisp, low-carb lunch loaded with butter lettuce, crunchy bacon, ripe avocado slices, boiled eggs, and a zesty herb vinaigrette.',
    cookingTime: 15,
    difficulty: 'Easy',
    servings: 2,
    tags: ['salad', 'healthy', 'keto', 'low-carb', 'bacon', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 460, protein: 18, carbs: 5, fats: 42 },
    ingredients: [
      { name: 'Butter lettuce', quantity: '4', unit: 'cups' },
      { name: 'Avocado, cubed', quantity: '1', unit: 'large' },
      { name: 'Bacon strips, cooked and crumbled', quantity: '4', unit: 'strips' },
      { name: 'Hard boiled eggs, sliced', quantity: '2', unit: 'pieces' },
      { name: 'Cherry tomatoes', quantity: '1/2', unit: 'cup' },
      { name: 'Olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'Red wine vinegar', quantity: '1', unit: 'tbsp' },
      { name: 'Dijon mustard', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Wash and tear butter lettuce into bite-sized pieces and place in a large salad bowl.' },
      { stepNumber: 2, description: 'Top with cubed avocado, crumbled crispy bacon, sliced hard-boiled eggs, and halved cherry tomatoes.' },
      { stepNumber: 3, description: 'Whisk olive oil, red wine vinegar, Dijon mustard, salt, and pepper in a small bowl to make dressing.' },
      { stepNumber: 4, description: 'Drizzle vinaigrette over the salad, toss gently, and serve immediately.' },
    ],
  },
];

// Add 17 more recipes to reach 25 total
for (let i = 1; i <= 17; i++) {
  const diffs = ['Easy', 'Medium', 'Hard'];
  const titles = [
    'Gluten-free Chocolate Brownies', 'Creamy Mushroom Risotto', 'Slow Cooked Beef Birria Tacos',
    'Street Style Pad Thai Noodles', 'Lemon Blueberry Scones', 'Sweet Potato Chickpea Curry',
    'Greek Quinoa Salad bowl', 'French Onion Soup', 'Garlic Butter Steak Bites',
    'Ceremonial Matcha Latte', 'Spicy Shakshuka Eggs', 'Blueberry Almond Pancakes',
    'Glazed Teriyaki Salmon Bowl', 'Decadent Chocolate Lava Cake', 'Authentic Beef Pho Soup',
    'Mango Sticky Rice Dessert', 'Caprese Stuffed Chicken'
  ];
  const tags = [
    ['dessert', 'baking', 'gluten-free', 'chocolate'], ['vegetarian', 'risotto', 'italian', 'mushrooms'], ['mexican', 'beef', 'tacos', 'slow-cooker', 'spicy'],
    ['thai', 'noodles', 'street-food', 'shrimp'], ['breakfast', 'baking', 'blueberry', 'scones'], ['vegan', 'vegetarian', 'curry', 'sweet-potato'],
    ['salad', 'healthy', 'greek', 'quinoa'], ['soup', 'french', 'onion', 'comfort-food'], ['steak', 'beef', 'garlic', 'quick', 'keto'],
    ['matcha', 'drink', 'healthy', 'vegan'], ['breakfast', 'eggs', 'shakshuka', 'spicy'], ['breakfast', 'pancakes', 'blueberry', 'quick'],
    ['seafood', 'salmon', 'japanese', 'teriyaki'], ['dessert', 'chocolate', 'baking', 'cake'], ['soup', 'vietnamese', 'pho', 'beef', 'noodles'],
    ['dessert', 'thai', 'mango', 'sticky-rice'], ['chicken', 'caprese', 'italian', 'keto']
  ];
  const images = [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590412200988-a436bb705300?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop'
  ];

  recipesData.push({
    title: titles[i - 1],
    description: `A delicious and crafted culinary version of ${titles[i - 1]} that is easy to prepare and yields wonderful results.`,
    cookingTime: 15 + (i * 10),
    difficulty: diffs[(i - 1) % 3],
    servings: 2 + ((i - 1) % 4),
    tags: tags[i - 1],
    imageUrl: images[i - 1],
    nutritionInfo: {
      calories: 200 + (i * 15),
      protein: 10 + (i % 5) * 5,
      carbs: 20 + (i % 6) * 5,
      fats: 5 + (i % 4) * 4
    },
    ingredients: [
      { name: 'Core Base Ingredient', quantity: '2', unit: 'cups' },
      { name: 'Spices and Seasoning Mix', quantity: '1', unit: 'tbsp' },
      { name: 'Fresh Vegetables / Herbs', quantity: '1/2', unit: 'cup' },
      { name: 'Olive oil or Butter', quantity: '2', unit: 'tbsp' }
    ],
    instructions: [
      { stepNumber: 1, description: 'Gather all ingredients and pre-heat cooking apparatus.' },
      { stepNumber: 2, description: 'Combine primary ingredients in a cooking vessel and simmer gently.' },
      { stepNumber: 3, description: 'Adjust seasoning with salt, pepper, and fresh herbs. Serve hot immediately.' }
    ]
  });
}

const mockComments = [
  'Wow, this looks incredible! Made it tonight and the whole family loved it.',
  'Could I substitute the heavy cream with coconut milk to make it dairy-free?',
  'Definitely adding this to my weekly dinner rotation! Super easy to follow.',
  'Perfect instructions. The cooking time was spot on.',
  'This is the best version of this recipe I have ever tried! 10/10.',
  'Loved the visual step instructions, made it so simple.',
  'A bit too spicy for my taste, but the flavor profile is wonderful.',
  'Amazing results! Thank you chef for sharing.'
];

const seedDB = async () => {
  try {
    console.log('Connecting to MongoDB database to seed...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipebox');
    console.log('Connection successful.');

    // Clear existing data
    console.log('Cleaning existing collection documents...');
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    await Rating.deleteMany({});
    await Cookbook.deleteMany({});
    await MealPlan.deleteMany({});
    console.log('Collections cleared.');

    // 1. Create Users
    console.log('Creating mock user profiles...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`${createdUsers.length} users registered successfully.`);

    // 2. Establish Social Follows
    console.log('Establishing social follows...');
    // Mario follows Sam, Hanna, Bob
    // Yuki follows Mario, Hanna
    // Hanna follows Yuki, Bob
    // Bob follows Mario, Yuki, Sam
    // Sam follows Bob, Hanna
    const followList = [
      { from: createdUsers[0], to: [createdUsers[4], createdUsers[2], createdUsers[3]] },
      { from: createdUsers[1], to: [createdUsers[0], createdUsers[2]] },
      { from: createdUsers[2], to: [createdUsers[1], createdUsers[3]] },
      { from: createdUsers[3], to: [createdUsers[0], createdUsers[1], createdUsers[4]] },
      { from: createdUsers[4], to: [createdUsers[3], createdUsers[2]] },
    ];

    for (const f of followList) {
      for (const targetUser of f.to) {
        f.from.following.push(targetUser._id);
        targetUser.followers.push(f.from._id);
        await targetUser.save();
      }
      await f.from.save();
    }
    console.log('Social connection maps populated.');

    // 3. Create Recipes
    console.log('Creating recipes...');
    const createdRecipes = [];
    for (let i = 0; i < recipesData.length; i++) {
      const recipeItem = recipesData[i];
      // Distribute recipes randomly among authors
      const author = createdUsers[i % createdUsers.length];
      const recipe = new Recipe({
        ...recipeItem,
        author: author._id,
      });
      await recipe.save();
      createdRecipes.push(recipe);
    }
    console.log(`${createdRecipes.length} recipes created successfully.`);

    // 4. Create Comments & Ratings
    console.log('Seeding comments and ratings...');
    for (const recipe of createdRecipes) {
      // Pick 2-4 random users to comment and rate
      const selectedUsers = [...createdUsers].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      for (const user of selectedUsers) {
        // Skip author rating their own recipe sometimes to keep it realistic
        if (recipe.author.toString() === user._id.toString()) continue;

        // Seed Rating (4 or 5 stars mostly)
        const star = Math.floor(Math.random() * 2) + 4; // 4 or 5
        await Rating.create({
          user: user._id,
          recipe: recipe._id,
          rating: star,
        });

        // Seed Comment
        const text = mockComments[Math.floor(Math.random() * mockComments.length)];
        await Comment.create({
          user: user._id,
          recipe: recipe._id,
          text,
        });
      }

      // Recalculate Recipe ratings stats
      const ratings = await Rating.find({ recipe: recipe._id });
      if (ratings.length > 0) {
        const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        recipe.averageRating = Math.round((sum / ratings.length) * 10) / 10;
        recipe.totalRatings = ratings.length;
        await recipe.save();
      }
    }
    console.log('Comments and Ratings successfully linked.');

    // 5. Create Cookbooks
    console.log('Seeding cookbooks collections...');
    const cookbookCollections = [
      { title: 'Sunday Brunch Favorites', description: 'Sweet and savory dishes for a slow weekend morning.', owner: createdUsers[0] },
      { title: 'Keto Diet Mealprep', description: 'High fat, low carb delicious meals.', owner: createdUsers[2] },
      { title: 'Quick Weeknight Dinners', description: 'Under 30-minute delicious meals for busy schedules.', owner: createdUsers[4] },
    ];

    for (const c of cookbookCollections) {
      const cookbook = new Cookbook({
        title: c.title,
        description: c.description,
        owner: c.owner._id,
        // Insert 3 random recipes
        recipes: createdRecipes.sort(() => 0.5 - Math.random()).slice(0, 3).map(r => r._id),
      });
      await cookbook.save();
    }
    console.log('Cookbook folders populated.');

    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Database seeding error:', error);
    process.exit(1);
  }
};

seedDB();
