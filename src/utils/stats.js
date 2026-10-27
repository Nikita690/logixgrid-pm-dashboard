import { getPeriodBounds, inRange, parseDate } from './dates';

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

/**
 * Month/year stats are computed from task dates — never hard-coded.
 * - Created: createdDate falls in the selected month/year
 * - Completed: status is Completed and completedDate (fallback createdDate) falls in the month
 * - Pending: still open as of the evaluation cutoff, created on or before month end, due on/after cutoff
 * - Overdue: still open, due date is in the selected month, and due date is before the cutoff
 */
export function computeMonthYearStats(tasks, month, year, now = new Date()) {
  const { start, end } = getPeriodBounds(month, year);
  const cutoff = now < end ? endOfDay(now) : end;

  const created = tasks.filter((task) => inRange(task.createdDate, start, end));
  const completed = tasks.filter((task) => {
    if (task.status !== 'Completed') return false;
    return inRange(task.completedDate || task.createdDate, start, end);
  });
  const pending = tasks.filter((task) => {
    if (task.status === 'Completed') return false;
    const createdAt = parseDate(task.createdDate);
    const due = parseDate(task.dueDate);
    if (!createdAt || createdAt > end) return false;
    if (!due) return true;
    return due >= cutoff;
  });
  const overdue = tasks.filter((task) => {
    if (task.status === 'Completed') return false;
    const due = parseDate(task.dueDate);
    if (!due) return false;
    return due >= start && due <= end && due < cutoff;
  });

  return {
    createdCount: created.length,
    completedCount: completed.length,
    pendingCount: pending.length,
    overdueCount: overdue.length,
    created,
    completed,
    pending,
    overdue,
  };
}

export function computeDashboardTotals(projects, tasks, now = new Date()) {
  const activeProjects = projects.filter((project) => project.status === 'Active').length;
  const completedProjects = projects.filter((project) => project.status === 'Completed').length;
  const pendingTasks = tasks.filter((task) => task.status !== 'Completed').length;
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
  const overdueTasks = tasks.filter((task) => {
    if (task.status === 'Completed') return false;
    const due = parseDate(task.dueDate);
    if (!due) return false;
    const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return due < cutoff;
  }).length;

  return {
    totalProjects: projects.length,
    activeProjects,
    completedProjects,
    totalTasks: tasks.length,
    pendingTasks,
    completedTasks,
    overdueTasks,
  };
}

export function projectStatusCounts(projects) {
  return ['Active', 'Completed', 'On Hold'].map((status) => ({
    name: status,
    value: projects.filter((project) => project.status === status).length,
  }));
}

export function taskStatusCounts(tasks) {
  return ['To Do', 'In Progress', 'Completed'].map((status) => ({
    name: status,
    value: tasks.filter((task) => task.status === status).length,
  }));
}
