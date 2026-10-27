import { SEED_VERSION, projects as seedProjects, tasks as seedTasks, users as seedUsers } from './seedData';

const DB_KEY = 'logixgrid_pm_db';
const LATENCY_MS = 220;

function delay(result) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(structuredClone(result)), LATENCY_MS);
  });
}

function fail(message) {
  return Promise.reject(new Error(message));
}

function readDb() {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const initial = {
      version: SEED_VERSION,
      users: seedUsers,
      projects: seedProjects,
      tasks: seedTasks,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(initial));
    return structuredClone(initial);
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed.version !== SEED_VERSION) {
      const migrated = {
        version: SEED_VERSION,
        users: seedUsers,
        projects: seedProjects,
        tasks: seedTasks,
      };
      localStorage.setItem(DB_KEY, JSON.stringify(migrated));
      return structuredClone(migrated);
    }
    return parsed;
  } catch {
    const fallback = {
      version: SEED_VERSION,
      users: seedUsers,
      projects: seedProjects,
      tasks: seedTasks,
    };
    localStorage.setItem(DB_KEY, JSON.stringify(fallback));
    return structuredClone(fallback);
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export const dataService = {
  async getUsers() {
    return delay(readDb().users.map(({ password, ...user }) => user));
  },

  async authenticate(email, password) {
    const user = readDb().users.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!user || user.password !== password) {
      return fail('Invalid email or password.');
    }
    return delay({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  },

  async getProjects() {
    return delay(readDb().projects);
  },

  async getProject(id) {
    const project = readDb().projects.find((item) => item.id === id);
    if (!project) return fail('Project not found.');
    return delay(project);
  },

  async createProject(payload) {
    const db = readDb();
    const project = { ...payload, id: createId('p') };
    db.projects = [project, ...db.projects];
    writeDb(db);
    return delay(project);
  },

  async updateProject(id, payload) {
    const db = readDb();
    const index = db.projects.findIndex((item) => item.id === id);
    if (index < 0) return fail('Project not found.');
    db.projects[index] = { ...db.projects[index], ...payload, id };
    writeDb(db);
    return delay(db.projects[index]);
  },

  async deleteProject(id) {
    const db = readDb();
    db.projects = db.projects.filter((item) => item.id !== id);
    db.tasks = db.tasks.filter((item) => item.projectId !== id);
    writeDb(db);
    return delay({ id });
  },

  async getTasks() {
    return delay(readDb().tasks);
  },

  async createTask(payload) {
    const db = readDb();
    const task = {
      ...payload,
      id: createId('t'),
      createdDate: payload.createdDate,
      completedDate: payload.status === 'Completed' ? payload.completedDate || payload.createdDate : null,
    };
    db.tasks = [task, ...db.tasks];
    writeDb(db);
    return delay(task);
  },

  async updateTask(id, payload) {
    const db = readDb();
    const index = db.tasks.findIndex((item) => item.id === id);
    if (index < 0) return fail('Task not found.');
    const previous = db.tasks[index];
    const next = { ...previous, ...payload, id };
    if (next.status === 'Completed' && previous.status !== 'Completed') {
      next.completedDate = payload.completedDate || new Date().toISOString().slice(0, 10);
    }
    if (next.status !== 'Completed') {
      next.completedDate = null;
    }
    db.tasks[index] = next;
    writeDb(db);
    return delay(next);
  },

  async deleteTask(id) {
    const db = readDb();
    db.tasks = db.tasks.filter((item) => item.id !== id);
    writeDb(db);
    return delay({ id });
  },
};
