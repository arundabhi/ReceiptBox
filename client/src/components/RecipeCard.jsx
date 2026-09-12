import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Activity, User } from 'lucide-react';
import { getImageUrl } from '../services/api';

export default function RecipeCard({ recipe }) {
  const {
    _id,
    title,
    description,
    imageUrl,
    cookingTime,
    difficulty,
    averageRating,
    totalRatings,
    author,
    tags,
  } = recipe;

  // Format image URL using getImageUrl helper
  const imageSrc = getImageUrl(imageUrl, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600');

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in flex flex-col h-full">
      {/* Recipe Cover Image with Link */}
      <Link to={`/recipes/${_id}`} className="block overflow-hidden relative aspect-video bg-slate-100 dark:bg-slate-800">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Difficulty Badge floating */}
        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-md ${
          difficulty === 'Easy' ? 'bg-emerald-500' :
          difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'
        }`}>
          {difficulty}
        </span>
      </Link>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Title & Description */}
          <Link to={`/recipes/${_id}`} className="block">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-brand-500 dark:hover:text-brand-400 transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Rating and Metadata */}
        <div className="pt-4 mt-4 border-t border-slate-50 dark:border-slate-800/60 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{cookingTime} mins</span>
            </div>
            
            {/* Stars */}
            <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded text-amber-600 dark:text-amber-400 font-semibold">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{averageRating > 0 ? averageRating.toFixed(1) : 'New'}</span>
              {totalRatings > 0 && <span className="text-[10px] text-slate-400">({totalRatings})</span>}
            </div>
          </div>

          {/* Author info */}
          <div className="flex items-center justify-between">
            {author ? (
              <Link to={`/profile/${author.username}`} className="flex items-center gap-2 group/author">
                <img
                  src={getImageUrl(author.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}
                  alt={author.username}
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-100 dark:ring-slate-800"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover/author:text-brand-500 transition-colors">
                  {author.username}
                </span>
              </Link>
            ) : (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <User className="h-3 w-3" />
                <span>Anonymous</span>
              </div>
            )}
            
            <Link
              to={`/recipes/${_id}`}
              className="text-xs font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
            >
              View Recipe →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
