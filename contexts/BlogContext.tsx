'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/lib/types';
import { postsApi, commentsApi } from '@/lib/api';

interface BlogContextType {
  posts: Post[];
  comments: Comment[];
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
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Fetch posts from API
  const refreshPosts = async () => {
    try {
      const postsData = await postsApi.getAll();
      const formattedPosts = postsData.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
      setPosts(formattedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  // Fetch comments for a specific post
  const refreshComments = async (postId: string) => {
    try {
      const commentsData = await commentsApi.getByPostId(postId);
      const formattedComments = commentsData.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      }));
      
      // Update comments state, keeping comments from other posts
      setComments(prev => [
        ...prev.filter(c => c.postId !== postId),
        ...formattedComments
      ]);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  // Initialize data from API
  useEffect(() => {
    refreshPosts();
  }, []);

  const createPost = async (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    try {
      const newPost = await postsApi.create({
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        category: postData.category,
      });

      const formattedPost: Post = {
        ...newPost,
        createdAt: new Date(newPost.createdAt),
        updatedAt: new Date(newPost.updatedAt),
      };

      setPosts(prev => [formattedPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    try {
      const updatedPost = await postsApi.update(id, {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        category: postData.category,
      });

      const formattedPost: Post = {
        ...updatedPost,
        createdAt: new Date(updatedPost.createdAt),
        updatedAt: new Date(updatedPost.updatedAt),
      };

      setPosts(prev => prev.map(post => post.id === id ? formattedPost : post));
    } catch (error) {
      console.error('Failed to update post:', error);
      throw error;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await postsApi.delete(id);
      setPosts(prev => prev.filter(post => post.id !== id));
      setComments(prev => prev.filter(comment => comment.postId !== id));
    } catch (error) {
      console.error('Failed to delete post:', error);
      throw error;
    }
  };

  const createComment = async (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'authorName'>) => {
    try {
      const newComment = await commentsApi.create(commentData.postId, commentData.content);

      const formattedComment: Comment = {
        ...newComment,
        createdAt: new Date(newComment.createdAt),
        updatedAt: new Date(newComment.updatedAt),
      };

      setComments(prev => [formattedComment, ...prev]);
    } catch (error) {
      console.error('Failed to create comment:', error);
      throw error;
    }
  };

  const updateComment = async (id: string, content: string) => {
    try {
      const updatedComment = await commentsApi.update(id, content);

      const formattedComment: Comment = {
        ...updatedComment,
        createdAt: new Date(updatedComment.createdAt),
        updatedAt: new Date(updatedComment.updatedAt),
      };

      setComments(prev => prev.map(comment => comment.id === id ? formattedComment : comment));
    } catch (error) {
      console.error('Failed to update comment:', error);
      throw error;
    }
  };

  const deleteComment = async (id: string) => {
    try {
      await commentsApi.delete(id);
      setComments(prev => prev.filter(comment => comment.id !== id));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
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
