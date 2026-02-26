import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { roomTypes } from "@/lib/mockData";
import type { MinStayRule } from "@/lib/revenueData";

interface MinStayModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: MinStayRule | null;
  onSave: (rule: Omit<MinStayRule, "id">) => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function MinStayModal({ open, onOpenChange, rule, onSave }: MinStayModalProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [roomTypeId, setRoomTypeId] = useState("all");
  const [selectedDays, setSelectedDays] = useState<string[]>(["all"]);
  const [minNights, setMinNights] = useState("");
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rule) {
      setStartDate(new Date(rule.startDate));
      setEndDate(new Date(rule.endDate));
      setRoomTypeId(rule.roomTypeId);
      setSelectedDays(rule.dayOfWeek === "all" ? ["all"] : [rule.dayOfWeek]);
      setMinNights(String(rule.minNights));
      setActive(rule.status === "Active");
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
      setRoomTypeId("all");
      setSelectedDays(["all"]);
      setMinNights("");
      setActive(true);
    }
    setErrors({});
  }, [rule, open]);

  const toggleDay = (day: string) => {
    if (day === "all") {
      setSelectedDays(["all"]);
    } else {
      setSelectedDays((prev) => {
        const without = prev.filter((d) => d !== "all" && d !== day);
        if (prev.includes(day)) return without.length === 0 ? ["all"] : without;
        return [...without, day];
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!startDate) errs.startDate = "Required";
    if (!endDate) errs.endDate = "Required";
    if (startDate && endDate && startDate >= endDate) errs.endDate = "Must be after start date";
    if (!minNights || Number(minNights) < 1) errs.minNights = "Must be at least 1 night";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      roomTypeId,
      minNights: Number(minNights),
      dayOfWeek: selectedDays.includes("all") ? "all" : selectedDays[0],
      status: active ? "Active" : "Inactive",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Minimum Stay Rule" : "Create Minimum Stay Rule"}</DialogTitle>
          <DialogDescription>Set minimum night requirements for specific dates and room types.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
                  <Calendar mode="single" selected={startDate} onSelect={setStartDate} className="p-3 pointer-events-auto" />
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
                  <Calendar mode="single" selected={endDate} onSelect={setEndDate} className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room Type</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant={roomTypeId === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setRoomTypeId("all")}>All Room Types</Badge>
              {roomTypes.map((rt) => (
                <Badge key={rt.id} variant={roomTypeId === rt.id ? "default" : "outline"} className="cursor-pointer" onClick={() => setRoomTypeId(rt.id)}>{rt.name}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Days of Week</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedDays.includes("all") ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleDay("all")}>All Days</Badge>
              {DAYS_OF_WEEK.map((day) => (
                <Badge key={day} variant={selectedDays.includes(day) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleDay(day)}>{day.slice(0, 3)}</Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Minimum Nights *</Label>
            <Input type="number" min={1} placeholder="e.g. 3" value={minNights} onChange={(e) => setMinNights(e.target.value)} className="w-32" />
            {errors.minNights && <p className="text-xs text-red-500">{errors.minNights}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] p-3">
            <Label>Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--admin-text-muted)]">{active ? "Active" : "Inactive"}</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
