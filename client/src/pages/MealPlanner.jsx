import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getImageUrl } from '../services/api';
import { toast } from '../components/Toast';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export default function MealPlanner() {
  const queryClient = useQueryClient();

  // State to track current week's starting date (Monday)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  });

  // State for side drawer search
  const [recipeSearch, setRecipeSearch] = useState('');

  // Format date helper
  const formatDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Human friendly dates display
  const getWeekRangeLabel = () => {
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);
    return `${currentWeekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Navigators
  const handlePrevWeek = () => {
    setCurrentWeekStart(prev => {
      const nextDate = new Date(prev);
      nextDate.setDate(nextDate.getDate() - 7);
      return nextDate;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(prev => {
      const nextDate = new Date(prev);
      nextDate.setDate(nextDate.getDate() + 7);
      return nextDate;
    });
  };

  // Fetch current week's meal plan
  const { data: mealPlan, isLoading: loadingPlan } = useQuery({
    queryKey: ['mealPlan', formatDateString(currentWeekStart)],
    queryFn: async () => {
      const res = await api.get('/mealplans', {
        params: { weekStartDate: formatDateString(currentWeekStart) }
      });
      return res.data;
    },
  });

  // Fetch all recipes for draggable side panel drawer
  const { data: recipesData, isLoading: loadingRecipes } = useQuery({
    queryKey: ['recipesListDraggable'],
    queryFn: async () => {
      const res = await api.get('/recipes', { params: { limit: 50 } });
      return res.data.recipes;
    },
  });

  // Add Recipe to MealPlan mutation
  const addMealMutation = useMutation({
    mutationFn: async ({ day, recipeId }) => {
      const res = await api.post('/mealplans', {
        weekStartDate: formatDateString(currentWeekStart),
        day,
        recipeId
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', formatDateString(currentWeekStart)] });
      toast.success('Recipe scheduled in meal plan!');
    },
    onError: () => {
      toast.error('Failed to add recipe to plan');
    },
  });

  // Delete specific Item from MealPlan
  const deleteMealItemMutation = useMutation({
    mutationFn: async (planItemId) => {
      const res = await api.delete('/mealplans/item', {
        params: {
          weekStartDate: formatDateString(currentWeekStart),
          planItemId
        }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', formatDateString(currentWeekStart)] });
      toast.success('Meal removed from plan');
    },
    onError: () => {
      toast.error('Failed to delete meal');
    },
  });

  // Clear entire week plan mutation
  const clearWeeklyPlanMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/mealplans/clear', {
        params: { weekStartDate: formatDateString(currentWeekStart) }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan', formatDateString(currentWeekStart)] });
      toast.success('Weekly calendar cleared!');
    },
    onError: () => {
      toast.error('Failed to clear calendar');
    },
  });

  // Drag start handler (from side panel list)
  const handleDragStart = (e, recipeId) => {
    e.dataTransfer.setData('recipeId', recipeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Drop handler on a calendar slot
  const handleDrop = (e, dayName) => {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData('recipeId');
    if (recipeId) {
      addMealMutation.mutate({ day: dayName, recipeId });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Add click uploader fallback
  const handleAddClick = (dayName, recipeId) => {
    addMealMutation.mutate({ day: dayName, recipeId });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const filteredRecipes = recipesData?.filter(r =>
    r.title.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500/10 p-3 rounded-2xl">
            <CalendarDays className="h-6 w-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Meal Planner</h1>
            <p className="text-slate-400 text-xs mt-0.5">Drag-and-drop recipes onto the days to build your weekly eating schedule.</p>
          </div>
        </div>

        {/* Week navigation control */}
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm">
          <button
            onClick={handlePrevWeek}
            className="p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <span className="text-xs font-bold whitespace-nowrap min-w-[150px] text-center select-none">
            {getWeekRangeLabel()}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-1.5 rounded-lg hover:bg-slate-150 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

        {/* LEFT COLUMN: draggables side list of recipes */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 h-[75vh] flex flex-col">
          <div>
            <h3 className="font-black text-slate-800 dark:text-slate-100">Chef Recipes</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Drag card or tap (+) to schedule on calendar</p>
          </div>

          <input
            type="text"
            placeholder="Search recipes..."
            value={recipeSearch}
            onChange={(e) => setRecipeSearch(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-250 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none"
          />

          {loadingRecipes ? (
            <div className="flex-1 animate-pulse bg-slate-50 dark:bg-slate-950/20 rounded-xl" />
          ) : (
            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
              {filteredRecipes?.map((recipe) => (
                <div
                  key={recipe._id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, recipe._id)}
                  className="flex gap-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 p-2.5 rounded-xl cursor-grab active:cursor-grabbing hover:border-slate-300 dark:hover:border-slate-750 transition-all select-none group relative"
                >
                  <img
                    src={getImageUrl(recipe.imageUrl, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300')}
                    alt={recipe.title}
                    className="h-11 w-11 rounded-lg object-cover shrink-0 bg-slate-100"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <h5 className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate pr-6 group-hover:text-brand-500 transition-colors">
                      {recipe.title}
                    </h5>
                    <span className="text-[9px] text-slate-400 mt-0.5">{recipe.cookingTime} mins | {recipe.difficulty}</span>
                  </div>

                  {/* Drag Handle Icon visual indicator */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-350 flex items-center gap-1">
                    {/* tap adder fallback for mobile */}
                    <div className="dropdown relative group/drop font-bold text-slate-400 hover:text-slate-600 block sm:hidden">
                      <PlusCircle className="h-4 w-4 text-brand-500 pointer-events-auto cursor-pointer" />
                      <div className="absolute right-0 bottom-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-2 hidden group-hover/drop:block z-50 shadow-lg text-[10px] w-28 space-y-1">
                        {daysOfWeek.map(d => (
                          <button
                            key={d}
                            onClick={() => handleAddClick(d, recipe._id)}
                            className="w-full text-left py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded px-1 text-slate-800 dark:text-slate-200"
                          >
                            + {d.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <GripVertical className="h-4 w-4 hidden sm:block" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Calendar schedule grid (Monday to Sunday) */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold select-none">
              <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
              <span>Tip: Drag recipes from the side drawer and drop them onto any day panel below.</span>
            </div>

            {mealPlan?.plans && mealPlan.plans.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear your entire meal plan for this week?')) {
                    clearWeeklyPlanMutation.mutate();
                  }
                }}
                className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1"
              >
                Clear Weekly Calendar
              </button>
            )}
          </div>

          {loadingPlan ? (
            <div className="h-96 animate-pulse bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {daysOfWeek.map((dayName) => {
                // Filter plan items for this day
                const dayMeals = mealPlan?.plans ? mealPlan.plans.filter((p) => p.day === dayName) : [];

                return (
                  <div
                    key={dayName}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dayName)}
                    className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 rounded-2xl p-4 min-h-[220px] shadow-sm flex flex-col justify-between hover:border-brand-300 dark:hover:border-brand-900/60 transition-all duration-300 relative group/day"
                  >
                    <div className="space-y-3 flex-1">
                      {/* Day Header */}
                      <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-850/60 pb-1.5">
                        <span className="font-black text-xs text-slate-800 dark:text-slate-150 uppercase tracking-wider">{dayName.slice(0, 3)}</span>
                        <span className="text-[10px] text-slate-400">{dayName}</span>
                      </div>

                      {/* Meals Scheduled List */}
                      {dayMeals.length === 0 ? (
                        <div className="text-center py-8 text-[10px] text-slate-350 border border-dashed border-slate-100 dark:border-slate-850 rounded-xl select-none flex flex-col items-center justify-center h-full">
                          <span>Empty</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {dayMeals.map((planItem) => {
                            const { recipe, _id: itemId } = planItem;
                            if (!recipe) return null;

                            return (
                              <div
                                key={itemId}
                                className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl p-2 flex flex-col relative group/meal shadow-sm"
                              >
                                <Link to={`/recipes/${recipe._id}`} className="block h-16 rounded-lg overflow-hidden bg-slate-150 mb-1">
                                  <img
                                    src={getImageUrl(recipe.imageUrl, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300')}
                                    alt={recipe.title}
                                    className="h-full w-full object-cover"
                                  />
                                </Link>
                                <Link to={`/recipes/${recipe._id}`} className="block">
                                  <h6 className="font-extrabold text-[9px] line-clamp-1 hover:text-brand-500 leading-tight">
                                    {recipe.title}
                                  </h6>
                                </Link>
                                <span className="text-[8px] text-slate-400">{recipe.cookingTime}m | {recipe.difficulty}</span>

                                {/* Delete button */}
                                <button
                                  onClick={() => deleteMealItemMutation.mutate(itemId)}
                                  className="absolute top-1 right-1 bg-white/70 dark:bg-slate-900/70 p-1 rounded-md text-slate-400 hover:text-rose-500 shadow-sm opacity-0 group-hover/meal:opacity-100 transition-opacity"
                                  title="Remove Meal"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
