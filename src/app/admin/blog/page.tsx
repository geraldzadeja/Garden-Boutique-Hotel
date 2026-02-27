'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[];
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  isPublished: boolean;
}

const emptyFormData: BlogFormData = { title: '', slug: '', excerpt: '', content: '', coverImage: '', tags: [], isPublished: true };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(emptyFormData);
  const [actionLoading, setActionLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) { const data = await response.json(); setPosts(data.posts || []); }
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: editingPost ? formData.slug : generateSlug(title) });
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) { showToast('Invalid file type', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5MB)', 'error'); return; }
    setUploadingImage(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: fd });
      if (response.ok) { const data = await response.json(); setFormData({ ...formData, coverImage: data.url }); }
      else { const data = await response.json().catch(() => ({})); showToast(data.error || 'Upload failed', 'error'); }
    } catch (error) { console.error('Error:', error); showToast('Upload failed', 'error'); }
    finally { setUploadingImage(false); }
  };

  const openCreateModal = () => { setEditingPost(null); setFormData(emptyFormData); setShowModal(true); };
  const openEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({ title: post.title, slug: post.slug, excerpt: post.excerpt || '', content: post.content, coverImage: post.coverImage || '', tags: post.tags, isPublished: post.isPublished });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingPost(null); setFormData(emptyFormData); setNewTag(''); };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug || !formData.content) { showToast('Fill in Title, Slug, and Content', 'error'); return; }
    setActionLoading(true);
    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PATCH' : 'POST';
      const payload = { ...formData, excerpt: formData.excerpt || undefined, coverImage: formData.coverImage || undefined };
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (response.ok) { await fetchPosts(); closeModal(); showToast(editingPost ? 'Post updated!' : 'Post created!'); }
      else { const data = await response.json(); showToast(`Failed: ${typeof data.error === 'string' ? data.error : 'Check fields'}`, 'error'); }
    } catch (error) { console.error('Error:', error); showToast('Error saving post', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/blog/${postId}`, { method: 'DELETE' });
      if (response.ok) { await fetchPosts(); showToast('Post deleted!'); } else { showToast('Failed to delete', 'error'); }
    } catch (error) { console.error('Error:', error); showToast('Error deleting', 'error'); }
    finally { setActionLoading(false); }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/blog/${post.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !post.isPublished }) });
      if (response.ok) { await fetchPosts(); } else { showToast('Failed to update', 'error'); }
    } catch (error) { console.error('Error:', error); }
    finally { setActionLoading(false); }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" /></div>;
  }

  return (
    <>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Blog</h1>
          <p className="page-subtitle">Create and manage blog posts for your hotel website</p>
        </div>
        <Button className="gap-2" onClick={openCreateModal}><Plus className="h-4 w-4" /> New Post</Button>
      </div>

      <div className="kpi-card overflow-x-auto">
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Button onClick={openCreateModal}>Create Your First Post</Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header pb-3 text-left">Title</th>
                <th className="table-header pb-3 text-left">Date</th>
                <th className="table-header pb-3 text-left">Status</th>
                <th className="table-header pb-3 text-left">Tags</th>
                <th className="table-header pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 text-sm font-medium text-foreground max-w-xs truncate">{post.title}</td>
                  <td className="py-3.5 text-sm text-muted-foreground">{formatDate(post.isPublished ? post.publishedAt : post.createdAt)}</td>
                  <td className="py-3.5">
                    <button onClick={() => handleTogglePublish(post)} disabled={actionLoading}>
                      <StatusBadge status={post.isPublished ? 'Published' : 'Draft'} />
                    </button>
                  </td>
                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, i) => <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>)}
                      {post.tags.length > 2 && <span className="text-xs text-muted-foreground">+{post.tags.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(post)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>{editingPost ? 'Update your blog post' : 'Write a new blog post for your website'}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="post-title">Title <span className="text-destructive">*</span></Label>
              <Input id="post-title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Enter post title" />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="post-slug">Slug <span className="text-destructive">*</span></Label>
              <Input id="post-slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="post-url-slug" />
              <p className="text-xs text-muted-foreground">/blog/{formData.slug || 'your-slug'}</p>
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {formData.coverImage ? (
                <div className="relative h-48 rounded-lg overflow-hidden border border-border">
                  <Image src={formData.coverImage} alt="Cover" fill className="object-cover" />
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-6 w-6 p-0 bg-black/50 hover:bg-black/70 text-white" onClick={() => setFormData({ ...formData, coverImage: '' })}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50 cursor-pointer">
                  {uploadingImage ? <p className="text-sm text-primary font-medium">Uploading...</p> : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF (max 5MB)</p>
                    </>
                  )}
                  <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label htmlFor="post-excerpt">Excerpt</Label>
              <Textarea id="post-excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Short summary shown in blog cards..." className="resize-none" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content <span className="text-destructive">*</span></Label>
              <RichTextEditor
                content={formData.content}
                onChange={(html) => setFormData({ ...formData, content: html })}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} placeholder="Add a tag..." className="flex-1" />
                <Button type="button" variant="outline" size="sm" className="h-10" onClick={handleAddTag} disabled={!newTag.trim()}>Add</Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      {tag}
                      <button onClick={() => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })} className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="published-toggle" className="text-sm font-medium">Published</Label>
                <p className="text-xs text-muted-foreground mt-0.5">This post will be visible on your website</p>
              </div>
              <Switch id="published-toggle" checked={formData.isPublished} onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })} />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeModal} disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={actionLoading}>{actionLoading ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100]">
          <div className={`px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${toast.type === 'success' ? 'bg-[hsl(152,60%,40%)]' : 'bg-destructive'}`}>{toast.message}</div>
        </div>
      )}
    </>
  );
}
