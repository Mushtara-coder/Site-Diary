import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectsApi } from '../api/projects';
import { AppLayout } from '../components/layout/AppLayout';
import { PanelCard, PanelHeader } from '../components/shared/PanelCard';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { toast } from '../components/shared/Toast';
import type { Project } from '../types';

interface ProjectsPageProps {
  onNavigate: (page: string) => void;
}

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-amber/15 text-amber border border-amber/30',
  COMPLETED: 'bg-green/10 text-green border border-green/30',
  ON_HOLD: 'text-text-muted border border-border',
};

export function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: '', location: '', start_date: '', status: 'ACTIVE', description: '',
  });

  const fetchProjects = async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const filtered = projects.filter((p) => {
    if (filter !== 'ALL' && p.status !== filter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.location?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) { toast.error('Project name is required'); return; }
    try {
      await projectsApi.create({ ...formData, status: formData.status as any });
      toast.success('Project created');
      setFormData({ name: '', location: '', start_date: '', status: 'ACTIVE', description: '' });
      fetchProjects();
    } catch {
      toast.error('Failed to create project');
    }
  };

  const handleUpdate = async () => {
    if (!editProject) return;
    try {
      await projectsApi.update(editProject.id, { ...formData, status: formData.status as any });
      toast.success('Project updated');
      setEditProject(null);
      setFormData({ name: '', location: '', start_date: '', status: 'ACTIVE', description: '' });
      fetchProjects();
    } catch {
      toast.error('Failed to update project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await projectsApi.delete(id);
      toast.success('Project deleted');
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  return (
    <AppLayout page="projects" breadcrumb="Projects" onNavigate={onNavigate}
      right={<button onClick={() => document.getElementById('proj-name')?.focus()}
        className="bg-amber-glow border border-amber/30 text-amber px-4 py-2 font-mono text-[11px] tracking-wider hover:bg-amber/20 transition-all">
        + New Project
      </button>}>
      <div className="font-mono text-[11px] tracking-[1.5px] text-amber uppercase mb-1">Site Management</div>
      <div className="flex items-baseline justify-between mb-7">
        <h1 className="font-['Bebas_Neue'] text-[42px] tracking-wide">
          YOUR <span className="text-amber">PROJECTS</span>
        </h1>
        {user?.organization_name && (
          <span className="font-mono text-[10px] tracking-wider text-text-muted2 dark:text-text-muted2 border border-border dark:border-border px-2 py-1">
            {user.organization_name}
          </span>
        )}
      </div>

      <PanelCard>
        <PanelHeader title="CREATE PROJECT" badge="NEW SITE" />
        <div className="grid grid-cols-2 gap-4">
          <Input id="proj-name" label="Project Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. North Bridge Expansion" />
          <Input label="Location *" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Lagos, Nigeria" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date *" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
          <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
            <option value="ACTIVE">Active</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </Select>
        </div>
        <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief project description (optional)..." rows={2} />
        <Button onClick={handleCreate}>+ CREATE PROJECT</Button>
      </PanelCard>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..."
          className="flex-1 max-w-[320px] bg-panel dark:bg-panel border border-border dark:border-border text-text-white dark:text-text-white px-4 py-2.5 text-sm outline-none focus:border-amber" />
        {['ALL', 'ACTIVE', 'COMPLETED', 'ON_HOLD'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 border font-mono text-[11px] tracking-[0.5px] cursor-pointer transition-all ${
                filter === f ? 'border-amber text-amber bg-amber-glow' : 'border-border dark:border-border text-text-muted dark:text-text-muted'
              }`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <div className="text-[40px] opacity-40 mb-3">📁</div>
          <div className="font-['Bebas_Neue'] text-xl text-text-muted">NO PROJECTS</div>
          <div className="text-[13px] text-text-muted2 mt-2">Create your first project above.</div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const sc = statusColor[p.status] || statusColor.ON_HOLD;
            return (
              <div key={p.id} className="bg-panel border border-border p-5 hover:border-amber transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-['Bebas_Neue'] text-lg tracking-wide flex-1 mr-2">{p.name}</div>
                  <span className={`font-mono text-[9px] tracking-wider px-2 py-0.5 whitespace-nowrap ${sc}`}>{p.status.replace('_', ' ')}</span>
                </div>
                <div className="text-xs text-text-muted mb-1.5">📍 {p.location}</div>
                <div className="text-xs text-text-muted mb-3">📅 Started {p.start_date}</div>
                {p.description && <div className="text-[12.5px] text-text-muted2 mb-3.5 leading-relaxed line-clamp-2">{p.description}</div>}
                <div className="flex gap-3 py-2.5 border-y border-border mb-3.5">
                  <div className="flex-1 text-center">
                    <div className="font-['Bebas_Neue'] text-[22px]">{p.entry_count}</div>
                    <div className="font-mono text-[9px] tracking-wider text-text-muted2">ENTRIES</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-['Bebas_Neue'] text-[22px]">{p.delivery_count}</div>
                    <div className="font-mono text-[9px] tracking-wider text-text-muted2">DELIVERIES</div>
                  </div>
                  <div className="flex-1 text-center">
                    <div className="font-['Bebas_Neue'] text-[22px]">{p.issue_count}</div>
                    <div className="font-mono text-[9px] tracking-wider text-text-muted2">ISSUES</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditProject(p); setFormData({ name: p.name, location: p.location, start_date: p.start_date, status: p.status, description: p.description }); }}
                    className="flex-1 bg-transparent border border-border text-text-muted px-2 py-2 text-xs hover:border-amber hover:text-amber transition-all">EDIT</button>
                  <button onClick={() => handleDelete(p.id)}
                    className="flex-1 bg-transparent border border-red/25 text-red px-2 py-2 text-xs hover:bg-red/8 transition-all">DELETE</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editProject && (
        <Modal open onClose={() => setEditProject(null)} title="EDIT PROJECT" maxWidth={540}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Project Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <Input label="Location *" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
            <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
              <option value="ACTIVE">Active</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </Select>
          </div>
          <Textarea label="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
          <div className="flex gap-3">
            <Button onClick={handleUpdate} className="flex-1 justify-center">SAVE CHANGES</Button>
            <Button variant="outline" onClick={() => setEditProject(null)}>CANCEL</Button>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
