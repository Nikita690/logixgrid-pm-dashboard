import { useMemo, useState } from 'react';
import { MonthYearPicker } from '../components/dashboard/MonthYearPicker';
import { StatCard } from '../components/dashboard/StatCard';
import { StatsChart } from '../components/dashboard/StatsChart';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { useAppData } from '../context/AppDataContext';
import { MONTHS } from '../utils/dates';
import { computeDashboardTotals, computeMonthYearStats, projectStatusCounts } from '../utils/stats';

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const { projects, tasks, loading, error, refresh } = useAppData();

  const totals = useMemo(() => computeDashboardTotals(projects, tasks, now), [projects, tasks]);
  const monthly = useMemo(() => computeMonthYearStats(tasks, month, year, now), [tasks, month, year]);
  const pieData = useMemo(() => projectStatusCounts(projects), [projects]);
  const barData = useMemo(
    () => [
      { name: 'Created', value: monthly.createdCount },
      { name: 'Completed', value: monthly.completedCount },
      { name: 'Pending', value: monthly.pendingCount },
      { name: 'Overdue', value: monthly.overdueCount },
    ],
    [monthly],
  );
  const years = useMemo(() => {
    const fromTasks = tasks.flatMap((task) => {
      const created = task.createdDate ? Number(task.createdDate.slice(0, 4)) : null;
      const due = task.dueDate ? Number(task.dueDate.slice(0, 4)) : null;
      return [created, due].filter(Boolean);
    });
    const unique = [...new Set([...fromTasks, now.getFullYear(), now.getFullYear() - 1])].sort();
    return unique;
  }, [tasks]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="page-stack">
      <div className="panel d-flex flex-wrap justify-content-between gap-3 align-items-end">
        <div>
          <p className="eyebrow mb-1">Workspace overview</p>
          <h2 className="h4 mb-0">Delivery snapshot for {MONTHS[month - 1]} {year}</h2>
          <p className="text-body-secondary mb-0 mt-2">
            Month/year totals are calculated from task created, due, and completed dates.
          </p>
        </div>
        <MonthYearPicker month={month} year={year} years={years} onMonthChange={setMonth} onYearChange={setYear} />
      </div>

      <div className="stat-grid">
        <StatCard label="Total projects" value={totals.totalProjects} hint={`${totals.activeProjects} active`} />
        <StatCard label="Completed projects" value={totals.completedProjects} tone="navy" />
        <StatCard label="Total tasks" value={totals.totalTasks} hint={`${totals.pendingTasks} pending`} tone="gold" />
        <StatCard label="Overdue tasks" value={totals.overdueTasks} hint={`${totals.completedTasks} completed`} tone="coral" />
      </div>

      <div className="stat-grid">
        <StatCard label="Tasks created" value={monthly.createdCount} hint={`${MONTHS[month - 1]} ${year}`} />
        <StatCard label="Tasks completed" value={monthly.completedCount} tone="navy" hint="Completed in this month" />
        <StatCard label="Pending tasks" value={monthly.pendingCount} tone="gold" hint="Still open for this period" />
        <StatCard label="Overdue tasks" value={monthly.overdueCount} tone="coral" hint="Due in this month and past due" />
      </div>

      <StatsChart barData={barData} pieData={pieData} />
    </div>
  );
}
