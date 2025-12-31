'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface BlogContextType {
  posts: Post[];
  comments: Comment[];
  isLoading: boolean;
  isLoadingComments: boolean;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => Promise<void>;
  updatePost: (id: string, post: Partial<Post>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => Promise<void>;
  updateComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  getPostById: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
  refreshPosts: () => Promise<void>;
  refreshComments: (postId: string) => Promise<void>;
  fetchPostById: (id: string) => Promise<Post | null>;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // Fetch posts from API
  const refreshPosts = async () => {
    setIsLoading(true);
    const response = await apiClient.get<any[]>('/posts');
    if (response.data) {
      const postsWithDates = response.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        authorId: post.author_id,
        authorName: post.author_name,
        authorProfilePicture: post.author_profile_picture,
        createdAt: new Date(post.created_at),
        updatedAt: new Date(post.updated_at),
      }));
      setPosts(postsWithDates);
    }
    setIsLoading(false);
  };

  // Fetch comments for a specific post
  const refreshComments = async (postId: string) => {
    setIsLoadingComments(true);
    const response = await apiClient.get<any[]>(`/posts/${postId}/comments`);
    if (response.data) {
      const commentsWithDates = response.data.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        postId: comment.post_id,
        authorId: comment.author_id,
        authorName: comment.author_name,
        authorProfilePicture: comment.author_profile_picture,
        createdAt: new Date(comment.created_at),
        updatedAt: new Date(comment.updated_at),
      }));
      
      // Update comments for this post
      setComments((prev) => {
        const filtered = prev.filter((c) => c.postId !== postId);
        return [...filtered, ...commentsWithDates];
      });
    }
    setIsLoadingComments(false);
  };

  // Initialize data from API
  useEffect(() => {
    refreshPosts();
  }, []);

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    const response = await apiClient.post<Post>(
      '/posts',
      {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        category: postData.category,
      },
      true
    );

    if (response.data) {
      await refreshPosts();
    }
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    const response = await apiClient.put<Post>(
      `/posts/${id}`,
      {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        category: postData.category,
      },
      true
    );

    if (response.data) {
      await refreshPosts();
    }
  };

  const deletePost = async (id: string) => {
    const response = await apiClient.delete(`/posts/${id}`, true);
    if (!response.error) {
      await refreshPosts();
      // Also remove associated comments
      setComments((prev) => prev.filter((comment) => comment.postId !== id));
    }
  };

  const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    const response = await apiClient.post<Comment>(
      `/posts/${commentData.postId}/comments`,
      { content: commentData.content },
      true
    );

    if (response.data) {
      await refreshComments(commentData.postId);
    }
  };

  const updateComment = async (id: string, content: string) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    const response = await apiClient.put<Comment>(
      `/comments/${id}`,
      { content },
      true
    );

    if (response.data) {
      await refreshComments(comment.postId);
    }
  };

  const deleteComment = async (id: string) => {
    const comment = comments.find((c) => c.id === id);
    if (!comment) return;

    const response = await apiClient.delete(`/comments/${id}`, true);
    if (!response.error) {
      setComments((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const fetchPostById = async (id: string): Promise<Post | null> => {
    const response = await apiClient.get<any>(`/posts/${id}`);
    if (response.data) {
      const postWithDate: Post = {
        id: response.data.id,
        title: response.data.title,
        content: response.data.content,
        excerpt: response.data.excerpt,
        category: response.data.category,
        authorId: response.data.author_id,
        authorName: response.data.author_name,
        authorProfilePicture: response.data.author_profile_picture,
        createdAt: new Date(response.data.created_at),
        updatedAt: new Date(response.data.updated_at),
      };
      
      // Update posts array with the fetched post
      setPosts((prev) => {
        const filtered = prev.filter((p) => p.id !== id);
        return [...filtered, postWithDate];
      });
      
      return postWithDate;
    }
    return null;
  };

  const getPostById = (id: string) => {
    return posts.find((post) => post.id === id);
  };

  const getCommentsByPostId = (postId: string) => {
    return comments.filter((comment) => comment.postId === postId);
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        comments,
        isLoading,
        isLoadingComments,
        createPost,
        updatePost,
        deletePost,
        createComment,
        updateComment,
        deleteComment,
        getPostById,
        getCommentsByPostId,
        refreshPosts,
        refreshComments,
        fetchPostById,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
}
