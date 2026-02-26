import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { roomTypes } from "@/lib/mockData";
import type { PricingEvent } from "@/lib/revenueData";

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: PricingEvent | null;
  onSave: (event: Omit<PricingEvent, "id">) => void;
}

export function EventModal({ open, onOpenChange, event, onSave }: EventModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [percentageIncrease, setPercentageIncrease] = useState("");
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(["all"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setStartDate(new Date(event.startDate));
      setEndDate(new Date(event.endDate));
      setPercentageIncrease(String(event.percentageIncrease));
      setSelectedRoomTypes(["all"]);
    } else {
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
      setPercentageIncrease("");
      setSelectedRoomTypes(["all"]);
    }
    setErrors({});
    setHasUnsavedChanges(false);
  }, [event, open]);

  const handleFieldChange = () => setHasUnsavedChanges(true);

  const toggleRoomType = (id: string) => {
    handleFieldChange();
    if (id === "all") {
      setSelectedRoomTypes(["all"]);
    } else {
      setSelectedRoomTypes((prev) => {
        const without = prev.filter((r) => r !== "all" && r !== id);
        if (prev.includes(id)) return without.length === 0 ? ["all"] : without;
        return [...without, id];
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Event name is required";
    if (!startDate) errs.startDate = "Start date is required";
    if (!endDate) errs.endDate = "End date is required";
    if (startDate && endDate && startDate >= endDate) errs.endDate = "End date must be after start date";
    if (!percentageIncrease || isNaN(Number(percentageIncrease))) errs.percentageIncrease = "Valid percentage is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const colors = ["hsl(280, 60%, 55%)", "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)", "hsl(152, 60%, 40%)"];
    onSave({
      name: name.trim(),
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      percentageIncrease: Number(percentageIncrease),
      color: event?.color || colors[Math.floor(Math.random() * colors.length)],
    });
    onOpenChange(false);
  };

  const handleClose = (val: boolean) => {
    if (!val && hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to close?")) return;
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>Configure event-based pricing overrides.</DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-amber-300/30 bg-amber-50 p-3 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">Event pricing overrides seasonal and weekend pricing for the specified dates.</p>
        </div>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Event Name *</Label>
            <Input placeholder="e.g. City Music Festival" value={name} onChange={(e) => { setName(e.target.value); handleFieldChange(); }} />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-[var(--admin-text-muted)]")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={startDate} onSelect={(d) => { setStartDate(d); handleFieldChange(); }} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-[var(--admin-text-muted)]")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={endDate} onSelect={(d) => { setEndDate(d); handleFieldChange(); }} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Price Increase *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--admin-text-muted)]">+</span>
              <Input type="number" placeholder="e.g. 35" value={percentageIncrease} onChange={(e) => { setPercentageIncrease(e.target.value); handleFieldChange(); }} className="w-32" />
              <span className="text-sm text-[var(--admin-text-muted)]">%</span>
            </div>
            {errors.percentageIncrease && <p className="text-xs text-red-500">{errors.percentageIncrease}</p>}
          </div>

          <div className="space-y-2">
            <Label>Room Types</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedRoomTypes.includes("all") ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleRoomType("all")}>All Room Types</Badge>
              {roomTypes.map((rt) => (
                <Badge key={rt.id} variant={selectedRoomTypes.includes(rt.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleRoomType(rt.id)}>{rt.name}</Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
