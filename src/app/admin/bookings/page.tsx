'use client';

import { useEffect, useState } from 'react';
import StatusBadge from '@/components/admin/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Search } from 'lucide-react';
import CustomDatePicker from '@/components/CustomDatePicker';

interface Booking {
  id: string;
  bookingNumber: string;
  reservationGroupId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: { name: string; id: string };
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  adminNotes?: string;
  createdAt: string;
  cancelledAt?: string;
}

interface GroupedReservation {
  id: string;
  reservationGroupId: string | null;
  bookings: Booking[];
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfNights: number;
  numberOfGuests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
  cancelledAt?: string;
}

const filters = ['All', 'Cancelled', 'No Show'];

export default function AdminBookingsPage() {
  const [groupedReservations, setGroupedReservations] = useState<GroupedReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<GroupedReservation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const groupBookings = (bookings: Booking[]): GroupedReservation[] => {
    const groupMap = new Map<string, Booking[]>();
    bookings.forEach(booking => {
      const key = booking.reservationGroupId || booking.id;
      if (!groupMap.has(key)) groupMap.set(key, []);
      groupMap.get(key)!.push(booking);
    });
    return Array.from(groupMap.entries()).map(([key, bookings]) => {
      const first = bookings[0];
      return {
        id: key,
        reservationGroupId: first.reservationGroupId || null,
        bookings,
        guestName: first.guestName,
        guestEmail: first.guestEmail,
        guestPhone: first.guestPhone,
        checkInDate: first.checkInDate,
        checkOutDate: first.checkOutDate,
        numberOfNights: first.numberOfNights,
        numberOfGuests: first.numberOfGuests,
        totalPrice: bookings.reduce((sum, b) => sum + Number(b.totalPrice), 0),
        status: first.status,
        specialRequests: first.specialRequests,
        createdAt: first.createdAt,
        cancelledAt: first.cancelledAt,
      };
    });
  };

  const isCurrentMonth = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth();
  };

  const fetchBookings = async () => {
    try {
      await fetch('/api/bookings/cleanup', { method: 'POST' }).catch(() => {});
      const response = await fetch('/api/bookings');
      const data = await response.json();
      const fetchedBookings = data.bookings || [];
      setGroupedReservations(groupBookings(fetchedBookings));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (reservation: GroupedReservation, newStatus: string) => {
    setActionLoading(true);
    try {
      const bookingIds = reservation.bookings.map(b => b.id);
      const updatePromises = bookingIds.map(id =>
        fetch(`/api/bookings/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })
      );
      const responses = await Promise.all(updatePromises);
      if (responses.every(r => r.ok)) {
        await fetchBookings();
        setSelectedReservation(null);
      } else {
        alert('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error updating booking status');
    }
    setActionLoading(false);
  };

  const filtered = groupedReservations.filter((r) => {
    // Status filter
    let passesFilter = true;
    if (activeFilter === 'All') {
      passesFilter = r.status !== 'CANCELLED' || isCurrentMonth(r.cancelledAt);
    } else if (activeFilter === 'No Show') {
      passesFilter = r.status === 'NO_SHOW';
    } else if (activeFilter === 'Cancelled') {
      passesFilter = r.status === 'CANCELLED' && isCurrentMonth(r.cancelledAt);
    } else {
      passesFilter = r.status.toLowerCase() === activeFilter.toLowerCase();
    }
    if (!passesFilter) return false;

    // Date range filter
    if (dateFrom) {
      const from = new Date(dateFrom + 'T00:00:00');
      const checkIn = new Date(r.checkInDate);
      if (checkIn < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59');
      const checkIn = new Date(r.checkInDate);
      if (checkIn > to) return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        r.guestName.toLowerCase().includes(term) ||
        r.guestEmail.toLowerCase().includes(term) ||
        r.bookings[0].bookingNumber.toLowerCase().includes(term) ||
        r.bookings.some(b => b.room.name.toLowerCase().includes(term))
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm">Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Bookings</h1>
        <p className="page-subtitle">Manage reservations and booking details</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by guest name, email, booking ID, or room..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-2 mb-6 relative z-20">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {f}
          </button>
        ))}

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">From</span>
          <CustomDatePicker
            label=""
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="Start date"
            variant="admin"
          />
          <span className="text-xs text-muted-foreground">To</span>
          <CustomDatePicker
            label=""
            value={dateTo}
            onChange={setDateTo}
            placeholder="End date"
            minDate={dateFrom}
            variant="admin"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="kpi-card overflow-x-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No bookings match the selected filter</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="table-header pb-3 text-left">Booking ID</th>
                <th className="table-header pb-3 text-left">Guest</th>
                <th className="table-header pb-3 text-left">Room</th>
                <th className="table-header pb-3 text-left">Check-in</th>
                <th className="table-header pb-3 text-left">Check-out</th>
                <th className="table-header pb-3 text-left">Status</th>
                <th className="table-header pb-3 text-right">Amount</th>
                <th className="table-header pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 text-sm font-medium text-foreground">{r.bookings[0].bookingNumber}</td>
                  <td className="py-3.5 text-sm text-foreground">{r.guestName}</td>
                  <td className="py-3.5 text-sm text-muted-foreground">{r.bookings.map(b => b.room.name).join(', ')}</td>
                  <td className="py-3.5 text-sm text-muted-foreground">{new Date(r.checkInDate).toLocaleDateString()}</td>
                  <td className="py-3.5 text-sm text-muted-foreground">{new Date(r.checkOutDate).toLocaleDateString()}</td>
                  <td className="py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="py-3.5 text-sm font-medium text-foreground text-right">€{Number(r.totalPrice).toFixed(2)}</td>
                  <td className="py-3.5 text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedReservation(r)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedReservation} onOpenChange={() => setSelectedReservation(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking {selectedReservation?.bookings[0].bookingNumber}</DialogTitle>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Guest</p>
                  <p className="text-sm font-medium">{selectedReservation.guestName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selectedReservation.guestEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selectedReservation.guestPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guests</p>
                  <p className="text-sm font-medium">{selectedReservation.numberOfGuests}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Room(s)</p>
                  <p className="text-sm font-medium">{selectedReservation.bookings.map(b => b.room.name).join(', ')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nights</p>
                  <p className="text-sm font-medium">{selectedReservation.numberOfNights}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="text-sm font-medium">{new Date(selectedReservation.checkInDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="text-sm font-medium">{new Date(selectedReservation.checkOutDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1"><StatusBadge status={selectedReservation.status} /></div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="text-sm font-semibold">€{Number(selectedReservation.totalPrice).toFixed(2)}</p>
                </div>
              </div>

              {selectedReservation.specialRequests && (
                <div>
                  <p className="text-xs text-muted-foreground">Special Requests</p>
                  <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedReservation.specialRequests}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {selectedReservation.status === 'CONFIRMED' && (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 text-destructive" onClick={() => handleStatusChange(selectedReservation, 'CANCELLED')} disabled={actionLoading}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleStatusChange(selectedReservation, 'NO_SHOW')} disabled={actionLoading}>
                      No Show
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
