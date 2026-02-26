'use client';

import { Session } from 'next-auth';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

export default function AdminLayoutClient({ children, session }: AdminLayoutClientProps) {
  return (
    <div className="admin-panel min-h-screen bg-background">
      <Sidebar session={session} />
      <div className="md:ml-64">
        <TopBar session={session} />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
