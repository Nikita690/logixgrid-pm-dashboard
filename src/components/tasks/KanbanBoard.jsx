import { DndContext, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PriorityBadge } from '../common/StatusBadge';

const COLUMNS = ['To Do', 'In Progress', 'Completed'];

function KanbanCard({ task, userMap, onEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <article ref={setNodeRef} style={style} className="kanban-card" {...attributes} {...listeners}>
      <div className="d-flex justify-content-between gap-2">
        <strong>{task.title}</strong>
        <PriorityBadge value={task.priority} />
      </div>
      <p className="small text-body-secondary mb-2">{userMap[task.assignedUserId]?.name}</p>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(task)}>
        Edit
      </button>
    </article>
  );
}

function Column({ status, tasks, userMap, onEdit }) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <header>
        <h3 className="h6 mb-0">{status}</h3>
        <span className="badge text-bg-light">{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-list">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} userMap={userMap} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ tasks, userMap, onStatusChange, onEdit }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const task = tasks.find((item) => item.id === active.id);
    if (!task) return;
    const overStatus = COLUMNS.includes(over.id)
      ? over.id
      : tasks.find((item) => item.id === over.id)?.status;
    if (overStatus && overStatus !== task.status) {
      onStatusChange(task, overStatus);
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            userMap={userMap}
            onEdit={onEdit}
          />
        ))}
      </div>
    </DndContext>
  );
}
