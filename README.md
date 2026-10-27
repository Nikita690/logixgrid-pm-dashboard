# LogixGrid Project Management Dashboard

A responsive and interactive project management dashboard built with React and Vite to streamline project tracking, task management, and team operations. The application uses a mock API layer backed by browser `localStorage`, so no backend server is required.

## Tech Stack

- **Frontend:** React 19, JavaScript (ES6+)
- **Build Tool:** Vite
- **UI Framework:** Bootstrap 5, React Bootstrap
- **Routing:** React Router
- **State Management:** React Context API
- **Data Visualization:** Recharts
- **Drag and Drop:** @dnd-kit
- **Data Persistence:** Browser localStorage

## Features

### Dashboard
- Overview of project and task statistics.
- Month and year filters.
- Computed task counts for created, completed, pending, and overdue tasks.

### Project Management
- Create, view, update, and delete projects.
- Manage project descriptions, dates, deadlines, statuses, and team assignments.

### Task Management
- Create and update tasks.
- Change task statuses and assign team members.
- Search, filtering, date sorting, and pagination.
- Kanban board with drag-and-drop functionality.

### User Experience
- Responsive interface for different screen sizes.
- Dark mode and light mode.
- Loading, error, and empty states.
- Protected dashboard routes.
- Login session persistence across browser refreshes.

## Prerequisites

Before running the project, ensure you have installed:

- Node.js (LTS version recommended)
- npm
- Git (optional, for cloning the repository)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nikita690/logixgrid-pm-dashboard.git
```

### 2. Navigate to the project directory

```bash
cd logixgrid-pm-dashboard
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173/`.

## Production Build

To generate a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Demo Login Credentials

The application uses mock authentication. The login form accepts Gmail addresses, and the following demo accounts are configured in the local seed data.

| Role | Email | Password |
|---|---|---|
| Admin | admin@gmail.com | Admin@123 |
| Project Manager | pm@gmail.com | Project@123 |
| Developer | alex@gmail.com | Team@123 |
| Designer | priya@gmail.com | Team@123 |
| QA Engineer | sam@gmail.com | Team@123 |

**Note:** These credentials are for local demonstration only. Verify that each account exists in the project's seed data before using it.

## Mock Data and Persistence

- Sample users, projects, and tasks are provided through the local mock data layer.
- Application data is stored in the browser's `localStorage`.
- No external database or backend service is required.
- The login session persists across page refreshes.

To reset the demo data, clear the `logixgrid_pm_db` key in browser localStorage. You can also clear `logixgrid_session` to reset the stored login session.

## Project Structure

```text
src/
├── api/          # Mock data service and local data handling
├── components/   # Reusable layout, dashboard, project, and task components
├── context/      # Authentication, theme, and workspace state
├── hooks/        # Custom React hooks
├── pages/        # Application route screens
└── utils/        # Date utilities, statistics, and validation
```

## Repository

GitHub: https://github.com/Nikita690/logixgrid-pm-dashboard

---

Developed as a project management dashboard assignment for LogixGrid.
