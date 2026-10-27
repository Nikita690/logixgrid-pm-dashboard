# LogixGrid Project Management Dashboard

Responsive React dashboard for LogixGrid project and task operations. Data is mocked in a local API layer backed by `localStorage` — no backend required.

## Stack

- React 19 + Vite
- JavaScript (ES6+)
- Bootstrap 5 / React Bootstrap
- React Router
- Context API
- Recharts
- @dnd-kit (kanban drag-and-drop)

## Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

## Login (Gmail only)

The login form accepts **@gmail.com** addresses. Mock accounts:

| Email | Password | Role |
| --- | --- | --- |
| admin@gmail.com | Admin@123 | Admin |
| pm@gmail.com | Project@123 | Project Manager |
| alex@gmail.com | Team@123 | Developer |
| priya@gmail.com | Team@123 | Designer |
| sam@gmail.com | Team@123 | QA Engineer |

Session is stored in `localStorage` and survives refresh. Dashboard routes are protected. Use **Logout** in the top bar.

## What is included

- Dashboard totals for projects and tasks
- Month/year picker with **computed** created / completed / pending / overdue task counts
- Project CRUD (name, description, start date, deadline, status, team)
- Task CRUD, status changes, user assignment
- Search (debounced), combined filters, date sorting, pagination
- Dark / light mode
- Drag-and-drop task board
- Loading, error, and empty states

## Folder structure

```
src/
  api/            mock data service (separated from UI)
  components/     reusable layout, dashboard, project, and task UI
  context/        auth, theme, and workspace data
  hooks/          debounce
  pages/          route screens
  utils/          dates, stats, validators
```

Reset demo data by clearing `logixgrid_pm_db` (and optionally `logixgrid_session`) from localStorage.
