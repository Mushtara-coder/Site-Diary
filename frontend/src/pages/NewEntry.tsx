import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { entriesApi } from '../api/entries';
import { projectsApi } from '../api/projects';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { toast } from '../components/shared/Toast';
import { AppLayout } from '../components/layout/AppLayout';
import type { Project, WorkItem, Delivery, Plan, Issue } from '../types';
import { todayStr } from '../lib/utils';

interface NewEntryModalProps {
  projects: Project[];
  onClose: () => void;
  onCreated: () => void;
}

interface NewEntryPageProps {
  onNavigate: (page: string) => void;
}

function SectionBlock({ label, onAdd, children }: { label: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border dark:border-border mb-4 overflow-hidden">
      <div className="flex items-center justify-between bg-panel2 dark:bg-panel2 px-3.5 py-2.5 border-b border-border dark:border-border">
        <span className="font-mono text-[10px] tracking-[1.8px] text-amber uppercase">{label}</span>
        <button onClick={onAdd} className="bg-transparent border border-amber/30 text-amber font-mono text-[10px] tracking-wider px-2.5 py-1 cursor-pointer hover:bg-amber/10 transition-all">
          + Add Row
        </button>
      </div>
      {children}
    </div>
  );
}

export function NewEntryModal({ projects, onClose, onCreated }: NewEntryModalProps) {
  const [project, setProject] = useState('');
  const [date, setDate] = useState(todayStr());
  const [weather, setWeather] = useState('Clear / Sunny');
  const [personnel, setPersonnel] = useState('');
  const [work, setWork] = useState<WorkItem[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const addWork = () => setWork((w) => [...w, { description: '', quantity: null, unit: '' }]);
  const addDelivery = () => setDeliveries((d) => [...d, { material: '', quantity: null, supplier: '', condition: 'Good' }]);
  const addPlan = () => setPlans((p) => [...p, { activity: '', expected_date: null }]);
  const addIssue = () => setIssues((i) => [...i, { description: '', severity: 'LOW' }]);

  async function submit() {
    if (!project) { toast.error('Please select a project'); return; }
    if (!date) { toast.error('Please select a date'); return; }

    try {
      await entriesApi.create({
        project,
        date,
        weather,
        personnel: parseInt(personnel) || 0,
        work_items_data: work.filter((w) => w.description),
        deliveries_data: deliveries.filter((d) => d.material),
        plans_data: plans.filter((p) => p.activity),
        issues_data: issues.filter((i) => i.description),
      });
      toast.success('Entry saved successfully!');
      onCreated();
    } catch {
      toast.error('Failed to save entry');
    }
  }

  return (
    <Modal open onClose={onClose} title="NEW SITE ENTRY" maxWidth={820}>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Project *" value={project} onChange={(e) => setProject(e.target.value)}>
          <option value="">Select project</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Input label="Date *" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Weather" value={weather} onChange={(e) => setWeather(e.target.value)}>
          {['Clear / Sunny', 'Overcast', 'Light Rain', 'Heavy Rain', 'Extreme Heat'].map((w) => (
            <option key={w}>{w}</option>
          ))}
        </Select>
        <Input label="Personnel On-Site" type="number" value={personnel} onChange={(e) => setPersonnel(e.target.value)} placeholder="e.g. 24" min="0" />
      </div>

      <SectionBlock label="A. WORK DONE" onAdd={addWork}>
        {work.length === 0 ? (
          <div className="p-3.5 font-mono text-[11px] text-text-muted2 text-center">No rows — click + Add Row</div>
        ) : (
          work.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_90px_90px_28px] gap-2 px-3.5 py-2.5 border-b border-white/4 items-start">
              <input value={row.description} onChange={(e) => { const w = [...work]; w[i] = { ...w[i], description: e.target.value }; setWork(w); }} placeholder="Work description"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <input value={row.quantity || ''} onChange={(e) => { const w = [...work]; w[i] = { ...w[i], quantity: e.target.value }; setWork(w); }} placeholder="Qty"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <input value={row.unit} onChange={(e) => { const w = [...work]; w[i] = { ...w[i], unit: e.target.value }; setWork(w); }} placeholder="Unit"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <button onClick={() => setWork(work.filter((_, j) => j !== i))} className="text-text-muted2 text-lg hover:text-red self-center mt-4">×</button>
            </div>
          ))
        )}
      </SectionBlock>

      <SectionBlock label="B. DELIVERIES" onAdd={addDelivery}>
        {deliveries.length === 0 ? (
          <div className="p-3.5 font-mono text-[11px] text-text-muted2 text-center">No rows — click + Add Row</div>
        ) : (
          deliveries.map((row, i) => (
            <div key={i} className="grid grid-cols-[1.4fr_80px_1fr_100px_28px] gap-2 px-3.5 py-2.5 border-b border-white/4 items-start">
              <input value={row.material} onChange={(e) => { const d = [...deliveries]; d[i] = { ...d[i], material: e.target.value }; setDeliveries(d); }} placeholder="Material"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <input value={row.quantity || ''} onChange={(e) => { const d = [...deliveries]; d[i] = { ...d[i], quantity: e.target.value }; setDeliveries(d); }} placeholder="Qty"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <input value={row.supplier} onChange={(e) => { const d = [...deliveries]; d[i] = { ...d[i], supplier: e.target.value }; setDeliveries(d); }} placeholder="Supplier"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <select value={row.condition} onChange={(e) => { const d = [...deliveries]; d[i] = { ...d[i], condition: e.target.value as Delivery['condition'] }; setDeliveries(d); }}
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] appearance-none cursor-pointer">
                {['Good', 'Damaged', 'Partial', 'Rejected'].map((c) => <option key={c}>{c}</option>)}
              </select>
              <button onClick={() => setDeliveries(deliveries.filter((_, j) => j !== i))} className="text-text-muted2 text-lg hover:text-red self-center mt-4">×</button>
            </div>
          ))
        )}
      </SectionBlock>

      <SectionBlock label="D. PLANS" onAdd={addPlan}>
        {plans.length === 0 ? (
          <div className="p-3.5 font-mono text-[11px] text-text-muted2 text-center">No rows — click + Add Row</div>
        ) : (
          plans.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_150px_28px] gap-2 px-3.5 py-2.5 border-b border-white/4 items-start">
              <input value={row.activity} onChange={(e) => { const p = [...plans]; p[i] = { ...p[i], activity: e.target.value }; setPlans(p); }} placeholder="Planned activity"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <input type="date" value={row.expected_date || ''} onChange={(e) => { const p = [...plans]; p[i] = { ...p[i], expected_date: e.target.value || null }; setPlans(p); }}
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <button onClick={() => setPlans(plans.filter((_, j) => j !== i))} className="text-text-muted2 text-lg hover:text-red self-center mt-4">×</button>
            </div>
          ))
        )}
      </SectionBlock>

      <SectionBlock label="E. ISSUES / OBSERVATIONS" onAdd={addIssue}>
        {issues.length === 0 ? (
          <div className="p-3.5 font-mono text-[11px] text-text-muted2 text-center">No rows — click + Add Row</div>
        ) : (
          issues.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_28px] gap-2 px-3.5 py-2.5 border-b border-white/4 items-start">
              <input value={row.description} onChange={(e) => { const is = [...issues]; is[i] = { ...is[i], description: e.target.value }; setIssues(is); }} placeholder="Issue description"
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] outline-none focus:border-amber" />
              <select value={row.severity} onChange={(e) => { const is = [...issues]; is[i] = { ...is[i], severity: e.target.value as Issue['severity'] }; setIssues(is); }}
                className="w-full bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-2.5 py-2 text-[13px] appearance-none cursor-pointer">
                {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button onClick={() => setIssues(issues.filter((_, j) => j !== i))} className="text-text-muted2 text-lg hover:text-red self-center mt-4">×</button>
            </div>
          ))
        )}
      </SectionBlock>

      <button onClick={submit} className="w-full mt-6 bg-amber border-none text-black py-3.5 font-bold text-sm cursor-pointer tracking-wider hover:bg-amber-dim transition-colors">
        SUBMIT ENTRY
      </button>
    </Modal>
  );
}

export function NewEntryPage({ onNavigate }: NewEntryPageProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const loadProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    }
  };

  return (
    <AppLayout page="new-entry" breadcrumb="New Entry" onNavigate={onNavigate}>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
        <div className="text-[48px] opacity-30">✏️</div>
        <div className="font-['Bebas_Neue'] text-[36px] tracking-wide">LOG A SITE ENTRY</div>
        <div className="text-sm text-text-muted dark:text-text-muted max-w-[340px] leading-relaxed">
          Use the full entry modal to log today's work, deliveries, issues, and plans.
        </div>
        <button onClick={() => { loadProjects(); setOpen(true); }}
          className="mt-2 bg-amber border-none text-black px-8 py-3.5 font-bold text-sm cursor-pointer hover:bg-amber-dim transition-colors">
          + OPEN ENTRY FORM
        </button>
        {user?.organization_name && (
          <div className="font-mono text-[10px] text-text-muted2 dark:text-text-muted2 tracking-wider mt-2">
            Organization: {user.organization_name}
          </div>
        )}
      </div>
      {open && <NewEntryModal projects={projects} onClose={() => setOpen(false)} onCreated={() => setOpen(false)} />}
    </AppLayout>
  );
}
