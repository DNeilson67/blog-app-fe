'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/AuthContext';
import { useBlog } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, User, Edit, Trash2, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { LoadingDots } from '@/components/ui/loading-dots';

function formatDate(date: Date | string) {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  } catch (error) {
    return 'Invalid date';
  }
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { getPostById, deletePost, getCommentsByPostId, createComment, updateComment, deleteComment, refreshComments, isLoadingComments, fetchPostById } = useBlog();
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [postNotFound, setPostNotFound] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  const post = getPostById(resolvedParams.id);
  const comments = getCommentsByPostId(resolvedParams.id);

  // Fetch post and comments when component mounts
  useEffect(() => {
    const loadPost = async () => {
      setIsLoadingPost(true);
      const loadedPost = await fetchPostById(resolvedParams.id);
      if (!loadedPost) {
        setPostNotFound(true);
      }
      setIsLoadingPost(false);
    };
    loadPost();
    refreshComments(resolvedParams.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedParams.id]);

  if (isLoadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (postNotFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.id === post.authorId;

  const handleDeletePost = () => {
    deletePost(post.id);
    router.push('/');
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }

    if (!commentContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }

    setIsSubmittingComment(true);
    await createComment({
      content: commentContent,
      postId: post.id,
    });

    setCommentContent('');
    setIsSubmittingComment(false);
    toast.success('Comment added successfully');
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setEditingCommentId(commentId);
      setEditingCommentContent(comment.content);
    }
  };

  const handleSaveComment = () => {
    if (!editingCommentContent.trim()) {
      toast.error('Comment content cannot be empty');
      return;
    }

    updateComment(editingCommentId!, editingCommentContent);
    setEditingCommentId(null);
    setEditingCommentContent('');
    toast.success('Comment updated successfully');
  };

  const handleDeleteComment = () => {
    if (deleteCommentId) {
      deleteComment(deleteCommentId);
      setDeleteCommentId(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to posts
        </Button>
      </Link>

      {/* Post Content */}
      <article className="bg-white rounded-lg shadow-sm p-8 mb-8">
        {/* Category Badge */}
        {post.category && (
          <Badge variant="secondary" className="mb-4">
            {post.category}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Meta Information */}
        <div className="flex items-center gap-6 text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.authorProfilePicture || undefined} />
              <AvatarFallback>{post.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Markdown Content */}
        <div className="prose prose-gray max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>

        {/* Edit/Delete Buttons for Author */}
        {isAuthor && (
          <>
            <Separator className="my-6" />
            <div className="flex gap-3">
              <Link href={`/post/${post.id}/edit`}>
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Post
                </Button>
              </Link>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Post
              </Button>
            </div>
          </>
        )}
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        {user ? (
          <div className="mb-8">
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="mb-3"
              rows={3}
              disabled={isSubmittingComment}
            />
            <Button 
              onClick={handleAddComment} 
              className="cursor-pointer" 
              disabled={isSubmittingComment}
            >
              {isSubmittingComment ? <LoadingDots /> : 'Add Comment'}
            </Button>
          </div>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">
              Please{' '}
              <Link href="/login" className="text-gray-900 font-medium hover:underline">
                login
              </Link>{' '}
              to add a comment.
            </p>
          </div>
        )}

        <Separator className="mb-6" />

        {/* Comments List */}
        {isLoadingComments ? (
          <div className="flex justify-center items-center py-12">
            <LoadingDots />
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.authorProfilePicture || undefined} />
                        <AvatarFallback>
                          {comment.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{comment.authorName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                    {user?.id === comment.authorId && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditComment(comment.id)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteCommentId(comment.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {editingCommentId === comment.id ? (
                    <div>
                      <Textarea
                        value={editingCommentContent}
                        onChange={(e) => setEditingCommentContent(e.target.value)}
                        className="mb-3"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveComment}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditingCommentContent('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              {deleteCommentId
                ? 'Are you sure you want to delete this comment? This action cannot be undone.'
                : 'Are you sure you want to delete this post? This will also delete all associated comments. This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteCommentId ? handleDeleteComment : handleDeletePost}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
