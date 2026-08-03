import { Button } from '../components/ui/Button';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    { icon: '📋', title: 'Smart Daily Logs', desc: 'Capture work summaries, deliveries, personnel counts, weather, and photos in one streamlined form.' },
    { icon: '📊', title: 'Automated Reports', desc: 'Generate weekly, bi-weekly, monthly, and annual reports with one click — export to PDF or Excel.' },
    { icon: '🔍', title: 'Issue Tracking', desc: 'Log and categorise issues by severity — LOW to CRITICAL — with built-in alert escalation.' },
    { icon: '☁️', title: 'Cloud Sync', desc: 'Connect for real-time sync across your team. Works offline, syncs when reconnected.' },
    { icon: '🗺️', title: 'GPS Photo Tagging', desc: 'Attach GPS-stamped site photos directly to each entry for precise documentation.' },
    { icon: '🤖', title: 'AI Summaries', desc: 'Generate intelligent narrative summaries of your reports powered by AI.' },
  ];

  return (
    <div className="text-text-white dark:text-text-white min-h-screen animate-[fadeIn_0.25s_ease]">
      {/* Nav */}
      <nav className="sticky top-0 z-[100] border-b border-border dark:border-border bg-black/90 dark:bg-black/90 backdrop-blur-xl px-12 flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-[34px] h-[34px] bg-amber grid place-items-center font-['Bebas_Neue'] text-lg text-black"
            style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}>
            SD
          </div>
          <span className="font-['Bebas_Neue'] text-xl tracking-widest">SITEDIARY</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[13.5px]">
          <a href="#features" className="text-text-muted dark:text-text-muted hover:text-text-white dark:hover:text-text-white transition-colors">Features</a>
          <a href="#roles" className="text-text-muted dark:text-text-muted hover:text-text-white dark:hover:text-text-white transition-colors">Roles</a>
          <a href="#reports" className="text-text-muted dark:text-text-muted hover:text-text-white dark:hover:text-text-white transition-colors">Reports</a>
          <button onClick={() => onNavigate('login')}
            className="bg-transparent border border-border dark:border-border text-text-muted dark:text-text-muted px-4 py-2 text-sm hover:border-amber hover:text-amber transition-all">
            Log In
          </button>
          <Button onClick={() => onNavigate('signup')}>Get Started</Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-12 py-24 max-w-[900px] mx-auto max-sm:px-5 max-sm:py-16">
        <div className="font-mono text-[11px] tracking-[2px] text-amber uppercase mb-5">Field Intelligence Platform</div>
        <h1 className="font-['Bebas_Neue'] text-[clamp(56px,8vw,96px)] leading-[0.95] tracking-wider mb-7">
          YOUR SITE.<br /><span className="text-amber">EVERY DAY.</span><br />DOCUMENTED.
        </h1>
        <p className="text-lg text-text-muted dark:text-text-muted max-w-[560px] leading-relaxed mb-10">
          SiteDiary transforms daily field entries into intelligent, automated reports — empowering site engineers, project managers, and stakeholders with real-time visibility and decision-ready data.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button onClick={() => onNavigate('signup')} className="!px-8 !py-3.5 !text-base">
            Start Free Trial
          </Button>
          <a href="#features"
            className="inline-flex items-center gap-2 border border-border-md dark:border-border-md text-text-white dark:text-text-white px-7 py-3.5 text-base hover:border-amber transition-colors">
            Explore Features →
          </a>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-panel dark:bg-panel border-y border-border dark:border-border py-10 px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-[900px] mx-auto">
          {[
            ['10K+', 'Daily Entries Logged'],
            ['98%', 'Uptime Reliability'],
            ['50+', 'Project Types Supported'],
            ['<2min', 'Report Generation Time'],
          ].map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="font-['Bebas_Neue'] text-[42px] text-amber tracking-wide">{n}</div>
              <div className="text-xs text-text-muted dark:text-text-muted font-mono">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-12 max-w-[1000px] mx-auto">
        <div className="font-mono text-[11px] tracking-[2px] text-amber mb-3">CORE CAPABILITIES</div>
        <h2 className="font-['Bebas_Neue'] text-[48px] tracking-wide mb-12">
          FEATURES BUILT<br /><span className="text-amber">FOR THE FIELD</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={i} className="bg-panel dark:bg-panel border border-border dark:border-border p-7 hover:border-amber/30 transition-colors">
              <div className="text-[32px] mb-4">{f.icon}</div>
              <div className="font-['Bebas_Neue'] text-xl tracking-wide mb-2.5">{f.title}</div>
              <div className="text-[13.5px] text-text-muted dark:text-text-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-panel dark:bg-panel border-y border-border dark:border-border py-20 px-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="font-mono text-[11px] tracking-[2px] text-amber mb-3">WHO IT'S FOR</div>
          <h2 className="font-['Bebas_Neue'] text-[48px] tracking-wide mb-12">
            BUILT FOR EVERY <span className="text-amber">ROLE</span>
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: '👷', title: 'Site Engineers', desc: 'Log daily work, capture photos, and document issues on-site from any device.' },
              { icon: '📐', title: 'Project Managers', desc: 'Monitor progress across multiple sites with consolidated dashboard views.' },
              { icon: '🏢', title: 'Stakeholders', desc: 'Access read-only reports and KPI dashboards without disrupting field teams.' },
              { icon: '⚖️', title: 'Safety Officers', desc: 'Track and escalate safety issues with severity classification and history.' },
            ].map((r, i) => (
              <div key={i} className="p-6 border border-border dark:border-border bg-panel2 dark:bg-panel2">
                <div className="text-[36px] mb-3.5">{r.icon}</div>
                <div className="font-['Bebas_Neue'] text-lg tracking-wide mb-2">{r.title}</div>
                <div className="text-[13px] text-text-muted dark:text-text-muted leading-relaxed">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reports */}
      <section id="reports" className="py-20 px-12 max-w-[1000px] mx-auto">
        <div className="font-mono text-[11px] tracking-[2px] text-amber mb-3">REPORTS ENGINE</div>
        <h2 className="font-['Bebas_Neue'] text-[48px] tracking-wide mb-12">
          INTELLIGENT <span className="text-amber">REPORTING</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📋', name: 'Weekly', freq: 'Last 7 days' },
            { icon: '📅', name: 'Bi-Weekly', freq: 'Last 14 days' },
            { icon: '🗓️', name: 'Monthly', freq: 'Last 30 days' },
            { icon: '📆', name: 'Annual', freq: 'Last 12 months' },
          ].map((r, i) => (
            <div key={i} className="bg-panel dark:bg-panel border border-border dark:border-border p-6 cursor-pointer hover:bg-amber-glow hover:border-amber/40 transition-all">
              <div className="text-[28px] mb-3.5">{r.icon}</div>
              <div className="font-['Bebas_Neue'] text-[22px] tracking-wide">{r.name}</div>
              <div className="font-mono text-xs text-text-muted dark:text-text-muted mt-1">{r.freq}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-12 mb-20 border border-border dark:border-border p-20 text-center"
        style={{ background: `linear-gradient(135deg, var(--color-panel) 0%, rgba(245,158,11,0.08) 100%)` }}>
        <div className="font-['Bebas_Neue'] text-[clamp(36px,5vw,60px)] tracking-wide mb-4">
          START DOCUMENTING <span className="text-amber">TODAY</span>
        </div>
        <p className="text-base text-text-muted dark:text-text-muted mb-9 max-w-[480px] mx-auto">
          No credit card required. Set up in under 5 minutes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button onClick={() => onNavigate('signup')} className="!px-10 !py-4 !text-base">
            Create Free Account
          </Button>
          <button onClick={() => onNavigate('login')}
            className="bg-transparent border border-border-md dark:border-border-md text-text-white dark:text-text-white px-8 py-4 text-base hover:border-amber transition-colors">
            Demo Login
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border px-12 py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] bg-amber grid place-items-center font-['Bebas_Neue'] text-lg text-black"
            style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}>
            SD
          </div>
          <span className="font-['Bebas_Neue'] text-xl tracking-widest">SITEDIARY</span>
        </div>
        <div className="font-mono text-[11px] text-text-muted2 dark:text-text-muted2">
          © {new Date().getFullYear()} SiteDiary — Field Intelligence Platform
        </div>
        <div className="flex gap-5 text-[12.5px]">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-text-muted dark:text-text-muted hover:text-text-white dark:hover:text-text-white transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
