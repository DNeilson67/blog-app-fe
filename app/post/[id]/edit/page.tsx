'use client';

import { useState, useEffect, use } from 'react';
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
import { AlertCircle, ArrowLeft, Eye } from 'lucide-react';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { getPostById, updatePost } = useBlog();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const post = getPostById(resolvedParams.id);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!post) {
      router.push('/');
      return;
    }

    if (post.authorId !== user.id) {
      router.push(`/post/${post.id}`);
      return;
    }

    // Initialize form with post data
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category || '');
    setIsLoading(false);
  }, [user, post, router]);

  if (isLoading || !user || !post) {
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

    updatePost(post.id, {
      title: title.trim(),
      content: content.trim(),
      excerpt,
      category: category.trim() || undefined,
    });

    router.push(`/post/${post.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Link href={`/post/${post.id}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to post
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Edit Post</CardTitle>
              <CardDescription>Update your post content</CardDescription>
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
                  <Button type="submit" className="flex-1">
                    Update Post
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="lg:hidden"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className={`${showPreview ? 'block' : 'hidden'} lg:block`}>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your post will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                    {category}
                  </span>
                )}
                <Separator />
                {content ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Your content preview will appear here...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
