import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RevenueSuggestion } from "@/lib/revenueData";

interface IgnoreSuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: RevenueSuggestion | null;
  onConfirm: (snooze?: string) => void;
}

export function IgnoreSuggestionModal({ open, onOpenChange, suggestion, onConfirm }: IgnoreSuggestionModalProps) {
  const [snooze, setSnooze] = useState("none");

  if (!suggestion) return null;

  const handleConfirm = () => {
    onConfirm(snooze === "none" ? undefined : snooze);
    setSnooze("none");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Ignore Suggestion</DialogTitle>
          <DialogDescription>Dismiss this pricing suggestion for {suggestion.roomType}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Snooze (optional)</Label>
            <Select value={snooze} onValueChange={setSnooze}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Dismiss permanently</SelectItem>
                <SelectItem value="24h">Snooze for 24 hours</SelectItem>
                <SelectItem value="7d">Snooze for 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="secondary" onClick={handleConfirm}>Ignore</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
