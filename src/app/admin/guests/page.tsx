'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import StatusBadge from '@/components/admin/StatusBadge';
import { KpiCard } from '@/components/admin/KpiCard';
import { Users, Banknote, CalendarCheck, Search, Eye } from 'lucide-react';

interface Booking {
  id: string;
  bookingNumber: string;
  reservationGroupId?: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  room: { name: string };
  createdAt: string;
}

interface GroupedReservation {
  bookings: Booking[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Guest {
  name: string;
  email: string;
  phone: string;
  totalReservations: number;
  totalSpent: number;
  lastBooking: string;
  reservations: GroupedReservation[];
}

export default function AdminGuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchGuests(); }, []);

  const fetchGuests = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      const bookings = data.bookings || [];

      const groupBookings = (bookings: any[]): GroupedReservation[] => {
        const groupMap = new Map<string, any[]>();
        bookings.forEach(booking => {
          const key = booking.reservationGroupId || booking.id;
          if (!groupMap.has(key)) groupMap.set(key, []);
          groupMap.get(key)!.push(booking);
        });

        return Array.from(groupMap.values()).map((bookings) => {
          const firstBooking = bookings[0];
          const totalPrice = bookings.reduce((sum: number, b: any) => sum + Number(b.totalPrice), 0);
          return {
            bookings: bookings.map((b: any) => ({
              id: b.id, bookingNumber: b.bookingNumber, reservationGroupId: b.reservationGroupId,
              checkInDate: b.checkInDate, checkOutDate: b.checkOutDate, status: b.status,
              totalPrice: Number(b.totalPrice), room: b.room, createdAt: b.createdAt,
            })),
            totalPrice,
            status: firstBooking.status,
            createdAt: firstBooking.createdAt,
          };
        });
      };

      const groupedReservations = groupBookings(bookings);
      const guestMap = new Map<string, Guest>();

      bookings.forEach((booking: any) => {
        if (!guestMap.has(booking.guestEmail)) {
          const actualGuestReservations = groupedReservations.filter(res => {
            const firstBookingOfRes = bookings.find((b: any) => b.id === res.bookings[0].id);
            return firstBookingOfRes && firstBookingOfRes.guestEmail === booking.guestEmail;
          });

          const hasValidReservation = actualGuestReservations.some(
            res => res.status !== 'CANCELLED' && res.status !== 'NO_SHOW'
          );
          if (!hasValidReservation) return;

          const validReservations = actualGuestReservations.filter(
            res => res.status !== 'CANCELLED' && res.status !== 'NO_SHOW'
          );
          const totalSpent = validReservations.reduce((sum, res) => sum + res.totalPrice, 0);
          const lastBooking = validReservations.reduce((latest, res) => {
            return new Date(res.createdAt) > new Date(latest) ? res.createdAt : latest;
          }, validReservations[0]?.createdAt || new Date().toISOString());

          guestMap.set(booking.guestEmail, {
            name: booking.guestName,
            email: booking.guestEmail,
            phone: booking.guestPhone,
            totalReservations: validReservations.length,
            totalSpent,
            lastBooking,
            reservations: validReservations,
          });
        }
      });

      setGuests(Array.from(guestMap.values()));
    } catch (error) {
      console.error('Error fetching guests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" /></div>;
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Guests</h1>
        <p className="page-subtitle">Guest profiles and booking history</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <KpiCard title="Total Guests" value={guests.length} icon={Users} />
        <KpiCard title="Total Reservations" value={guests.reduce((sum, g) => sum + g.totalReservations, 0)} icon={CalendarCheck} />
        <KpiCard title="Total Revenue" value={`€${guests.reduce((sum, g) => sum + g.totalSpent, 0).toFixed(0)}`} icon={Banknote} />
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Guests Table */}
      {filteredGuests.length === 0 ? (
        <div className="kpi-card text-center py-8">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No guests found</p>
        </div>
      ) : (
        <div className="kpi-card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header p-4 text-left">Guest</th>
                  <th className="table-header p-4 text-left">Contact</th>
                  <th className="table-header p-4 text-center">Reservations</th>
                  <th className="table-header p-4 text-right">Total Spent</th>
                  <th className="table-header p-4 text-left">Last Booking</th>
                  <th className="table-header p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map(guest => (
                  <tr key={guest.email} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 shrink-0">
                          <span className="text-sm font-semibold text-primary">{guest.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{guest.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{guest.email}</p>
                      <p className="text-xs text-muted-foreground">{guest.phone}</p>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground text-center">{guest.totalReservations}</td>
                    <td className="p-4 text-sm font-semibold text-foreground text-right">€{guest.totalSpent.toFixed(2)}</td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(guest.lastBooking)}</td>
                    <td className="p-4 text-center">
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setSelectedGuest(guest)}>
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guest Detail Dialog */}
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-semibold text-primary">{selectedGuest?.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-base font-semibold">{selectedGuest?.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{selectedGuest?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedGuest && (
            <div className="space-y-6 pt-2">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Reservations</p>
                  <p className="text-xl font-semibold text-foreground mt-1">{selectedGuest.totalReservations}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-semibold text-foreground mt-1">€{selectedGuest.totalSpent.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground mt-1">{selectedGuest.phone}</p>
                </div>
              </div>

              {/* Reservation History */}
              <div>
                <h3 className="section-title mb-3">Reservation History</h3>
                <div className="space-y-3">
                  {selectedGuest.reservations.map((reservation, index) => (
                    <div key={index} className="rounded-lg border border-border p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{reservation.bookings[0].bookingNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {reservation.bookings.map(b => b.room.name).join(', ')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDate(reservation.bookings[0].checkInDate)} - {formatDate(reservation.bookings[0].checkOutDate)}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p className="text-sm font-semibold text-foreground">€{reservation.totalPrice.toFixed(2)}</p>
                          <StatusBadge status={reservation.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
