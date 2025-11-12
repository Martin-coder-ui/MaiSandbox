import React, { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Award, Users, Heart, MessageSquare, Settings, UserPlus, UserMinus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, socialApi } from '../lib/supabase';

interface UserProfileProps {
  userId: string;
  onClose?: () => void;
}

interface UserStats {
  posts_count: number;
  followers_count: number;
  following_count: number;
  achievements_count: number;
  total_points: number;
}

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  type: 'client' | 'provider';
  specialization?: string;
  location?: string;
  created_at: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onClose }) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'achievements'>('posts');

  // Fetch user profile data
  const fetchProfile = async () => {
    try {
      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Get user stats
      const userStats = await socialApi.getUserStats(userId);
      setStats(userStats);

      // Get user posts
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          *,
          media:social_post_media(*),
          achievement:social_achievements(*),
          likes_count:social_likes(count),
          comments_count:social_comments(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (postsError) throw postsError;
      setPosts(postsData || []);

      // Get user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('social_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false })
        .limit(12);

      if (achievementsError) throw achievementsError;
      setAchievements(achievementsData || []);

      // Check if current user is following this user
      if (currentUser && currentUser.id !== userId) {
        const { data: followData } = await supabase
          .from('social_follows')
          .select('id')
          .eq('follower_id', currentUser.id)
          .eq('following_id', userId)
          .maybeSingle();

        setIsFollowing(!!followData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Follow/unfollow user
  const toggleFollow = async () => {
    if (!currentUser || currentUser.id === userId) return;

    try {
      if (isFollowing) {
        await socialApi.unfollowUser(currentUser.id, userId);
        setIsFollowing(false);
        setStats(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
      } else {
        await socialApi.followUser(currentUser.id, userId);
        setIsFollowing(true);
        setStats(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-8">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">User not found</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Info */}
          <div className="px-6 pb-6 relative">
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-700">
                <img
                  src={profile.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="pt-20">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                    {profile.type === 'provider' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        <Award className="w-3 h-3 mr-1" />
                        Verified Provider
                      </span>
                    )}
                  </div>
                  
                  {profile.specialization && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {profile.specialization.replace('-', ' ')}
                    </p>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </div>
                  )}

                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Follow Button */}
                {currentUser && currentUser.id !== userId && (
                  <button
                    onClick={toggleFollow}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isFollowing
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unfollow</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Stats */}
              {stats && (
                <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.posts_count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.followers_count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.following_count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.achievements_count}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Achievements</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total_points}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Posts ({stats?.posts_count || 0})
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'achievements'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Achievements ({stats?.achievements_count || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'posts' ? (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-gray-900 dark:text-white mb-3">{post.content}</p>
                    
                    {/* Post Media */}
                    {post.media && post.media.length > 0 && (
                      <div className="mb-3">
                        <img
                          src={post.media[0].url}
                          alt="Post media"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Post Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes_count?.[0]?.count || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments_count?.[0]?.count || 0}</span>
                      </div>
                      <span className="text-xs">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <Award className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No achievements yet</p>
                </div>
              ) : (
                achievements.map((achievement) => (
                  <div key={achievement.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        achievement.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <Award className={`w-5 h-5 ${
                          achievement.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                          achievement.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                          achievement.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{achievement.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{achievement.rarity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(achievement.achieved_at).toLocaleDateString()}
                      </span>
                      {achievement.points > 0 && (
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          +{achievement.points} points
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;