import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export function Topbar({ title, onMenu }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-outline-secondary d-lg-none" onClick={onMenu} aria-label="Open menu">
          <i className="bi bi-list" />
        </button>
        <div>
          <p className="eyebrow mb-0">LogixGrid</p>
          <h1 className="h4 mb-0">{title}</h1>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="btn btn-outline-secondary" onClick={toggleTheme}>
          <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
          <span className="d-none d-sm-inline ms-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <div className="user-chip">
          <span className="avatar">{user?.name?.charAt(0)}</span>
          <span className="d-none d-md-block">
            <strong>{user?.name}</strong>
            <div className="small text-body-secondary">{user?.email}</div>
          </span>
        </div>
        <button type="button" className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
