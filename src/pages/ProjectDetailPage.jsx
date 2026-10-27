import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { StatusBadge } from '../components/common/StatusBadge';
import { ProjectForm } from '../components/projects/ProjectForm';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskTable } from '../components/tasks/TaskTable';
import { useAppData } from '../context/AppDataContext';
import { formatDate } from '../utils/dates';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    tasks,
    users,
    userMap,
    projectMap,
    loading,
    error,
    refresh,
    editProject,
    removeProject,
    addTask,
    editTask,
    removeTask,
  } = useAppData();
  const [formOpen, setFormOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingProject, setDeletingProject] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [busy, setBusy] = useState(false);

  const project = projects.find((item) => item.id === projectId);
  const projectTasks = useMemo(
    () => tasks.filter((task) => task.projectId === projectId),
    [tasks, projectId],
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!project) {
    return <ErrorState message="That project was not found." onRetry={() => navigate('/projects')} />;
  }

  const members = users.filter((user) => project.teamMemberIds.includes(user.id));

  return (
    <div className="page-stack">
      <Link to="/projects" className="back-link">
        ← All projects
      </Link>
      <div className="panel">
        <div className="d-flex justify-content-between gap-3 flex-wrap">
          <div>
            <p className="eyebrow mb-1">Project</p>
            <h2 className="h3 mb-2">{project.name}</h2>
            <StatusBadge kind="project" value={project.status} />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setFormOpen(true)}>
              Edit
            </button>
            <button type="button" className="btn btn-outline-danger" onClick={() => setDeletingProject(true)}>
              Delete
            </button>
          </div>
        </div>
        <p className="mt-3 mb-0">{project.description}</p>
        <dl className="meta-list mt-4">
          <div>
            <dt>Start date</dt>
            <dd>{formatDate(project.startDate)}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>{formatDate(project.deadline)}</dd>
          </div>
          <div>
            <dt>Tasks</dt>
            <dd>{projectTasks.length}</dd>
          </div>
        </dl>
        <h3 className="h6 mt-4">Team members</h3>
        <div className="d-flex flex-wrap gap-2">
          {members.map((member) => (
            <span key={member.id} className="pill">
              {member.name} · {member.role}
            </span>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <h3 className="h5 mb-0">Project tasks</h3>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingTask(null);
            setTaskFormOpen(true);
          }}
        >
          Add task
        </button>
      </div>

      {projectTasks.length ? (
        <TaskTable
          tasks={projectTasks}
          userMap={userMap}
          projectMap={projectMap}
          onView={(task) => {
            setEditingTask(task);
            setTaskFormOpen(true);
          }}
          onEdit={(task) => {
            setEditingTask(task);
            setTaskFormOpen(true);
          }}
          onDelete={setDeletingTask}
          onStatusChange={(task, status) => editTask(task.id, { status })}
        />
      ) : (
        <EmptyState title="No tasks yet" message="Add the first task for this project." actionLabel="Add task" onAction={() => setTaskFormOpen(true)} />
      )}

      <ProjectForm
        show={formOpen}
        project={project}
        users={users}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => editProject(project.id, values)}
      />
      <TaskForm
        show={taskFormOpen}
        task={editingTask}
        projects={projects}
        users={users}
        defaultProjectId={project.id}
        onClose={() => setTaskFormOpen(false)}
        onSubmit={(values) => (editingTask ? editTask(editingTask.id, values) : addTask(values))}
      />
      <ConfirmModal
        show={deletingProject}
        title="Delete project"
        message={`Delete “${project.name}” and its tasks?`}
        busy={busy}
        onClose={() => setDeletingProject(false)}
        onConfirm={async () => {
          setBusy(true);
          try {
            await removeProject(project.id);
            navigate('/projects');
          } finally {
            setBusy(false);
          }
        }}
      />
      <ConfirmModal
        show={Boolean(deletingTask)}
        title="Delete task"
        message={`Delete “${deletingTask?.title}”?`}
        busy={busy}
        onClose={() => setDeletingTask(null)}
        onConfirm={async () => {
          setBusy(true);
          try {
            await removeTask(deletingTask.id);
            setDeletingTask(null);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
