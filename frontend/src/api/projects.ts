import api from './client';
import type { Project } from '../types';

export const projectsApi = {
  list: async (): Promise<Project[]> => {
    const { data } = await api.get('/projects/');
    return data.results || data;
  },

  get: async (id: string): Promise<Project> => {
    const { data } = await api.get(`/projects/${id}/`);
    return data;
  },

  create: async (payload: {
    name: string;
    location: string;
    start_date: string;
    status: string;
    description?: string;
  }): Promise<Project> => {
    const { data } = await api.post('/projects/', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Project>): Promise<Project> => {
    const { data } = await api.put(`/projects/${id}/`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}/`);
  },
};
