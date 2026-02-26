import { roomTypes } from "./mockData";

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  modifierType: "percentage" | "fixed";
  modifierValue: number;
  roomTypeId: string | "all";
  color: string;
}

export interface WeekendPricing {
  enabled: boolean;
  days: string[];
  modifiers: { roomTypeId: string; percentage: number }[];
}

export interface PricingEvent {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  percentageIncrease: number;
  color: string;
}

export interface MinStayRule {
  id: string;
  startDate: string;
  endDate: string;
  roomTypeId: string | "all";
  minNights: number;
  dayOfWeek: string | "all";
  status: "Active" | "Inactive";
}

export interface RatePlan {
  id: string;
  roomTypeId: string;
  name: string;
  type: "Flexible" | "Non-refundable" | "Breakfast included";
  modifierType: "percentage" | "fixed";
  modifierValue: number;
  cancellationPolicy: string;
  includedServices: string[];
  status: "Active" | "Inactive";
}

export interface RevenueSuggestion {
  id: string;
  roomType: string;
  message: string;
  suggestedChange: string;
  estimatedRevenue: string;
  urgency: "high" | "medium" | "low";
  status: "pending" | "applied" | "ignored";
}

export const seasons: Season[] = [
  { id: "S1", name: "High Season", startDate: "2026-06-15", endDate: "2026-09-15", modifierType: "percentage", modifierValue: 25, roomTypeId: "all", color: "hsl(0, 72%, 60%)" },
  { id: "S2", name: "Winter Holiday", startDate: "2026-12-20", endDate: "2027-01-05", modifierType: "percentage", modifierValue: 30, roomTypeId: "all", color: "hsl(210, 70%, 50%)" },
  { id: "S3", name: "Spring Break", startDate: "2026-03-15", endDate: "2026-04-05", modifierType: "percentage", modifierValue: 15, roomTypeId: "all", color: "hsl(152, 60%, 40%)" },
  { id: "S4", name: "Low Season", startDate: "2026-01-10", endDate: "2026-03-14", modifierType: "percentage", modifierValue: -10, roomTypeId: "all", color: "hsl(220, 10%, 60%)" },
];

export const weekendPricing: WeekendPricing = {
  enabled: true,
  days: ["Friday", "Saturday"],
  modifiers: [
    { roomTypeId: "deluxe-double", percentage: 15 },
    { roomTypeId: "deluxe-twin", percentage: 12 },
    { roomTypeId: "deluxe-triple", percentage: 10 },
    { roomTypeId: "double-room", percentage: 8 },
  ],
};

export const pricingEvents: PricingEvent[] = [
  { id: "E1", name: "City Music Festival", startDate: "2026-07-10", endDate: "2026-07-14", percentageIncrease: 35, color: "hsl(280, 60%, 55%)" },
  { id: "E2", name: "National Holiday Weekend", startDate: "2026-05-01", endDate: "2026-05-04", percentageIncrease: 20, color: "hsl(38, 92%, 50%)" },
  { id: "E3", name: "New Year's Eve", startDate: "2026-12-30", endDate: "2027-01-02", percentageIncrease: 45, color: "hsl(0, 72%, 51%)" },
];

export const minStayRules: MinStayRule[] = [
  { id: "MS1", startDate: "2026-06-15", endDate: "2026-09-15", roomTypeId: "all", minNights: 3, dayOfWeek: "all", status: "Active" },
  { id: "MS2", startDate: "2026-12-20", endDate: "2027-01-05", roomTypeId: "deluxe-double", minNights: 4, dayOfWeek: "all", status: "Active" },
  { id: "MS3", startDate: "2026-01-01", endDate: "2026-12-31", roomTypeId: "all", minNights: 2, dayOfWeek: "Saturday", status: "Active" },
  { id: "MS4", startDate: "2026-05-01", endDate: "2026-05-04", roomTypeId: "deluxe-triple", minNights: 2, dayOfWeek: "all", status: "Inactive" },
];

export const ratePlans: RatePlan[] = [
  { id: "RP1", roomTypeId: "deluxe-double", name: "Flexible Rate", type: "Flexible", modifierType: "percentage", modifierValue: 0, cancellationPolicy: "Free cancellation up to 24 hours before check-in. Full refund available at reception.", includedServices: ["Wi-Fi", "Parking"], status: "Active" },
  { id: "RP2", roomTypeId: "deluxe-double", name: "Non-refundable Saver", type: "Non-refundable", modifierType: "percentage", modifierValue: -15, cancellationPolicy: "Non-refundable. No changes or cancellations allowed after booking.", includedServices: ["Wi-Fi"], status: "Active" },
  { id: "RP3", roomTypeId: "deluxe-double", name: "Breakfast Package", type: "Breakfast included", modifierType: "fixed", modifierValue: 35, cancellationPolicy: "Free cancellation up to 48 hours before check-in.", includedServices: ["Wi-Fi", "Breakfast for 2", "Late checkout"], status: "Active" },
  { id: "RP4", roomTypeId: "deluxe-twin", name: "Flexible Rate", type: "Flexible", modifierType: "percentage", modifierValue: 0, cancellationPolicy: "Free cancellation up to 24 hours before check-in.", includedServices: ["Wi-Fi", "Parking"], status: "Active" },
  { id: "RP5", roomTypeId: "deluxe-twin", name: "Non-refundable Saver", type: "Non-refundable", modifierType: "percentage", modifierValue: -12, cancellationPolicy: "Non-refundable. No modifications allowed.", includedServices: ["Wi-Fi"], status: "Active" },
  { id: "RP6", roomTypeId: "double-room", name: "Flexible Rate", type: "Flexible", modifierType: "percentage", modifierValue: 0, cancellationPolicy: "Free cancellation up to 24 hours before check-in.", includedServices: ["Wi-Fi"], status: "Active" },
  { id: "RP7", roomTypeId: "double-room", name: "Breakfast Package", type: "Breakfast included", modifierType: "fixed", modifierValue: 25, cancellationPolicy: "Free cancellation up to 48 hours before check-in.", includedServices: ["Wi-Fi", "Breakfast for 2"], status: "Active" },
];

export const revenueSuggestions: RevenueSuggestion[] = [
  { id: "RS1", roomType: "Deluxe Double Room", message: "Deluxe Double Room is 95% booked next weekend. Demand is exceptionally high.", suggestedChange: "+15% price increase", estimatedRevenue: "+€672 extra revenue", urgency: "high", status: "pending" },
  { id: "RS2", roomType: "Double Room", message: "Double Room is only 25% booked 5 days before arrival. Consider a discount to fill inventory.", suggestedChange: "-10% discount", estimatedRevenue: "+€420 vs empty rooms", urgency: "high", status: "pending" },
  { id: "RS3", roomType: "Deluxe Twin Room", message: "Deluxe Twin Room has 60% occupancy for next month. Slightly below average.", suggestedChange: "-5% adjustment", estimatedRevenue: "+€310 potential gain", urgency: "medium", status: "pending" },
  { id: "RS4", roomType: "Deluxe Triple Room", message: "Deluxe Triple Room during City Music Festival (Jul 10-14) has only 1 room left.", suggestedChange: "+25% premium pricing", estimatedRevenue: "+€420 extra revenue", urgency: "high", status: "pending" },
  { id: "RS5", roomType: "Double Room", message: "Midweek occupancy for Double Rooms is consistently below 40%.", suggestedChange: "Midweek -8% promo", estimatedRevenue: "+€560 monthly gain", urgency: "low", status: "pending" },
];

export function getRoomTypeName(id: string): string {
  if (id === "all") return "All Room Types";
  const rt = roomTypes.find((r) => r.id === id);
  return rt?.name ?? id;
}
