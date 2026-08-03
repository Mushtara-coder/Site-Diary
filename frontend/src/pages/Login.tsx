import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../components/shared/Toast';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 min-h-screen animate-[fadeIn_0.25s_ease]">
      {/* Left */}
      <div className="bg-panel dark:bg-panel border-r border-border dark:border-border p-12 flex flex-col justify-between max-md:hidden">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-[34px] h-[34px] bg-amber grid place-items-center font-['Bebas_Neue'] text-lg text-black"
            style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}>
            SD
          </div>
          <span className="font-['Bebas_Neue'] text-xl tracking-widest">SITEDIARY</span>
        </div>
        <div>
          <div className="font-mono text-[11px] tracking-[2px] text-amber mb-4">FIELD INTELLIGENCE PLATFORM</div>
          <h1 className="font-['Bebas_Neue'] text-[52px] leading-[0.95] tracking-wide mb-6">
            TRANSFORM<br /><span className="text-amber">YOUR</span><br />SITE DATA
          </h1>
          <p className="text-sm text-text-muted dark:text-text-muted leading-relaxed max-w-[380px] mb-8">
            Daily logs → automated reports → actionable insights. Everything your site team needs, in one platform.
          </p>
          <div className="flex flex-col gap-2.5">
            {['Real-time dashboard & KPIs', 'PDF & Excel export', 'Cloud sync', 'AI-powered report summaries'].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-[13.5px] text-text-muted dark:text-text-muted">
                <span className="text-green">✓</span> {f}
              </div>
            ))}
          </div>
        </div>
        <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2">
          DEMO: demo@sitediary.com / demo123
        </div>
      </div>

      {/* Right */}
      <div className="p-15 flex flex-col justify-center max-sm:p-6">
        <div className="max-w-[400px] w-full mx-auto">
          <div className="flex items-center justify-between mb-7">
            <h2 className="font-['Bebas_Neue'] text-[36px] tracking-wide">WELCOME BACK</h2>
          </div>
          <p className="text-[13.5px] text-text-muted dark:text-text-muted mb-9">Sign in to your SiteDiary account</p>

          {error && (
            <div className="bg-red/8 border border-red/25 text-red px-4 py-3 text-sm mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Button type="submit" disabled={loading} className="w-full justify-center !py-3.5 !text-base !font-bold">
              {loading ? 'SIGNING IN…' : 'SIGN IN'}
            </Button>
          </form>

          <div className="mt-6 text-sm text-text-muted dark:text-text-muted text-center">
            Don't have an account?{' '}
            <span onClick={() => onNavigate('signup')} className="text-amber cursor-pointer hover:underline">
              Create account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
