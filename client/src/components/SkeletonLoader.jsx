import React from 'react';

export const RecipeCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="bg-slate-200 dark:bg-slate-800 h-56 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-12" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
        </div>
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
        </div>
      </div>
    </div>
  );
};

export const RecipeGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <RecipeCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse space-y-8">
      <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div className="h-28 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-3">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="flex gap-4 pt-2">
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
          </div>
        </div>
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
      <RecipeGridSkeleton count={4} />
    </div>
  );
};
