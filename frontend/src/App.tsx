import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from './components/shared/Toast';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { DashboardPage } from './pages/Dashboard';
import { NewEntryPage } from './pages/NewEntry';
import { ProjectsPage } from './pages/Projects';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';

function AppInner() {
  const { user, isLoading } = useAuth();
  const [page, setPage] = useState(() => (user ? 'dashboard' : 'landing'));

  function navigate(target: string) {
    const appPages = ['dashboard', 'new-entry', 'projects', 'reports', 'settings'];
    if (appPages.includes(target) && !user) {
      setPage('login');
      return;
    }
    if ((target === 'login' || target === 'signup') && user) {
      setPage('dashboard');
      return;
    }
    setPage(target);
    window.scrollTo(0, 0);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="font-['Bebas_Neue'] text-2xl text-amber tracking-wider animate-pulse">SITEDIARY</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {page === 'landing' && <LandingPage onNavigate={navigate} />}
      {page === 'login' && <LoginPage onNavigate={navigate} />}
      {page === 'signup' && <SignupPage onNavigate={navigate} />}
      {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
      {page === 'new-entry' && <NewEntryPage onNavigate={navigate} />}
      {page === 'projects' && <ProjectsPage onNavigate={navigate} />}
      {page === 'reports' && <ReportsPage onNavigate={navigate} />}
      {page === 'settings' && <SettingsPage onNavigate={navigate} />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
