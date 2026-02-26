'use client';

import { useState, useEffect } from 'react';

interface Room {
  id: string;
  name: string;
  slug: string;
  totalUnits: number;
}

interface RoomAvailability {
  roomId: string;
  roomName: string;
  roomSlug: string;
  totalUnits: number;
  availableUnits: number;
  occupiedUnits: number;
  actuallyAvailable: number;
  hasOverride: boolean;
}

export default function AvailabilityCalendar() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<RoomAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInPast = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (year: number, month: number, day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getUTCFullYear() === year &&
      selectedDate.getUTCMonth() === month &&
      selectedDate.getUTCDate() === day
    );
  };

  const handleDateClick = async (year: number, month: number, day: number) => {
    if (isDateInPast(year, month, day)) return;

    // Create date in UTC to avoid timezone issues
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    setSelectedDate(date);
    setShowModal(true);
    setLoading(true);

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    try {
      const dateStr = date.toISOString().split('T')[0];
      const response = await fetch(`/api/rooms/availability?date=${dateStr}`);
      const data = await response.json();
      setAvailability(data.availability || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Re-enable background scroll
    document.body.style.overflow = 'unset';
  };

  const handleUpdateAvailability = async (roomId: string, newAvailable: number) => {
    if (!selectedDate) return;

    const room = availability.find(a => a.roomId === roomId);
    if (!room) return;

    // Validation
    if (newAvailable < 0) {
      alert('Available units cannot be negative');
      return;
    }
    if (newAvailable > room.totalUnits) {
      alert(`Available units cannot exceed total capacity (${room.totalUnits})`);
      return;
    }

    setSaving(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch('/api/rooms/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          date: dateStr,
          availableUnits: newAvailable,
        }),
      });

      if (response.ok) {
        // Refresh availability data
        const refreshResponse = await fetch(`/api/rooms/availability?date=${dateStr}`);
        const data = await refreshResponse.json();
        setAvailability(data.availability || []);

        setSuccessMessage('Availability updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        alert('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error updating availability');
    } finally {
      setSaving(false);
    }
  };

  const renderCalendarGrid = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    const today = new Date();
    const isToday = (day: number) =>
      year === today.getFullYear() && month === today.getMonth() && day === today.getDate();

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dayName) => (
          <div
            key={dayName}
            className="text-center text-[10px] font-semibold py-1.5"
            style={{ color: 'var(--admin-text-muted)' }}
          >
            {dayName}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isPast = isDateInPast(year, month, day);
          const isSelected = isDateSelected(year, month, day);
          const isTodayDate = isToday(day);

          let cellStyle: React.CSSProperties = {};
          let cellClass = 'aspect-square flex items-center justify-center text-xs rounded-md transition-all';

          if (isPast) {
            cellStyle = {
              backgroundColor: '#f3f2f0',
              color: '#b0ada8',
              cursor: 'not-allowed',
            };
          } else if (isSelected) {
            cellStyle = {
              backgroundColor: 'var(--admin-primary)',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 0 0 2px var(--admin-primary), 0 0 0 4px var(--admin-surface)',
            };
          } else if (isTodayDate) {
            cellStyle = {
              backgroundColor: 'var(--admin-primary-light)',
              color: 'var(--admin-primary)',
              fontWeight: 700,
              border: '2px solid var(--admin-primary)',
            };
          } else {
            cellStyle = {
              backgroundColor: 'var(--admin-surface)',
              color: 'var(--admin-text)',
              fontWeight: 500,
              cursor: 'pointer',
              border: '1px solid var(--admin-border)',
            };
            cellClass += ' hover:border-[#1a8a7a] hover:bg-[#e6f5f3]';
          }

          return (
            <button
              key={day}
              onClick={() => handleDateClick(year, month, day)}
              disabled={isPast}
              className={cellClass}
              style={cellStyle}
            >
              {day}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Year Navigation */}
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--admin-surface)',
          border: '1px solid var(--admin-border)',
        }}
      >
        <button
          onClick={() => setCurrentYear(currentYear - 1)}
          className="px-4 py-2 rounded-lg transition-colors font-medium"
          style={{
            backgroundColor: 'var(--admin-primary-light)',
            color: 'var(--admin-primary)',
            border: '1px solid var(--admin-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-primary)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-primary-light)';
            e.currentTarget.style.color = 'var(--admin-primary)';
          }}
        >
          &larr; {currentYear - 1}
        </button>
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--admin-text)' }}
        >
          {currentYear}
        </h2>
        <button
          onClick={() => setCurrentYear(currentYear + 1)}
          className="px-4 py-2 rounded-lg transition-colors font-medium"
          style={{
            backgroundColor: 'var(--admin-primary-light)',
            color: 'var(--admin-primary)',
            border: '1px solid var(--admin-primary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-primary)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--admin-primary-light)';
            e.currentTarget.style.color = 'var(--admin-primary)';
          }}
        >
          {currentYear + 1} &rarr;
        </button>
      </div>

      {/* 12 Month Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {months.map((monthName, monthIndex) => (
          <div
            key={monthName}
            className="p-4 rounded-xl transition-all hover:shadow-md"
            style={{
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--admin-border)';
            }}
          >
            <h3
              className="text-sm font-semibold mb-3 text-center uppercase tracking-wider"
              style={{ color: 'var(--admin-primary)' }}
            >
              {monthName}
            </h3>
            {renderCalendarGrid(currentYear, monthIndex)}
          </div>
        ))}
      </div>

      {/* Availability Modal */}
      {showModal && selectedDate && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center p-4 z-[9999] overflow-hidden"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            margin: 0,
            padding: '1rem',
          }}
          onClick={handleCloseModal}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden relative"
            style={{
              backgroundColor: 'var(--admin-surface)',
              border: '1px solid var(--admin-border)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Fixed */}
            <div
              className="p-6 sticky top-0 z-10"
              style={{
                background: 'linear-gradient(to right, var(--admin-primary), var(--admin-primary-hover))',
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    Room Availability Manager
                  </h2>
                  <p className="mt-1 flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white rounded-lg p-2 transition-colors"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6">

              {/* Success Message */}
              {successMessage && (
                <div
                  className="mb-6 p-4 rounded-lg flex items-center gap-3"
                  style={{
                    backgroundColor: 'var(--admin-success-bg)',
                    border: '1px solid var(--admin-success)',
                  }}
                >
                  <svg className="w-6 h-6" style={{ color: 'var(--admin-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium" style={{ color: 'var(--admin-success)' }}>{successMessage}</p>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-16">
                  <div
                    className="animate-spin rounded-full h-16 w-16 mx-auto"
                    style={{
                      borderWidth: '4px',
                      borderStyle: 'solid',
                      borderColor: 'var(--admin-border)',
                      borderTopColor: 'var(--admin-primary)',
                    }}
                  ></div>
                  <p className="mt-6 font-medium" style={{ color: 'var(--admin-text-muted)' }}>Loading availability data...</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {availability.map((room) => (
                    <div
                      key={room.roomId}
                      className="rounded-xl p-5 transition-all"
                      style={{
                        backgroundColor: 'var(--admin-bg)',
                        border: '1px solid var(--admin-border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--admin-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--admin-border)';
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3
                            className="text-lg font-bold flex items-center gap-2"
                            style={{ color: 'var(--admin-text)' }}
                          >
                            {room.roomName}
                            {room.hasOverride && (
                              <span
                                className="px-2.5 py-1 text-white text-xs font-semibold rounded-full"
                                style={{ backgroundColor: 'var(--admin-primary)' }}
                              >
                                CUSTOM
                              </span>
                            )}
                          </h3>
                          <p className="text-sm mt-1" style={{ color: 'var(--admin-text-muted)' }}>
                            Total Capacity: <span className="font-semibold" style={{ color: 'var(--admin-text)' }}>{room.totalUnits}</span> {room.totalUnits === 1 ? 'room' : 'rooms'}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: 'var(--admin-danger-bg)',
                            border: '1px solid var(--admin-danger)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4" style={{ color: 'var(--admin-danger)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-xs font-semibold uppercase" style={{ color: 'var(--admin-danger)' }}>Occupied</p>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: 'var(--admin-danger)' }}>{room.occupiedUnits}</p>
                        </div>
                        <div
                          className="p-4 rounded-lg"
                          style={{
                            backgroundColor: 'var(--admin-success-bg)',
                            border: '1px solid var(--admin-success)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <svg className="w-4 h-4" style={{ color: 'var(--admin-success)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs font-semibold uppercase" style={{ color: 'var(--admin-success)' }}>Available</p>
                          </div>
                          <p className="text-3xl font-bold" style={{ color: 'var(--admin-success)' }}>{room.actuallyAvailable}</p>
                        </div>
                      </div>

                      <div
                        className="pt-4"
                        style={{ borderTop: '1px solid var(--admin-border)' }}
                      >
                        <label
                          className="block text-sm font-bold mb-2"
                          style={{ color: 'var(--admin-text)' }}
                        >
                          Adjust Available Units for This Date
                        </label>
                        <p
                          className="text-xs mb-3 p-2 rounded-lg"
                          style={{
                            color: 'var(--admin-primary)',
                            backgroundColor: 'var(--admin-primary-light)',
                            border: '1px solid var(--admin-primary)',
                          }}
                        >
                          <strong>Night-based logic:</strong> Setting availability to 0 for Jan 21 blocks bookings that include the <em>night</em> of Jan 21 (Jan 21-22).
                        </p>
                        <p
                          className="text-xs mb-3 p-2 rounded-lg"
                          style={{
                            color: 'var(--admin-text-muted)',
                            backgroundColor: 'var(--admin-bg)',
                            border: '1px solid var(--admin-border)',
                          }}
                        >
                          Currently: <strong style={{ color: 'var(--admin-text)' }}>{room.occupiedUnits} occupied</strong>, <strong style={{ color: 'var(--admin-text)' }}>{room.actuallyAvailable} available</strong>. Use +/- to adjust.
                        </p>
                        <div
                          className="flex items-center gap-4 p-4 rounded-xl"
                          style={{
                            backgroundColor: 'var(--admin-surface)',
                            border: '1px solid var(--admin-border)',
                          }}
                        >
                          <button
                            onClick={() => {
                              const newAvailableUnits = room.availableUnits - 1;
                              handleUpdateAvailability(room.roomId, newAvailableUnits);
                            }}
                            disabled={saving || room.actuallyAvailable <= 0}
                            className="w-12 h-12 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold text-2xl"
                            style={{ backgroundColor: 'var(--admin-danger)' }}
                            onMouseEnter={(e) => {
                              if (!e.currentTarget.disabled) {
                                e.currentTarget.style.opacity = '0.85';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '';
                            }}
                          >
                            −
                          </button>
                          <div
                            className="flex-1 text-center py-3 rounded-lg"
                            style={{
                              backgroundColor: 'var(--admin-primary-light)',
                              border: '1px solid var(--admin-primary)',
                            }}
                          >
                            <div
                              className="text-4xl font-extrabold"
                              style={{ color: 'var(--admin-primary)' }}
                            >
                              {room.actuallyAvailable}
                            </div>
                            <div
                              className="text-xs font-medium mt-1"
                              style={{ color: 'var(--admin-text-muted)' }}
                            >
                              available ({room.availableUnits} total - {room.occupiedUnits} occupied)
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              const newAvailableUnits = room.availableUnits + 1;
                              handleUpdateAvailability(room.roomId, newAvailableUnits);
                            }}
                            disabled={saving || room.availableUnits >= room.totalUnits}
                            className="w-12 h-12 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center font-bold text-2xl"
                            style={{ backgroundColor: 'var(--admin-success)' }}
                            onMouseEnter={(e) => {
                              if (!e.currentTarget.disabled) {
                                e.currentTarget.style.opacity = '0.85';
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = '';
                            }}
                          >
                            +
                          </button>
                        </div>
                        <p
                          className="text-xs text-center mt-3 font-medium"
                          style={{ color: 'var(--admin-text-muted)' }}
                        >
                          {room.availableUnits === room.totalUnits
                            ? 'Using default capacity'
                            : `Custom: ${room.availableUnits} of ${room.totalUnits} units`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div
              className="p-4 sticky bottom-0"
              style={{
                backgroundColor: 'var(--admin-bg)',
                borderTop: '1px solid var(--admin-border)',
              }}
            >
              <button
                onClick={handleCloseModal}
                className="w-full text-white px-6 py-3.5 rounded-xl transition-all font-semibold"
                style={{ backgroundColor: 'var(--admin-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-primary)';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
