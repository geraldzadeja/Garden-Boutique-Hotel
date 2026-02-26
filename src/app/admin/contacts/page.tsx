'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MailOpen, Reply } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  respondedAt: string | null;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/contacts');
      if (response.ok) { const data = await response.json(); setMessages(data.messages || []); }
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isRead: true }) });
      if (response.ok) {
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
        if (selectedMessage?.id === id) setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
      }
    } catch (error) { console.error('Error:', error); }
  };

  const handleSelectMessage = (msg: ContactMessage) => {
    if (!msg.isRead) markAsRead(msg.id);
    setSelectedMessage({ ...msg, isRead: true });
  };

  const openReply = () => {
    if (selectedMessage) {
      setReplySubject(`Re: ${selectedMessage.subject || 'Your inquiry'}`);
      setReplyBody('');
      setReplyOpen(true);
    }
  };

  const replyDirty = replyBody.trim().length > 0;

  const handleReplyClose = useCallback(() => {
    if (replyDirty) {
      const confirmed = window.confirm('You have unsent changes. Discard reply?');
      if (!confirmed) return;
    }
    setReplyOpen(false);
    setReplyBody('');
  }, [replyDirty]);

  const handleSendReply = () => {
    setReplyOpen(false);
    setReplyBody('');
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMessages(prev => prev.filter(m => m.id !== id));
        if (selectedMessage?.id === id) { setSelectedMessage(null); }
      }
    } catch (error) { console.error('Error:', error); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" /></div>;
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Messages</h1>
        <p className="page-subtitle">Contact form submissions and guest inquiries</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <button className="rounded-full px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground">All</button>
      </div>

      {/* Messages list */}
      {messages.length === 0 ? (
        <div className="kpi-card text-center py-8">
          <p className="text-muted-foreground">No messages received yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => handleSelectMessage(msg)}
              className="kpi-card cursor-pointer !p-4 flex items-start gap-4"
            >
              <div className="mt-0.5">
                <MailOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-sm font-medium ${!msg.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{msg.name}</p>
                  <span className="text-xs text-muted-foreground">{formatDate(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{msg.subject || 'No subject'}</p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedMessage && !replyOpen} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || 'No subject'}</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{selectedMessage.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedMessage.email}</p>
                  {selectedMessage.phone && (
                    <p className="text-xs text-muted-foreground">{selectedMessage.phone}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gap-2 flex-1" onClick={openReply}>
                  <Reply className="h-4 w-4" /> Reply
                </Button>
                <Button size="sm" variant="outline" className="text-destructive flex-1" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Modal */}
      <Dialog open={replyOpen} onOpenChange={(o) => { if (!o) handleReplyClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              {selectedMessage && <span>{selectedMessage.name} · {selectedMessage.subject || 'No subject'}</span>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reply-subject">Subject</Label>
              <Input id="reply-subject" value={replySubject} onChange={(e) => setReplySubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply-body">Message</Label>
              <Textarea id="reply-body" placeholder="Type your reply..." value={replyBody} onChange={(e) => setReplyBody(e.target.value)} rows={6} className="resize-y" />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleReplyClose}>Cancel</Button>
            <Button onClick={handleSendReply} disabled={!replyBody.trim()}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
