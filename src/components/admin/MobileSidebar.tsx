'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  FileText,
  Mail,
  CalendarRange,
  DollarSign,
  Tag,
  Lightbulb,
  Hotel,
  LogOut,
} from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Bookings', icon: CalendarCheck, path: '/admin/bookings' },
  { label: 'Rooms', icon: BedDouble, path: '/admin/rooms' },
  { label: 'Availability', icon: CalendarRange, path: '/admin/availability' },
  { label: 'Blog', icon: FileText, path: '/admin/blog' },
  { label: 'Messages', icon: Mail, path: '/admin/contacts' },
];

const revenueItems = [
  { label: 'Pricing Rules', icon: DollarSign, path: '/admin/revenue/pricing' },
  { label: 'Rate Plans', icon: Tag, path: '/admin/revenue/plans' },
  { label: 'Revenue Suggestions', icon: Lightbulb, path: '/admin/revenue/suggestions' },
];

interface MobileSidebarProps {
  session: Session;
  onNavigate: () => void;
}

export default function MobileSidebar({ session, onNavigate }: MobileSidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin';
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Hotel className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-accent-foreground">Garden Boutique</h1>
          <p className="text-xs text-sidebar-muted">Hotel Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
          Main
        </p>
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}

        <p className="mt-5 mb-2 px-3 text-xs font-medium uppercase tracking-wider text-sidebar-muted">
          Revenue & Pricing
        </p>
        {revenueItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
            {session.user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">
              {session.user?.name || 'Admin'}
            </p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="nav-item w-full mt-1 !text-red-400 hover:!text-red-300 hover:!bg-red-500/10"
        >
          <LogOut className="h-[18px] w-[18px]" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
