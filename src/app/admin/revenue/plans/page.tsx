'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Tag, Check } from 'lucide-react';
import { ratePlans as initialRatePlans, type RatePlan } from '@/lib/revenueData';
import { roomTypes } from '@/lib/mockData';
import { RatePlanModal } from '@/components/admin/revenue/RatePlanModal';
import { DeleteConfirmModal } from '@/components/admin/revenue/DeleteConfirmModal';
import { toast } from 'sonner';

export default function RatePlansPage() {
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypes[0].id);
  const [ratePlans, setRatePlans] = useState<RatePlan[]>(initialRatePlans);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<RatePlan | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RatePlan | null>(null);

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Rate Plans</h1>
            <p className="page-subtitle">Manage rate plans per room type with pricing modifiers and policies.</p>
          </div>
          <Button size="sm" className="gap-2" onClick={() => { setEditingPlan(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> Create Rate Plan</Button>
        </div>
      </div>

      <Tabs value={selectedRoomType} onValueChange={setSelectedRoomType}>
        <TabsList className="mb-6">
          {roomTypes.map(rt => (
            <TabsTrigger key={rt.id} value={rt.id} className="text-xs sm:text-sm">{rt.name}</TabsTrigger>
          ))}
        </TabsList>

        {roomTypes.map(rt => (
          <TabsContent key={rt.id} value={rt.id}>
            <div className="grid gap-4">
              {ratePlans
                .filter(rp => rp.roomTypeId === rt.id)
                .map(plan => {
                  const base = rt.pricePerNight;
                  const finalPrice = plan.modifierType === 'percentage'
                    ? Math.round(base * (1 + plan.modifierValue / 100))
                    : base + plan.modifierValue;

                  return (
                    <Card key={plan.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">{plan.name}</p>
                              <Badge variant="outline" className="mt-1 text-xs">{plan.type}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>{plan.status}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => { setEditingPlan(plan); setModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { setDeleteTarget(plan); setDeleteModalOpen(true); }}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground mb-1">Base Price</p>
                            <p className="text-lg font-semibold text-foreground">€{base}</p>
                          </div>
                          <div className="rounded-lg bg-muted/50 p-3">
                            <p className="text-xs text-muted-foreground mb-1">Modifier</p>
                            <p className="text-lg font-semibold text-foreground">
                              {plan.modifierType === 'percentage'
                                ? `${plan.modifierValue >= 0 ? '+' : ''}${plan.modifierValue}%`
                                : `+€${plan.modifierValue}`}
                            </p>
                          </div>
                          <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
                            <p className="text-xs text-muted-foreground mb-1">Final Price</p>
                            <p className="text-lg font-semibold text-primary">€{finalPrice}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Cancellation Policy</p>
                          <p className="text-sm text-foreground">{plan.cancellationPolicy}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Included Services</p>
                          <div className="flex flex-wrap gap-2">
                            {plan.includedServices.map(service => (
                              <Badge key={service} variant="outline" className="gap-1 text-xs">
                                <Check className="h-3 w-3 text-primary" />
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

              {ratePlans.filter(rp => rp.roomTypeId === rt.id).length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No rate plans for this room type.</p>
                    <Button size="sm" className="mt-4 gap-2" onClick={() => { setEditingPlan(null); setModalOpen(true); }}><Plus className="h-4 w-4" /> Create Rate Plan</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <RatePlanModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        ratePlan={editingPlan}
        roomTypeId={selectedRoomType}
        onSave={(data) => {
          if (editingPlan) {
            setRatePlans(prev => prev.map(p => p.id === editingPlan.id ? { ...p, ...data } : p));
            toast.success('Rate plan updated.');
          } else {
            setRatePlans(prev => [...prev, { ...data, id: `RP${Date.now()}` }]);
            toast.success('Rate plan created.');
          }
        }}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Rate Plan"
        description="Are you sure you want to delete this rate plan? This action cannot be undone and will affect future pricing."
        onConfirm={() => {
          if (deleteTarget) {
            setRatePlans(prev => prev.filter(p => p.id !== deleteTarget.id));
            toast.success(`${deleteTarget.name} deleted.`);
            setDeleteTarget(null);
          }
        }}
      />
    </>
  );
}
