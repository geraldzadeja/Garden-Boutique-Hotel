'use client';

import AvailabilityCalendar from '@/components/admin/AvailabilityCalendar';

export default function AdminAvailabilityPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Availability Calendar</h1>
        <p className="page-subtitle">Manage room availability and inventory by date</p>
      </div>
      <AvailabilityCalendar />
    </>
  );
}
