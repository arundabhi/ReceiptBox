import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getImageUrl } from '../services/api';
import {
  Compass,
  Search,
  Rss,
  FolderHeart,
  CalendarDays,
  User,
  LogOut,
  Sun,
  Moon,
  PlusCircle,
  Menu,
  X,
  LogIn
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Discover', icon: <Compass className="h-5 w-5" /> },
    { to: '/search', label: 'Search Engine', icon: <Search className="h-5 w-5" /> },
    ...(isAuthenticated
      ? [
          { to: '/feed', label: 'My Feed', icon: <Rss className="h-5 w-5" /> },
          { to: '/cookbooks', label: 'Cookbooks', icon: <FolderHeart className="h-5 w-5" /> },
          { to: '/planner', label: 'Meal Planner', icon: <CalendarDays className="h-5 w-5" /> },
          { to: '/create-recipe', label: 'Share Recipe', icon: <PlusCircle className="h-5 w-5" /> },
          { to: `/profile/${user?.username}`, label: 'My Profile', icon: <User className="h-5 w-5" /> },
        ]
      : []),
  ];

  const activeClass = "flex items-center gap-3 px-4 py-3 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-950/40 dark:text-brand-400 font-bold transition-all duration-200";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 font-medium transition-all duration-200";

  return (
    <>
      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🍳</span>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-500 to-rose-600 bg-clip-text text-transparent">
            RecipeBox
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Dark Mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[73px] bottom-0 z-30 bg-white dark:bg-slate-900 px-6 py-6 space-y-4 animate-fade-in flex flex-col justify-between overflow-y-auto border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(user.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">@{user.username}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20 font-bold transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all duration-200"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex fixed top-0 bottom-0 left-0 w-64 border-r border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 flex-col justify-between z-40">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 px-4">
            <span className="text-3xl">🍳</span>
            <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-brand-500 to-rose-600 bg-clip-text text-transparent">
              RecipeBox
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Footer Profile & Settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          {/* Dark Mode toggle */}
          <div className="flex items-center justify-between px-4">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Dark Mode</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-300 transition-colors"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-brand-400" /> : <Moon className="h-4.5 w-4.5 text-brand-500" />}
            </button>
          </div>

          {isAuthenticated ? (
            <div className="space-y-3">
              <Link to={`/profile/${user.username}`} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                <img
                  src={getImageUrl(user.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}
                  alt={user.username}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors truncate">
                    @{user.username}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{user.email}</div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout Session</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-all duration-200 shadow-md hover:shadow-brand-500/20"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
