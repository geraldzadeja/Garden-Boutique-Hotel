import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { roomTypes } from "@/lib/mockData";
import type { RatePlan } from "@/lib/revenueData";

interface RatePlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ratePlan?: RatePlan | null;
  roomTypeId: string;
  onSave: (plan: Omit<RatePlan, "id">) => void;
}

const COMMON_SERVICES = ["Wi-Fi", "Parking", "Breakfast for 2", "Late checkout", "Early check-in", "Airport transfer", "Spa access", "Mini bar"];

export function RatePlanModal({ open, onOpenChange, ratePlan, roomTypeId, onSave }: RatePlanModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<RatePlan["type"]>("Flexible");
  const [modifierType, setModifierType] = useState<"percentage" | "fixed">("percentage");
  const [modifierValue, setModifierValue] = useState("");
  const [cancellationPolicy, setCancellationPolicy] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (ratePlan) {
      setName(ratePlan.name);
      setType(ratePlan.type);
      setModifierType(ratePlan.modifierType);
      setModifierValue(String(ratePlan.modifierValue));
      setCancellationPolicy(ratePlan.cancellationPolicy);
      setServices([...ratePlan.includedServices]);
    } else {
      setName("");
      setType("Flexible");
      setModifierType("percentage");
      setModifierValue("");
      setCancellationPolicy("");
      setServices([]);
    }
    setNewService("");
    setErrors({});
    setHasUnsavedChanges(false);
  }, [ratePlan, open]);

  const handleFieldChange = () => setHasUnsavedChanges(true);

  const addService = (service: string) => {
    if (service && !services.includes(service)) {
      setServices([...services, service]);
      handleFieldChange();
    }
    setNewService("");
  };

  const removeService = (service: string) => {
    setServices(services.filter((s) => s !== service));
    handleFieldChange();
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Rate plan name is required";
    if (modifierValue === "" || isNaN(Number(modifierValue))) errs.modifierValue = "Valid modifier value is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      roomTypeId,
      name: name.trim(),
      type,
      modifierType,
      modifierValue: Number(modifierValue),
      cancellationPolicy,
      includedServices: services,
      status: ratePlan?.status || "Active",
    });
    onOpenChange(false);
  };

  const handleClose = (val: boolean) => {
    if (!val && hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Are you sure you want to close?")) return;
    }
    onOpenChange(val);
  };

  const rt = roomTypes.find((r) => r.id === roomTypeId);
  const base = rt?.pricePerNight ?? 0;
  const preview = modifierType === "percentage"
    ? Math.round(base * (1 + Number(modifierValue || 0) / 100))
    : base + Number(modifierValue || 0);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ratePlan ? "Edit Rate Plan" : "Create Rate Plan"}</DialogTitle>
          <DialogDescription>Configure pricing and policies for {rt?.name || "this room type"}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Rate Plan Name *</Label>
            <Input placeholder="e.g. Flexible Rate" value={name} onChange={(e) => { setName(e.target.value); handleFieldChange(); }} />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Select value={type} onValueChange={(v: RatePlan["type"]) => { setType(v); handleFieldChange(); }}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Flexible">Flexible</SelectItem>
                <SelectItem value="Non-refundable">Non-refundable</SelectItem>
                <SelectItem value="Breakfast included">Breakfast included</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Modifier Type</Label>
              <Select value={modifierType} onValueChange={(v: "percentage" | "fixed") => { setModifierType(v); handleFieldChange(); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Modifier Value *</Label>
              <Input type="number" placeholder="e.g. -15" value={modifierValue} onChange={(e) => { setModifierValue(e.target.value); handleFieldChange(); }} />
              {errors.modifierValue && <p className="text-xs text-red-500">{errors.modifierValue}</p>}
            </div>
          </div>

          {base > 0 && (
            <div className="rounded-lg border border-[var(--admin-primary)]/20 bg-[var(--admin-primary-light)] p-3">
              <p className="text-xs text-[var(--admin-text-muted)] mb-1">Price Preview</p>
              <p className="text-sm font-medium">Base EUR{base} &rarr; <span className="text-[var(--admin-primary)] font-semibold">EUR{preview}</span></p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Cancellation Policy</Label>
            <Textarea placeholder="Describe the cancellation terms..." value={cancellationPolicy} onChange={(e) => { setCancellationPolicy(e.target.value); handleFieldChange(); }} />
          </div>

          <div className="space-y-2">
            <Label>Included Services</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {services.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1 pr-1">
                  {s}
                  <button onClick={() => removeService(s)} className="ml-1 rounded-full hover:bg-gray-200 p-0.5"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-1">
              {COMMON_SERVICES.filter((s) => !services.includes(s)).map((s) => (
                <Badge key={s} variant="outline" className="cursor-pointer text-xs" onClick={() => addService(s)}>+ {s}</Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input placeholder="Custom service..." value={newService} onChange={(e) => setNewService(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addService(newService); } }} />
              <Button type="button" variant="outline" size="sm" onClick={() => addService(newService)}>Add</Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Rate Plan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
