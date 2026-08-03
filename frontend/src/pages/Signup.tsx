import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from '../components/shared/Toast';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    organization_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSignup() {
    const errs: Record<string, string> = {};
    if (!form.firstName) errs.firstName = 'Required';
    if (!form.lastName) errs.lastName = 'Required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.organization_name.trim()) errs.organization_name = 'Organization is required';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await register({
        email: form.email,
        first_name: form.firstName,
        last_name: form.lastName,
        password: form.password,
        password_confirm: form.confirm,
        organization_name: form.organization_name,
      });
      toast.success('Account created!');
      onNavigate('dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      if (data) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(data).forEach(([key, val]: [string, any]) => {
          fieldErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(fieldErrors);
      }
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
            <h2 className="font-['Bebas_Neue'] text-[36px] tracking-wide">CREATE ACCOUNT</h2>
          </div>
          <p className="text-[13.5px] text-text-muted dark:text-text-muted mb-9">Join SiteDiary — your field intelligence platform</p>

          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={set('firstName')} placeholder="Ada" error={errors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={set('lastName')} placeholder="Okonkwo" error={errors.lastName} />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" error={errors.email} />
          <Input label="Organization *" value={form.organization_name} onChange={set('organization_name')} placeholder="e.g. Acme Construction Ltd." error={errors.organization_name} />
          <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" error={errors.password} />
          <Input label="Confirm" type="password" value={form.confirm} onChange={set('confirm')} placeholder="••••••••" error={errors.confirm} />

          <Button onClick={handleSignup} disabled={loading} className="w-full justify-center !py-3.5 !text-base !font-bold">
            {loading ? 'CREATING…' : 'CREATE ACCOUNT'}
          </Button>

          <div className="mt-6 text-sm text-text-muted dark:text-text-muted text-center">
            Already have an account?{' '}
            <span onClick={() => onNavigate('login')} className="text-amber cursor-pointer hover:underline">
              Sign in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
