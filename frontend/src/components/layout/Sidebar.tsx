import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../lib/utils';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
  { id: 'new-entry', label: 'New Entry', icon: '✏' },
  { id: 'projects', label: 'Projects', icon: '📁' },
  { id: 'reports', label: 'Reports', icon: '📄' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentPage, onNavigate, mobileOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-[199] backdrop-blur-sm animate-[fadeIn_0.2s_ease] md:hidden"
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-[200] w-60 min-h-screen bg-panel dark:bg-panel border-r border-border dark:border-border flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5 border-b border-border dark:border-border">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-[34px] h-[34px] bg-amber grid place-items-center font-['Bebas_Neue'] text-lg text-black"
              style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}>
              SD
            </div>
            <span className="font-['Bebas_Neue'] text-xl tracking-widest">SITEDIARY</span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-0.5">
          <div className="font-mono text-[10px] tracking-[1.5px] text-text-muted2 dark:text-text-muted2 px-2 pb-1 pt-2 uppercase">
            Navigation
          </div>
          {NAV.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onNavigate(n.id);
                onClose();
              }}
              className={`flex items-center gap-2.5 px-3 py-2.5 cursor-pointer rounded-[3px] text-[13.5px] transition-all duration-150 ${
                currentPage === n.id
                  ? 'bg-amber-glow dark:bg-amber-glow text-amber border border-amber/15'
                  : 'text-text-muted dark:text-text-muted border border-transparent hover:text-text-white dark:hover:text-text-white'
              }`}
            >
              <span className="text-base">{n.icon}</span>
              <span>{n.label}</span>
              {currentPage === n.id && (
                <span className="ml-auto w-1 h-1 bg-amber rounded-full" />
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 pt-5 border-t border-border dark:border-border">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-[34px] h-[34px] bg-amber rounded-full grid place-items-center font-['Bebas_Neue'] text-[15px] text-black shrink-0">
              {user ? getInitials(user.first_name, user.last_name) : '?'}
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-text-white dark:text-text-white truncate">
                {user?.first_name} {user?.last_name}
              </div>
            </div>
          </div>
          {user?.organization_name && (
            <div className="font-mono text-[9px] text-text-muted2 dark:text-text-muted2 tracking-wider mb-3 px-1 truncate">
              {user.organization_name}
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2.5 py-2 w-full cursor-pointer text-xs text-text-muted dark:text-text-muted rounded-[3px] transition-all duration-150 hover:bg-amber/10 hover:text-amber mb-1"
          >
            <span className="text-base">{theme === 'dark' ? '☀️' : '🌙'}</span>
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <div
            onClick={logout}
            className="flex items-center gap-2 px-2.5 py-2 cursor-pointer text-xs text-text-muted dark:text-text-muted rounded-[3px] transition-all duration-150 hover:bg-red/10 hover:text-red"
          >
            <span>⎋</span>
            <span>Log Out</span>
          </div>
        </div>
      </aside>
    </>
  );
}
