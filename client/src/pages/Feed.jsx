import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { RecipeGridSkeleton } from '../components/SkeletonLoader';
import { Rss, Sparkles } from 'lucide-react';

export default function Feed() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['feed', page],
    queryFn: async () => {
      const res = await api.get('/feed', { params: { page, limit: 8 } });
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Page Title Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="bg-brand-500/10 p-3 rounded-2xl">
          <Rss className="h-6 w-6 text-brand-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-850 dark:text-slate-100">Social Recipe Feed</h1>
          <p className="text-slate-400 text-xs mt-0.5">Recipes shared by foodies you follow.</p>
        </div>
      </div>

      {isLoading ? (
        <RecipeGridSkeleton count={4} />
      ) : isError ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <p className="text-red-500 font-bold">Failed to load feed</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Fallback Notification Banner */}
          {data?.fallback && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-brand-50 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 p-5 rounded-2xl">
              <span className="text-2xl">✨</span>
              <div className="text-center sm:text-left space-y-1">
                <h4 className="font-bold text-sm text-brand-800 dark:text-brand-350">
                  Your Feed is Empty
                </h4>
                <p className="text-xs text-brand-700/80 dark:text-brand-400/80 max-w-xl">
                  You aren't following anyone yet! We are recommending some popular recent uploads from our chef community to get you started. Go ahead and click user profiles to follow them!
                </p>
              </div>
            </div>
          )}

          {!data?.recipes || data.recipes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-4">🥣</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">No recipes available</h3>
              <p className="text-slate-400 text-xs">There are no recipes uploaded to suggest right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.recipes?.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
