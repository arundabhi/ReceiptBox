import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from '../components/Toast';
import {
  Clock,
  Utensils,
  Gauge,
  Flame,
  Star,
  Trash2,
  Send,
  Plus,
  BookOpen,
  Calendar,
  ChevronRight,
  Heart
} from 'lucide-react';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Checked state lists for interactive checklist mode
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  // Comment input
  const [commentText, setCommentText] = useState('');
  
  // Rating hover and selection states
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Cookbook modal state
  const [showCookbookModal, setShowCookbookModal] = useState(false);

  // Fetch recipe details & comments
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipeDetails', id],
    queryFn: async () => {
      const res = await api.get(`/recipes/${id}`);
      return res.data;
    },
  });

  // Fetch user's cookbooks (for saving to collection)
  const { data: cookbooksList } = useQuery({
    queryKey: ['cookbooks'],
    enabled: isAuthenticated && showCookbookModal,
    queryFn: async () => {
      const res = await api.get('/cookbooks');
      return res.data;
    },
  });

  // Save to Cookbook mutation
  const saveToCookbookMutation = useMutation({
    mutationFn: async ({ cookbookId, recipeId }) => {
      await api.post(`/cookbooks/${cookbookId}/recipes`, { recipeId });
    },
    onSuccess: () => {
      toast.success('Recipe saved to collection!');
      setShowCookbookModal(false);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save recipe');
    },
  });

  // Delete Recipe mutation
  const deleteRecipeMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
      toast.success('Recipe deleted successfully!');
      navigate('/');
    },
    onError: () => {
      toast.error('Failed to delete recipe');
    },
  });

  // Add Comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (text) => {
      const res = await api.post('/comments', { recipeId: id, text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeDetails', id] });
      setCommentText('');
      toast.success('Comment posted!');
    },
    onError: () => {
      toast.error('Failed to post comment');
    },
  });

  // Delete Comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) => {
      await api.delete(`/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipeDetails', id] });
      toast.success('Comment deleted');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });

  // Rate Recipe mutation
  const rateRecipeMutation = useMutation({
    mutationFn: async (stars) => {
      const res = await api.post('/ratings', { recipeId: id, rating: stars });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recipeDetails', id] });
      toast.success(`You rated this recipe ${data.averageRating} stars!`);
    },
    onError: () => {
      toast.error('Failed to submit rating');
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">Recipe Not Found</h2>
        <Link to="/" className="inline-block mt-4 text-xs font-bold text-brand-500">Back to Discovery</Link>
      </div>
    );
  }

  const { recipe, comments } = data;
  const isAuthor = currentUser && recipe.author._id.toString() === currentUser.id;

  const imageSrc = recipe.imageUrl.startsWith('http') ? recipe.imageUrl : `http://localhost:5000${recipe.imageUrl}`;

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  const handleRatingClick = (stars) => {
    if (!isAuthenticated) return toast.info('Please sign in to rate recipes!');
    setUserRating(stars);
    rateRecipeMutation.mutate(stars);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Breadcrumb back */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link to="/" className="hover:text-slate-650 dark:hover:text-slate-300">Discover</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-600 dark:text-slate-300 truncate">{recipe.title}</span>
      </div>

      {/* Main Recipe Info Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover image */}
        <div className="h-96 w-full relative bg-slate-100 dark:bg-slate-800">
          <img src={imageSrc} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          
          {/* Quick floating Actions */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{recipe.title}</h1>
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {recipe.tags.map((tag) => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-brand-500 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated && (
              <button
                onClick={() => setShowCookbookModal(true)}
                className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-white hover:text-slate-900 transition-all shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>Save to Cookbook</span>
              </button>
            )}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Author line and ownership CRUD actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-50 dark:border-slate-850/60">
            <Link to={`/profile/${recipe.author.username}`} className="flex items-center gap-3 group">
              <img
                src={recipe.author.avatar ? (recipe.author.avatar.startsWith('http') ? recipe.author.avatar : `http://localhost:5000${recipe.author.avatar}`) : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={recipe.author.username}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                  @{recipe.author.username}
                </h4>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Author Chef</p>
              </div>
            </Link>

            {isAuthor && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/edit-recipe/${recipe._id}`}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors"
                >
                  Edit Recipe
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm('Are you absolutely sure you want to delete this recipe?')) {
                      deleteRecipeMutation.mutate();
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>

          {/* Description & Metadata cards */}
          <p className="text-slate-655 dark:text-slate-350 text-sm leading-relaxed max-w-3xl">
            {recipe.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Clock className="h-8 w-8 text-brand-500" />
              <div>
                <div className="font-bold text-sm">{recipe.cookingTime} mins</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Cooking Time</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Gauge className="h-8 w-8 text-brand-500" />
              <div>
                <div className="font-bold text-sm">{recipe.difficulty}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Difficulty</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Utensils className="h-8 w-8 text-brand-500" />
              <div>
                <div className="font-bold text-sm">{recipe.servings} people</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Servings</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl flex items-center gap-3">
              <Star className="h-8 w-8 text-brand-500 fill-brand-500/20" />
              <div>
                <div className="font-bold text-sm">{recipe.averageRating.toFixed(1)} / 5</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">({recipe.totalRatings} ratings)</div>
              </div>
            </div>
          </div>

          {/* Nutrition dashboard grid */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50 dark:bg-slate-950/20 space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">Nutrition Facts Dashboard</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-2">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{recipe.nutritionInfo?.calories || 0}</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Calories</div>
              </div>
              <div className="text-center p-2 border-l border-slate-200/50 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{recipe.nutritionInfo?.protein || 0}g</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Protein</div>
              </div>
              <div className="text-center p-2 border-l border-slate-200/50 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{recipe.nutritionInfo?.carbs || 0}g</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Carbohydrates</div>
              </div>
              <div className="text-center p-2 border-l border-slate-200/50 dark:border-slate-800">
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{recipe.nutritionInfo?.fats || 0}g</div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Fats</div>
              </div>
            </div>
          </div>

          {/* Ingredients & Steps split */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            
            {/* Ingredients column */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <span>Ingredients</span>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold px-2 py-0.5 rounded-full">
                  Checklist Mode
                </span>
              </h3>
              
              <ul className="space-y-2.5">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    onClick={() => toggleIngredient(idx)}
                    className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850/60 p-3 rounded-xl cursor-pointer hover:border-slate-300 dark:hover:border-slate-750 transition-colors shadow-sm select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedIngredients[idx]}
                      onChange={() => {}} // handled by click of row
                      className="h-4 w-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/20 pointer-events-none"
                    />
                    <span className={`text-sm ${checkedIngredients[idx] ? 'checkbox-checked' : 'text-slate-700 dark:text-slate-350'}`}>
                      <strong className="text-slate-800 dark:text-slate-100 font-semibold">{ing.quantity} {ing.unit}</strong> {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps column */}
            <div className="md:col-span-3 space-y-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <span>Instructions Step-by-Step</span>
              </h3>

              <div className="space-y-4">
                {recipe.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer select-none ${
                      checkedSteps[idx]
                        ? 'bg-slate-105 border-slate-200 dark:bg-slate-950/20 dark:border-slate-850 opacity-50'
                        : 'bg-white border-slate-100 hover:border-slate-250 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700 shadow-sm'
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                      checkedSteps[idx]
                        ? 'bg-slate-200 text-slate-500'
                        : 'bg-brand-500 text-white'
                    }`}>
                      {step.stepNumber}
                    </div>
                    <p className={`text-sm leading-relaxed ${checkedSteps[idx] ? 'line-through text-slate-500' : 'text-slate-750 dark:text-slate-300'}`}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RATINGS FEEDBACK WIDGET */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm text-center space-y-4">
        <h3 className="text-lg font-black">Enjoying this creation? Leave a Star Rating</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Share your feedback. Click stars to submit and recalculate average ratings.
        </p>

        {/* Stars clicker */}
        <div className="flex justify-center items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleRatingClick(star)}
              className="p-1 transition-transform transform active:scale-125"
            >
              <Star className={`h-8 w-8 transition-colors ${
                star <= (hoverRating || userRating || Math.round(recipe.averageRating))
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 dark:text-slate-800'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* COMMENTS LIST & FORM SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
        <h3 className="text-xl font-black">Discussion board ({comments ? comments.length : 0})</h3>
        
        {/* Comment form */}
        {isAuthenticated ? (
          <form onSubmit={handlePostComment} className="flex gap-3">
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              required
            />
            <button
              type="submit"
              disabled={addCommentMutation.isPending}
              className="bg-brand-500 hover:bg-brand-600 text-white p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center shadow-md hover:shadow-brand-500/20 active:scale-95"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-100 dark:border-slate-850 text-center text-xs text-slate-400">
            Please{' '}
            <Link to="/login" className="font-bold text-brand-500 hover:underline">
              login
            </Link>{' '}
            to post opinions and rate recipes.
          </div>
        )}

        {/* Comments listing */}
        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {comments?.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400 font-medium">No remarks written yet. Be the first to start the discussion!</p>
          ) : (
            comments?.map((comment) => {
              const isCommentOwner = currentUser && comment.user._id.toString() === currentUser.id;
              const isCommentRecipeOwner = currentUser && recipe.author._id.toString() === currentUser.id;
              
              const commentAvatar = comment.user.avatar ? (comment.user.avatar.startsWith('http') ? comment.user.avatar : `http://localhost:5000${comment.user.avatar}`) : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100';

              return (
                <div key={comment._id} className="flex gap-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl group/comment">
                  <Link to={`/profile/${comment.user.username}`}>
                    <img
                      src={commentAvatar}
                      alt={comment.user.username}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                  </Link>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <Link to={`/profile/${comment.user.username}`} className="font-bold text-xs text-slate-750 dark:text-slate-200 hover:text-brand-500 transition-colors">
                        @{comment.user.username}
                      </Link>
                      <span className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">{comment.text}</p>
                  </div>

                  {/* Delete own comment */}
                  {(isCommentOwner || isCommentRecipeOwner || currentUser?.role === 'admin') && (
                    <button
                      onClick={() => deleteCommentMutation.mutate(comment._id)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                      title="Delete Comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SAVE TO COOKBOOK MODAL DIALOG */}
      {showCookbookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-brand-500" />
                <span>Save to Collection</span>
              </h3>
              <button
                onClick={() => setShowCookbookModal(false)}
                className="text-slate-400 hover:text-slate-655 font-bold text-xs"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Add this recipe to one of your personal cookbook collections (e.g. Sunday Brunch) to retrieve it easily later.
            </p>

            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {!cookbooksList || cookbooksList.length === 0 ? (
                <div className="text-center py-6 text-slate-405 text-xs font-semibold">
                  You don't have any cookbooks yet! Make one in your <Link to="/cookbooks" className="text-brand-500 hover:underline">dashboard</Link>.
                </div>
              ) : (
                cookbooksList.map((cb) => (
                  <button
                    key={cb._id}
                    onClick={() => saveToCookbookMutation.mutate({ cookbookId: cb._id, recipeId: recipe._id })}
                    disabled={saveToCookbookMutation.isPending}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-500 text-left transition-colors font-medium text-xs dark:bg-slate-950/40"
                  >
                    <span>{cb.title}</span>
                    <span className="text-[10px] text-slate-450 dark:text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      {cb.recipes.length} recipes
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
