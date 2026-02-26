'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { KpiCard } from '@/components/admin/KpiCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { DollarSign, BedDouble, Users, CalendarCheck, ArrowRight, Lightbulb, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { revenueSuggestions } from '@/lib/revenueData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';

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
  createdAt: string;
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
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [recentReservations, setRecentReservations] = useState<GroupedReservation[]>([]);
  const [todayCheckIns, setTodayCheckIns] = useState<GroupedReservation[]>([]);
  const [revenueChartData, setRevenueChartData] = useState<{ month: string; revenue: number }[]>([]);
  const [occupancyChartData, setOccupancyChartData] = useState<{ month: string; rate: number }[]>([]);
  const [kpis, setKpis] = useState({
    totalRevenue: 0,
    occupancyRate: 0,
    totalGuests: 0,
    monthlyBookings: 0,
    totalUnits: 0,
    occupiedToday: 0,
  });

  useEffect(() => {
    fetchDashboardData();
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
      };
    });
  };

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/rooms'),
      ]);
      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();
      const bookings: Booking[] = bookingsData.bookings || [];
      const rooms = roomsData.rooms || [];

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const today = new Date(todayStr + 'T00:00:00.000Z');
      const totalUnits = rooms.reduce((sum: number, room: any) => sum + (room.totalUnits || 1), 0);

      // Today's occupancy
      const occupiedToday = bookings.filter((b) => {
        const checkIn = new Date(b.checkInDate);
        const checkOut = new Date(b.checkOutDate);
        return (b.status === 'CONFIRMED' || b.status === 'COMPLETED') && checkIn <= today && checkOut > today;
      }).length;

      const occupancyRate = totalUnits > 0 ? Math.round((occupiedToday / totalUnits) * 100) : 0;

      // Total guests (unique by grouped reservation)
      const allGrouped = groupBookings(bookings);
      const activeReservations = allGrouped.filter(r => r.status !== 'CANCELLED' && r.status !== 'NO_SHOW');

      // This month's bookings
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const monthlyRaw = bookings.filter((b) => {
        const d = new Date(b.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
      const monthlyBookings = groupBookings(monthlyRaw).length;

      // Total revenue (exclude cancelled/no-show)
      const totalRevenue = bookings
        .filter((b) => b.status !== 'CANCELLED' && b.status !== 'NO_SHOW')
        .reduce((sum, b) => sum + Number(b.totalPrice), 0);

      // Total guests count
      const totalGuests = activeReservations.length;

      setKpis({ totalRevenue, occupancyRate, totalGuests, monthlyBookings, totalUnits, occupiedToday });

      // Recent reservations (top 5)
      setRecentReservations(allGrouped.slice(0, 5));

      // Today's check-ins
      const todaysBookings = bookings.filter((b) => {
        const checkIn = new Date(b.checkInDate).toISOString().split('T')[0];
        return checkIn === todayStr;
      });
      setTodayCheckIns(groupBookings(todaysBookings));

      // Build monthly revenue chart data (last 6 months)
      const revenueByMonth: { month: string; revenue: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const monthLabel = d.toLocaleDateString('en', { month: 'short' });
        const monthBookings = bookings.filter((b) => {
          const cd = new Date(b.createdAt);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear() && b.status !== 'CANCELLED' && b.status !== 'NO_SHOW';
        });
        const rev = monthBookings.reduce((s, b) => s + Number(b.totalPrice), 0);
        revenueByMonth.push({ month: monthLabel, revenue: Math.round(rev) });
      }
      setRevenueChartData(revenueByMonth);

      // Build occupancy chart data (last 6 months - simplified)
      const occByMonth: { month: string; rate: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(currentYear, currentMonth - i, 1);
        const monthLabel = d.toLocaleDateString('en', { month: 'short' });
        const monthBookings = bookings.filter((b) => {
          const ci = new Date(b.checkInDate);
          return ci.getMonth() === d.getMonth() && ci.getFullYear() === d.getFullYear() && (b.status === 'CONFIRMED' || b.status === 'COMPLETED');
        });
        const rate = totalUnits > 0 ? Math.min(100, Math.round((monthBookings.length / totalUnits) * 100)) : 0;
        occByMonth.push({ month: monthLabel, rate });
      }
      setOccupancyChartData(occByMonth);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <KpiCard title="Revenue (MTD)" value={`€${kpis.totalRevenue.toLocaleString()}`} icon={DollarSign} />
        <KpiCard title="Occupancy Rate" value={`${kpis.occupancyRate}%`} icon={BedDouble} />
        <KpiCard title="Total Guests" value={kpis.totalGuests.toString()} icon={Users} />
        <KpiCard title="Bookings" value={kpis.monthlyBookings.toString()} icon={CalendarCheck} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <div className="kpi-card">
          <h3 className="section-title mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueChartData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 62%, 38%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(174, 62%, 38%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)', fontSize: '13px' }}
                formatter={(value) => [`€${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(174, 62%, 38%)" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="kpi-card">
          <h3 className="section-title mb-4">Occupancy Rate</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={occupancyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(220, 10%, 46%)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid hsl(220, 13%, 91%)', fontSize: '13px' }}
                formatter={(value) => [`${value}%`, 'Occupancy']}
              />
              <Bar dataKey="rate" fill="hsl(174, 62%, 38%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Check-ins */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Today&apos;s Check-ins</h3>
            <span className="text-xs font-medium text-primary">{todayCheckIns.length} arrivals</span>
          </div>
          <div className="space-y-3">
            {todayCheckIns.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No check-ins today</p>
            ) : (
              todayCheckIns.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.guestName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.bookings.map(b => b.room.name).join(', ')} · {new Date(item.checkInDate).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="kpi-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Reservations</h3>
            <Link href="/admin/bookings" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="table-header pb-3 text-left">ID</th>
                  <th className="table-header pb-3 text-left">Guest</th>
                  <th className="table-header pb-3 text-left">Room</th>
                  <th className="table-header pb-3 text-left">Check-in</th>
                  <th className="table-header pb-3 text-left">Status</th>
                  <th className="table-header pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 text-sm font-medium text-foreground">{r.bookings[0].bookingNumber}</td>
                    <td className="py-3 text-sm text-foreground">{r.guestName}</td>
                    <td className="py-3 text-sm text-muted-foreground">{r.bookings.map(b => b.room.name).join(', ')}</td>
                    <td className="py-3 text-sm text-muted-foreground">{new Date(r.checkInDate).toLocaleDateString()}</td>
                    <td className="py-3"><StatusBadge status={r.status} /></td>
                    <td className="py-3 text-sm font-medium text-foreground text-right">€{Number(r.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Revenue Suggestions Card */}
      <div className="mt-8">
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-[hsl(38,92%,50%)]" />
              <h3 className="section-title">Revenue Suggestions</h3>
            </div>
            <Link href="/admin/revenue/suggestions" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {revenueSuggestions.filter(s => s.status === 'pending').slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={s.urgency === 'high' ? 'destructive' : s.urgency === 'medium' ? 'default' : 'secondary'} className="text-xs">{s.urgency}</Badge>
                    <span className="text-xs text-muted-foreground">{s.roomType}</span>
                  </div>
                  <p className="text-sm text-foreground truncate">{s.message}</p>
                  <span className="text-xs text-[hsl(152,60%,40%)] font-medium flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> {s.estimatedRevenue}
                  </span>
                </div>
                <Badge variant="outline" className="shrink-0">{s.suggestedChange}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
