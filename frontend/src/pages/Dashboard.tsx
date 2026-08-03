import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { entriesApi } from '../api/entries';
import { projectsApi } from '../api/projects';
import { AppLayout } from '../components/layout/AppLayout';
import { KpiCard } from '../components/shared/KpiCard';
import { SevBadge } from '../components/shared/SevBadge';
import { PanelCard, PanelHeader } from '../components/shared/PanelCard';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { toast } from '../components/shared/Toast';
import { NewEntryModal } from './NewEntry';
import type { SiteEntry, Project } from '../types';
import { getWeekNumber, todayStr } from '../lib/utils';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SiteEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterProj, setFilterProj] = useState('');
  const [filterFrom, setFilterFrom] = useState('');
  const [filterTo, setFilterTo] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [showIssues, setShowIssues] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SiteEntry | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    entriesApi.list().then(setEntries).catch(() => {});
    projectsApi.list().then(setProjects).catch(() => {});
  }, [showNewEntry]);

  const generateDemoData = useCallback(async () => {
    setGenerating(true);

    const demoProjects = [
      { name: 'Lekki Expressway Flyover', location: 'Lekki Phase 1, Lagos', start_date: '2025-06-15', status: 'ACTIVE' as const, description: 'Dual carriageway flyover with 4-lane ramp system' },
      { name: 'Ikorodu Drainage Network', location: 'Ikorodu, Lagos', start_date: '2025-07-01', status: 'ACTIVE' as const, description: 'Storm water drainage channelization project' },
      { name: 'Eko Atlantic Tower', location: 'Eko Atlantic, Victoria Island', start_date: '2025-05-20', status: 'ACTIVE' as const, description: '42-storey mixed-use commercial tower foundation works' },
    ];

    const today = new Date();
    const demoEntriesRaw = [
      { daysAgo: 0, projectIdx: 0, weather: 'Sunny, 32°C', personnel: 45, work: [{ description: 'Pile cap excavation completed for spans 12-14', quantity: '340', unit: 'm³' }, { description: 'Rebar cage assembly for pier columns in progress', quantity: '18', unit: 'tonnes' }], deliveries: [{ material: 'Ready-Mix Concrete (Grade 35)', quantity: '120 m³', supplier: 'Dangote Cement', condition: 'Good' as const }], issues: [{ description: 'Heavy traffic congestion causing delivery delays on Lekki-Epe Expressway', severity: 'HIGH' as const }], plans: [{ activity: 'Concrete pour for pier caps spans 12-14', expected_date: todayStr() }] },
      { daysAgo: 1, projectIdx: 1, weather: 'Partly Cloudy, 29°C', personnel: 22, work: [{ description: 'Excavation of drainage channel Section B completed', quantity: '850', unit: 'm' }, { description: 'Compacted laterite base for Channel B placed', quantity: '420', unit: 'm³' }], deliveries: [{ material: 'HDPE Pipes (450mm)', quantity: '120 lengths', supplier: 'Julius Berger', condition: 'Good' as const }], issues: [{ description: 'Underground cable conflict detected at Chainage 2+340', severity: 'CRITICAL' as const }, { description: 'Minor silt buildup in existing channel upstream', severity: 'LOW' as const }], plans: [{ activity: 'Pipe laying for Channel Section B', expected_date: todayStr() }] },
      { daysAgo: 2, projectIdx: 2, weather: 'Rainy, 27°C', personnel: 68, work: [{ description: 'Mat foundation reinforcement tying 75% complete', quantity: '285', unit: 'tonnes' }, { description: 'Waterproofing membrane application on raft slab', quantity: '2,400', unit: 'm²' }], deliveries: [{ material: 'Reinforcement Rebar (Y16)', quantity: '45 tonnes', supplier: 'Steel Rolling Mills', condition: 'Good' as const }, { material: 'Waterproofing Membrane', quantity: '2,400 m²', supplier: 'Sika Nigeria', condition: 'Good' as const }], issues: [{ description: 'Rain delay — 3 hours lost productivity on mat foundation', severity: 'MEDIUM' as const }], plans: [{ activity: 'Complete mat foundation reinforcement', expected_date: todayStr() }] },
      { daysAgo: 3, projectIdx: 0, weather: 'Sunny, 34°C', personnel: 48, work: [{ description: 'Formwork erection for pier cap spans 10-11', quantity: '6', unit: 'sets' }, { description: 'Soil investigation boring for abutment B completed', quantity: '4', unit: 'boreholes' }], deliveries: [{ material: 'Formwork Panels (System)', quantity: '180 panels', supplier: 'PERI Formwork', condition: 'Good' as const }], issues: [{ description: 'Worker PPE compliance check — 3 hard hats missing chin straps', severity: 'MEDIUM' as const }], plans: [{ activity: 'Pier cap concrete pour spans 10-11', expected_date: todayStr() }] },
      { daysAgo: 4, projectIdx: 1, weather: 'Overcast, 28°C', personnel: 20, work: [{ description: 'Manhole construction MH-07 and MH-08 completed', quantity: '2', unit: 'nos' }, { description: 'Backfilling and compaction of completed trench sections', quantity: '680', unit: 'm³' }], deliveries: [{ material: 'Precast Manhole Rings', quantity: '8 sets', supplier: 'Boulos Enterprises', condition: 'Good' as const }, { material: 'Granular Sub-Base', quantity: '250 tonnes', supplier: 'Lafarge Africa', condition: 'Good' as const }], issues: [], plans: [{ activity: 'Channel excavation Section C begins', expected_date: todayStr() }] },
      { daysAgo: 5, projectIdx: 2, weather: 'Sunny, 31°C', personnel: 72, work: [{ description: 'Anchor pile installation (Pile P-42 to P-56) completed', quantity: '14', unit: 'piles' }, { description: 'Pile integrity testing — all 14 piles passed', quantity: '14', unit: 'tests' }], deliveries: [{ material: 'Bored Piles (900mm)', quantity: '14 piles', supplier: 'BAM International', condition: 'Good' as const }], issues: [{ description: 'Pile P-47 deviated 150mm from design alignment — remedial action required', severity: 'HIGH' as const }, { description: 'Neighbouring property noise complaint received', severity: 'LOW' as const }], plans: [{ activity: 'Pile cap reinforcement tying for pile group PG-05', expected_date: todayStr() }] },
    ];

    // Try backend first; on any failure fall back to local state
    let apiSucceeded = false;
    let createdProjects: Project[] = [];

    try {
      for (const p of demoProjects) {
        const proj = await projectsApi.create(p);
        createdProjects.push(proj);
      }
      apiSucceeded = true;
    } catch {
      // API unavailable — build local fallback projects
      createdProjects = demoProjects.map((p, i) => ({
        id: `demo-proj-${i + 1}`,
        name: p.name,
        location: p.location,
        start_date: p.start_date,
        status: p.status,
        description: p.description,
        organization: user?.organization || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        entry_count: 0,
        delivery_count: 0,
        issue_count: 0,
      }));
    }

    if (apiSucceeded) {
      // API is reachable — try creating entries via API, with per-entry fallback
      const fallbackEntries: SiteEntry[] = [];
      for (let idx = 0; idx < demoEntriesRaw.length; idx++) {
        const entry = demoEntriesRaw[idx];
        const entryDate = new Date(today);
        entryDate.setDate(entryDate.getDate() - entry.daysAgo);
        const dateStr = entryDate.toISOString().split('T')[0];

        try {
          await entriesApi.create({
            project: createdProjects[entry.projectIdx].id,
            date: dateStr,
            weather: entry.weather,
            personnel: entry.personnel,
            work_items_data: entry.work,
            deliveries_data: entry.deliveries,
            plans_data: entry.plans,
            issues_data: entry.issues,
          });
        } catch {
          // This entry failed — build a local fallback
          fallbackEntries.push({
            id: `demo-entry-${idx + 1}`,
            project: createdProjects[entry.projectIdx].id,
            project_name: createdProjects[entry.projectIdx].name,
            user: user?.id || '',
            user_name: user ? `${user.first_name} ${user.last_name}` : '',
            organization: user?.organization || '',
            date: dateStr,
            weather: entry.weather,
            personnel: entry.personnel,
            work_items: entry.work,
            deliveries: entry.deliveries,
            plans: entry.plans,
            issues: entry.issues,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }

      // Refetch from API for entries that succeeded, then merge any local fallbacks
      let apiEntries: SiteEntry[] = [];
      try {
        apiEntries = await entriesApi.list();
      } catch { /* ignore */ }
      const merged = [...apiEntries, ...fallbackEntries];
      setEntries(merged);
      setProjects(createdProjects);
    } else {
      // Full local fallback — build all entries in-memory
      const localEntries: SiteEntry[] = demoEntriesRaw.map((entry, idx) => {
        const entryDate = new Date(today);
        entryDate.setDate(entryDate.getDate() - entry.daysAgo);
        return {
          id: `demo-entry-${idx + 1}`,
          project: createdProjects[entry.projectIdx].id,
          project_name: createdProjects[entry.projectIdx].name,
          user: user?.id || '',
          user_name: user ? `${user.first_name} ${user.last_name}` : '',
          organization: user?.organization || '',
          date: entryDate.toISOString().split('T')[0],
          weather: entry.weather,
          personnel: entry.personnel,
          work_items: entry.work,
          deliveries: entry.deliveries,
          plans: entry.plans,
          issues: entry.issues,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      });
      setProjects(createdProjects);
      setEntries(localEntries);
    }

    toast.success('Demo project and entries loaded successfully!');
    setGenerating(false);
  }, [user]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filterProj && e.project !== filterProj) return false;
      if (filterFrom && e.date < filterFrom) return false;
      if (filterTo && e.date > filterTo) return false;
      return true;
    });
  }, [entries, filterProj, filterFrom, filterTo]);

  const totalDeliveries = filtered.reduce((s, e) => s + (parseInt(String(e.deliveries?.length)) || 0), 0);
  const issueEntries = filtered.filter((e) => e.issues?.length > 0);
  const withWork = filtered.filter((e) => e.work_items?.length > 0).length;
  const progress = filtered.length > 0 ? Math.min(100, Math.round((withWork / filtered.length) * 100)) : 0;

  const allDeliveries = filtered.flatMap((e) =>
    (e.deliveries || []).map((d) => ({
      ...d,
      entryDate: e.date,
      projectName: projects.find((p) => p.id === e.project)?.name || e.project_name || '—',
    }))
  );

  const allIssues = filtered.flatMap((e) =>
    (e.issues || []).map((i) => ({
      ...i,
      entryDate: e.date,
      projectName: projects.find((p) => p.id === e.project)?.name || e.project_name || '—',
    }))
  );

  const sortedIssues = [...allIssues].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return (order[a.severity as keyof typeof order] ?? 4) - (order[b.severity as keyof typeof order] ?? 4);
  });

  const entriesWithWork = filtered.filter((e) => e.work_items?.length > 0);

  const d = new Date();
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const dateStr = `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;

  return (
    <AppLayout
      page="dashboard"
      breadcrumb="Dashboard"
      onNavigate={onNavigate}
      right={
        <button
          onClick={() => setShowNewEntry(true)}
          className="bg-amber-glow dark:bg-amber-glow border border-amber/30 text-amber px-4 py-2 font-mono text-[11px] tracking-wider hover:bg-amber/20 transition-all"
        >
          + New Entry
        </button>
      }
    >
      <div className="font-mono text-[11px] tracking-[1.5px] text-amber mb-1">
        Welcome back, {user?.first_name} · Week {getWeekNumber(d)}
      </div>
      <div className="flex items-baseline justify-between mb-3">
        <h1 className="font-['Bebas_Neue'] text-[42px] tracking-wide">DASHBOARD</h1>
        <div className="flex items-center gap-3">
          {user?.organization_name && (
            <span className="font-mono text-[10px] tracking-wider text-text-muted2 dark:text-text-muted2 border border-border dark:border-border px-2 py-1">
              {user.organization_name}
            </span>
          )}
          <span className="font-mono text-xs text-text-muted dark:text-text-muted">{dateStr}</span>
        </div>
      </div>

      {entries.length === 0 && projects.length === 0 && (
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={generateDemoData}
            disabled={generating}
            className="flex items-center gap-2.5 bg-amber/10 hover:bg-amber/20 border border-amber/30 text-amber px-5 py-2.5 font-mono text-[11px] tracking-wider transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                GENERATING...
              </>
            ) : (
              '⚡ GENERATE DEMO DATA'
            )}
          </button>
          <span className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2">Load sample projects and entries for testing</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-end gap-3.5 flex-wrap p-4 px-5 bg-panel dark:bg-panel border border-border dark:border-border mb-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Project</span>
          <Select value={filterProj} onChange={(e) => setFilterProj(e.target.value)} className="!h-[38px] !text-[13px] !px-3.5 !min-w-[160px]">
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">From</span>
          <Input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="!h-[38px] !text-[13px] !px-3.5 !mb-0" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">To</span>
          <Input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="!h-[38px] !text-[13px] !px-3.5 !mb-0" />
        </div>
        <button
          onClick={() => { setFilterProj(''); setFilterFrom(''); setFilterTo(''); }}
          className="bg-transparent border border-border dark:border-border text-text-muted dark:text-text-muted px-4 py-2 text-xs font-mono hover:border-amber hover:text-amber transition-all h-[38px]"
        >
          CLEAR
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          label="Total Entries"
          value={filtered.length}
          sub={filtered.length === 0 ? 'No entries yet' : 'Click to view all'}
          color="var(--color-amber)"
          onClick={() => onNavigate('reports')}
        />
        <KpiCard
          label="Deliveries"
          value={totalDeliveries}
          sub="Across all entries"
          color="var(--color-teal)"
          onClick={() => setShowDeliveries(true)}
        />
        <KpiCard
          label="Open Issues"
          value={issueEntries.length}
          sub={issueEntries.length === 0 ? 'No issues raised' : 'Click to view all'}
          color="var(--color-red)"
          onClick={() => setShowIssues(true)}
        />
        <KpiCard
          label="Work Completion"
          value={`${progress}%`}
          sub="Entries with work logged"
          color="var(--color-purple)"
          onClick={() => setShowDeliveries(false)}
        />
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-5">
        <PanelCard>
          <PanelHeader title="RECENT ENTRIES" badge="LIVE FEED" />
          {filtered.length === 0 ? (
            <div className="text-center py-14">
              <div className="text-[40px] opacity-40 mb-3">📝</div>
              <div className="font-['Bebas_Neue'] text-xl text-text-muted dark:text-text-muted">NO ENTRIES YET</div>
              <div className="text-[13px] text-text-muted2 dark:text-text-muted2 mt-2">Start logging daily site activities.</div>
            </div>
          ) : (
            filtered
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 5)
              .map((e) => (
                <div
                  key={e.id}
                  onClick={() => setSelectedEntry(e)}
                  className="flex items-start gap-3.5 py-3 border-b border-border dark:border-border last:border-0 cursor-pointer hover:bg-panel2/60 dark:hover:bg-panel2/60 -mx-7 px-7 transition-colors duration-150 group"
                >
                  <div className="font-mono text-[10px] text-amber min-w-[80px] pt-0.5">{e.date}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium truncate">
                      {projects.find((p) => p.id === e.project)?.name || e.project_name || '—'}
                    </div>
                    <div className="text-xs text-text-muted dark:text-text-muted truncate mt-0.5">
                      {e.work_items?.length > 0 ? e.work_items.map((w) => w.description).join('; ') : 'No work summary'}
                    </div>
                  </div>
                  {e.issues?.length > 0 && <SevBadge severity={e.issues[0].severity} />}
                  <svg className="w-3.5 h-3.5 text-text-muted2 dark:text-text-muted2 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))
          )}
        </PanelCard>

        <PanelCard>
          <PanelHeader title="QUICK ACTIONS" />
          <div className="flex flex-col gap-2.5">
            <div
              onClick={() => setShowNewEntry(true)}
              className="flex items-center gap-3.5 p-3.5 px-4 bg-panel2 dark:bg-panel2 border border-border dark:border-border cursor-pointer hover:border-amber transition-colors"
            >
              <span className="text-[22px]">✏️</span>
              <div>
                <div className="font-mono text-[11px] tracking-wider mb-0.5">NEW ENTRY</div>
                <div className="text-xs text-text-muted dark:text-text-muted">Log today's site activity</div>
              </div>
            </div>
            <div
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-3.5 p-3.5 px-4 bg-panel2 dark:bg-panel2 border border-border dark:border-border cursor-pointer hover:border-amber transition-colors"
            >
              <span className="text-[22px]">📁</span>
              <div>
                <div className="font-mono text-[11px] tracking-wider mb-0.5">ADD PROJECT</div>
                <div className="text-xs text-text-muted dark:text-text-muted">Set up a new site project</div>
              </div>
            </div>
            <div
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-3.5 p-3.5 px-4 bg-panel2 dark:bg-panel2 border border-border dark:border-border cursor-pointer hover:border-amber transition-colors"
            >
              <span className="text-[22px]">📊</span>
              <div>
                <div className="font-mono text-[11px] tracking-wider mb-0.5">REPORTS</div>
                <div className="text-xs text-text-muted dark:text-text-muted">Generate or view reports</div>
              </div>
            </div>
          </div>
        </PanelCard>
      </div>

      {/* Deliveries Detail Modal */}
      {showDeliveries && (
        <Modal open onClose={() => setShowDeliveries(false)} title="ALL DELIVERIES" maxWidth={700}>
          {allDeliveries.length === 0 ? (
            <div className="text-center py-10 text-text-muted dark:text-text-muted font-mono text-sm">No deliveries logged yet.</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border dark:border-border">
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Date</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Project</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Material</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Qty</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Supplier</th>
                    <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Condition</th>
                  </tr>
                </thead>
                <tbody>
                  {allDeliveries.map((d, i) => (
                    <tr key={i} className="border-b border-border/50 dark:border-border/50">
                      <td className="py-2.5 font-mono text-[11px] text-amber">{d.entryDate}</td>
                      <td className="py-2.5 text-text-white dark:text-text-white">{d.projectName}</td>
                      <td className="py-2.5">{d.material}</td>
                      <td className="py-2.5 font-mono">{d.quantity || '—'}</td>
                      <td className="py-2.5 text-text-muted dark:text-text-muted">{d.supplier}</td>
                      <td className="py-2.5">
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 ${
                          d.condition === 'Good' ? 'bg-green/10 text-green' :
                          d.condition === 'Damaged' ? 'bg-red/10 text-red' :
                          d.condition === 'Partial' ? 'bg-amber/10 text-amber' :
                          'bg-red/20 text-red'
                        }`}>{d.condition}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}

      {/* Issues Detail Modal */}
      {showIssues && (
        <Modal open onClose={() => setShowIssues(false)} title="ALL OPEN ISSUES" maxWidth={700}>
          {sortedIssues.length === 0 ? (
            <div className="text-center py-10 text-text-muted dark:text-text-muted font-mono text-sm">No issues logged.</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-2">
              {sortedIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 px-4 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                  <SevBadge severity={issue.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px]">{issue.description}</div>
                    <div className="text-[11px] text-text-muted dark:text-text-muted mt-0.5 font-mono">
                      {issue.projectName} · {issue.entryDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {showNewEntry && (
        <NewEntryModal
          projects={projects}
          onClose={() => setShowNewEntry(false)}
          onCreated={() => {
            setShowNewEntry(false);
            entriesApi.list().then(setEntries);
          }}
        />
      )}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <Modal open onClose={() => setSelectedEntry(null)} title="ENTRY DETAILS" maxWidth={680}>
          <div className="flex items-center gap-4 mb-5 pb-4 border-b border-border dark:border-border">
            <div className="w-10 h-10 bg-amber/15 dark:bg-amber/15 rounded-lg grid place-items-center text-amber text-lg">📋</div>
            <div>
              <div className="font-['Bebas_Neue'] text-lg tracking-wide">
                {projects.find((p) => p.id === selectedEntry.project)?.name || selectedEntry.project_name || '—'}
              </div>
              <div className="font-mono text-[11px] text-amber">{selectedEntry.date}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border text-center">
              <div className="font-mono text-[9px] tracking-wider text-text-muted dark:text-text-muted uppercase mb-1">Weather</div>
              <div className="text-[13px]">{selectedEntry.weather || '—'}</div>
            </div>
            <div className="p-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border text-center">
              <div className="font-mono text-[9px] tracking-wider text-text-muted dark:text-text-muted uppercase mb-1">Personnel</div>
              <div className="text-[13px]">{selectedEntry.personnel || 0}</div>
            </div>
            <div className="p-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border text-center">
              <div className="font-mono text-[9px] tracking-wider text-text-muted dark:text-text-muted uppercase mb-1">Issues</div>
              <div className="text-[13px]">{selectedEntry.issues?.length || 0}</div>
            </div>
          </div>

          {/* Work Items */}
          {selectedEntry.work_items?.length > 0 && (
            <div className="mb-5">
              <div className="font-mono text-[10px] tracking-[1.5px] text-amber uppercase mb-2.5">Work Done</div>
              <div className="flex flex-col gap-1.5">
                {selectedEntry.work_items.map((w, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 px-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                    <span className="text-green mt-0.5">✓</span>
                    <div className="flex-1">
                      <div className="text-[13px]">{w.description}</div>
                      {w.quantity && <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2 mt-0.5">{w.quantity} {w.unit}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliveries */}
          {selectedEntry.deliveries?.length > 0 && (
            <div className="mb-5">
              <div className="font-mono text-[10px] tracking-[1.5px] text-teal uppercase mb-2.5">Deliveries</div>
              <div className="flex flex-col gap-1.5">
                {selectedEntry.deliveries.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 px-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] truncate">{d.material}</div>
                      <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2">{d.supplier}</div>
                    </div>
                    <div className="font-mono text-[11px] text-text-muted dark:text-text-muted">{d.quantity || '—'}</div>
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 ${
                      d.condition === 'Good' ? 'bg-green/10 text-green' :
                      d.condition === 'Damaged' ? 'bg-red/10 text-red' :
                      d.condition === 'Partial' ? 'bg-amber/10 text-amber' :
                      'bg-red/20 text-red'
                    }`}>{d.condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {selectedEntry.issues?.length > 0 && (
            <div className="mb-5">
              <div className="font-mono text-[10px] tracking-[1.5px] text-red uppercase mb-2.5">Issues / Observations</div>
              <div className="flex flex-col gap-1.5">
                {selectedEntry.issues.map((iss, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 px-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                    <SevBadge severity={iss.severity} />
                    <div className="text-[13px] flex-1">{iss.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plans */}
          {selectedEntry.plans?.length > 0 && (
            <div>
              <div className="font-mono text-[10px] tracking-[1.5px] text-purple uppercase mb-2.5">Planned Activities</div>
              <div className="flex flex-col gap-1.5">
                {selectedEntry.plans.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 px-3 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                    <div className="flex-1 text-[13px]">{p.activity}</div>
                    {p.expected_date && <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2">{p.expected_date}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </AppLayout>
  );
}
