import { useState } from 'react';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectForm } from '../components/projects/ProjectForm';
import { useAppData } from '../context/AppDataContext';

export function ProjectsPage() {
  const { projects, users, loading, error, refresh, addProject, editProject, removeProject } = useAppData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="page-stack">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h2 className="h4 mb-1">Projects</h2>
          <p className="text-body-secondary mb-0">{projects.length} workstreams in the LogixGrid portfolio.</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Add project
        </button>
      </div>

      {projects.length ? (
        <div className="row g-3">
          {projects.map((project) => (
            <div className="col-md-6 col-xl-4" key={project.id}>
              <ProjectCard
                project={project}
                users={users}
                onEdit={(item) => {
                  setEditing(item);
                  setFormOpen(true);
                }}
                onDelete={setDeleting}
              />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          message="Create the first LogixGrid project to start tracking work."
          actionLabel="Add project"
          onAction={() => setFormOpen(true)}
        />
      )}

      <ProjectForm
        show={formOpen}
        project={editing}
        users={users}
        onClose={() => setFormOpen(false)}
        onSubmit={(values) => (editing ? editProject(editing.id, values) : addProject(values))}
      />

      <ConfirmModal
        show={Boolean(deleting)}
        title="Delete project"
        message={`Delete “${deleting?.name}”? Related tasks will also be removed.`}
        busy={busy}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true);
          try {
            await removeProject(deleting.id);
            setDeleting(null);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
