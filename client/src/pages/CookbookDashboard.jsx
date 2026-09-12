import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getImageUrl } from '../services/api';
import { toast } from '../components/Toast';
import { FolderHeart, Plus, Trash2, BookOpen, Utensils, X } from 'lucide-react';

export default function CookbookDashboard() {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedCookbook, setSelectedCookbook] = useState(null);

  // Fetch all cookbooks
  const { data: cookbooks, isLoading, isError } = useQuery({
    queryKey: ['cookbooks'],
    queryFn: async () => {
      const res = await api.get('/cookbooks');
      return res.data;
    },
  });

  // Create cookbook mutation
  const createCookbookMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/cookbooks', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      setNewTitle('');
      setNewDesc('');
      setShowCreateModal(false);
      toast.success('Cookbook collection created!');
    },
    onError: () => {
      toast.error('Failed to create cookbook');
    },
  });

  // Delete cookbook mutation
  const deleteCookbookMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/cookbooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      if (selectedCookbook && selectedCookbook._id === deleteCookbookMutation.variables) {
        setSelectedCookbook(null);
      }
      toast.success('Cookbook collection deleted');
    },
    onError: () => {
      toast.error('Failed to delete cookbook');
    },
  });

  // Remove recipe from cookbook mutation
  const removeRecipeMutation = useMutation({
    mutationFn: async ({ cookbookId, recipeId }) => {
      const res = await api.delete(`/cookbooks/${cookbookId}/recipes/${recipeId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cookbooks'] });
      // Update active viewing cookbook details
      setSelectedCookbook(data);
      toast.success('Recipe removed from cookbook');
    },
    onError: () => {
      toast.error('Failed to remove recipe');
    },
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createCookbookMutation.mutate({ title: newTitle, description: newDesc });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500/10 p-3 rounded-2xl">
            <FolderHeart className="h-6 w-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Cookbook Collections</h1>
            <p className="text-slate-400 text-xs mt-0.5">Organize your saved recipes into custom recipe boxes.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-brand-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Collection</span>
        </button>
      </div>

      {isLoading ? (
        <div className="h-48 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-3xl" />
      ) : isError ? (
        <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <p className="text-red-500 font-bold">Failed to load cookbooks dashboard</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Cookbooks list cards */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">My Collections</h3>
            
            {!cookbooks || !Array.isArray(cookbooks) || cookbooks.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl text-center space-y-3">
                <span className="text-3xl">📂</span>
                <h4 className="font-bold text-sm">No Cookbooks yet</h4>
                <p className="text-xs text-slate-400">Create a collection like "Keto Favorites" to save recipes.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cookbooks.map((cb) => (
                  <div
                    key={cb._id}
                    onClick={() => setSelectedCookbook(cb)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex justify-between items-start ${
                      selectedCookbook?._id === cb._id
                        ? 'bg-brand-50/50 border-brand-300 dark:bg-brand-950/20 dark:border-brand-850'
                        : 'bg-white border-slate-100 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1 select-none flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-slate-850 dark:text-slate-150">{cb.title}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{cb.description || 'No description provided'}</p>
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-brand-500 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full mt-2">
                        {cb.recipes?.length || 0} Recipes
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Delete this entire cookbook collection?')) {
                          deleteCookbookMutation.mutate(cb._id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Delete Cookbook"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Selected Cookbook Details recipes grid */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recipes Inside</h3>

            {!selectedCookbook ? (
              <div className="h-72 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-400 select-none">
                <BookOpen className="h-10 w-10 mb-2" />
                <span className="text-xs">Select a cookbook from the left panel to browse recipes</span>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black">{selectedCookbook.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedCookbook.description || 'Saved recipe collection box.'}</p>
                </div>

                {!selectedCookbook?.recipes || selectedCookbook.recipes.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-2xl text-slate-400">
                    <Utensils className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-semibold">This collection has no recipes yet.</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Explore recipes on the home page and click "Save to Cookbook".</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCookbook.recipes?.map((recipe) => (
                      <div key={recipe._id} className="relative group bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-3 rounded-2xl flex gap-3 hover:shadow-md transition-shadow">
                        <Link to={`/recipes/${recipe._id}`} className="block h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                          <img
                            src={getImageUrl(recipe.imageUrl, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300')}
                            alt={recipe.title}
                            className="h-full w-full object-cover"
                          />
                        </Link>
                        
                        <div className="min-w-0 flex-1 flex flex-col justify-between py-1">
                          <Link to={`/recipes/${recipe._id}`} className="block">
                            <h4 className="font-bold text-xs truncate hover:text-brand-500 transition-colors">
                              {recipe.title}
                            </h4>
                          </Link>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-slate-400">by @{recipe.author?.username || 'chef'}</span>
                            <button
                              onClick={() => removeRecipeMutation.mutate({ cookbookId: selectedCookbook._id, recipeId: recipe._id })}
                              className="text-[10px] font-bold text-rose-500 hover:underline flex items-center gap-1"
                              title="Remove from Cookbook"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE COOKBOOK MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-lg font-black">New Cookbook Box</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-655">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cookbook Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sunday Brunch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-slate-950/40 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  placeholder="e.g. Sweet and savory pancake recipes for cozy weekends..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-850 dark:bg-slate-950/40 text-sm focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={createCookbookMutation.isPending}
                className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-md"
              >
                Create Cookbook Collection
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
