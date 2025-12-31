'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '@/contexts/AuthContext';
import { useBlog } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { AlertCircle, ArrowLeft, Eye, Calendar, User, X } from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createPost } = useBlog();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    // Create excerpt from content (first 150 characters)
    const excerpt = content.replace(/[#*`]/g, '').slice(0, 150) + '...';

    createPost({
      title: title.trim(),
      content: content.trim(),
      excerpt,
      category: category.trim() || undefined,
      authorId: user.id,
      authorName: user.name,
    });

    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Create New Post</CardTitle>
          <CardDescription className="text-center">Share your thoughts with the world</CardDescription>
        </CardHeader>
        <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Input
                    id="category"
                    type="text"
                    placeholder="e.g., Technology, Lifestyle"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content * (Markdown supported)</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your post content using Markdown..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    Supports Markdown: **bold**, *italic*, # headings, code blocks, lists, etc.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 cursor-pointer">
                    Publish Post
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

      {/* Full Preview Sheet */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent side="bottom" className="h-[100vh] w-full p-0 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <div className="flex items-start justify-between">
              <SheetHeader>
                <SheetTitle>Post Preview</SheetTitle>
                <SheetDescription>
                  This is how your post will appear to readers
                </SheetDescription>
              </SheetHeader>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="container mx-auto max-w-4xl p-8">
            {/* Category Badge */}
            {category && (
              <Badge variant="secondary" className="mb-4">
                {category}
              </Badge>
            )}

            {/* Title */}
            {title ? (
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
            ) : (
              <h1 className="text-4xl font-bold text-gray-400 mb-4 italic">Your Title Here</h1>
            )}

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Markdown Content */}
            {content ? (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-12">
                Start writing your content to see the preview...
              </p>
            )}
          </div>

        </SheetContent>
      </Sheet>
    </div>
  );
}
