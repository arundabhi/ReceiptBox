import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import { Flame, Compass, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function Home() {
  const [page, setPage] = useState(1);
  const [selectedTag, setSelectedTag] = useState('');
  const [sort, setSort] = useState('recent');
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const tagsList = ['Italian', 'Keto', 'Vegan', 'Mexican', 'Dessert', 'Healthy', 'Indian', 'Baking'];

  // Fetch recipes
  const { data, isLoading, isError } = useQuery({
    queryKey: ['recipes', page, selectedTag, sort],
    queryFn: async () => {
      const res = await api.get('/recipes', {
        params: {
          page,
          limit: 8,
          tag: selectedTag,
          sort,
        },
      });
      return res.data;
    },
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleTagToggle = (tag) => {
    setSelectedTag(prev => (prev === tag ? '' : tag));
    setPage(1);
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-brand-950 to-rose-950 text-white py-16 px-6 sm:px-12 text-center overflow-hidden mb-10">
        {/* Abstract lights background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.15),transparent)] pointer-events-none" />
        
        <div className="relative max-w-2xl mx-auto space-y-6">
          <span className="bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            🥗 Instagram for Foodies
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover, Create & Share <br />
            <span className="bg-gradient-to-r from-brand-400 to-rose-400 bg-clip-text text-transparent">
              Delicious Recipes
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
            Welcome to the ultimate social kitchen. Browse tasty plates, follow your favorite home chefs, and plan your weekly meals.
          </p>

          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center bg-white dark:bg-slate-900 p-1.5 rounded-2xl max-w-md mx-auto shadow-xl text-slate-800 dark:text-slate-100">
            <input
              type="text"
              placeholder="Search chicken, pizza, tacos..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none dark:placeholder-slate-500"
            />
            <button
              type="submit"
              className="bg-brand-500 hover:bg-brand-600 text-white p-2.5 rounded-xl transition-all shadow-md hover:shadow-brand-500/20"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* TAG SHORTCUTS / FILTERS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-brand-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Browse Cuisine</h2>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="text-xs font-bold border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 bg-white dark:bg-slate-905 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="recent">Latest Dishes</option>
              <option value="popular">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2">
          {tagsList.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? 'bg-brand-500 border-brand-500 text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-350 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* RECIPES DISPLAY GRID */}
        {isLoading ? (
          <RecipeGridSkeleton count={8} />
        ) : isError ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
            <p className="text-red-500 font-bold mb-2">Oops! Something went wrong.</p>
            <p className="text-slate-400 text-xs">Failed to load recipes. Check your database connection.</p>
          </div>
        ) : data?.recipes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-12">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-lg font-bold mb-1 text-slate-800 dark:text-slate-155">No recipes found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              There are no recipes matching the selected tags right now. Try switching tags or check back later!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {data?.pages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-850">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="h-4.5 w-4.5" />
                </button>
                <span className="text-sm font-semibold">
                  Page {page} of {data.pages}
                </span>
                <button
                  disabled={page === data.pages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
