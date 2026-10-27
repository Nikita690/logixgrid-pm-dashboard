import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Dashboard', icon: 'bi-grid-1x2' },
  { to: '/projects', label: 'Projects', icon: 'bi-folder2-open' },
  { to: '/tasks', label: 'Tasks', icon: 'bi-check2-square' },
];

export function Sidebar({ open, onNavigate }) {
  return (
    <aside className={`app-sidebar ${open ? 'open' : ''}`}>
      <div className="brand-block">
        <div className="brand-mark">LG</div>
        <div>
          <strong>LogixGrid</strong>
          <div className="small text-body-secondary">Project Ops</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <i className={`bi ${link.icon}`} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
