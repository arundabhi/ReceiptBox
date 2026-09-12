import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { toast } from '../components/Toast';
import { Plus, Trash2, Camera, Clock, Utensils, Award, Save, Sparkles } from 'lucide-react';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Nutrition states
  const [calories, setCalories] = useState('0');
  const [protein, setProtein] = useState('0');
  const [carbs, setCarbs] = useState('0');
  const [fats, setFats] = useState('0');

  // Dynamic lists states
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
  const [instructions, setInstructions] = useState([{ stepNumber: 1, description: '' }]);

  // Image upload states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch current recipe values
  const { data: recipeData, isLoading, isError } = useQuery({
    queryKey: ['editRecipeDetails', id],
    queryFn: async () => {
      const res = await api.get(`/recipes/${id}`);
      return res.data;
    },
  });

  // Populate form states when data is loaded
  useEffect(() => {
    if (recipeData?.recipe) {
      const { recipe } = recipeData;
      setTitle(recipe.title);
      setDescription(recipe.description);
      setCookingTime(recipe.cookingTime.toString());
      setDifficulty(recipe.difficulty);
      setServings(recipe.servings.toString());
      setTagsInput(recipe.tags ? recipe.tags.join(', ') : '');
      
      if (recipe.nutritionInfo) {
        setCalories(recipe.nutritionInfo.calories.toString());
        setProtein(recipe.nutritionInfo.protein.toString());
        setCarbs(recipe.nutritionInfo.carbs.toString());
        setFats(recipe.nutritionInfo.fats.toString());
      }

      setIngredients(recipe.ingredients);
      setInstructions(recipe.instructions);
      setImagePreview(recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:5000${recipe.imageUrl}`);
    }
  }, [recipeData]);

  // Dropzone callbacks
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  // Dynamic ingredient modifiers
  const handleAddIngredient = () => {
    setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }]);
  };

  const handleRemoveIngredient = (idxToRemove) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleIngredientChange = (idx, field, val) => {
    setIngredients(prev => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  // Dynamic instruction modifiers
  const handleAddStep = () => {
    setInstructions(prev => [...prev, { stepNumber: prev.length + 1, description: '' }]);
  };

  const handleRemoveStep = (idxToRemove) => {
    setInstructions(prev => {
      const filtered = prev.filter((_, idx) => idx !== idxToRemove);
      return filtered.map((step, idx) => ({ ...step, stepNumber: idx + 1 }));
    });
  };

  const handleStepChange = (idx, val) => {
    setInstructions(prev => {
      const copy = [...prev];
      copy[idx].description = val;
      return copy;
    });
  };

  // Recipe edit mutation
  const editRecipeMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await api.put(`/recipes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('Recipe updated successfully!');
      navigate(`/recipes/${id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update recipe');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description || !cookingTime || !servings) {
      return toast.error('Please enter title, description, time, and servings');
    }

    // Validate lists
    const filteredIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());
    if (filteredIngredients.length === 0) {
      return toast.error('Please add at least one valid ingredient');
    }

    const filteredInstructions = instructions.filter(step => step.description.trim());
    if (filteredInstructions.length === 0) {
      return toast.error('Please add at least one valid step instruction');
    }

    // Process Tags
    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t);

    // Build form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('cookingTime', cookingTime);
    formData.append('difficulty', difficulty);
    formData.append('servings', servings);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('ingredients', JSON.stringify(filteredIngredients));
    formData.append('instructions', JSON.stringify(filteredInstructions));
    formData.append('tags', JSON.stringify(tagsArr));
    
    const nutritionInfo = {
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fats: parseInt(fats) || 0,
    };
    formData.append('nutritionInfo', JSON.stringify(nutritionInfo));

    editRecipeMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Failed to load recipe details</h2>
        <button onClick={() => navigate(-1)} className="inline-block mt-4 text-xs font-bold text-brand-500">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Title */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="bg-brand-500/10 p-3 rounded-2xl">
          <Sparkles className="h-6 w-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Edit Your Recipe</h1>
          <p className="text-slate-400 text-xs mt-0.5">Modify ingredients, steps, tags, or cooking metrics.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Core Metadata Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
          {/* Image uploader */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Change Recipe Cover Image (Optional)</label>
            <div
              {...getRootProps()}
              className={`h-56 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center relative overflow-hidden transition-all group ${
                isDragActive
                  ? 'border-brand-500 bg-brand-50/20'
                  : imagePreview
                  ? 'border-slate-200'
                  : 'border-slate-350 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-500 hover:bg-slate-50'
              }`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Camera className="h-8 w-8 mb-2" />
                  <span className="text-sm font-semibold">Drag & drop cover photo here</span>
                  <span className="text-xs text-slate-400 mt-1">Accepts PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recipe Title</label>
            <input
              type="text"
              placeholder="e.g. Creamy Tuscan Chicken Pasta"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea
              placeholder="Tell us about the history of the dish, how it tastes, and why you love it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              required
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Cooking Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Cooking Time (mins)</span>
              </label>
              <input
                type="number"
                placeholder="30"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            {/* Servings */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5 text-slate-400" />
                <span>Servings Count</span>
              </label>
              <input
                type="number"
                placeholder="4"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                min="1"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-slate-400" />
                <span>Difficulty Level</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. Italian, Pasta, Keto, Quick, Dinner"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Ingredients dynamic section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-850">
            <h3 className="text-lg font-black">Ingredients Checklist</h3>
            <button
              type="button"
              onClick={handleAddIngredient}
              className="flex items-center gap-1.5 bg-brand-50 text-brand-500 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add row</span>
            </button>
          </div>

          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                {/* Quantity */}
                <input
                  type="text"
                  placeholder="Qty"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                  className="w-1/4 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />
                
                {/* Unit */}
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                  className="w-1/4 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none"
                />

                {/* Name */}
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                  required
                />

                {/* Remove */}
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions steps section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-850">
            <h3 className="text-lg font-black">Step Instructions</h3>
            <button
              type="button"
              onClick={handleAddStep}
              className="flex items-center gap-1.5 bg-brand-50 text-brand-500 dark:bg-brand-950/40 dark:text-brand-400 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-brand-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add step</span>
            </button>
          </div>

          <div className="space-y-4">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <span className="h-6 w-6 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-2 shadow-sm">
                  {step.stepNumber}
                </span>

                <textarea
                  placeholder="Describe this preparation step..."
                  value={step.description}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
                  required
                />

                {/* Remove */}
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition values section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-4">
          <h3 className="text-lg font-black pb-3 border-b border-slate-50 dark:border-slate-850">Nutrition Facts Panel</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Calories (kcal)</label>
              <input
                type="number"
                placeholder="420"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Protein (g)</label>
              <input
                type="number"
                placeholder="30"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Carbohydrates (g)</label>
              <input
                type="number"
                placeholder="10"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500">Fats (g)</label>
              <input
                type="number"
                placeholder="25"
                value={fats}
                onChange={(e) => setFats(e.target.value)}
                min="0"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={editRecipeMutation.isPending}
            className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-brand-500/25 flex items-center gap-2"
          >
            <Save className="h-4.5 w-4.5" />
            <span>{editRecipeMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
