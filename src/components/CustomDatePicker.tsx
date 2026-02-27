'use client';

import { useState, useEffect, useRef } from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  placeholder?: string;
  label: string;
  highlightDate?: string;
  variant?: 'dark' | 'light' | 'admin';
}

export default function CustomDatePicker({
  value,
  onChange,
  minDate,
  placeholder = 'Select date',
  label,
  highlightDate,
  variant = 'dark',
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value + 'T00:00:00'));
    }
  }, [value]);

  // When minDate changes (e.g. check-in picked), jump calendar to that month
  useEffect(() => {
    if (minDate && !value) {
      setCurrentMonth(new Date(minDate + 'T00:00:00'));
    }
  }, [minDate, value]);

  // Close calendar on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        calendarRef.current && !calendarRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 7 : day;
  };

  const isDateDisabled = (checkDate: Date) => {
    if (!minDate) return false;
    const min = new Date(minDate + 'T00:00:00');
    return checkDate < min;
  };


  const isSelected = (checkDate: Date) => {
    if (!value) return false;
    const selected = new Date(value + 'T00:00:00');
    return checkDate.toDateString() === selected.toDateString();
  };

  const isHighlighted = (checkDate: Date) => {
    if (!highlightDate) return false;
    const highlight = new Date(highlightDate + 'T00:00:00');
    return checkDate.toDateString() === highlight.toDateString();
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (isDateDisabled(date)) return;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    onChange(formattedDate);
    setIsOpen(false);
  };


  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: React.ReactNode[] = [];
    const weeks: React.ReactNode[] = [];

    for (let i = 1; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="p-1 sm:p-0.5"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isSelected(date);
      const highlighted = isHighlighted(date);

      days.push(
        <td key={day} className="p-1 sm:p-0.5">
          <button
            type="button"
            onClick={() => handleDateClick(day)}
            disabled={disabled}
            className={`w-10 h-10 sm:w-6 sm:h-6 rounded-full text-[15px] sm:text-[11px] font-medium transition-all
              ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}
              ${selected ? 'bg-[#111111] text-white' : ''}
              ${highlighted && !selected ? 'bg-[#333333] text-white' : ''}
              ${!disabled && !selected && !highlighted ? 'text-gray-700' : ''}
            `}
          >
            {day}
          </button>
        </td>
      );

      if ((firstDay + day - 1) % 7 === 0 || day === daysInMonth) {
        if (day === daysInMonth) {
          const remaining = 7 - (days.length % 7);
          if (remaining < 7) {
            for (let i = 0; i < remaining; i++) {
              days.push(<td key={`empty-end-${i}`} className="p-1 sm:p-0.5"></td>);
            }
          }
        }

        const rowDays = days.splice(0, 7);
        weeks.push(
          <tr key={`week-${day}`} className="text-center">
            {rowDays}
          </tr>
        );
      }
    }

    return weeks;
  };

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : placeholder;

  return (
    <div className={`relative ${variant === 'dark' ? 'w-full lg:max-w-[220px]' : variant === 'admin' ? 'w-[140px]' : 'w-full'}`}>
      {/* Trigger */}
      <div ref={triggerRef} className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {variant === 'dark' ? (
          <div className="flex items-center justify-between pb-2.5 border-b border-white/40">
            <div>
              <span className="text-white/60 text-[11px] sm:text-[9px] tracking-[0.15em] uppercase block mb-0.5">{label}</span>
              <span className="text-white text-lg sm:text-lg md:text-xl font-light">{displayValue}</span>
            </div>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        ) : variant === 'admin' ? (
          <div className="flex items-center justify-between w-full h-8 px-3 rounded-md bg-background text-foreground border border-input hover:border-ring transition-colors text-sm">
            <span className={value ? 'text-foreground' : 'text-muted-foreground'}>{value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : placeholder}</span>
            <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        ) : (
          <div className="flex flex-col">
            <label className="block text-[9px] text-[#873260] tracking-[0.2em] uppercase mb-2 font-medium">{label}</label>
            <div className="flex items-center justify-between w-full h-[46px] px-4 rounded-sm bg-white text-[#111111] border border-[#e5e5e5] hover:border-[#873260] transition-colors">
              <span className={`text-[14px] ${value ? 'text-[#111111]' : 'text-[#999]'}`}>{value ? new Date(value + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : placeholder}</span>
              <svg className="w-4 h-4 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Calendar Popup */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div className="sm:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />
          {/* Calendar */}
          <div ref={calendarRef} className={`fixed sm:absolute left-0 right-0 sm:right-auto sm:left-0 bg-white sm:rounded-md shadow-2xl w-full overflow-hidden animate-[scaleIn_0.15s_ease-out] ${variant === 'dark' ? 'z-50 sm:w-[220px] bottom-0 sm:bottom-full sm:mb-2 rounded-t-xl' : variant === 'admin' ? 'z-[60] sm:w-[220px] sm:left-0 top-0 sm:top-full sm:mt-1 rounded-xl' : 'z-50 bottom-0 sm:bottom-full sm:mb-1 rounded-t-xl'}`} style={{ transformOrigin: variant === 'admin' ? 'top center' : 'bottom center' }}>
            {/* Header */}
            <div className="bg-[#111111] px-4 py-3 sm:px-2.5 sm:py-1.5 flex items-center justify-center rounded-t-md">
              <span className="text-white font-medium text-[14px] sm:text-[11px] tracking-wide">Date Selector</span>
            </div>

            {/* Calendar Grid */}
            <div className="p-4 sm:p-1.5">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-[13px] sm:text-[9px] font-semibold">
                    <th className="p-1 sm:p-0.5">M</th>
                    <th className="p-1 sm:p-0.5">T</th>
                    <th className="p-1 sm:p-0.5">W</th>
                    <th className="p-1 sm:p-0.5">T</th>
                    <th className="p-1 sm:p-0.5">F</th>
                    <th className="p-1 sm:p-0.5">S</th>
                    <th className="p-1 sm:p-0.5">S</th>
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>

            {/* Month Navigation - arrows + month name */}
            <div className="border-t border-gray-100 px-4 py-3 sm:px-2.5 sm:py-1.5 flex items-center justify-between rounded-b-md">
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                className="text-black hover:text-black/70 p-1 sm:p-0.5 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-black text-[14px] sm:text-[11px] font-medium">{months[currentMonth.getMonth()]}</span>
              <button
                type="button"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                className="text-black hover:text-black/70 p-1 sm:p-0.5 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
