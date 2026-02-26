import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { roomTypes } from "@/lib/mockData";
import type { WeekendPricing } from "@/lib/revenueData";

interface WeekendPricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weekendPricing: WeekendPricing;
  onSave: (data: WeekendPricing) => void;
}

const ALL_DAYS = ["Friday", "Saturday", "Sunday"];

export function WeekendPricingModal({ open, onOpenChange, weekendPricing, onSave }: WeekendPricingModalProps) {
  const [enabled, setEnabled] = useState(weekendPricing.enabled);
  const [days, setDays] = useState<string[]>(weekendPricing.days);
  const [modifiers, setModifiers] = useState<Record<string, string>>({});

  useEffect(() => {
    setEnabled(weekendPricing.enabled);
    setDays([...weekendPricing.days]);
    const mods: Record<string, string> = {};
    weekendPricing.modifiers.forEach((m) => { mods[m.roomTypeId] = String(m.percentage); });
    roomTypes.forEach((rt) => { if (!mods[rt.id]) mods[rt.id] = "0"; });
    setModifiers(mods);
  }, [weekendPricing, open]);

  const toggleDay = (day: string) => {
    setDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);
  };

  const handleSave = () => {
    onSave({
      enabled,
      days,
      modifiers: roomTypes.map((rt) => ({ roomTypeId: rt.id, percentage: Number(modifiers[rt.id] || 0) })),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Weekend Pricing</DialogTitle>
          <DialogDescription>Configure weekend pricing modifiers for each room type.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] p-3">
            <Label>Enable Weekend Pricing</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          <div className="space-y-2">
            <Label>Weekend Days</Label>
            <div className="flex gap-4">
              {ALL_DAYS.map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={days.includes(day)} onCheckedChange={() => toggleDay(day)} />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Price Modifier per Room Type</Label>
            {roomTypes.map((rt) => {
              const base = rt.pricePerNight;
              const pct = Number(modifiers[rt.id] || 0);
              const modified = Math.round(base * (1 + pct / 100));
              return (
                <div key={rt.id} className="flex items-center gap-3 rounded-lg border border-[var(--admin-border)] p-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{rt.name}</p>
                    <p className="text-xs text-[var(--admin-text-muted)]">EUR{base} &rarr; EUR{modified}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[var(--admin-text-muted)]">+</span>
                    <Input type="number" className="w-20" value={modifiers[rt.id] || ""} onChange={(e) => setModifiers({ ...modifiers, [rt.id]: e.target.value })} />
                    <span className="text-sm text-[var(--admin-text-muted)]">%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Weekend Pricing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
