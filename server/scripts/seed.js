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
      { stepNumber: 1, description: 'Season chicken breasts with Italian seasoning, sea salt, and freshly cracked black pepper.' },
      { stepNumber: 2, description: 'Heat olive oil in a large skillet over medium-high heat. Sear chicken for 5-6 minutes per side until golden brown and cooked through (165°F internal). Transfer to a plate.' },
      { stepNumber: 3, description: 'In the same skillet, add minced garlic and sauté for 1 minute until fragrant. Add sun-dried tomatoes and chicken broth, deglazing the flavorful browned bits from the pan.' },
      { stepNumber: 4, description: 'Reduce heat to low and whisk in heavy cream and grated Parmesan cheese. Simmer gently for 3 minutes until the sauce slightly thickens.' },
      { stepNumber: 5, description: 'Add fresh baby spinach and stir until wilted. Return chicken and resting juices back to skillet, spooning sauce over each piece before serving hot.' },
    ],
  },
  {
    title: 'Classic Margherita Pizza',
    description: 'The ultimate Italian flatbread with a simple homemade dough, rich San Marzano tomato sauce, fresh mozzarella, and aromatic basil leaves.',
    cookingTime: 45,
    difficulty: 'Medium',
    servings: 3,
    tags: ['pizza', 'italian', 'vegetarian', 'baking'],
    imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 350, protein: 14, carbs: 45, fats: 12 },
    ingredients: [
      { name: 'Pizza dough ball', quantity: '1', unit: 'portion (300g)' },
      { name: 'San Marzano tomatoes, crushed', quantity: '1/2', unit: 'cup' },
      { name: 'Fresh mozzarella cheese, sliced', quantity: '4', unit: 'oz' },
      { name: 'Fresh basil leaves', quantity: '8', unit: 'leaves' },
      { name: 'Extra virgin olive oil', quantity: '1', unit: 'tbsp' },
      { name: 'Flaky sea salt', quantity: '1/2', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat your oven to 500°F (260°C) with a pizza stone or baking steel placed on the middle rack for at least 45 minutes.' },
      { stepNumber: 2, description: 'Dust your work surface with semolina flour and gently stretch the pizza dough with your fingers from the center outward, forming a 12-inch disc with a raised rim.' },
      { stepNumber: 3, description: 'Spread crushed San Marzano tomatoes in a thin layer over the dough, leaving a 1-inch border. Season lightly with sea salt.' },
      { stepNumber: 4, description: 'Evenly distribute fresh mozzarella slices and drizzle with good extra virgin olive oil.' },
      { stepNumber: 5, description: 'Bake for 9-11 minutes until the crust is blistered and golden, and the cheese is bubbling.' },
      { stepNumber: 6, description: 'Garnish with fresh basil leaves immediately after removing from the oven. Slice and serve hot.' },
    ],
  },
  {
    title: 'Salmon Avocado Sushi Roll',
    description: 'Fresh sushi-grade salmon, creamy Hass avocado, and seasoned sushi rice wrapped in crisp toasted nori seaweed sheets.',
    cookingTime: 40,
    difficulty: 'Hard',
    servings: 2,
    tags: ['sushi', 'japanese', 'salmon', 'seafood', 'rice'],
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 280, protein: 12, carbs: 38, fats: 9 },
    ingredients: [
      { name: 'Sushi rice (cooked and seasoned with rice vinegar)', quantity: '2', unit: 'cups' },
      { name: 'Sushi-grade raw salmon fillet, sliced into strips', quantity: '6', unit: 'oz' },
      { name: 'Ripe avocado, sliced', quantity: '1', unit: 'whole' },
      { name: 'Nori seaweed sheets', quantity: '2', unit: 'sheets' },
      { name: 'Rice vinegar', quantity: '2', unit: 'tbsp' },
      { name: 'Toasted white sesame seeds', quantity: '1', unit: 'tbsp' },
      { name: 'Soy sauce, pickled ginger & wasabi', quantity: '1', unit: 'to serve' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Place a sheet of nori shiny side down on a bamboo rolling mat (makisu).' },
      { stepNumber: 2, description: 'Dampen hands with vinegared water to prevent sticking. Spread 1 cup of seasoned sushi rice evenly across the nori, leaving a 1/2-inch border at the top.' },
      { stepNumber: 3, description: 'Sprinkle sesame seeds over the rice. Lay salmon strips and avocado slices horizontally across the lower third of the rice.' },
      { stepNumber: 4, description: 'Lift the bottom edge of the bamboo mat and roll firmly away from you, tucking ingredients tightly until the roll is sealed.' },
      { stepNumber: 5, description: 'Wipe a sharp chef knife with a damp cloth, slice roll into 8 equal pieces, and serve with soy sauce, wasabi, and pickled ginger.' },
    ],
  },
  {
    title: 'Vegan Buddha Bowl',
    description: 'A vibrant, nutrient-dense bowl with fluffy quinoa, spiced roasted sweet potatoes, crispy chickpeas, avocado, and creamy lemon-tahini dressing.',
    cookingTime: 35,
    difficulty: 'Easy',
    servings: 2,
    tags: ['vegan', 'vegetarian', 'healthy', 'gluten-free', 'quinoa'],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 480, protein: 14, carbs: 62, fats: 18 },
    ingredients: [
      { name: 'Tri-color quinoa, rinsed and cooked', quantity: '1.5', unit: 'cups' },
      { name: 'Sweet potato, diced into 1/2-inch cubes', quantity: '1', unit: 'large' },
      { name: 'Chickpeas, rinsed, drained and patted dry', quantity: '1', unit: 'can (15oz)' },
      { name: 'Ripe avocado, sliced', quantity: '1', unit: 'whole' },
      { name: 'Baby kale or spinach', quantity: '2', unit: 'cups' },
      { name: 'Tahini paste', quantity: '3', unit: 'tbsp' },
      { name: 'Fresh lemon juice', quantity: '2', unit: 'tbsp' },
      { name: 'Smoked paprika and ground cumin', quantity: '1', unit: 'tsp each' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 400°F (200°C). Line a large baking sheet with parchment paper.' },
      { stepNumber: 2, description: 'Toss diced sweet potatoes and chickpeas in olive oil, smoked paprika, cumin, salt, and black pepper. Spread evenly in a single layer.' },
      { stepNumber: 3, description: 'Roast for 25 minutes, tossing halfway through, until sweet potatoes are tender and chickpeas are crispy.' },
      { stepNumber: 4, description: 'Whisk tahini, lemon juice, 2 tbsp warm water, minced garlic, and salt together in a small bowl until smooth and creamy.' },
      { stepNumber: 5, description: 'Assemble bowls: base with cooked quinoa and greens, arrange roasted sweet potatoes, crispy chickpeas, and avocado slices on top. Drizzle generously with tahini dressing.' },
    ],
  },
  {
    title: 'Artisan Sourdough Bread',
    description: 'Classic rustic sourdough boule featuring a crackling blistered crust, airy open crumb, and the unmistakable tangy wild-yeast aroma.',
    cookingTime: 180,
    difficulty: 'Hard',
    servings: 10,
    tags: ['bread', 'baking', 'sourdough', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 160, protein: 5, carbs: 32, fats: 1 },
    ingredients: [
      { name: 'Unbleached bread flour', quantity: '500', unit: 'grams' },
      { name: 'Lukewarm water (78°F / 25°C)', quantity: '350', unit: 'grams' },
      { name: 'Active bubbly sourdough starter (100% hydration)', quantity: '100', unit: 'grams' },
      { name: 'Fine sea salt', quantity: '10', unit: 'grams' },
      { name: 'Rice flour for dusting banneton', quantity: '2', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Autolyse: In a large glass bowl, combine bread flour and 330g water until no dry flour remains. Cover and rest for 45 minutes.' },
      { stepNumber: 2, description: 'Add active sourdough starter, salt, and remaining 20g water. Dimple into dough and mix thoroughly until smooth and elastic.' },
      { stepNumber: 3, description: 'Bulk Fermentation: Perform 4 sets of stretch-and-folds every 30 minutes. Let dough rise at room temperature for 4 hours until increased by 50% with visible bubbles.' },
      { stepNumber: 4, description: 'Pre-shape dough into a round ball on a lightly floured surface. Rest uncovered 20 minutes, then final shape into a tight boule and place upside down into a rice-floured banneton basket.' },
      { stepNumber: 5, description: 'Cover and refrigerate overnight (12-16 hours) for cold retarding and flavor development.' },
      { stepNumber: 6, description: 'Preheat a heavy Dutch oven at 500°F (260°C) for 45 minutes. Turn dough onto parchment paper, score the top with a razor blade, and transfer into the Dutch oven. Bake 20 minutes covered, then 20 minutes uncovered at 450°F (230°C) until deep mahogany brown.' },
    ],
  },
  {
    title: 'Spicy Shrimp Tacos',
    description: 'Chili-lime seasoned jumbo shrimp seared in cast iron, nestled in warm corn tortillas with shredded purple cabbage, avocado crema, and cotija cheese.',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 3,
    tags: ['seafood', 'shrimp', 'tacos', 'mexican', 'spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 310, protein: 22, carbs: 24, fats: 13 },
    ingredients: [
      { name: 'Jumbo raw shrimp, peeled and deveined', quantity: '1', unit: 'lb' },
      { name: 'Chili powder, cumin & garlic powder mix', quantity: '1.5', unit: 'tbsp' },
      { name: 'Limes, juiced', quantity: '2', unit: 'whole' },
      { name: 'Corn tortillas', quantity: '6', unit: 'pieces' },
      { name: 'Shredded red cabbage', quantity: '2', unit: 'cups' },
      { name: 'Ripe avocado', quantity: '1', unit: 'whole' },
      { name: 'Sour cream or Greek yogurt', quantity: '1/3', unit: 'cup' },
      { name: 'Fresh cilantro, chopped', quantity: '1/4', unit: 'cup' },
      { name: 'Cotija cheese, crumbled', quantity: '1/4', unit: 'cup' },
    ],
    instructions: [
      { stepNumber: 1, description: 'In a bowl, toss shrimp with chili powder spice blend, 1 tbsp olive oil, juice of 1 lime, and 1/2 tsp salt.' },
      { stepNumber: 2, description: 'Make Avocado Crema: In a food processor, blend avocado, sour cream, remaining lime juice, cilantro, and salt until smooth and velvety.' },
      { stepNumber: 3, description: 'Heat a cast-iron skillet over high heat with 1 tbsp oil. Cook shrimp in a single layer for 2 minutes per side until pink and slightly charred.' },
      { stepNumber: 4, description: 'Warm corn tortillas over an open flame or dry skillet for 30 seconds per side until pliable and fragrant.' },
      { stepNumber: 5, description: 'Assemble tacos: Layer shredded cabbage onto tortillas, top with seared spicy shrimp, generous drizzle of avocado crema, crumbled cotija, and lime wedges.' },
    ],
  },
  {
    title: 'Spicy Butter Chicken (Murgh Makhani)',
    description: 'Tender spiced chicken thighs simmered in an opulent, velvety tomato, butter, and cream curry infused with aromatic fenugreek leaves.',
    cookingTime: 45,
    difficulty: 'Medium',
    servings: 4,
    tags: ['indian', 'chicken', 'curry', 'spicy', 'creamy'],
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 510, protein: 32, carbs: 12, fats: 38 },
    ingredients: [
      { name: 'Boneless chicken thighs, cut into bite-sized chunks', quantity: '1.5', unit: 'lbs' },
      { name: 'Plain Greek yogurt', quantity: '1/2', unit: 'cup' },
      { name: 'Ginger-garlic paste', quantity: '2', unit: 'tbsp' },
      { name: 'Garam masala & Kashmiri red chili powder', quantity: '2', unit: 'tsp each' },
      { name: 'Unsalted butter', quantity: '4', unit: 'tbsp' },
      { name: 'Crushed canned tomato puree', quantity: '1.5', unit: 'cups' },
      { name: 'Heavy whipping cream', quantity: '3/4', unit: 'cup' },
      { name: 'Kasuri Methi (dried fenugreek leaves), crushed', quantity: '1', unit: 'tbsp' },
      { name: 'Fresh cilantro for garnish', quantity: '2', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Marinate chicken in yogurt, 1 tbsp ginger-garlic paste, 1 tsp garam masala, 1 tsp chili powder, and salt for at least 30 minutes.' },
      { stepNumber: 2, description: 'Heat 1 tbsp butter in a deep heavy pan over high heat. Sear chicken pieces for 3-4 minutes on each side until charred; remove to a plate (they will finish cooking in sauce).' },
      { stepNumber: 3, description: 'Melt remaining butter in the same pan. Sauté the rest of the ginger-garlic paste, then pour in tomato puree, chili powder, and cumin. Simmer for 12 minutes.' },
      { stepNumber: 4, description: 'Blend sauce with an immersion blender until completely smooth. Stir in heavy cream and crushed Kasuri Methi.' },
      { stepNumber: 5, description: 'Return browned chicken pieces to the simmering sauce and cook for 8-10 minutes until chicken is tender. Garnish with cream swirl and fresh cilantro, served with garlic naan.' },
    ],
  },
  {
    title: 'Keto Avocado Bacon Salad',
    description: 'Crisp butter lettuce layered with thick-cut smoked bacon, ripe avocado cubes, hard-boiled eggs, cherry tomatoes, and homemade Dijon vinaigrette.',
    cookingTime: 15,
    difficulty: 'Easy',
    servings: 2,
    tags: ['salad', 'healthy', 'keto', 'low-carb', 'bacon', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 460, protein: 18, carbs: 5, fats: 42 },
    ingredients: [
      { name: 'Crisp butter lettuce or romaine hearts', quantity: '4', unit: 'cups' },
      { name: 'Ripe Hass avocado, cubed', quantity: '1', unit: 'large' },
      { name: 'Thick-cut applewood smoked bacon, cooked crispy and crumbled', quantity: '5', unit: 'slices' },
      { name: 'Hard-boiled eggs, quartered', quantity: '2', unit: 'whole' },
      { name: 'Heirloom cherry tomatoes, halved', quantity: '1/2', unit: 'cup' },
      { name: 'Extra virgin olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'Red wine vinegar', quantity: '1', unit: 'tbsp' },
      { name: 'Dijon mustard', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Wash and thoroughly dry butter lettuce leaves. Tear into bite-sized pieces and spread across a wide serving platter.' },
      { stepNumber: 2, description: 'Arrange rows of cubed avocado, quartered eggs, crispy crumbled bacon, and halved cherry tomatoes over the greens.' },
      { stepNumber: 3, description: 'In a mason jar, combine extra virgin olive oil, red wine vinegar, Dijon mustard, sea salt, and black pepper. Shake vigorously for 15 seconds until emulsified.' },
      { stepNumber: 4, description: 'Drizzle vinaigrette over the salad right before serving and enjoy fresh.' },
    ],
  },
  {
    title: 'Gluten-Free Chocolate Fudge Brownies',
    description: 'Ultra-fudgy, crackly-topped dark chocolate brownies made with almond flour and rich Dutch-process cocoa powder.',
    cookingTime: 35,
    difficulty: 'Easy',
    servings: 9,
    tags: ['dessert', 'baking', 'gluten-free', 'chocolate'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 240, protein: 5, carbs: 22, fats: 16 },
    ingredients: [
      { name: 'Bittersweet dark chocolate (70%), chopped', quantity: '6', unit: 'oz' },
      { name: 'Unsalted butter or coconut oil', quantity: '1/2', unit: 'cup' },
      { name: 'Granulated sugar', quantity: '3/4', unit: 'cup' },
      { name: 'Large eggs at room temperature', quantity: '3', unit: 'whole' },
      { name: 'Super-fine blanched almond flour', quantity: '1/2', unit: 'cup' },
      { name: 'Dutch-process cocoa powder', quantity: '1/4', unit: 'cup' },
      { name: 'Vanilla extract', quantity: '1', unit: 'tsp' },
      { name: 'Flaky sea salt', quantity: '1/2', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 350°F (175°C). Line an 8x8 inch square baking pan with parchment paper, leaving overhang edges for easy removal.' },
      { stepNumber: 2, description: 'Melt chopped dark chocolate and butter together in a heatproof bowl set over simmering water (or microwave in 20-second bursts), stirring until silky smooth. Allow to cool slightly.' },
      { stepNumber: 3, description: 'In a separate bowl, vigorously whisk eggs and sugar for 3 full minutes until pale, frothy, and doubled in volume (this creates the signature shiny crackly top).' },
      { stepNumber: 4, description: 'Gently fold melted chocolate mixture and vanilla extract into the whipped eggs.' },
      { stepNumber: 5, description: 'Sift in almond flour, cocoa powder, and salt. Fold with a rubber spatula just until no dry pockets remain.' },
      { stepNumber: 6, description: 'Pour batter into prepared pan. Bake for 22-25 minutes until center is just set. Cool completely before slicing into 9 decadent squares.' },
    ],
  },
  {
    title: 'Creamy Wild Mushroom Risotto',
    description: 'Slow-simmered Arborio rice cooked in rich vegetable broth with sautéed cremini, shiitake mushrooms, white wine, and fresh Parmigiano-Reggiano.',
    cookingTime: 40,
    difficulty: 'Medium',
    servings: 4,
    tags: ['vegetarian', 'risotto', 'italian', 'mushrooms'],
    imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 380, protein: 9, carbs: 54, fats: 14 },
    ingredients: [
      { name: 'Arborio risotto rice', quantity: '1.5', unit: 'cups' },
      { name: 'Mixed wild mushrooms (shiitake, cremini, oyster), sliced', quantity: '8', unit: 'oz' },
      { name: 'Shallots, finely minced', quantity: '2', unit: 'whole' },
      { name: 'Dry white wine (Sauvignon Blanc or Pinot Grigio)', quantity: '1/2', unit: 'cup' },
      { name: 'Low-sodium vegetable or mushroom broth, kept warm', quantity: '5', unit: 'cups' },
      { name: 'Freshly grated Parmigiano-Reggiano', quantity: '3/4', unit: 'cup' },
      { name: 'Butter', quantity: '3', unit: 'tbsp' },
      { name: 'Fresh thyme leaves', quantity: '1', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'In a wide heavy skillet, melt 1 tbsp butter over high heat. Add sliced mushrooms and thyme; sauté for 5 minutes until browned and caramelized. Transfer mushrooms to a plate.' },
      { stepNumber: 2, description: 'In the same skillet, melt remaining 2 tbsp butter over medium heat. Add minced shallots and cook 2 minutes until translucent.' },
      { stepNumber: 3, description: 'Add Arborio rice and toast for 2 minutes, stirring constantly until the grains become translucent around edges with a pearl center.' },
      { stepNumber: 4, description: 'Pour in white wine and stir until completely absorbed by the rice.' },
      { stepNumber: 5, description: 'Add warm broth one ladleful at a time (about 1/2 cup), stirring frequently and waiting until the liquid is absorbed before adding the next ladle (approx. 18-20 minutes total).' },
      { stepNumber: 6, description: 'When rice is creamy yet al dente, remove from heat. Stir in sautéed mushrooms, grated Parmigiano-Reggiano, salt, and pepper. Rest covered for 2 minutes before serving.' },
    ],
  },
  {
    title: 'Slow Cooked Beef Birria Tacos',
    description: 'Tender braised beef chuck roast simmered in an authentic guajillo and ancho chili broth, stuffed in corn tortillas with melted Oaxaca cheese and served with dipping consommé.',
    cookingTime: 180,
    difficulty: 'Hard',
    servings: 6,
    tags: ['mexican', 'beef', 'tacos', 'slow-cooker', 'spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 540, protein: 38, carbs: 28, fats: 32 },
    ingredients: [
      { name: 'Beef chuck roast, cut into large chunks', quantity: '3', unit: 'lbs' },
      { name: 'Dried Guajillo chilies, stemmed and seeded', quantity: '5', unit: 'pods' },
      { name: 'Dried Ancho chilies, stemmed and seeded', quantity: '3', unit: 'pods' },
      { name: 'Roma tomatoes, halved', quantity: '2', unit: 'whole' },
      { name: 'Cinnamon stick', quantity: '1', unit: 'piece' },
      { name: 'Apple cider vinegar', quantity: '2', unit: 'tbsp' },
      { name: 'Beef broth', quantity: '4', unit: 'cups' },
      { name: 'Corn tortillas', quantity: '12', unit: 'pieces' },
      { name: 'Oaxaca or Monterey Jack cheese, shredded', quantity: '2', unit: 'cups' },
      { name: 'Diced white onion and fresh cilantro', quantity: '1/2', unit: 'cup each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Toast dried guajillo and ancho chilies in a dry pan for 1 minute until fragrant. Transfer to a pot with tomatoes and simmer in 2 cups broth for 10 minutes until soft.' },
      { stepNumber: 2, description: 'Blend softened chilies, tomatoes, apple cider vinegar, 4 garlic cloves, cumin, oregano, and cinnamon with 1 cup broth until completely smooth to create the adobo sauce.' },
      { stepNumber: 3, description: 'Season beef chunks heavily with salt and sear in a Dutch oven until browned on all sides.' },
      { stepNumber: 4, description: 'Pour adobo sauce and remaining beef broth over the meat. Cover and slow simmer on low heat for 3 hours (or slow cooker for 6 hours) until the beef falls apart effortlessly.' },
      { stepNumber: 5, description: 'Shred the beef with two forks and skim the red chili oil from top of the broth into a bowl.' },
      { stepNumber: 6, description: 'Dip corn tortillas into the chili oil, place on a hot flat skillet, top with shredded cheese and juicy birria beef, fold over and fry until crispy on both sides. Serve with a hot cup of rich beef consommé for dipping.' },
    ],
  },
  {
    title: 'Street Style Shrimp Pad Thai',
    description: 'Classic Thai stir-fried rice noodles tossed with plump shrimp, tofu, scrambled eggs, bean sprouts, crushed peanuts, and tangy tamarind sauce.',
    cookingTime: 25,
    difficulty: 'Medium',
    servings: 3,
    tags: ['thai', 'noodles', 'street-food', 'shrimp'],
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 430, protein: 24, carbs: 58, fats: 12 },
    ingredients: [
      { name: 'Flat rice Pad Thai noodles, soaked in warm water for 30 mins', quantity: '8', unit: 'oz' },
      { name: 'Jumbo shrimp, peeled and deveined', quantity: '1/2', unit: 'lb' },
      { name: 'Extra-firm tofu, cubed', quantity: '4', unit: 'oz' },
      { name: 'Tamarind paste concentrate', quantity: '2', unit: 'tbsp' },
      { name: 'Fish sauce', quantity: '2', unit: 'tbsp' },
      { name: 'Palm sugar or brown sugar', quantity: '2', unit: 'tbsp' },
      { name: 'Eggs, lightly beaten', quantity: '2', unit: 'whole' },
      { name: 'Fresh bean sprouts and garlic chives', quantity: '1.5', unit: 'cups' },
      { name: 'Roasted peanuts, crushed', quantity: '1/4', unit: 'cup' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Make Pad Thai Sauce: Whisk tamarind paste, fish sauce, palm sugar, and 2 tbsp water in a small saucepan over low heat until sugar dissolves. Set aside.' },
      { stepNumber: 2, description: 'Heat 2 tbsp oil in a large wok over high heat. Add shrimp and cubed tofu; stir-fry for 2 minutes until shrimp turns pink. Push to the side of the wok.' },
      { stepNumber: 3, description: 'Crack eggs into empty side of wok and scramble quickly until set.' },
      { stepNumber: 4, description: 'Add drained rice noodles and pour Pad Thai sauce over everything. Stir-fry vigorously using tongs for 2-3 minutes until noodles absorb sauce and turn tender.' },
      { stepNumber: 5, description: 'Toss in bean sprouts and garlic chives for 30 seconds. Remove from heat and serve with crushed roasted peanuts, lime wedges, and chili flakes.' },
    ],
  },
  {
    title: 'Lemon Glazed Blueberry Scones',
    description: 'Tender, flaky British bakery scones packed with fresh juicy blueberries and finished with a zesty lemon sugar glaze.',
    cookingTime: 30,
    difficulty: 'Easy',
    servings: 8,
    tags: ['breakfast', 'baking', 'blueberry', 'scones'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 290, protein: 4, carbs: 42, fats: 12 },
    ingredients: [
      { name: 'All-purpose flour', quantity: '2', unit: 'cups' },
      { name: 'Granulated sugar', quantity: '1/3', unit: 'cup' },
      { name: 'Baking powder', quantity: '1', unit: 'tbsp' },
      { name: 'Cold unsalted butter, grated or cubed', quantity: '1/2', unit: 'cup (1 stick)' },
      { name: 'Fresh organic blueberries', quantity: '1', unit: 'cup' },
      { name: 'Heavy whipping cream (plus extra for brushing)', quantity: '1/2', unit: 'cup' },
      { name: 'Large egg', quantity: '1', unit: 'whole' },
      { name: 'Lemon zest and fresh juice', quantity: '1', unit: 'lemon' },
      { name: 'Powdered sugar for glaze', quantity: '3/4', unit: 'cup' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.' },
      { stepNumber: 2, description: 'In a large bowl, whisk flour, sugar, baking powder, salt, and lemon zest. Cut in cold butter with a pastry cutter until crumbly with pea-sized pieces.' },
      { stepNumber: 3, description: 'Gently fold fresh blueberries into the flour mixture.' },
      { stepNumber: 4, description: 'Whisk heavy cream and egg together in a measuring cup. Pour into flour mixture and stir gently with a fork until dough barely comes together.' },
      { stepNumber: 5, description: 'Transfer dough to a floured counter and pat into an 8-inch round disc (3/4-inch thick). Cut into 8 equal triangular wedges. Brush tops with cream.' },
      { stepNumber: 6, description: 'Bake for 18-20 minutes until golden on top. Cool on wire rack, then drizzle with glaze made by whisking powdered sugar with 2 tbsp lemon juice.' },
    ],
  },
  {
    title: 'Sweet Potato & Chickpea Coconut Curry',
    description: 'A comforting, creamy plant-based Indian curry packed with tender sweet potato chunks, hearty chickpeas, fresh spinach, and rich coconut milk.',
    cookingTime: 35,
    difficulty: 'Easy',
    servings: 4,
    tags: ['vegan', 'vegetarian', 'curry', 'sweet-potato'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 390, protein: 11, carbs: 48, fats: 18 },
    ingredients: [
      { name: 'Sweet potato, peeled and cut into 1-inch chunks', quantity: '2', unit: 'medium' },
      { name: 'Canned chickpeas, rinsed and drained', quantity: '1', unit: 'can (15oz)' },
      { name: 'Full-fat canned coconut milk', quantity: '1', unit: 'can (14oz)' },
      { name: 'Diced canned tomatoes', quantity: '1', unit: 'can (14oz)' },
      { name: 'Yellow onion, diced', quantity: '1', unit: 'whole' },
      { name: 'Fresh ginger, grated', quantity: '1', unit: 'tbsp' },
      { name: 'Curry powder and ground turmeric', quantity: '1.5', unit: 'tbsp' },
      { name: 'Fresh baby spinach', quantity: '2', unit: 'cups' },
      { name: 'Coconut oil', quantity: '1', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Heat coconut oil in a large pot over medium heat. Sauté diced onion and grated ginger for 4 minutes until soft and fragrant.' },
      { stepNumber: 2, description: 'Stir in curry powder, turmeric, and cumin, toasting the spices for 1 minute.' },
      { stepNumber: 3, description: 'Add sweet potato chunks, drained chickpeas, diced tomatoes, and coconut milk. Stir well and bring to a gentle boil.' },
      { stepNumber: 4, description: 'Reduce heat to low, cover with a lid, and simmer for 20 minutes until sweet potatoes are fork-tender.' },
      { stepNumber: 5, description: 'Stir in fresh baby spinach and cook for 2 minutes until wilted. Season with lime juice and salt. Serve over steamed Jasmine rice.' },
    ],
  },
  {
    title: 'Mediterranean Greek Quinoa Bowl',
    description: 'Wholesome Mediterranean grain bowl featuring fluffy quinoa, crisp Persian cucumbers, Kalamata olives, cherry tomatoes, and creamy feta cheese in herb dressing.',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 2,
    tags: ['salad', 'healthy', 'greek', 'quinoa'],
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 360, protein: 12, carbs: 42, fats: 16 },
    ingredients: [
      { name: 'Cooked white quinoa, cooled', quantity: '2', unit: 'cups' },
      { name: 'Persian cucumbers, diced', quantity: '2', unit: 'whole' },
      { name: 'Cherry tomatoes, halved', quantity: '1', unit: 'cup' },
      { name: 'Kalamata olives, pitted and sliced', quantity: '1/3', unit: 'cup' },
      { name: 'Greek feta cheese block, crumbled', quantity: '1/2', unit: 'cup' },
      { name: 'Red onion, thinly shaved', quantity: '1/4', unit: 'cup' },
      { name: 'Extra virgin olive oil', quantity: '3', unit: 'tbsp' },
      { name: 'Red wine vinegar and dried oregano', quantity: '1', unit: 'tbsp each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'In a small bowl or jar, whisk olive oil, red wine vinegar, dried oregano, salt, and black pepper to create the Greek dressing.' },
      { stepNumber: 2, description: 'Divide cooked quinoa evenly between two shallow serving bowls.' },
      { stepNumber: 3, description: 'Arrange diced cucumbers, cherry tomatoes, Kalamata olives, and red onion over the quinoa in colorful sections.' },
      { stepNumber: 4, description: 'Crumble fresh feta cheese over the top.' },
      { stepNumber: 5, description: 'Drizzle dressing evenly over each bowl and toss before eating.' },
    ],
  },
  {
    title: 'Classic French Onion Soup',
    description: 'Deeply caramelized sweet onions slow-cooked in rich beef and thyme broth, topped with toasted baguette slices and melted Gruyère cheese.',
    cookingTime: 60,
    difficulty: 'Medium',
    servings: 4,
    tags: ['soup', 'french', 'onion', 'comfort-food'],
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 340, protein: 16, carbs: 32, fats: 16 },
    ingredients: [
      { name: 'Yellow sweet onions, thinly sliced', quantity: '4', unit: 'large (approx 3 lbs)' },
      { name: 'Unsalted butter', quantity: '3', unit: 'tbsp' },
      { name: 'Dry white wine or dry sherry', quantity: '1/2', unit: 'cup' },
      { name: 'Rich beef bone broth', quantity: '6', unit: 'cups' },
      { name: 'Fresh thyme sprigs & 1 bay leaf', quantity: '4', unit: 'sprigs' },
      { name: 'French baguette, sliced into 1-inch rounds', quantity: '8', unit: 'slices' },
      { name: 'Gruyère cheese, freshly shredded', quantity: '1.5', unit: 'cups' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Melt butter in a large Dutch oven over medium-low heat. Add all sliced onions and 1/2 tsp salt.' },
      { stepNumber: 2, description: 'Slow-cook onions for 40-45 minutes, stirring every few minutes, until they turn a deep, golden mahogany brown and sweet.' },
      { stepNumber: 3, description: 'Pour in white wine to deglaze the pot, scraping up all browned flavor fond from the bottom. Simmer for 2 minutes.' },
      { stepNumber: 4, description: 'Add beef broth, fresh thyme sprigs, and bay leaf. Bring to a simmer, then reduce heat and cook for 20 minutes to meld flavors.' },
      { stepNumber: 5, description: 'Toast baguette slices under a broiler until golden.' },
      { stepNumber: 6, description: 'Ladle hot soup into oven-safe ceramic ramekins. Float 2 baguette slices on top and cover generously with shredded Gruyère. Broil for 3-4 minutes until cheese is bubbly and golden brown.' },
    ],
  },
  {
    title: 'Garlic Butter Steak Bites',
    description: 'Juicy, tender sirloin steak cubed and seared in a smoking hot cast-iron skillet, smothered in garlic herb butter.',
    cookingTime: 15,
    difficulty: 'Easy',
    servings: 3,
    tags: ['steak', 'beef', 'garlic', 'quick', 'keto'],
    imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 390, protein: 36, carbs: 2, fats: 26 },
    ingredients: [
      { name: 'Top sirloin or ribeye steak, cut into 1-inch cubes', quantity: '1.5', unit: 'lbs' },
      { name: 'Olive oil', quantity: '1', unit: 'tbsp' },
      { name: 'Unsalted butter', quantity: '3', unit: 'tbsp' },
      { name: 'Garlic cloves, minced', quantity: '4', unit: 'cloves' },
      { name: 'Fresh rosemary and parsley, chopped', quantity: '1', unit: 'tbsp each' },
      { name: 'Coarse sea salt and cracked black pepper', quantity: '1', unit: 'tsp each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Pat steak cubes dry with paper towels and season generously with coarse salt and black pepper on all sides.' },
      { stepNumber: 2, description: 'Heat olive oil in a cast-iron skillet over high heat until smoking hot.' },
      { stepNumber: 3, description: 'Add steak cubes in a single layer (do not overcrowd; work in batches if needed). Sear undisturbed for 2 minutes to get a golden crust, then flip and cook 2 minutes more for medium-rare.' },
      { stepNumber: 4, description: 'Reduce heat to low. Add butter, minced garlic, and fresh rosemary to the skillet.' },
      { stepNumber: 5, description: 'Baste steak bites with the foaming garlic herb butter for 1 minute. Remove from heat, garnish with fresh parsley, and serve immediately.' },
    ],
  },
  {
    title: 'Ceremonial Iced Matcha Green Tea Latte',
    description: 'Vibrant Japanese ceremonial grade Uji matcha whisked with warm water and poured over ice and creamy oat milk with a hint of vanilla.',
    cookingTime: 5,
    difficulty: 'Easy',
    servings: 1,
    tags: ['matcha', 'drink', 'healthy', 'vegan'],
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 120, protein: 3, carbs: 16, fats: 4 },
    ingredients: [
      { name: 'Ceremonial grade Japanese Matcha powder', quantity: '1.5', unit: 'tsp' },
      { name: 'Hot water (175°F / 80°C - not boiling)', quantity: '1/4', unit: 'cup' },
      { name: 'Barista oat milk or almond milk', quantity: '3/4', unit: 'cup' },
      { name: 'Pure maple syrup or vanilla syrup', quantity: '1', unit: 'tbsp' },
      { name: 'Ice cubes', quantity: '1', unit: 'cup' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Sift matcha powder through a fine mesh strainer into a shallow tea bowl (chawan) to eliminate clumps.' },
      { stepNumber: 2, description: 'Pour in hot water (175°F). Using a bamboo whisk (chasen), whisk briskly in a W-shaped motion for 30-45 seconds until a dense, velvety green micro-foam forms on top.' },
      { stepNumber: 3, description: 'Fill a tall glass to the brim with fresh ice cubes.' },
      { stepNumber: 4, description: 'Pour oat milk and sweetener over the ice.' },
      { stepNumber: 5, description: 'Slowly pour the whisked green matcha over the milk for an aesthetic two-toned layered presentation. Stir before sipping.' },
    ],
  },
  {
    title: 'Authentic Spicy Shakshuka with Feta',
    description: 'Poached eggs nestled in a smoky, spicy skillet stew of sweet bell peppers, crushed tomatoes, harissa paste, and crumbled creamy feta cheese.',
    cookingTime: 25,
    difficulty: 'Easy',
    servings: 3,
    tags: ['breakfast', 'eggs', 'shakshuka', 'spicy'],
    imageUrl: 'https://images.unsplash.com/photo-1590412200988-a436bb705300?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 260, protein: 14, carbs: 18, fats: 15 },
    ingredients: [
      { name: 'Large fresh eggs', quantity: '4', unit: 'whole' },
      { name: 'Whole peeled San Marzano tomatoes, crushed by hand', quantity: '1', unit: 'can (28oz)' },
      { name: 'Red bell pepper, thinly sliced', quantity: '1', unit: 'large' },
      { name: 'Yellow onion, chopped', quantity: '1', unit: 'medium' },
      { name: 'Harissa paste or chili paste', quantity: '1.5', unit: 'tbsp' },
      { name: 'Ground cumin & smoked paprika', quantity: '1', unit: 'tsp each' },
      { name: 'Feta cheese, crumbled', quantity: '1/3', unit: 'cup' },
      { name: 'Fresh cilantro and crusty bread to serve', quantity: '1', unit: 'portion' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Heat 2 tbsp olive oil in a large cast-iron skillet over medium heat. Sauté sliced bell pepper and onions for 6 minutes until soft and caramelized.' },
      { stepNumber: 2, description: 'Add minced garlic, harissa paste, ground cumin, and smoked paprika. Stir continuously for 1 minute to bloom spices.' },
      { stepNumber: 3, description: 'Pour in crushed tomatoes and season with salt and pepper. Simmer gently for 10 minutes until sauce thickens.' },
      { stepNumber: 4, description: 'Use the back of a large spoon to make 4 small wells in the sauce. Crack one egg into each well.' },
      { stepNumber: 5, description: 'Cover the skillet with a lid and cook on medium-low heat for 5-7 minutes until egg whites are set and yolks remain soft and runny.' },
      { stepNumber: 6, description: 'Sprinkle crumbled feta cheese and fresh cilantro over top. Serve straight from skillet with toasted sourdough.' },
    ],
  },
  {
    title: 'Fluffy Blueberry Almond Flour Pancakes',
    description: 'Thick, fluffy gluten-free pancakes loaded with bursting wild blueberries and drizzled with pure amber maple syrup.',
    cookingTime: 20,
    difficulty: 'Easy',
    servings: 2,
    tags: ['breakfast', 'pancakes', 'blueberry', 'quick'],
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 320, protein: 12, carbs: 26, fats: 18 },
    ingredients: [
      { name: 'Super-fine blanched almond flour', quantity: '1.5', unit: 'cups' },
      { name: 'Tapioca starch or arrowroot', quantity: '2', unit: 'tbsp' },
      { name: 'Baking powder', quantity: '1', unit: 'tsp' },
      { name: 'Almond milk or whole milk', quantity: '1/3', unit: 'cup' },
      { name: 'Large eggs', quantity: '2', unit: 'whole' },
      { name: 'Pure maple syrup', quantity: '2', unit: 'tbsp' },
      { name: 'Fresh wild blueberries', quantity: '3/4', unit: 'cup' },
      { name: 'Vanilla extract & cinnamon', quantity: '1', unit: 'tsp each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'In a large bowl, whisk almond flour, tapioca starch, baking powder, and cinnamon together.' },
      { stepNumber: 2, description: 'In a measuring cup, whisk eggs, milk, maple syrup, and vanilla extract until blended.' },
      { stepNumber: 3, description: 'Pour wet ingredients into dry ingredients and mix until a thick, smooth pancake batter forms. Let batter rest for 5 minutes.' },
      { stepNumber: 4, description: 'Heat a non-stick griddle over medium-low heat and grease lightly with butter or coconut oil.' },
      { stepNumber: 5, description: 'Scoop 1/4 cup batter for each pancake onto the griddle. Press 6-8 fresh blueberries into the top of each pancake.' },
      { stepNumber: 6, description: 'Cook 3-4 minutes until bubbles appear on edges, gently flip, and cook 2 minutes more until golden brown. Serve stacked with butter and warm maple syrup.' },
    ],
  },
  {
    title: 'Honey Glazed Teriyaki Salmon Bowl',
    description: 'Pan-seared Atlantic salmon fillet glazed in a homemade sweet-savory teriyaki sauce, served over sushi rice with steamed edamame, cucumber, and pickled ginger.',
    cookingTime: 25,
    difficulty: 'Medium',
    servings: 2,
    tags: ['seafood', 'salmon', 'japanese', 'teriyaki'],
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 490, protein: 34, carbs: 48, fats: 16 },
    ingredients: [
      { name: 'Atlantic salmon fillets, skin on', quantity: '2', unit: 'fillets (6oz each)' },
      { name: 'Low-sodium soy sauce', quantity: '3', unit: 'tbsp' },
      { name: 'Mirin (Japanese sweet cooking wine)', quantity: '2', unit: 'tbsp' },
      { name: 'Honey or brown sugar', quantity: '1.5', unit: 'tbsp' },
      { name: 'Grated fresh ginger & garlic', quantity: '1', unit: 'tsp each' },
      { name: 'Steamed Jasmine or sushi rice', quantity: '2', unit: 'cups' },
      { name: 'Shelled edamame & sliced cucumber', quantity: '1/2', unit: 'cup each' },
      { name: 'Toasted sesame seeds & sliced scallions', quantity: '1', unit: 'tbsp each' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Whisk soy sauce, mirin, honey, grated ginger, and minced garlic together in a small bowl to make teriyaki glaze.' },
      { stepNumber: 2, description: 'Pat salmon dry and season flesh side with salt and pepper.' },
      { stepNumber: 3, description: 'Heat 1 tbsp oil in a non-stick skillet over medium-high heat. Place salmon flesh-side down and sear for 4 minutes until golden crust forms.' },
      { stepNumber: 4, description: 'Flip salmon skin-side down and pour teriyaki glaze into the skillet. Lower heat to medium and spoon bubbling glaze continuously over the salmon for 3 minutes until sauce reduces to a thick glaze and salmon is cooked through.' },
      { stepNumber: 5, description: 'Divide rice into bowls, arrange steamed edamame and cucumber slices, place glazed salmon on top, and spoon remaining pan glaze over everything. Garnish with sesame seeds and scallions.' },
    ],
  },
  {
    title: 'Molten Chocolate Lava Cake',
    description: 'Individual French dark chocolate cakes with firm, cake-like outer edges and a luscious, flowing warm molten chocolate center.',
    cookingTime: 25,
    difficulty: 'Medium',
    servings: 4,
    tags: ['dessert', 'chocolate', 'baking', 'cake'],
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 390, protein: 6, carbs: 38, fats: 24 },
    ingredients: [
      { name: 'High-quality bittersweet chocolate (60-70%), chopped', quantity: '6', unit: 'oz' },
      { name: 'Unsalted butter', quantity: '1/2', unit: 'cup (1 stick)' },
      { name: 'Powdered sugar', quantity: '1/2', unit: 'cup' },
      { name: 'Large eggs + 2 egg yolks', quantity: '2 whole + 2 yolks', unit: 'eggs' },
      { name: 'All-purpose flour', quantity: '6', unit: 'tbsp' },
      { name: 'Vanilla extract & pinch of salt', quantity: '1', unit: 'tsp' },
      { name: 'Vanilla ice cream and fresh raspberries', quantity: '1', unit: 'to serve' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 425°F (220°C). Butter four 6-ounce ceramic ramekins and dust inside thoroughly with cocoa powder, tapping out excess.' },
      { stepNumber: 2, description: 'Melt chopped chocolate and butter in a heatproof bowl over simmering water, stirring until smooth and glossy. Cool for 5 minutes.' },
      { stepNumber: 3, description: 'Whisk powdered sugar, whole eggs, egg yolks, and vanilla extract into the chocolate mixture until blended.' },
      { stepNumber: 4, description: 'Gently fold in flour and salt until just combined with no streaks.' },
      { stepNumber: 5, description: 'Divide batter evenly between prepared ramekins. Place on a baking sheet and bake for exactly 12-14 minutes (sides should be firm and center should still jiggle slightly).' },
      { stepNumber: 6, description: 'Rest 1 minute, run a butter knife gently around edges, and invert onto dessert plates. Dust with powdered sugar and serve immediately with vanilla bean ice cream.' },
    ],
  },
  {
    title: 'Authentic Vietnamese Beef Pho Soup',
    description: 'Traditional aromatic beef noodle soup made by simmering charred ginger, star anise, and beef marrow bones for hours, served with flat rice noodles and thinly sliced ribeye.',
    cookingTime: 120,
    difficulty: 'Hard',
    servings: 4,
    tags: ['soup', 'vietnamese', 'pho', 'beef', 'noodles'],
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 460, protein: 32, carbs: 52, fats: 14 },
    ingredients: [
      { name: 'Beef soup marrow bones', quantity: '3', unit: 'lbs' },
      { name: 'Beef brisket or chuck', quantity: '1', unit: 'lb' },
      { name: 'Thinly sliced raw beef tenderloin / sirloin', quantity: '1/2', unit: 'lb' },
      { name: 'Flat Pho rice noodles', quantity: '12', unit: 'oz' },
      { name: 'Ginger root (halved) & 1 large onion (quartered), charred over open flame', quantity: '1', unit: 'portion' },
      { name: 'Whole spices: 4 star anise, 1 cinnamon stick, 3 cardamom pods, 1 tsp coriander seeds', quantity: '1', unit: 'spice bundle' },
      { name: 'Fish sauce', quantity: '3', unit: 'tbsp' },
      { name: 'Fresh Thai basil, bean sprouts, lime wedges, and sliced jalapeños', quantity: '2', unit: 'cups' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Parboil beef bones in boiling water for 10 minutes to remove impurities. Drain and rinse bones thoroughly under cold water.' },
      { stepNumber: 2, description: 'Char halved ginger and quartered onion over open flame until blackened around edges, then scrape off excess char.' },
      { stepNumber: 3, description: 'In a clean large stockpot, place clean bones, brisket, charred aromatics, toasted whole spice bundle, 4 quarts water, and 1 tbsp salt. Bring to gentle simmer for 3 hours, skimming broth regularly.' },
      { stepNumber: 4, description: 'Remove brisket, slice thinly, and strain broth through a fine-mesh cheesecloth. Season broth with fish sauce and rock sugar.' },
      { stepNumber: 5, description: 'Cook rice noodles in boiling water for 1 minute, then drain and divide among serving bowls.' },
      { stepNumber: 6, description: 'Top noodles with cooked brisket slices and raw beef tenderloin slices. Ladle boiling broth directly over beef (it will cook instantly). Serve with Thai basil, bean sprouts, hoisin sauce, and lime.' },
    ],
  },
  {
    title: 'Thai Sweet Mango Sticky Rice',
    description: 'Traditional Thai dessert of sweet glutinous sticky rice infused with rich coconut cream, paired with fresh, sweet honey mango slices and toasted mung beans.',
    cookingTime: 35,
    difficulty: 'Easy',
    servings: 3,
    tags: ['dessert', 'thai', 'mango', 'sticky-rice'],
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 340, protein: 4, carbs: 64, fats: 8 },
    ingredients: [
      { name: 'Thai glutinous sweet rice (soaked in water 4 hours)', quantity: '1', unit: 'cup' },
      { name: 'Full-fat coconut milk', quantity: '1', unit: 'can (14oz)' },
      { name: 'White sugar', quantity: '1/3', unit: 'cup' },
      { name: 'Salt', quantity: '1/2', unit: 'tsp' },
      { name: 'Ripe sweet Champagne or Honey mangoes, peeled and sliced', quantity: '2', unit: 'whole' },
      { name: 'Tapioca starch (for salted coconut topping)', quantity: '1/2', unit: 'tsp' },
      { name: 'Toasted sesame seeds or split yellow mung beans', quantity: '1', unit: 'tsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Drain soaked sticky rice and steam in a cheesecloth-lined steamer basket over boiling water for 25 minutes until translucent and chewy.' },
      { stepNumber: 2, description: 'In a saucepan, heat 1 cup coconut milk, sugar, and 1/4 tsp salt over low heat until sugar dissolves (do not boil).' },
      { stepNumber: 3, description: 'Transfer hot steamed rice into a bowl, pour hot coconut mixture over the rice, cover with a plate, and let stand for 20 minutes to absorb liquid.' },
      { stepNumber: 4, description: 'Prepare salted coconut sauce: Heat remaining coconut milk, 1/4 tsp salt, and 1/2 tsp tapioca starch until slightly thickened.' },
      { stepNumber: 5, description: 'Serve a mound of sweet warm coconut sticky rice alongside chilled sliced mangoes. Spoon salted coconut cream on top and sprinkle with toasted mung beans.' },
    ],
  },
  {
    title: 'Caprese Stuffed Chicken Breast with Balsamic Glaze',
    description: 'Juicy chicken breasts stuffed with fresh mozzarella, sweet Roma tomato slices, and fragrant basil, pan-seared and drizzled with a tangy balsamic reduction.',
    cookingTime: 30,
    difficulty: 'Easy',
    servings: 4,
    tags: ['chicken', 'caprese', 'italian', 'keto'],
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&auto=format&fit=crop',
    nutritionInfo: { calories: 360, protein: 42, carbs: 6, fats: 18 },
    ingredients: [
      { name: 'Boneless skinless chicken breasts', quantity: '4', unit: 'large' },
      { name: 'Fresh mozzarella cheese, sliced into half-moons', quantity: '4', unit: 'oz' },
      { name: 'Roma tomatoes, thinly sliced', quantity: '2', unit: 'whole' },
      { name: 'Fresh basil leaves', quantity: '12', unit: 'leaves' },
      { name: 'Olive oil', quantity: '2', unit: 'tbsp' },
      { name: 'Italian seasoning & garlic powder', quantity: '1', unit: 'tsp each' },
      { name: 'Balsamic vinegar glaze (reduced)', quantity: '3', unit: 'tbsp' },
    ],
    instructions: [
      { stepNumber: 1, description: 'Preheat oven to 375°F (190°C).' },
      { stepNumber: 2, description: 'Cut a horizontal pocket into the thick side of each chicken breast without cutting all the way through.' },
      { stepNumber: 3, description: 'Stuff each pocket with 2 slices of fresh mozzarella, 2-3 tomato slices, and 3 fresh basil leaves. Secure openings with toothpicks.' },
      { stepNumber: 4, description: 'Season chicken outside with Italian seasoning, garlic powder, salt, and black pepper.' },
      { stepNumber: 5, description: 'Heat olive oil in an oven-safe skillet over medium-high heat. Sear chicken for 3 minutes per side until golden brown.' },
      { stepNumber: 6, description: 'Transfer skillet into the oven and bake for 15 minutes until chicken registers 165°F (74°C) internally. Drizzle with balsamic glaze before serving.' },
    ],
  },
];

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
    console.log('Creating recipes with authentic detailed ingredients & instructions...');
    const createdRecipes = [];
    for (let i = 0; i < recipesData.length; i++) {
      const recipeItem = recipesData[i];
      const author = createdUsers[i % createdUsers.length];
      const recipe = new Recipe({
        ...recipeItem,
        author: author._id,
      });
      await recipe.save();
      createdRecipes.push(recipe);
    }
    console.log(`${createdRecipes.length} distinct detailed recipes created successfully.`);

    // 4. Create Comments & Ratings
    console.log('Seeding comments and ratings...');
    for (const recipe of createdRecipes) {
      const selectedUsers = [...createdUsers].sort(() => 0.5 - Math.random()).slice(0, 3);
      
      for (const user of selectedUsers) {
        if (recipe.author.toString() === user._id.toString()) continue;

        const star = Math.floor(Math.random() * 2) + 4; // 4 or 5
        await Rating.create({
          user: user._id,
          recipe: recipe._id,
          rating: star,
        });

        const text = mockComments[Math.floor(Math.random() * mockComments.length)];
        await Comment.create({
          user: user._id,
          recipe: recipe._id,
          text,
        });
      }

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
