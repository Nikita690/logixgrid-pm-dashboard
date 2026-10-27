export function TaskFilters({
  search,
  onSearch,
  status,
  onStatus,
  priority,
  onPriority,
  assignedUserId,
  onAssignedUser,
  sortBy,
  onSortBy,
  users,
}) {
  return (
    <div className="panel">
      <div className="row g-3 align-items-end">
        <div className="col-lg-4">
          <label className="form-label">Search by title</label>
          <input
            className="form-control"
            placeholder="Type a task title…"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <div className="col-6 col-lg-2">
          <label className="form-label">Status</label>
          <select className="form-select" value={status} onChange={(event) => onStatus(event.target.value)}>
            <option value="">All</option>
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="col-6 col-lg-2">
          <label className="form-label">Priority</label>
          <select className="form-select" value={priority} onChange={(event) => onPriority(event.target.value)}>
            <option value="">All</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="col-6 col-lg-2">
          <label className="form-label">Assigned user</label>
          <select className="form-select" value={assignedUserId} onChange={(event) => onAssignedUser(event.target.value)}>
            <option value="">All</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-lg-2">
          <label className="form-label">Sort by</label>
          <select className="form-select" value={sortBy} onChange={(event) => onSortBy(event.target.value)}>
            <option value="created-desc">Created (newest)</option>
            <option value="created-asc">Created (oldest)</option>
            <option value="due-asc">Due date (soonest)</option>
            <option value="due-desc">Due date (latest)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
