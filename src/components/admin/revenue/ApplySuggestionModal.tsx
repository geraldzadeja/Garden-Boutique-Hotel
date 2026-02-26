import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowRight } from "lucide-react";
import type { RevenueSuggestion } from "@/lib/revenueData";

interface ApplySuggestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestion: RevenueSuggestion | null;
  onConfirm: () => void;
}

export function ApplySuggestionModal({ open, onOpenChange, suggestion, onConfirm }: ApplySuggestionModalProps) {
  if (!suggestion) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply Price Suggestion</DialogTitle>
          <DialogDescription>Review and confirm the suggested pricing change.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="rounded-lg border border-[var(--admin-border)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--admin-text-muted)]">Room Type</span>
              <span className="text-sm font-medium">{suggestion.roomType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--admin-text-muted)]">Suggested Change</span>
              <Badge>{suggestion.suggestedChange}</Badge>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--admin-primary)]/20 bg-[var(--admin-primary-light)] p-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[var(--admin-primary)] shrink-0" />
            <div>
              <p className="text-xs text-[var(--admin-text-muted)]">Estimated Additional Revenue</p>
              <p className="text-lg font-semibold text-[var(--admin-primary)]">{suggestion.estimatedRevenue}</p>
            </div>
          </div>

          <p className="text-xs text-[var(--admin-text-muted)]">{suggestion.message}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} className="gap-2">
            <ArrowRight className="h-4 w-4" /> Apply Price Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
