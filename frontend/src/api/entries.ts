import api from './client';
import type { SiteEntry, SiteEntryCreate, ReportSummary } from '../types';

export interface AiSummaryResponse {
  summary: string;
}

export const entriesApi = {
  list: async (params?: {
    project?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<SiteEntry[]> => {
    const { data } = await api.get('/entries/', { params });
    return data.results || data;
  },

  get: async (id: string): Promise<SiteEntry> => {
    const { data } = await api.get(`/entries/${id}/`);
    return data;
  },

  create: async (payload: SiteEntryCreate): Promise<SiteEntry> => {
    const { data } = await api.post('/entries/', payload);
    return data;
  },

  update: async (id: string, payload: Partial<SiteEntryCreate>): Promise<SiteEntry> => {
    const { data } = await api.put(`/entries/${id}/`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/entries/${id}/`);
  },

  getReportSummary: async (params: {
    type: string;
    project?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<ReportSummary> => {
    const { data } = await api.get('/reports/summary/', { params });
    return data;
  },

  generateAiSummary: async (params: {
    project?: string;
    date_from?: string;
    date_to?: string;
  }): Promise<AiSummaryResponse> => {
    const { data } = await api.post('/reports/ai-summary/', params);
    return data;
  },
};
