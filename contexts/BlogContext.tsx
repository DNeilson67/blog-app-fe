'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, Comment } from '@/lib/types';
import { mockPosts, mockComments } from '@/lib/mockData';

interface BlogContextType {
  posts: Post[];
  comments: Comment[];
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  createComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComment: (id: string, content: string) => void;
  deleteComment: (id: string) => void;
  getPostById: (id: string) => Post | undefined;
  getCommentsByPostId: (postId: string) => Comment[];
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export function BlogProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  // Initialize data from localStorage or use mock data
  useEffect(() => {
    const storedPosts = localStorage.getItem('posts');
    const storedComments = localStorage.getItem('comments');

    if (storedPosts) {
      const parsedPosts = JSON.parse(storedPosts);
      // Convert date strings back to Date objects
      const postsWithDates = parsedPosts.map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
      setPosts(postsWithDates);
    } else {
      setPosts(mockPosts);
      localStorage.setItem('posts', JSON.stringify(mockPosts));
    }

    if (storedComments) {
      const parsedComments = JSON.parse(storedComments);
      const commentsWithDates = parsedComments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt),
      }));
      setComments(commentsWithDates);
    } else {
      setComments(mockComments);
      localStorage.setItem('comments', JSON.stringify(mockComments));
    }
  }, []);

  const createPost = (postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const updatePost = (id: string, postData: Partial<Post>) => {
    const updatedPosts = posts.map((post) =>
      post.id === id
        ? { ...post, ...postData, updatedAt: new Date() }
        : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  const deletePost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    // Also delete associated comments
    const updatedComments = comments.filter((comment) => comment.postId !== id);
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const createComment = (commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const updateComment = (id: string, content: string) => {
    const updatedComments = comments.map((comment) =>
      comment.id === id
        ? { ...comment, content, updatedAt: new Date() }
        : comment
    );
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const deleteComment = (id: string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
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
