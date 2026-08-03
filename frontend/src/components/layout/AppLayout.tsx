import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
interface AppLayoutProps {
  page: string;
  breadcrumb: string;
  onNavigate: (page: string) => void;
  right?: ReactNode;
  children: ReactNode;
}

export function AppLayout({ page, breadcrumb, onNavigate, right, children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        currentPage={page}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="ml-60 flex-1 flex flex-col min-w-0 max-md:ml-0">
        <Topbar
          breadcrumb={breadcrumb}
          onHamburger={() => setMobileOpen((o) => !o)}
          right={right}
        />
        <div className="p-8 flex-1 overflow-y-auto animate-[fadeIn_0.25s_ease]">
          {children}
        </div>
      </div>
    </div>
  );
}
