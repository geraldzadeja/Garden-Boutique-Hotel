import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { roomTypes } from "@/lib/mockData";
import type { Season } from "@/lib/revenueData";

interface SeasonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season?: Season | null;
  onSave: (season: Omit<Season, "id">) => void;
}

export function SeasonModal({ open, onOpenChange, season, onSave }: SeasonModalProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [modifierType, setModifierType] = useState<"percentage" | "fixed">("percentage");
  const [modifierValue, setModifierValue] = useState("");
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>(["all"]);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (season) {
      setName(season.name);
      setStartDate(new Date(season.startDate));
      setEndDate(new Date(season.endDate));
      setModifierType(season.modifierType);
      setModifierValue(String(season.modifierValue));
      setSelectedRoomTypes(season.roomTypeId === "all" ? ["all"] : [season.roomTypeId]);
      setActive(true);
    } else {
      setName("");
      setStartDate(undefined);
      setEndDate(undefined);
      setModifierType("percentage");
      setModifierValue("");
      setSelectedRoomTypes(["all"]);
      setActive(true);
    }
    setErrors({});
    setHasUnsavedChanges(false);
  }, [season, open]);

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
    if (!name.trim()) errs.name = "Season name is required";
    if (!startDate) errs.startDate = "Start date is required";
    if (!endDate) errs.endDate = "End date is required";
    if (startDate && endDate && startDate >= endDate) errs.endDate = "End date must be after start date";
    if (!modifierValue || isNaN(Number(modifierValue))) errs.modifierValue = "Valid modifier value is required";
    if (selectedRoomTypes.length === 0) errs.roomTypes = "Select at least one room type";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const colors = ["hsl(0, 72%, 60%)", "hsl(210, 70%, 50%)", "hsl(152, 60%, 40%)", "hsl(38, 92%, 50%)", "hsl(280, 60%, 55%)"];
    onSave({
      name: name.trim(),
      startDate: format(startDate!, "yyyy-MM-dd"),
      endDate: format(endDate!, "yyyy-MM-dd"),
      modifierType,
      modifierValue: Number(modifierValue),
      roomTypeId: selectedRoomTypes.includes("all") ? "all" : selectedRoomTypes[0],
      color: season?.color || colors[Math.floor(Math.random() * colors.length)],
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
          <DialogTitle>{season ? "Edit Season" : "Create Season"}</DialogTitle>
          <DialogDescription>Configure seasonal pricing rules for your room types.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="season-name">Season Name *</Label>
            <Input id="season-name" placeholder="e.g. High Season" value={name} onChange={(e) => { setName(e.target.value); handleFieldChange(); }} />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modifier Type</Label>
              <Select value={modifierType} onValueChange={(v: "percentage" | "fixed") => { setModifierType(v); handleFieldChange(); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (+/-)</SelectItem>
                  <SelectItem value="fixed">Fixed Price (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modifier Value *</Label>
              <Input type="number" placeholder={modifierType === "percentage" ? "e.g. 25" : "e.g. 300"} value={modifierValue} onChange={(e) => { setModifierValue(e.target.value); handleFieldChange(); }} />
              {errors.modifierValue && <p className="text-xs text-red-500">{errors.modifierValue}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room Types *</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedRoomTypes.includes("all") ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleRoomType("all")}>
                All Room Types
              </Badge>
              {roomTypes.map((rt) => (
                <Badge key={rt.id} variant={selectedRoomTypes.includes(rt.id) ? "default" : "outline"} className="cursor-pointer" onClick={() => toggleRoomType(rt.id)}>
                  {rt.name}
                </Badge>
              ))}
            </div>
            {errors.roomTypes && <p className="text-xs text-red-500">{errors.roomTypes}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[var(--admin-border)] p-3">
            <Label htmlFor="season-status">Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--admin-text-muted)]">{active ? "Active" : "Disabled"}</span>
              <Switch id="season-status" checked={active} onCheckedChange={(v) => { setActive(v); handleFieldChange(); }} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Season</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
