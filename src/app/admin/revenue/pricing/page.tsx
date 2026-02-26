'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import StatusBadge from '@/components/admin/StatusBadge';
import { Plus, Pencil, Trash2, Sun, Calendar, PartyPopper, Clock } from 'lucide-react';
import {
  seasons as initialSeasons,
  weekendPricing as initialWeekendPricing,
  pricingEvents as initialEvents,
  minStayRules as initialMinStayRules,
  getRoomTypeName,
  type Season,
  type WeekendPricing,
  type PricingEvent,
  type MinStayRule,
} from '@/lib/revenueData';
import { roomTypes } from '@/lib/mockData';
import { SeasonModal } from '@/components/admin/revenue/SeasonModal';
import { WeekendPricingModal } from '@/components/admin/revenue/WeekendPricingModal';
import { EventModal } from '@/components/admin/revenue/EventModal';
import { MinStayModal } from '@/components/admin/revenue/MinStayModal';
import { DeleteConfirmModal } from '@/components/admin/revenue/DeleteConfirmModal';
import { toast } from 'sonner';

export default function PricingRulesPage() {
  const [activeTab, setActiveTab] = useState('seasonal');

  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);
  const [weekendPricingData, setWeekendPricingData] = useState<WeekendPricing>(initialWeekendPricing);
  const [events, setEvents] = useState<PricingEvent[]>(initialEvents);
  const [minStayRules, setMinStayRules] = useState<MinStayRule[]>(initialMinStayRules);

  const [seasonModalOpen, setSeasonModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [weekendModalOpen, setWeekendModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PricingEvent | null>(null);
  const [minStayModalOpen, setMinStayModalOpen] = useState(false);
  const [editingMinStay, setEditingMinStay] = useState<MinStayRule | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  const handleDeleteClick = (type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'season') {
      setSeasons(prev => prev.filter(s => s.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'event') {
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
    } else if (deleteTarget.type === 'minstay') {
      setMinStayRules(prev => prev.filter(r => r.id !== deleteTarget.id));
    }
    toast.success(`${deleteTarget.name} deleted successfully.`);
    setDeleteTarget(null);
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Pricing Rules</h1>
        <p className="page-subtitle">Manage seasonal, weekend, event pricing and minimum stay rules.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="seasonal" className="gap-2"><Sun className="h-4 w-4" /> Seasonal</TabsTrigger>
          <TabsTrigger value="weekend" className="gap-2"><Calendar className="h-4 w-4" /> Weekend</TabsTrigger>
          <TabsTrigger value="events" className="gap-2"><PartyPopper className="h-4 w-4" /> Events</TabsTrigger>
          <TabsTrigger value="minstay" className="gap-2"><Clock className="h-4 w-4" /> Min Stay</TabsTrigger>
        </TabsList>

        {/* Seasonal Pricing */}
        <TabsContent value="seasonal">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Seasons</h2>
            <Button size="sm" className="gap-2" onClick={() => { setEditingSeason(null); setSeasonModalOpen(true); }}><Plus className="h-4 w-4" /> Add Season</Button>
          </div>

          {seasons.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Sun className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No seasonal pricing rules configured yet.</p>
                <Button size="sm" className="gap-2" onClick={() => { setEditingSeason(null); setSeasonModalOpen(true); }}><Plus className="h-4 w-4" /> Create First Season</Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Season Calendar Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {seasons.map(s => (
                      <div key={s.id} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.startDate} → {s.endDate}</span>
                        <Badge variant="outline" className="text-xs">
                          {s.modifierValue > 0 ? '+' : ''}{s.modifierValue}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {seasons.map(season => (
                  <Card key={season.id}>
                    <CardContent className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: season.color + '22' }}>
                          <Sun className="h-5 w-5" style={{ color: season.color }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{season.name}</p>
                          <p className="text-xs text-muted-foreground">{season.startDate} → {season.endDate} · {getRoomTypeName(season.roomTypeId)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={season.modifierValue > 0 ? 'default' : 'secondary'}>
                          {season.modifierType === 'percentage' ? `${season.modifierValue > 0 ? '+' : ''}${season.modifierValue}%` : `€${season.modifierValue}`}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => { setEditingSeason(season); setSeasonModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick('season', season.id, season.name)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Weekend Pricing */}
        <TabsContent value="weekend">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Weekend Pricing</h2>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="gap-2" onClick={() => setWeekendModalOpen(true)}><Pencil className="h-4 w-4" /> Edit</Button>
              <span className="text-sm text-muted-foreground">Enable Weekend Pricing</span>
              <Switch checked={weekendPricingData.enabled} />
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Weekend Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <Badge key={day} variant={weekendPricingData.days.includes(day) ? 'default' : 'outline'} className="cursor-pointer">{day.slice(0, 3)}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {weekendPricingData.modifiers.map(mod => {
              const rt = roomTypes.find(r => r.id === mod.roomTypeId);
              const basePrice = rt?.pricePerNight ?? 0;
              const weekendPrice = Math.round(basePrice * (1 + mod.percentage / 100));
              return (
                <Card key={mod.roomTypeId}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{rt?.name}</p>
                      <p className="text-xs text-muted-foreground">Base: €{basePrice} → Weekend: €{weekendPrice}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>+{mod.percentage}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Event Pricing */}
        <TabsContent value="events">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Event Pricing</h2>
            <Button size="sm" className="gap-2" onClick={() => { setEditingEvent(null); setEventModalOpen(true); }}><Plus className="h-4 w-4" /> Add Event</Button>
          </div>

          <p className="text-xs text-muted-foreground mb-4">Event pricing overrides seasonal and weekend pricing for the specified dates.</p>

          {events.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <PartyPopper className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No event pricing rules configured yet.</p>
                <Button size="sm" className="gap-2" onClick={() => { setEditingEvent(null); setEventModalOpen(true); }}><Plus className="h-4 w-4" /> Create First Event</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map(event => (
                <Card key={event.id}>
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: event.color + '22' }}>
                        <PartyPopper className="h-5 w-5" style={{ color: event.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.startDate} → {event.endDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive">+{event.percentageIncrease}%</Badge>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(event); setEventModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick('event', event.id, event.name)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Minimum Stay Rules */}
        <TabsContent value="minstay">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">Minimum Stay Rules</h2>
            <Button size="sm" className="gap-2" onClick={() => { setEditingMinStay(null); setMinStayModalOpen(true); }}><Plus className="h-4 w-4" /> Add Rule</Button>
          </div>

          {minStayRules.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">No minimum stay rules configured yet.</p>
                <Button size="sm" className="gap-2" onClick={() => { setEditingMinStay(null); setMinStayModalOpen(true); }}><Plus className="h-4 w-4" /> Create First Rule</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="table-header p-4 text-left">Date Range</th>
                        <th className="table-header p-4 text-left">Room Type</th>
                        <th className="table-header p-4 text-left">Day</th>
                        <th className="table-header p-4 text-center">Min Nights</th>
                        <th className="table-header p-4 text-center">Status</th>
                        <th className="table-header p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {minStayRules.map(rule => (
                        <tr key={rule.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-4 text-sm text-foreground">{rule.startDate} → {rule.endDate}</td>
                          <td className="p-4 text-sm text-foreground">{getRoomTypeName(rule.roomTypeId)}</td>
                          <td className="p-4 text-sm text-muted-foreground">{rule.dayOfWeek === 'all' ? 'All Days' : rule.dayOfWeek}</td>
                          <td className="p-4 text-sm font-semibold text-foreground text-center">{rule.minNights}</td>
                          <td className="p-4 text-center"><StatusBadge status={rule.status} /></td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => { setEditingMinStay(rule); setMinStayModalOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick('minstay', rule.id, `Min Stay Rule (${rule.minNights} nights)`)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <SeasonModal
        open={seasonModalOpen}
        onOpenChange={setSeasonModalOpen}
        season={editingSeason}
        onSave={(data) => {
          if (editingSeason) {
            setSeasons(prev => prev.map(s => s.id === editingSeason.id ? { ...s, ...data } : s));
            toast.success('Season updated successfully.');
          } else {
            setSeasons(prev => [...prev, { ...data, id: `S${Date.now()}` }]);
            toast.success('Season created successfully.');
          }
        }}
      />

      <WeekendPricingModal
        open={weekendModalOpen}
        onOpenChange={setWeekendModalOpen}
        weekendPricing={weekendPricingData}
        onSave={(data) => {
          setWeekendPricingData(data);
          toast.success('Weekend pricing updated.');
        }}
      />

      <EventModal
        open={eventModalOpen}
        onOpenChange={setEventModalOpen}
        event={editingEvent}
        onSave={(data) => {
          if (editingEvent) {
            setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...data } : e));
            toast.success('Event updated successfully.');
          } else {
            setEvents(prev => [...prev, { ...data, id: `E${Date.now()}` }]);
            toast.success('Event created successfully.');
          }
        }}
      />

      <MinStayModal
        open={minStayModalOpen}
        onOpenChange={setMinStayModalOpen}
        rule={editingMinStay}
        onSave={(data) => {
          if (editingMinStay) {
            setMinStayRules(prev => prev.map(r => r.id === editingMinStay.id ? { ...r, ...data } : r));
            toast.success('Rule updated successfully.');
          } else {
            setMinStayRules(prev => [...prev, { ...data, id: `MS${Date.now()}` }]);
            toast.success('Rule created successfully.');
          }
        }}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Pricing Rule"
        description="Are you sure you want to delete this rule? This action cannot be undone and will affect future pricing."
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
