import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { entriesApi } from '../api/entries';
import { projectsApi } from '../api/projects';
import { AppLayout } from '../components/layout/AppLayout';
import { KpiCard } from '../components/shared/KpiCard';
import { PanelCard, PanelHeader } from '../components/shared/PanelCard';
import { SevBadge } from '../components/shared/SevBadge';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { toast } from '../components/shared/Toast';
import type { Project, SiteEntry, ReportSummary } from '../types';

interface ReportsPageProps {
  onNavigate: (page: string) => void;
}

const REPORT_TYPES: Record<string, { icon: string; period: string }> = {
  weekly: { icon: '📋', period: 'Last 7 days' },
  biweekly: { icon: '📅', period: 'Last 14 days' },
  monthly: { icon: '🗓️', period: 'Last 30 days' },
  annual: { icon: '📆', period: 'Last 12 months' },
};

const SEVERITY_COLORS: Record<string, string> = {
  LOW: 'var(--color-green)',
  MEDIUM: 'var(--color-amber)',
  HIGH: 'var(--color-red)',
  CRITICAL: '#ff6b6b',
};

type ModalType = 'deliveries' | 'issues' | 'work' | 'severity';

export function ReportsPage({ onNavigate }: ReportsPageProps) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [entries, setEntries] = useState<SiteEntry[]>([]);
  const [reportType, setReportType] = useState('weekly');
  const [projectFilter, setProjectFilter] = useState('');
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [showWorkOnly, setShowWorkOnly] = useState(false);

  useEffect(() => {
    projectsApi.list().then(setProjects).catch(() => {});
  }, []);

  const projectNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    projects.forEach((p) => { map[p.id] = p.name; });
    return map;
  }, [projects]);

  const getProjectName = (e: SiteEntry) => projectNameMap[e.project] || e.project_name || '—';

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (projectFilter) {
      result = result.filter((e) => e.project === projectFilter);
    }
    if (showWorkOnly) {
      result = result.filter((e) => e.work_items?.length > 0);
    }
    return result;
  }, [entries, projectFilter, showWorkOnly]);

  const allDeliveries = useMemo(() =>
    filteredEntries.flatMap((e) =>
      (e.deliveries || []).map((d) => ({
        ...d,
        entryDate: e.date,
        projectName: getProjectName(e),
      }))
    ), [filteredEntries]);

  const allIssues = useMemo(() =>
    filteredEntries.flatMap((e) =>
      (e.issues || []).map((i) => ({
        ...i,
        entryDate: e.date,
        projectName: getProjectName(e),
      }))
    ), [filteredEntries]);

  const filteredIssues = useMemo(() => {
    if (!severityFilter) return allIssues;
    return allIssues.filter((i) => i.severity === severityFilter);
  }, [allIssues, severityFilter]);

  const sortedIssues = useMemo(() =>
    [...filteredIssues].sort((a, b) => {
      const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (order[a.severity as keyof typeof order] ?? 4) - (order[b.severity as keyof typeof order] ?? 4);
    }), [filteredIssues]);

  const entriesWithWork = useMemo(() =>
    filteredEntries.filter((e) => e.work_items?.length > 0), [filteredEntries]);

  const generateReport = async () => {
    setLoading(true);
    try {
      const summary = await entriesApi.getReportSummary({
        type: reportType,
        project: projectFilter || undefined,
      });
      setReport(summary);

      const allEntries = await entriesApi.list(
        projectFilter ? { project: projectFilter } : undefined
      );
      setEntries(allEntries);

      toast.success('Report generated');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const openDeliveries = () => setActiveModal('deliveries');
  const openIssues = () => setActiveModal('issues');
  const openWork = () => { setShowWorkOnly(true); };
  const openSeverity = (sev: string) => { setSeverityFilter(sev); setActiveModal('severity'); };
  const closeModal = () => { setActiveModal(null); setSeverityFilter(''); };

  return (
    <AppLayout page="reports" breadcrumb="Reports" onNavigate={onNavigate}
      right={<Button onClick={generateReport} disabled={loading}>
        {loading ? 'GENERATING…' : '⚡ GENERATE'}
      </Button>}>
      <div className="font-mono text-[11px] tracking-[1.5px] text-amber uppercase mb-1">Report Centre</div>
      <div className="flex items-baseline justify-between mb-7">
        <h1 className="font-['Bebas_Neue'] text-[42px] tracking-wide">
          GENERATE <span className="text-amber">REPORTS</span>
        </h1>
        {user?.organization_name && (
          <span className="font-mono text-[10px] tracking-wider text-text-muted2 dark:text-text-muted2 border border-border dark:border-border px-2 py-1">
            {user.organization_name}
          </span>
        )}
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-2.5 flex-wrap mb-6">
        {Object.entries(REPORT_TYPES).map(([type, { icon, period }]) => (
          <div key={type} onClick={() => setReportType(type)}
            className={`flex flex-col items-center gap-1 px-5 py-3.5 border cursor-pointer min-w-[100px] transition-all relative ${
              reportType === type
                ? 'border-amber/50 bg-amber-glow dark:bg-amber-glow text-amber'
                : 'border-border dark:border-border bg-panel dark:bg-panel text-text-white dark:text-text-white hover:border-amber/30'
            }`}>
            {reportType === type && <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber" />}
            <span className="text-[22px]">{icon}</span>
            <span className="font-['Bebas_Neue'] text-base tracking-wide">{type.toUpperCase()}</span>
            <span className="font-mono text-[9px] tracking-wider text-text-muted2 dark:text-text-muted2">{period}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-end gap-3.5 flex-wrap p-4 px-5 bg-panel dark:bg-panel border border-border dark:border-border mb-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Project Filter</span>
          <Select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} className="!h-[38px] !text-[13px] !px-3.5 !min-w-[200px]">
            <option value="">All Projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </div>
        <button onClick={generateReport} disabled={loading}
          className="bg-amber text-black px-6 py-2.5 font-bold text-[13px] cursor-pointer hover:bg-amber-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end">
          {loading ? 'GENERATING…' : '⚡ GENERATE'}
        </button>
      </div>

      {!report ? (
        <div className="text-center py-14">
          <div className="text-[40px] opacity-40 mb-3">📊</div>
          <div className="font-['Bebas_Neue'] text-xl text-text-muted dark:text-text-muted">SELECT & GENERATE</div>
          <div className="text-[13px] text-text-muted2 dark:text-text-muted2 mt-2 max-w-[300px]">Choose a report type and project filter, then click Generate.</div>
        </div>
      ) : (
        <div className="animate-[slideUp_0.3s_ease]">
          {/* Info Bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-glow dark:bg-amber-glow border border-amber/20 mb-5 font-mono text-[11px] tracking-[0.5px] text-amber">
            📅 {REPORT_TYPES[report.type]?.period || report.period.label} · {report.project_name} · Generated {new Date().toLocaleString()}
          </div>

          {/* Work Filter Indicator */}
          {showWorkOnly && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-purple/10 border border-purple/20 mb-5 font-mono text-[11px] tracking-[0.5px] text-purple">
              <span>Filtering: entries with work logged</span>
              <button
                onClick={() => { setShowWorkOnly(false); }}
                className="ml-auto text-xs underline cursor-pointer hover:text-text-white transition-colors"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
            <KpiCard
              label="Total Entries"
              value={report.total_entries}
              sub="Click to view dashboard"
              color="var(--color-amber)"
              onClick={() => onNavigate('dashboard')}
            />
            <KpiCard
              label="Total Deliveries"
              value={report.total_deliveries}
              sub="Click to view details"
              color="var(--color-teal)"
              onClick={openDeliveries}
            />
            <KpiCard
              label="Total Issues"
              value={report.total_issues}
              sub="Click to view details"
              color="var(--color-red)"
              onClick={openIssues}
            />
            <KpiCard
              label="Work Completion"
              value={`${report.work_completion}%`}
              sub={showWorkOnly ? 'Showing filtered entries' : 'Click to filter entries'}
              color="var(--color-purple)"
              onClick={openWork}
            />
          </div>

          {/* Issues Breakdown */}
          <PanelCard>
            <PanelHeader title="ISSUES BREAKDOWN" badge="CLICK TO DRILL DOWN" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => {
                const total = report.total_issues || 1;
                const count = report.issues[sev];
                return (
                  <div
                    key={sev}
                    onClick={() => openSeverity(sev)}
                    className="flex flex-col gap-1 px-3.5 py-3 border border-border dark:border-border bg-panel2 dark:bg-panel2 cursor-pointer hover:border-amber/40 hover:shadow-[0_0_16px_rgba(245,158,11,0.06)] active:scale-[0.98] transition-all duration-200 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style={{ background: `linear-gradient(135deg, ${SEVERITY_COLORS[sev]}08 0%, transparent 60%)` }} />
                    <div className="flex items-center justify-between relative">
                      <div className="font-mono text-[9px] tracking-[1.5px] uppercase" style={{ color: SEVERITY_COLORS[sev] }}>{sev}</div>
                      <svg className="w-3 h-3 text-text-muted2 dark:text-text-muted2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="font-['Bebas_Neue'] text-[28px] text-text-white dark:text-text-white relative">{count}</div>
                    <div className="h-[3px] bg-border dark:bg-border rounded-sm relative">
                      <div className="h-full rounded-sm" style={{ width: `${(count / total) * 100}%`, background: SEVERITY_COLORS[sev] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </PanelCard>

          {/* Recent Entries Table */}
          {filteredEntries.length > 0 && (
            <PanelCard>
              <PanelHeader title="FILTERED ENTRIES" badge={`${filteredEntries.length} ENTRIES`} />
              <div className="max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border dark:border-border">
                      <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Date</th>
                      <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Project</th>
                      <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Work</th>
                      <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Deliveries</th>
                      <th className="text-left py-2 font-mono text-[10px] tracking-wider text-text-muted dark:text-text-muted uppercase">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.slice(0, 10).map((e) => (
                      <tr key={e.id} className="border-b border-border/50 dark:border-border/50">
                        <td className="py-2.5 font-mono text-[11px] text-amber">{e.date}</td>
                        <td className="py-2.5 text-text-white dark:text-text-white">{getProjectName(e)}</td>
                        <td className="py-2.5 text-text-muted dark:text-text-muted">{e.work_items?.length || 0} items</td>
                        <td className="py-2.5 text-text-muted dark:text-text-muted">{e.deliveries?.length || 0}</td>
                        <td className="py-2.5">{e.issues?.length > 0 ? <SevBadge severity={e.issues[0].severity} /> : <span className="text-text-muted2 dark:text-text-muted2">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PanelCard>
          )}
        </div>
      )}

      {/* Deliveries Modal */}
      {activeModal === 'deliveries' && (
        <Modal open onClose={closeModal} title="ALL DELIVERIES" maxWidth={700}>
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

      {/* Issues Modal (all) */}
      {activeModal === 'issues' && (
        <Modal open onClose={closeModal} title="ALL ISSUES" maxWidth={700}>
          {allIssues.length === 0 ? (
            <div className="text-center py-10 text-text-muted dark:text-text-muted font-mono text-sm">No issues logged.</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-2">
              {[...allIssues].sort((a, b) => {
                const order = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
                return (order[a.severity as keyof typeof order] ?? 4) - (order[b.severity as keyof typeof order] ?? 4);
              }).map((issue, i) => (
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

      {/* Work Completion Modal */}
      {activeModal === 'work' && (
        <Modal open onClose={() => setActiveModal(null)} title="WORK COMPLETION" maxWidth={700}>
          {entriesWithWork.length === 0 ? (
            <div className="text-center py-10 text-text-muted dark:text-text-muted font-mono text-sm">No entries with work logged.</div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-2">
              {entriesWithWork.map((e) => (
                <div key={e.id} className="p-3 px-4 bg-panel2 dark:bg-panel2 border border-border dark:border-border">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="font-mono text-[11px] text-amber">{e.date}</span>
                    <span className="text-[13px] font-medium">{getProjectName(e)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {e.work_items.map((w, i) => (
                      <div key={i} className="text-[12px] text-text-muted dark:text-text-muted flex items-center gap-2">
                        <span className="text-green">✓</span>
                        {w.description}
                        {w.quantity && <span className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2">({w.quantity} {w.unit})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Severity Filtered Modal */}
      {activeModal === 'severity' && severityFilter && (
        <Modal open onClose={closeModal} title={`${severityFilter} ISSUES`} maxWidth={700}>
          {sortedIssues.length === 0 ? (
            <div className="text-center py-10 text-text-muted dark:text-text-muted font-mono text-sm">No {severityFilter.toLowerCase()} issues found.</div>
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
    </AppLayout>
  );
}
