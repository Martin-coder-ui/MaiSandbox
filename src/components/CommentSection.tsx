import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Reply, Send, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { socialApi } from '../lib/supabase';

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar_url?: string;
    type: 'client' | 'provider';
  };
  likes_count: number;
  liked: boolean;
  created_at: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  isExpanded: boolean;
  onToggle: () => void;
  commentCount: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  postId, 
  isExpanded, 
  onToggle, 
  commentCount 
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments when expanded
  const fetchComments = async () => {
    if (!isExpanded) return;

    setLoading(true);
    try {
      const commentsData = await socialApi.getComments(postId);
      
      // Transform the data to match our Comment interface
      const formattedComments: Comment[] = commentsData.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          avatar_url: comment.user.avatar_url,
          type: comment.user.type || 'client'
        },
        likes_count: comment.likes_count?.[0]?.count || 0,
        liked: false, // Will be updated separately
        created_at: comment.created_at,
        replies: [] // For future nested comment support
      }));

      setComments(formattedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    try {
      const comment = await socialApi.addComment(postId, user.id, newComment.trim());
      
      // Add the new comment to the local state
      const newCommentData: Comment = {
        id: comment.id,
        content: newComment.trim(),
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar,
          type: user.role === 'provider' ? 'provider' : 'client'
        },
        likes_count: 0,
        liked: false,
        created_at: new Date().toISOString(),
        replies: []
      };

      setComments(prev => [newCommentData, ...prev]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Like/unlike comment
  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      const comment = comments.find(c => c.id === commentId);
      if (!comment) return;

      if (comment.liked) {
        // Unlike comment (implement this in socialApi if needed)
        console.log('Unlike comment:', commentId);
      } else {
        // Like comment (implement this in socialApi if needed)
        console.log('Like comment:', commentId);
      }

      // Update local state optimistically
      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              liked: !c.liked,
              likes_count: c.liked ? c.likes_count - 1 : c.likes_count + 1
            };
          }
          return c;
        })
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [isExpanded, postId]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  return (
    <div>
      {/* Comment Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
      >
        <MessageSquare className="w-5 h-5" />
        <span>Comment</span>
        {commentCount > 0 && (
          <span className="text-sm text-gray-500 dark:text-gray-400">({commentCount})</span>
        )}
      </button>

      {/* Expanded Comment Section */}
      {isExpanded && (
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Add Comment Form */}
          {user && (
            <form onSubmit={handleAddComment} className="mb-4">
              <div className="flex space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={submitting}
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submitting}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {submitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No comments yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={comment.user.avatar_url || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={comment.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.user.name}
                        </span>
                        {comment.user.type === 'provider' && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            Provider
                          </span>
                        )}
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimeAgo(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white">{comment.content}</p>
                    </div>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 ${
                          comment.liked ? 'text-red-500' : ''
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${comment.liked ? 'fill-current' : ''}`} />
                        <span>{comment.likes_count > 0 ? comment.likes_count : 'Like'}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200">
                        <Reply className="w-3 h-3" />
                        <span>Reply</span>
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
  );
};

export default CommentSection;