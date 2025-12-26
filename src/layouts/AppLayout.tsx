import type { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto max-w-6xl pb-10">{children}</div>
        </main>
      </div>
    </div>
  );
};
