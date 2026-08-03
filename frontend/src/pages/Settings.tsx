import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { authApi } from '../api/auth';
import { AppLayout } from '../components/layout/AppLayout';
import { PanelCard, PanelHeader } from '../components/shared/PanelCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../components/shared/Toast';
import { getInitials } from '../lib/utils';

interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

const tabs = ['Profile', 'Security', 'App Settings'];

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    organization_name: user?.organization_name || '',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        organization_name: user.organization_name || user.organization_detail?.name || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await authApi.updateProfile({
        first_name: profile.first_name,
        last_name: profile.last_name,
      } as any);
      updateUser(updated);
      toast.success('Profile saved');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout page="settings" breadcrumb="Settings" onNavigate={onNavigate}>
      <div className="font-mono text-[11px] tracking-[1.5px] text-amber uppercase mb-1">Preferences</div>
      <h1 className="font-['Bebas_Neue'] text-[42px] tracking-wide mb-7">SETTINGS</h1>

      <div className="grid grid-cols-[200px_1fr] gap-6 max-md:grid-cols-1">
        {/* Tabs */}
        <div className="flex flex-col gap-0.5 max-md:flex-row max-md:flex-wrap max-md:border-b max-md:border-border dark:max-md:border-border max-md:pb-2">
          {tabs.map((tab) => (
            <div key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-[11px] text-[13.5px] cursor-pointer rounded-[3px] transition-all border ${
                activeTab === tab
                  ? 'text-amber bg-amber-glow dark:bg-amber-glow border-amber/15'
                  : 'text-text-muted dark:text-text-muted border-transparent'
              }`}>
              {tab}
            </div>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'Profile' && (
            <PanelCard>
              <PanelHeader title="PROFILE" badge="PERSONAL INFO" />
              <div className="flex items-center gap-5 mb-7 pb-6 border-b border-border dark:border-border">
                <div className="w-16 h-16 bg-amber rounded-full grid place-items-center font-['Bebas_Neue'] text-[28px] text-black shrink-0">
                  {getInitials(user?.first_name || '', user?.last_name || '')}
                </div>
                <div className="font-mono text-[11px] text-text-muted dark:text-text-muted mt-1.5">Avatar uses your initials</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" value={profile.first_name} onChange={(e) => setProfile({ ...profile, first_name: e.target.value })} />
                <Input label="Last Name" value={profile.last_name} onChange={(e) => setProfile({ ...profile, last_name: e.target.value })} />
              </div>
              <Input label="Email" value={user?.email || ''} disabled />
              <div className="mb-5">
                <label className="block font-mono text-[11px] tracking-[1.5px] uppercase text-text-muted dark:text-text-muted mb-2">Organization</label>
                <div className="font-mono text-sm text-text-white dark:text-text-white py-2.5">{user?.organization_name || user?.organization_detail?.name || '—'}</div>
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>SAVE PROFILE</Button>
            </PanelCard>
          )}

          {activeTab === 'Security' && (
            <PanelCard>
              <PanelHeader title="SECURITY" badge="ACCOUNT" />
              <div className="flex items-center justify-between py-4 border-b border-border dark:border-border">
                <div>
                  <div className="text-sm font-medium">Session Management</div>
                  <div className="text-xs text-text-muted dark:text-text-muted mt-0.5">Sessions expire after 8 hours or 30 min of inactivity</div>
                </div>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border dark:border-border">
                <div>
                  <div className="text-sm font-medium">Password Hashing</div>
                  <div className="text-xs text-text-muted dark:text-text-muted mt-0.5">Passwords protected with PBKDF2-SHA256</div>
                </div>
                <span className="bg-green/10 text-green px-2.5 py-1 font-mono text-[10px] tracking-wider">ENABLED</span>
              </div>
              <div className="py-4">
                <div className="text-sm font-medium mb-1">Signed in as</div>
                <div className="font-mono text-xs text-amber">{user?.email}</div>
                {user?.organization_name && (
                  <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2 mt-1">Organization: {user.organization_name}</div>
                )}
              </div>
              <Button variant="danger" onClick={() => { logout(); onNavigate('login'); }}>
                SIGN OUT ALL SESSIONS
              </Button>
            </PanelCard>
          )}

          {activeTab === 'App Settings' && (
            <PanelCard>
              <PanelHeader title="APP SETTINGS" />
              <div
                onClick={toggleTheme}
                className="flex items-center justify-between py-4 border-b border-border dark:border-border cursor-pointer hover:bg-panel2 dark:hover:bg-panel2 transition-colors -mx-7 px-7"
              >
                <div>
                  <div className="text-sm font-medium">Dark Mode</div>
                  <div className="text-xs text-text-muted dark:text-text-muted mt-0.5">Currently using {theme === 'dark' ? 'dark' : 'light'} theme</div>
                </div>
                <span className="bg-amber-glow dark:bg-amber-glow text-amber px-2.5 py-1 font-mono text-[10px] tracking-wider">{theme === 'dark' ? 'DARK' : 'LIGHT'}</span>
              </div>
              <div className="flex items-center justify-between py-4 border-b border-border dark:border-border">
                <div>
                  <div className="text-sm font-medium">Data Storage</div>
                  <div className="text-xs text-text-muted dark:text-text-muted mt-0.5">Connected to backend API</div>
                </div>
                <span className="bg-panel2 dark:bg-panel2 text-text-muted dark:text-text-muted px-2.5 py-1 font-mono text-[10px] tracking-wider">API</span>
              </div>
              <div className="py-4">
                <div className="text-sm font-medium mb-1">Firebase Cloud Sync</div>
                <div className="text-xs text-text-muted dark:text-text-muted">Connect a Firebase project to enable real-time cloud sync.</div>
              </div>
            </PanelCard>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
