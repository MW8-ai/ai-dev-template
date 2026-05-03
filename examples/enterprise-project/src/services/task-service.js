/**
 * task-service.js — Business logic for task operations
 *
 * This service layer sits between the API routes and the database.
 * It enforces business rules, validates domain constraints, and
 * coordinates database operations.
 *
 * The `db` parameter is a Knex.js instance, injected by the caller.
 * This pattern makes the service easy to unit test — pass in a mock db.
 *
 * All functions throw errors with a `.code` property for known failure modes.
 * Unknown errors are allowed to propagate as-is for the global error handler.
 */

'use strict';

const VALID_STATUSES = new Set(['todo', 'in_progress', 'done']);

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Fetches a task by ID that belongs to a given team, excluding soft-deleted tasks.
 * Returns null if not found or deleted.
 *
 * @param {import('knex').Knex} db
 * @param {string} taskId
 * @param {string} teamId
 * @returns {Promise<object|null>}
 */
async function findActiveTask(db, taskId, teamId) {
  return db('tasks')
    .where({ id: taskId, team_id: teamId })
    .whereNull('deleted_at')
    .first();
}

/**
 * Checks whether a user is a member of a given team.
 *
 * @param {import('knex').Knex} db
 * @param {string} userId
 * @param {string} teamId
 * @returns {Promise<boolean>}
 */
async function isTeamMember(db, userId, teamId) {
  const member = await db('team_members')
    .where({ user_id: userId, team_id: teamId })
    .first();
  return Boolean(member);
}

/**
 * Formats a raw database task row into the API response shape.
 *
 * @param {object} row - Raw database row
 * @returns {object} - API-shaped task object
 */
function formatTask(row) {
  return {
    id: row.id,
    team_id: row.team_id,
    title: row.title,
    description: row.description ?? null,
    status: row.status,
    assignee_user_id: row.assignee_user_id ?? null,
    due_date: row.due_date ?? null,
    created_by_user_id: row.created_by_user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// ── Public service functions ──────────────────────────────────────────────────

/**
 * Returns a paginated list of tasks for a team.
 * Supports optional filtering by status and assignee.
 *
 * @param {import('knex').Knex} db
 * @param {object} params
 * @param {string} params.teamId
 * @param {number} [params.page=1]
 * @param {number} [params.perPage=25]
 * @param {object} [params.filters]
 * @param {string} [params.filters.status]
 * @param {string} [params.filters.assigneeUserId]
 * @returns {Promise<{ tasks: object[], total: number, page: number, perPage: number }>}
 */
async function getTeamTasks(db, { teamId, page = 1, perPage = 25, filters = {} }) {
  if (!teamId) {
    throw Object.assign(new Error('teamId is required'), { code: 'INVALID_ARGUMENT' });
  }

  const offset = (page - 1) * perPage;

  // Build base query — reused for count and data fetch
  function baseQuery() {
    let q = db('tasks').where({ team_id: teamId }).whereNull('deleted_at');

    if (filters.status) {
      q = q.where({ status: filters.status });
    }
    if (filters.assigneeUserId) {
      q = q.where({ assignee_user_id: filters.assigneeUserId });
    }

    return q;
  }

  // Run count and data queries in parallel
  const [countResult, rows] = await Promise.all([
    baseQuery().count('id as count').first(),
    baseQuery()
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(perPage)
      .offset(offset),
  ]);

  return {
    tasks: rows.map(formatTask),
    total: Number(countResult.count),
    page,
    perPage,
  };
}

/**
 * Creates a new task in the given team.
 * Validates that the assignee (if provided) is a member of the team.
 *
 * @param {import('knex').Knex} db
 * @param {object} params
 * @param {string} params.teamId
 * @param {string} params.createdByUserId
 * @param {string} params.title
 * @param {string} [params.description]
 * @param {string} [params.assigneeUserId]
 * @param {string} [params.dueDate] - ISO date string (YYYY-MM-DD)
 * @returns {Promise<object>} The created task
 * @throws {{ code: 'ASSIGNEE_NOT_IN_TEAM' }} if assigneeUserId is not a team member
 */
async function createTask(db, { teamId, createdByUserId, title, description, assigneeUserId, dueDate }) {
  if (!teamId) throw Object.assign(new Error('teamId is required'), { code: 'INVALID_ARGUMENT' });
  if (!createdByUserId) throw Object.assign(new Error('createdByUserId is required'), { code: 'INVALID_ARGUMENT' });
  if (!title || title.trim().length === 0) throw Object.assign(new Error('title is required'), { code: 'INVALID_ARGUMENT' });

  // Validate assignee is a team member before inserting
  if (assigneeUserId) {
    const memberExists = await isTeamMember(db, assigneeUserId, teamId);
    if (!memberExists) {
      throw Object.assign(
        new Error(`User ${assigneeUserId} is not a member of team ${teamId}`),
        { code: 'ASSIGNEE_NOT_IN_TEAM' }
      );
    }
  }

  const [row] = await db('tasks')
    .insert({
      team_id: teamId,
      created_by_user_id: createdByUserId,
      title: title.trim(),
      description: description ?? null,
      status: 'todo',
      assignee_user_id: assigneeUserId ?? null,
      due_date: dueDate ?? null,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');

  return formatTask(row);
}

/**
 * Updates one or more fields on an existing task.
 * Only updates fields that are explicitly provided (undefined fields are skipped).
 * Validates that the task belongs to the given team and has not been deleted.
 *
 * @param {import('knex').Knex} db
 * @param {object} params
 * @param {string} params.taskId
 * @param {string} params.teamId
 * @param {object} params.updates
 * @param {string} [params.updates.title]
 * @param {string|null} [params.updates.description]
 * @param {string} [params.updates.status]
 * @param {string|null} [params.updates.assigneeUserId]
 * @param {string|null} [params.updates.dueDate]
 * @returns {Promise<object>} The updated task
 * @throws {{ code: 'TASK_NOT_FOUND' }} if task does not exist or is deleted
 * @throws {{ code: 'ASSIGNEE_NOT_IN_TEAM' }} if new assignee is not a team member
 */
async function updateTask(db, { taskId, teamId, updates }) {
  if (!taskId) throw Object.assign(new Error('taskId is required'), { code: 'INVALID_ARGUMENT' });
  if (!teamId) throw Object.assign(new Error('teamId is required'), { code: 'INVALID_ARGUMENT' });

  const existingTask = await findActiveTask(db, taskId, teamId);
  if (!existingTask) {
    throw Object.assign(new Error(`Task ${taskId} not found in team ${teamId}`), { code: 'TASK_NOT_FOUND' });
  }

  // Validate status if provided
  if (updates.status !== undefined && !VALID_STATUSES.has(updates.status)) {
    throw Object.assign(
      new Error(`Invalid status "${updates.status}". Must be one of: ${[...VALID_STATUSES].join(', ')}`),
      { code: 'INVALID_ARGUMENT' }
    );
  }

  // Validate new assignee is a team member
  if (updates.assigneeUserId !== undefined && updates.assigneeUserId !== null) {
    const memberExists = await isTeamMember(db, updates.assigneeUserId, teamId);
    if (!memberExists) {
      throw Object.assign(
        new Error(`User ${updates.assigneeUserId} is not a member of team ${teamId}`),
        { code: 'ASSIGNEE_NOT_IN_TEAM' }
      );
    }
  }

  // Build the update payload — only include fields that were explicitly provided
  const patch = { updated_at: db.fn.now() };
  if (updates.title !== undefined) patch.title = updates.title.trim();
  if (updates.description !== undefined) patch.description = updates.description;
  if (updates.status !== undefined) patch.status = updates.status;
  if (updates.assigneeUserId !== undefined) patch.assignee_user_id = updates.assigneeUserId;
  if (updates.dueDate !== undefined) patch.due_date = updates.dueDate;

  const [updated] = await db('tasks')
    .where({ id: taskId, team_id: teamId })
    .update(patch)
    .returning('*');

  return formatTask(updated);
}

/**
 * Soft-deletes a task by setting deleted_at to the current timestamp.
 * Members can only delete tasks they created. Admins and owners can delete any task.
 *
 * @param {import('knex').Knex} db
 * @param {object} params
 * @param {string} params.taskId
 * @param {string} params.teamId
 * @param {string} params.requestingUserId
 * @param {string} params.requestingUserRole - 'owner' | 'admin' | 'member'
 * @returns {Promise<void>}
 * @throws {{ code: 'TASK_NOT_FOUND' }} if task does not exist or is already deleted
 * @throws {{ code: 'FORBIDDEN' }} if member attempts to delete another user's task
 */
async function deleteTask(db, { taskId, teamId, requestingUserId, requestingUserRole }) {
  if (!taskId) throw Object.assign(new Error('taskId is required'), { code: 'INVALID_ARGUMENT' });
  if (!teamId) throw Object.assign(new Error('teamId is required'), { code: 'INVALID_ARGUMENT' });
  if (!requestingUserId) throw Object.assign(new Error('requestingUserId is required'), { code: 'INVALID_ARGUMENT' });

  const task = await findActiveTask(db, taskId, teamId);
  if (!task) {
    throw Object.assign(new Error(`Task ${taskId} not found`), { code: 'TASK_NOT_FOUND' });
  }

  // Members can only delete tasks they created; owners and admins can delete any task
  const isPrivileged = requestingUserRole === 'owner' || requestingUserRole === 'admin';
  if (!isPrivileged && task.created_by_user_id !== requestingUserId) {
    throw Object.assign(
      new Error('Members can only delete tasks they created'),
      { code: 'FORBIDDEN' }
    );
  }

  await db('tasks')
    .where({ id: taskId, team_id: teamId })
    .update({ deleted_at: db.fn.now() });
}

module.exports = {
  getTeamTasks,
  createTask,
  updateTask,
  deleteTask,
};
