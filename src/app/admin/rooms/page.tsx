'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BedDouble, DollarSign, Users, Pencil, Eye, Info, Type, FileText, List, ImagePlus, ShieldBan, CalendarOff } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  capacity: number;
  bedType: string;
  size: number;
  pricePerNight: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
  displayOrder: number;
  totalUnits: number;
  _count?: { bookings: number };
}

interface BlockedDate {
  id: string;
  date: string;
  unitsBlocked: number;
  reason: string | null;
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockDateForm, setBlockDateForm] = useState({ date: '', unitsBlocked: 1, reason: '' });
  const [editFormData, setEditFormData] = useState<Partial<Room>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      setRooms(data.rooms || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(f => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(f.type));
    if (imageFiles.length === 0) { alert('Please select valid image files'); return; }
    const validFiles = imageFiles.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length === 0) { alert('All files exceed 5MB limit'); return; }
    setUploadingImages(true);
    const newUrls: string[] = [];
    for (const file of validFiles) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'rooms');
        const response = await fetch('/api/upload', { method: 'POST', body: formData });
        if (response.ok) { const data = await response.json(); newUrls.push(data.url); }
      } catch (error) { console.error(`Error uploading ${file.name}:`, error); }
    }
    if (newUrls.length > 0) {
      setEditFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newUrls] }));
    }
    setUploadingImages(false);
  };

  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files); };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files.length > 0) { uploadFiles(e.target.files); e.target.value = ''; } };

  const handleToggleStatus = async (roomId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !currentStatus }) });
      if (response.ok) { await fetchRooms(); } else { alert('Failed to update room status'); }
    } catch (error) { console.error('Error:', error); alert('Error updating room status'); }
    setActionLoading(false);
  };

  const handleUpdateRoom = async () => {
    if (!selectedRoom) return;
    if (editFormData.name && editFormData.name.length < 2) { alert('Room name must be at least 2 characters'); return; }
    if (editFormData.description && editFormData.description.length < 10) { alert('Description must be at least 10 characters'); return; }

    setActionLoading(true);
    try {
      const cleanedData: Record<string, unknown> = {};
      if (editFormData.name) cleanedData.name = editFormData.name;
      if (editFormData.slug) cleanedData.slug = editFormData.slug;
      if (editFormData.description) cleanedData.description = editFormData.description;
      if (editFormData.shortDescription !== undefined) cleanedData.shortDescription = editFormData.shortDescription;
      if (editFormData.bedType) cleanedData.bedType = editFormData.bedType;
      if (editFormData.capacity !== undefined) cleanedData.capacity = Number(editFormData.capacity);
      if (editFormData.size !== undefined) cleanedData.size = Number(editFormData.size);
      if (editFormData.pricePerNight !== undefined) cleanedData.pricePerNight = Number(editFormData.pricePerNight);
      if (editFormData.displayOrder !== undefined) cleanedData.displayOrder = Number(editFormData.displayOrder);
      if (editFormData.amenities) cleanedData.amenities = editFormData.amenities;
      if (editFormData.images) cleanedData.images = editFormData.images.filter(img => img && img.trim() !== '');

      const response = await fetch(`/api/rooms/${selectedRoom.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cleanedData) });
      if (response.ok) { await fetchRooms(); setShowDetailsModal(false); setEditFormData({}); } else {
        const data = await response.json();
        if (Array.isArray(data.error)) { alert(`Validation errors:\n${data.error.map((err: { path?: string[]; message?: string }) => `${err.path?.join('.') || 'field'}: ${err.message}`).join('\n')}`); }
        else { alert(`Failed: ${typeof data.error === 'string' ? data.error : 'Check all fields'}`); }
      }
    } catch (error) { console.error('Error:', error); alert('Error updating room'); }
    setActionLoading(false);
  };

  const handleUpdateTotalUnits = async (roomId: string, newTotalUnits: string) => {
    const units = parseInt(newTotalUnits);
    if (isNaN(units) || units <= 0) { alert('Please enter a valid number'); return; }
    setActionLoading(true);
    try {
      const response = await fetch(`/api/rooms/${roomId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ totalUnits: units }) });
      if (response.ok) { await fetchRooms(); } else { alert('Failed to update units'); }
    } catch (error) { console.error('Error:', error); }
    setActionLoading(false);
  };

  const fetchBlockedDates = async (roomId: string) => {
    try { const response = await fetch(`/api/rooms/${roomId}/blocked-dates`); const data = await response.json(); setBlockedDates(data.blockedDates || []); } catch (error) { console.error('Error:', error); }
  };

  const handleBlockDate = async () => {
    if (!selectedRoom || !blockDateForm.date) { alert('Please select a date'); return; }
    setActionLoading(true);
    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}/blocked-dates`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(blockDateForm) });
      if (response.ok) { await fetchBlockedDates(selectedRoom.id); setBlockDateForm({ date: '', unitsBlocked: 1, reason: '' }); } else { alert('Failed to block date'); }
    } catch (error) { console.error('Error:', error); }
    setActionLoading(false);
  };

  const handleUnblockDate = async (dateId: string) => {
    if (!selectedRoom) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}/blocked-dates?dateId=${dateId}`, { method: 'DELETE' });
      if (response.ok) { await fetchBlockedDates(selectedRoom.id); } else { alert('Failed to unblock date'); }
    } catch (error) { console.error('Error:', error); }
    setActionLoading(false);
  };

  const openEditModal = (room: Room) => {
    setSelectedRoom(room);
    setEditFormData({ name: room.name, slug: room.slug, description: room.description, shortDescription: room.shortDescription || '', capacity: room.capacity, bedType: room.bedType, size: room.size, pricePerNight: room.pricePerNight, displayOrder: room.displayOrder, amenities: room.amenities, images: room.images });
    setShowDetailsModal(true);
  };

  const openInventoryModal = async (room: Room) => {
    setSelectedRoom(room);
    await fetchBlockedDates(room.id);
    setShowInventoryModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Rooms</h1>
        <p className="page-subtitle">Manage room types and inventory</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {rooms.map((room) => (
          <div key={room.id} className="kpi-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{room.shortDescription || room.description.substring(0, 80)}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                room.isActive ? 'bg-[hsl(152,60%,95%)] text-[hsl(152,60%,30%)]' : 'bg-muted text-muted-foreground'
              }`}>
                {room.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><BedDouble className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Total Rooms</p><p className="text-sm font-semibold text-foreground">{room.totalUnits}</p></div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><Users className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Capacity</p><p className="text-sm font-semibold text-foreground">{room.capacity} guests</p></div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted"><DollarSign className="h-4 w-4 text-muted-foreground" /></div>
                <div><p className="text-xs text-muted-foreground">Base Price</p><p className="text-sm font-semibold text-foreground">€{Number(room.pricePerNight).toFixed(0)}/night</p></div>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => openInventoryModal(room)}>
                <Eye className="h-3.5 w-3.5" /> Inventory
              </Button>
              <Button variant="outline" size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => openEditModal(room)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className={`text-xs ${room.isActive ? 'text-destructive hover:text-destructive' : 'text-primary hover:text-primary'}`} onClick={() => handleToggleStatus(room.id, room.isActive)} disabled={actionLoading}>
                {room.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Room Modal */}
      <Dialog open={showDetailsModal && !!selectedRoom} onOpenChange={(open) => { if (!open) { setShowDetailsModal(false); setEditFormData({}); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg">Edit Room Type</DialogTitle>
            <DialogDescription>{selectedRoom?.name}</DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-5">
            {/* Basic Info */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Info className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Basic Info</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Room Name</Label>
                <Input value={editFormData.name || ''} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editFormData.slug || ''} onChange={(e) => setEditFormData({ ...editFormData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="mt-1.5 font-mono text-xs" />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated from name</p>
              </div>
            </div>

            <Separator />

            {/* Room Details */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Type className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Room Details</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label>Capacity (guests)</Label>
                <Input type="number" min={1} max={10} value={editFormData.capacity || ''} onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) || 1 })} className="mt-1.5" />
              </div>
              <div>
                <Label>Size (m²)</Label>
                <Input type="number" min={10} max={500} value={editFormData.size || ''} onChange={(e) => setEditFormData({ ...editFormData, size: parseInt(e.target.value) || 10 })} className="mt-1.5" />
              </div>
              <div>
                <Label>Price per Night (€)</Label>
                <Input type="number" min={0} step={0.01} value={editFormData.pricePerNight || ''} onChange={(e) => setEditFormData({ ...editFormData, pricePerNight: parseFloat(e.target.value) || 0 })} className="mt-1.5" />
              </div>
              <div>
                <Label>Bed Type</Label>
                <Input value={editFormData.bedType || ''} onChange={(e) => setEditFormData({ ...editFormData, bedType: e.target.value })} placeholder="King Size Bed" className="mt-1.5" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" min={0} value={editFormData.displayOrder || 0} onChange={(e) => setEditFormData({ ...editFormData, displayOrder: parseInt(e.target.value) || 0 })} className="mt-1.5" />
              </div>
            </div>

            <Separator />

            {/* Descriptions */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <FileText className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Descriptions</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <Label>Short Description</Label>
                  <span className={`text-xs ${(editFormData.shortDescription || '').length > 200 ? 'text-destructive' : 'text-muted-foreground'}`}>{(editFormData.shortDescription || '').length}/200</span>
                </div>
                <Input maxLength={200} value={editFormData.shortDescription || ''} onChange={(e) => setEditFormData({ ...editFormData, shortDescription: e.target.value })} placeholder="Shown on room listing cards" className="mt-1.5" />
              </div>
              <div>
                <Label>Full Description</Label>
                <textarea rows={4} value={editFormData.description || ''} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} placeholder="Shown on the room detail page (min 10 characters)" className="mt-1.5 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none" />
              </div>
            </div>

            <Separator />

            {/* Amenities */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <List className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Amenities</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {(editFormData.amenities || []).map((amenity, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {amenity}
                  <button onClick={() => { const a = [...(editFormData.amenities || [])]; a.splice(i, 1); setEditFormData({ ...editFormData, amenities: a }); }} className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors">×</button>
                </span>
              ))}
              {(editFormData.amenities || []).length === 0 && <p className="text-xs text-muted-foreground">No amenities added yet.</p>}
            </div>
            <div className="flex gap-2">
              <Input id="newAmenity" placeholder="Add amenity…" className="flex-1" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const input = e.target as HTMLInputElement; if (input.value.trim()) { setEditFormData({ ...editFormData, amenities: [...(editFormData.amenities || []), input.value.trim()] }); input.value = ''; } } }} />
              <Button variant="outline" size="sm" className="gap-1" onClick={() => { const input = document.getElementById('newAmenity') as HTMLInputElement; if (input?.value.trim()) { setEditFormData({ ...editFormData, amenities: [...(editFormData.amenities || []), input.value.trim()] }); input.value = ''; } }}>Add</Button>
            </div>

            <Separator />

            {/* Images */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <ImagePlus className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Images</h3>
            </div>
            {(editFormData.images || []).length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {(editFormData.images || []).map((image, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-border aspect-video">
                    <Image src={image} alt={`Room image ${i + 1}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button onClick={() => { const imgs = [...(editFormData.images || [])]; imgs.splice(i, 1); setEditFormData({ ...editFormData, images: imgs }); }} className="p-2 bg-destructive/90 hover:bg-destructive rounded-md text-white text-sm font-medium transition-colors">Remove</button>
                    </div>
                    {i === 0 && <Badge className="absolute top-2 left-2 text-[10px]">Cover</Badge>}
                  </div>
                ))}
              </div>
            )}
            <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => document.getElementById('roomImageInput')?.click()}>
              <input id="roomImageInput" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleFileSelect} className="hidden" />
              {uploadingImages ? <p className="text-sm text-primary font-medium">Uploading...</p> : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{dragOver ? 'Drop images here' : 'Upload or drag & drop'}</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, GIF (max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="px-6 pb-6 pt-0 gap-2">
            <Button variant="outline" onClick={() => { setShowDetailsModal(false); setEditFormData({}); }} disabled={actionLoading}>Cancel</Button>
            <Button onClick={handleUpdateRoom} disabled={actionLoading} className="min-w-[120px]">{actionLoading ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inventory Modal */}
      <Dialog open={showInventoryModal && !!selectedRoom} onOpenChange={(open) => { if (!open) setShowInventoryModal(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-0">
            <DialogTitle className="text-lg">Inventory Management</DialogTitle>
            <DialogDescription>{selectedRoom?.name}</DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-5">
            {/* Total Units */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <BedDouble className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Total Units</h3>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label>Number of Units</Label>
                <Input type="number" min={1} max={100} defaultValue={selectedRoom?.totalUnits} id="totalUnits" className="mt-1.5" />
              </div>
              <Button onClick={() => { const input = document.getElementById('totalUnits') as HTMLInputElement; if (selectedRoom) handleUpdateTotalUnits(selectedRoom.id, input.value); }} disabled={actionLoading} className="min-w-[100px]">Update</Button>
            </div>

            <Separator />

            {/* Block Dates */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <CalendarOff className="h-4 w-4 text-destructive" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Block Dates</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={blockDateForm.date} onChange={(e) => setBlockDateForm({ ...blockDateForm, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="mt-1.5" />
              </div>
              <div>
                <Label>Units to Block</Label>
                <Input type="number" min={1} max={selectedRoom?.totalUnits} value={blockDateForm.unitsBlocked} onChange={(e) => setBlockDateForm({ ...blockDateForm, unitsBlocked: parseInt(e.target.value) || 1 })} className="mt-1.5" />
              </div>
              <div>
                <Label>Reason</Label>
                <Input value={blockDateForm.reason} onChange={(e) => setBlockDateForm({ ...blockDateForm, reason: e.target.value })} placeholder="e.g., Maintenance" className="mt-1.5" />
              </div>
            </div>
            <Button onClick={handleBlockDate} disabled={actionLoading} variant="destructive" className="w-full">Block Date</Button>

            <Separator />

            {/* Currently Blocked */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <ShieldBan className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground tracking-wide uppercase">Currently Blocked</h3>
            </div>
            {blockedDates.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center">
                <CalendarOff className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No dates currently blocked</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {blockedDates.map((blocked) => (
                  <div key={blocked.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                    <div>
                      <p className="font-medium text-foreground text-sm">{new Date(blocked.date).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{blocked.unitsBlocked} unit(s){blocked.reason && ` · ${blocked.reason}`}</p>
                    </div>
                    <Button onClick={() => handleUnblockDate(blocked.id)} disabled={actionLoading} variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">Unblock</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
