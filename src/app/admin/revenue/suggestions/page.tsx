'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Check, X, DollarSign, Zap } from 'lucide-react';
import { revenueSuggestions as initialSuggestions, type RevenueSuggestion } from '@/lib/revenueData';
import { ApplySuggestionModal } from '@/components/admin/revenue/ApplySuggestionModal';
import { IgnoreSuggestionModal } from '@/components/admin/revenue/IgnoreSuggestionModal';
import { toast } from 'sonner';

export default function RevenueSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<RevenueSuggestion[]>(initialSuggestions);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [ignoreModalOpen, setIgnoreModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<RevenueSuggestion | null>(null);

  const pending = suggestions.filter(s => s.status === 'pending');
  const applied = suggestions.filter(s => s.status === 'applied');
  const ignored = suggestions.filter(s => s.status === 'ignored');

  const totalPotential = pending.reduce((acc, s) => {
    const match = s.estimatedRevenue.match(/[\d,]+/);
    return acc + (match ? parseInt(match[0].replace(',', '')) : 0);
  }, 0);

  const urgencyColor = (u: string) => {
    switch (u) {
      case 'high': return 'destructive' as const;
      case 'medium': return 'default' as const;
      default: return 'secondary' as const;
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Revenue Suggestions</h1>
        <p className="page-subtitle">Smart pricing assistant — AI-powered insights to maximize revenue.</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending Suggestions</p>
              <p className="text-xl font-semibold text-foreground">{pending.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Estimated Extra Revenue</p>
              <p className="text-xl font-semibold text-foreground">€{totalPotential.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Applied This Month</p>
              <p className="text-xl font-semibold text-foreground">{applied.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Suggestions */}
      <h2 className="section-title mb-4">Active Suggestions</h2>
      <div className="grid gap-4 mb-8">
        {pending.map(s => (
          <Card key={s.id} className="border-l-4" style={{ borderLeftColor: s.urgency === 'high' ? 'hsl(0, 72%, 51%)' : s.urgency === 'medium' ? 'hsl(38, 92%, 50%)' : 'hsl(220, 13%, 91%)' }}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={urgencyColor(s.urgency)} className="text-xs">{s.urgency} priority</Badge>
                    <span className="text-xs text-muted-foreground">{s.roomType}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{s.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-semibold text-primary">{s.suggestedChange}</span>
                    <span className="text-xs text-success font-medium flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {s.estimatedRevenue}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => { setSelectedSuggestion(s); setApplyModalOpen(true); }} className="gap-1">
                    <Check className="h-4 w-4" /> Apply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setSelectedSuggestion(s); setIgnoreModalOpen(true); }} className="gap-1">
                    <X className="h-4 w-4" /> Ignore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {pending.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Check className="h-8 w-8 text-success mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">All suggestions have been reviewed!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* History */}
      {(applied.length > 0 || ignored.length > 0) && (
        <>
          <h2 className="section-title mb-4">History</h2>
          <div className="grid gap-3">
            {[...applied, ...ignored].map(s => (
              <Card key={s.id} className="opacity-70">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">{s.roomType}: {s.suggestedChange}</p>
                    <p className="text-xs text-muted-foreground">{s.estimatedRevenue}</p>
                  </div>
                  <Badge variant={s.status === 'applied' ? 'default' : 'secondary'}>
                    {s.status === 'applied' ? 'Applied' : 'Ignored'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <ApplySuggestionModal
        open={applyModalOpen}
        onOpenChange={setApplyModalOpen}
        suggestion={selectedSuggestion}
        onConfirm={() => {
          if (selectedSuggestion) {
            setSuggestions(prev => prev.map(s => s.id === selectedSuggestion.id ? { ...s, status: 'applied' as const } : s));
            toast.success(`Price change applied for ${selectedSuggestion.roomType}.`);
            setSelectedSuggestion(null);
          }
        }}
      />

      <IgnoreSuggestionModal
        open={ignoreModalOpen}
        onOpenChange={setIgnoreModalOpen}
        suggestion={selectedSuggestion}
        onConfirm={(snooze) => {
          if (selectedSuggestion) {
            setSuggestions(prev => prev.map(s => s.id === selectedSuggestion.id ? { ...s, status: 'ignored' as const } : s));
            toast.success(snooze ? `Suggestion snoozed for ${snooze}.` : 'Suggestion dismissed.');
            setSelectedSuggestion(null);
          }
        }}
      />
    </>
  );
}
