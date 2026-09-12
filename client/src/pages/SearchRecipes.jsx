import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import { Search, Plus, X, SlidersHorizontal, EyeOff, Eye, Utensils } from 'lucide-react';

export default function SearchRecipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State variables for inputs
  const [queryInput, setQueryInput] = useState(searchParams.get('query') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [maxTime, setMaxTime] = useState(searchParams.get('time') || '');
  const [author, setAuthor] = useState(searchParams.get('author') || '');
  
  // Inclusion / Exclusion ingredients lists
  const [includeInput, setIncludeInput] = useState('');
  const [includes, setIncludes] = useState(() => {
    const inc = searchParams.get('include');
    return inc ? inc.split(',') : [];
  });

  const [excludeInput, setExcludeInput] = useState('');
  const [excludes, setExcludes] = useState(() => {
    const exc = searchParams.get('exclude');
    return exc ? exc.split(',') : [];
  });

  // State to toggle advanced filters drawer
  const [showFilters, setShowFilters] = useState(true);

  // Sync state back to search parameters
  const updateSearchQuery = () => {
    const params = {};
    if (queryInput) params.query = queryInput;
    if (difficulty) params.difficulty = difficulty;
    if (maxTime) params.time = maxTime;
    if (author) params.author = author;
    if (includes.length > 0) params.include = includes.join(',');
    if (excludes.length > 0) params.exclude = excludes.join(',');
    
    setSearchParams(params);
  };

  // Run search query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['searchRecipes', searchParams.toString()],
    queryFn: async () => {
      const res = await api.get('/recipes/search', {
        params: Object.fromEntries(searchParams.entries())
      });
      return res.data;
    },
  });

  // Handle adding inclusion ingredient
  const handleAddInclude = (e) => {
    e.preventDefault();
    const val = includeInput.trim().toLowerCase();
    if (val && !includes.includes(val)) {
      setIncludes(prev => [...prev, val]);
      setIncludeInput('');
    }
  };

  // Handle adding exclusion ingredient
  const handleAddExclude = (e) => {
    e.preventDefault();
    const val = excludeInput.trim().toLowerCase();
    if (val && !excludes.includes(val)) {
      setExcludes(prev => [...prev, val]);
      setExcludeInput('');
    }
  };

  const handleRemoveInclude = (idxToRemove) => {
    setIncludes(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleRemoveExclude = (idxToRemove) => {
    setExcludes(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  // Auto trigger search when params change
  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-brand-500/10 p-3 rounded-2xl">
            <Search className="h-6 w-6 text-brand-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Advanced Recipe Finder</h1>
            <p className="text-slate-400 text-xs mt-0.5">Filter by ingredient exclusions, cooking durations, or difficulty levels.</p>
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-xs font-bold text-slate-655 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 bg-white dark:bg-slate-900 transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>

      {/* FILTER CONTROLS GRID PANEL */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Title / keyword search */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Keyword</label>
              <input
                type="text"
                placeholder="e.g. curry, pizza, chicken"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Any Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Cooking Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Duration ({maxTime || 'any'} mins)</label>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={maxTime || 180}
                onChange={(e) => setMaxTime(e.target.value === '180' ? '' : e.target.value)}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50 dark:border-slate-850/60">
            {/* Include Ingredients */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5 text-emerald-500" />
                <span>Must Contain (Inclusions)</span>
              </label>
              
              <form onSubmit={handleAddInclude} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. rice, chicken, tomato"
                  value={includeInput}
                  onChange={(e) => setIncludeInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-xl transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {/* Inclusions tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {includes.map((ing, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-350 dark:border-emerald-900/40">
                    <span>{ing}</span>
                    <button type="button" onClick={() => handleRemoveInclude(idx)} className="hover:text-emerald-900 dark:hover:text-emerald-250">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Exclude Ingredients */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <EyeOff className="h-3.5 w-3.5 text-rose-500" />
                <span>Must NOT Contain (Exclusions)</span>
              </label>

              <form onSubmit={handleAddExclude} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. onion, mushrooms, garlic"
                  value={excludeInput}
                  onChange={(e) => setExcludeInput(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </form>

              {/* Exclusions tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {excludes.map((ing, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/40 dark:text-rose-350 dark:border-rose-900/40">
                    <span>{ing}</span>
                    <button type="button" onClick={() => handleRemoveExclude(idx)} className="hover:text-rose-900 dark:hover:text-rose-250">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Trigger button */}
          <div className="flex justify-end pt-4 border-t border-slate-50 dark:border-slate-850/60">
            <button
              onClick={updateSearchQuery}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-brand-500/25"
            >
              Search Recipes Now
            </button>
          </div>
        </div>
      )}

      {/* RESULTS GRID VIEW */}
      <div>
        <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
          Results Found ({Array.isArray(data) ? data.length : 0})
        </h3>

        {isLoading ? (
          <RecipeGridSkeleton count={4} />
        ) : isError ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <p className="text-red-500 font-bold">Failed to process aggregation query</p>
          </div>
        ) : !Array.isArray(data) || data.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12">
            <span className="text-4xl">🔍</span>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mt-3 mb-1">No matching recipes</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              We couldn't find any recipes matching your specific inclusion and exclusion parameters. Try relaxing your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
