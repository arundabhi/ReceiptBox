import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api, { getImageUrl } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import { ProfileSkeleton } from '../components/SkeletonLoader';
import { toast } from '../components/Toast';
import { UserCheck, UserPlus, FileText, Users, Bookmark } from 'lucide-react';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('recipes'); // recipes, followers, following

  // Fetch Profile data
  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const res = await api.get(`/users/profile/${username}`);
      return res.data;
    },
  });

  // Fetch Followers details
  const { data: followersList, isLoading: loadingFollowers } = useQuery({
    queryKey: ['followers', data?.user?.id],
    enabled: !!data?.user?.id && activeTab === 'followers',
    queryFn: async () => {
      const res = await api.get(`/users/${data.user.id}/followers`);
      return res.data;
    },
  });

  // Fetch Following details
  const { data: followingList, isLoading: loadingFollowing } = useQuery({
    queryKey: ['following', data?.user?.id],
    enabled: !!data?.user?.id && activeTab === 'following',
    queryFn: async () => {
      const res = await api.get(`/users/${data.user.id}/following`);
      return res.data;
    },
  });

  // Follow mutation
  const followMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/users/follow/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['followers', data?.user?.id] });
      toast.success(`Successfully followed @${username}`);
    },
    onError: () => {
      toast.error('Failed to follow user');
    },
  });

  // Unfollow mutation
  const unfollowMutation = useMutation({
    mutationFn: async (id) => {
      await api.post(`/users/unfollow/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['followers', data?.user?.id] });
      toast.success(`Unfollowed @${username}`);
    },
    onError: () => {
      toast.error('Failed to unfollow user');
    },
  });

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !data) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">User Profile Not Found</h2>
        <p className="text-slate-400 text-xs mt-1">This foodie account may have been renamed or deleted.</p>
        <Link to="/" className="inline-block mt-4 text-xs font-bold text-brand-500">Back Home</Link>
      </div>
    );
  }

  const { user, recipes } = data;
  const isOwnProfile = currentUser && currentUser.id === user.id;
  const isFollowing = currentUser && Array.isArray(user?.followers) && user.followers.includes(currentUser.id);

  const handleFollowAction = () => {
    if (isFollowing) {
      unfollowMutation.mutate(user.id);
    } else {
      followMutation.mutate(user.id);
    }
  };

  const userAvatar = getImageUrl(user.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in space-y-8">
      {/* Profile Header Card */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
        {/* Avatar */}
        <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-brand-500 shadow-lg">
          <img src={userAvatar} alt={user.username} className="h-full w-full object-cover" />
        </div>

        {/* Bio Details */}
        <div className="flex-1 text-center sm:text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">@{user.username}</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{user.role} Member</p>
            </div>

            {/* Follow/Unfollow Button */}
            {!isOwnProfile && currentUser && (
              <button
                onClick={handleFollowAction}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  isFollowing
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-350 dark:hover:bg-slate-700'
                    : 'bg-brand-500 hover:bg-brand-600 text-white hover:shadow-brand-500/25'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow Creator</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed max-w-xl">
            {user.bio || "No bio description written yet. This foodie prefers to let their recipes do the talking!"}
          </p>

          {/* Followers and Recipes stats */}
          <div className="flex items-center justify-center sm:justify-start gap-6 border-t border-slate-50 dark:border-slate-850/60 pt-4">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`flex items-center gap-1.5 text-xs font-bold ${activeTab === 'recipes' ? 'text-brand-500' : 'text-slate-500'}`}
            >
              <FileText className="h-4 w-4" />
              <span>{recipes?.length || 0} Recipes</span>
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`flex items-center gap-1.5 text-xs font-bold ${activeTab === 'followers' ? 'text-brand-500' : 'text-slate-500'}`}
            >
              <Users className="h-4 w-4" />
              <span>{user.followersCount} Followers</span>
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`flex items-center gap-1.5 text-xs font-bold ${activeTab === 'following' ? 'text-brand-500' : 'text-slate-500'}`}
            >
              <Users className="h-4 w-4" />
              <span>{user.followingCount} Following</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="space-y-6">
        {/* Uploaded Recipes Grid */}
        {activeTab === 'recipes' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black">Shared Recipes</h3>
            {!recipes || recipes.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
                <span className="text-3xl">🍲</span>
                <p className="text-slate-400 text-xs mt-2">No recipes uploaded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {recipes?.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Followers Tab List */}
        {activeTab === 'followers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black">Followers</h3>
            {loadingFollowers ? (
              <div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
            ) : !followersList || !Array.isArray(followersList) || followersList.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-400 text-xs">No followers yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followersList?.map((fUser) => (
                  <Link
                    key={fUser._id}
                    to={`/profile/${fUser.username}`}
                    onClick={() => setActiveTab('recipes')}
                    className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <img
                      src={getImageUrl(fUser.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}
                      alt={fUser.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs">@{fUser.username}</div>
                      <div className="text-[10px] text-slate-400 truncate">{fUser.bio || 'No bio written'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Following Tab List */}
        {activeTab === 'following' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black">Following</h3>
            {loadingFollowing ? (
              <div className="h-20 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl" />
            ) : !followingList || !Array.isArray(followingList) || followingList.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-400 text-xs">Not following anyone yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {followingList?.map((fUser) => (
                  <Link
                    key={fUser._id}
                    to={`/profile/${fUser.username}`}
                    onClick={() => setActiveTab('recipes')}
                    className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl hover:shadow-md transition-shadow"
                  >
                    <img
                      src={getImageUrl(fUser.avatar, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100')}
                      alt={fUser.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs">@{fUser.username}</div>
                      <div className="text-[10px] text-slate-400 truncate">{fUser.bio || 'No bio written'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
