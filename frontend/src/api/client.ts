import axios from 'axios';

function getOrganization(): string {
  try {
    const stored = localStorage.getItem('sd_user');
    if (stored) {
      const user = JSON.parse(stored);
      return user.organization_name || '';
    }
  } catch {}
  return '';
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('sd_tokens');
  if (tokens) {
    const { access } = JSON.parse(tokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  const org = getOrganization();
  if (org) {
    if (config.method === 'get' || config.method === 'GET') {
      config.params = { ...config.params, organization: org };
    } else {
      if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
        config.data = { ...config.data, organization: org };
      }
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const tokens = localStorage.getItem('sd_tokens');
        if (tokens) {
          const { refresh } = JSON.parse(tokens);
          const { data } = await axios.post('/api/auth/refresh/', { refresh });
          localStorage.setItem('sd_tokens', JSON.stringify(data));
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        }
      } catch {
        localStorage.removeItem('sd_tokens');
        localStorage.removeItem('sd_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
