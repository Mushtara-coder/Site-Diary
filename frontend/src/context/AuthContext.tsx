import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { User, AuthTokens } from '../types';
import { authApi } from '../api/auth';

function normalizeOrg(name: string): string {
  return name.trim().toLowerCase();
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  organizationName: string;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    organization_name: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedTokens = localStorage.getItem('sd_tokens');
    const storedUser = localStorage.getItem('sd_user');
    if (storedTokens && storedUser) {
      setTokens(JSON.parse(storedTokens));
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    const u = response.user;
    if (u.organization_name) {
      u.organization_name = normalizeOrg(u.organization_name);
    } else if (u.organization_detail?.name) {
      u.organization_name = normalizeOrg(u.organization_detail.name);
    }
    setUser(u);
    setTokens(response.tokens);
    localStorage.setItem('sd_tokens', JSON.stringify(response.tokens));
    localStorage.setItem('sd_user', JSON.stringify(u));
  }, []);

  const register = useCallback(async (payload: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
    organization_name: string;
  }) => {
    const normalizedOrg = normalizeOrg(payload.organization_name);
    const response = await authApi.register({
      ...payload,
      organization_name: normalizedOrg,
    });
    const u = response.user;
    if (u.organization_name) {
      u.organization_name = normalizeOrg(u.organization_name);
    } else if (u.organization_detail?.name) {
      u.organization_name = normalizeOrg(u.organization_detail.name);
    } else {
      u.organization_name = normalizedOrg;
    }
    setUser(u);
    setTokens(response.tokens);
    localStorage.setItem('sd_tokens', JSON.stringify(response.tokens));
    localStorage.setItem('sd_user', JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('sd_tokens');
    localStorage.removeItem('sd_user');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser((prev) => {
      const merged: User = {
        ...updatedUser,
        organization_name: updatedUser.organization_name
          ? normalizeOrg(updatedUser.organization_name)
          : prev?.organization_name || '',
        organization: updatedUser.organization || prev?.organization || null,
        organization_detail: updatedUser.organization_detail || prev?.organization_detail || null,
      };
      localStorage.setItem('sd_user', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const organizationName = useMemo(() => {
    return user?.organization_name || user?.organization_detail?.name || '';
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      tokens,
      isLoading,
      organizationName,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
