import api from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login/', { email, password });
    return data;
  },

  register: async (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    organization_name: string;
  }): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register/', payload);
    return data;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await api.get('/auth/me/');
    return data;
  },

  updateProfile: async (payload: Partial<User>): Promise<User> => {
    const { data } = await api.put('/auth/me/', payload);
    return data;
  },
};
