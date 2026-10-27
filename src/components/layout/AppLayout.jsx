import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppDataProvider } from '../../context/AppDataContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const TITLES = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
};

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const title = TITLES[location.pathname] || (location.pathname.startsWith('/projects/') ? 'Project' : 'Workspace');

  return (
    <AppDataProvider>
      <div className="app-shell">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        {menuOpen ? <button type="button" className="sidebar-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" /> : null}
        <div className="app-main">
          <Topbar title={title} onMenu={() => setMenuOpen(true)} />
          <div className="app-content">
            <Outlet />
          </div>
        </div>
      </div>
    </AppDataProvider>
  );
}
