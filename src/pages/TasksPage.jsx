import { useMemo, useState } from 'react';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { PaginationBar } from '../components/common/PaginationBar';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskDetailModal } from '../components/tasks/TaskDetailModal';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskTable } from '../components/tasks/TaskTable';
import { useAppData } from '../context/AppDataContext';
import { useDebounce } from '../hooks/useDebounce';

const PAGE_SIZE = 6;

export function TasksPage() {
  const { tasks, users, projects, userMap, projectMap, loading, error, refresh, addTask, editTask, removeTask } =
    useAppData();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');
  const [sortBy, setSortBy] = useState('created-desc');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('table');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const next = tasks.filter((task) => {
      const matchesSearch = !query || task.title.toLowerCase().includes(query);
      const matchesStatus = !status || task.status === status;
      const matchesPriority = !priority || task.priority === priority;
      const matchesUser = !assignedUserId || task.assignedUserId === assignedUserId;
      return matchesSearch && matchesStatus && matchesPriority && matchesUser;
    });

    next.sort((a, b) => {
      if (sortBy.startsWith('created')) {
        const diff = a.createdDate.localeCompare(b.createdDate);
        return sortBy === 'created-asc' ? diff : -diff;
      }
      const diff = a.dueDate.localeCompare(b.dueDate);
      return sortBy === 'due-asc' ? diff : -diff;
    });
    return next;
  }, [tasks, debouncedSearch, status, priority, assignedUserId, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeFilter(setter) {
    return (value) => {
      setter(value);
      setPage(1);
    };
  }

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="page-stack">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 className="h4 mb-1">Tasks</h2>
          <p className="text-body-secondary mb-0">
            {filtered.length} matching · search is debounced · filters combine
          </p>
        </div>
        <div className="d-flex gap-2">
          <div className="btn-group">
            <button type="button" className={`btn btn-outline-secondary ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>
              List
            </button>
            <button type="button" className={`btn btn-outline-secondary ${view === 'board' ? 'active' : ''}`} onClick={() => setView('board')}>
              Board
            </button>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Add task
          </button>
        </div>
      </div>

      <TaskFilters
        search={search}
        onSearch={changeFilter(setSearch)}
        status={status}
        onStatus={changeFilter(setStatus)}
        priority={priority}
        onPriority={changeFilter(setPriority)}
        assignedUserId={assignedUserId}
        onAssignedUser={changeFilter(setAssignedUserId)}
        sortBy={sortBy}
        onSortBy={changeFilter(setSortBy)}
        users={users}
      />

      {view === 'table' ? (
        <>
          <TaskTable
            tasks={paged}
            userMap={userMap}
            projectMap={projectMap}
            onView={setViewing}
            onEdit={(task) => {
              setEditing(task);
              setFormOpen(true);
            }}
            onDelete={setDeleting}
            onStatusChange={(task, nextStatus) => editTask(task.id, { status: nextStatus })}
          />
          <PaginationBar page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        </>
      ) : (
        <KanbanBoard
          tasks={filtered}
          userMap={userMap}
          onEdit={(task) => {
            setEditing(task);
            setFormOpen(true);
          }}
          onStatusChange={(task, nextStatus) => editTask(task.id, { status: nextStatus })}
        />
      )}

      <TaskForm
        show={formOpen}
        task={editing}
        projects={projects}
        users={users}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => (editing ? editTask(editing.id, values) : addTask(values))}
      />
      <TaskDetailModal
        task={viewing}
        userMap={userMap}
        projectMap={projectMap}
        onClose={() => setViewing(null)}
        onEdit={(task) => {
          setViewing(null);
          setEditing(task);
          setFormOpen(true);
        }}
      />
      <ConfirmModal
        show={Boolean(deleting)}
        title="Delete task"
        message={`Delete “${deleting?.title}”?`}
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true);
          try {
            await removeTask(deleting.id);
            setDeleting(null);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
