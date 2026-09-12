import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import { UserPlus, Mail, Lock, User, FileText, Camera } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Dropzone setup for profile picture upload
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      return toast.error('Please fill in all required fields');
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      await register(formData);
      toast.success('Registration successful! Welcome to the foodie circle.');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 animate-fade-in">
      <div className="max-w-md w-full p-8 rounded-3xl glass shadow-xl border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-4xl">🍳</span>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Create Account
          </h2>
          <p className="text-sm text-slate-400">
            Join thousands of foodies sharing their daily kitchen masterpieces.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Dropzone Uploader */}
          <div className="flex flex-col items-center space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Profile Avatar
            </label>
            <div
              {...getRootProps()}
              className={`h-24 w-24 rounded-full border-2 border-dashed cursor-pointer flex flex-col items-center justify-center relative overflow-hidden transition-all group ${
                isDragActive
                  ? 'border-brand-500 bg-brand-50/20'
                  : avatarPreview
                  ? 'border-slate-200'
                  : 'border-slate-300 hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-850/40'
              }`}
            >
              <input {...getInputProps()} />
              {avatarPreview ? (
                <>
                  <img src={avatarPreview} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <Camera className="h-6 w-6 mb-1" />
                  <span className="text-[10px] font-medium text-center px-2">Drag or Tap</span>
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <User className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                placeholder="chef_mario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Mail className="h-4.5 w-4.5" />
              </span>
              <input
                type="email"
                placeholder="mario@recipebox.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bio (Short Description)
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3.5 text-slate-400 pointer-events-none">
                <FileText className="h-4.5 w-4.5" />
              </span>
              <textarea
                placeholder="Pasta lover, culinary student..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/40 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-brand-500/10 active:scale-[0.98]"
          >
            <UserPlus className="h-5 w-5" />
            <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-brand-500 dark:text-brand-400 hover:text-brand-600 hover:underline"
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
