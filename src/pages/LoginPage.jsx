
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { validateEmail, validatePassword } from '../utils/validators';

export function LoginPage() {
  const { isAuthenticated, login, loading, error } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  if (isAuthenticated) {
    const to = location.state?.from?.pathname || '/';
    return <Navigate to={to} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setFieldErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    try {
      await login(email, password);
    } catch {
      /* AuthContext stores the message */
    }
  }

  return (
    <div className="login-shell">
      <button
        type="button"
        className="btn btn-outline-secondary theme-float"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <i className={`bi ${theme === 'dark' ? 'bi-sun' : 'bi-moon'}`} />
      </button>

      <section className="login-hero">
        <p className="eyebrow">LogixGrid</p>

        <h1>Project Management Dashboard</h1>

        <p>
          Track projects, tasks, and monthly delivery health for LogixGrid operations — from a single
          responsive workspace.
        </p>
      </section>

      <section className="login-card">
        <h2 className="h4">Sign in with Gmail</h2>

        <form onSubmit={handleSubmit} noValidate>
          {error ? <div className="alert alert-danger">{error}</div> : null}

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              placeholder="Enter your email"
            />

            {fieldErrors.email ? (
              <div className="invalid-feedback">{fieldErrors.email}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
            />

            {fieldErrors.password ? (
              <div className="invalid-feedback">{fieldErrors.password}</div>
            ) : null}
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  );
}
