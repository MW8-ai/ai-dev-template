/**
 * task-service.test.js — Unit tests for the task service layer
 *
 * These tests use Jest and mock the database (Knex) layer entirely.
 * No database connection is needed to run these tests.
 *
 * Run: npm test -- tests/task-service.test.js
 */

'use strict';

const taskService = require('../src/services/task-service');

// ── DB Mock Factory ───────────────────────────────────────────────────────────

/**
 * Creates a mock Knex query builder that returns a predictable result.
 * Supports the chained API: db('table').where(...).first()
 *
 * @param {object} overrides - Override specific methods
 */
function createMockDb(overrides = {}) {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    whereNull: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null),
    select: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    count: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([]),
    ...overrides,
  };

  const db = jest.fn().mockReturnValue(queryBuilder);
  db.fn = { now: jest.fn().mockReturnValue('2026-05-03T12:00:00.000Z') };
  db._queryBuilder = queryBuilder; // Expose for test assertions

  return db;
}

/** Creates a realistic task row as it would appear from the database */
function makeTaskRow(overrides = {}) {
  return {
    id: 'task-uuid-001',
    team_id: 'team-uuid-001',
    title: 'Implement CSV export',
    description: 'Export task list to CSV format',
    status: 'todo',
    assignee_user_id: null,
    due_date: '2026-06-01',
    created_by_user_id: 'user-uuid-001',
    created_at: '2026-05-01T10:00:00.000Z',
    updated_at: '2026-05-01T10:00:00.000Z',
    deleted_at: null,
    ...overrides,
  };
}

// ── getTeamTasks ──────────────────────────────────────────────────────────────

describe('getTeamTasks', () => {
  it('returns paginated tasks for a team', async () => {
    const taskRows = [makeTaskRow(), makeTaskRow({ id: 'task-uuid-002', title: 'Fix login bug' })];
    const db = createMockDb();
    // Count query returns 2, data query returns both rows
    db._queryBuilder.first.mockResolvedValueOnce({ count: '2' });
    db._queryBuilder.returning.mockResolvedValue(taskRows); // Not used — offset returns tasks directly
    // Wire offset().returning() chain for data query
    db._queryBuilder.offset.mockImplementation(() => ({
      ...db._queryBuilder,
      then: (resolve) => resolve(taskRows), // Make awaitable
    }));
    // Rebuild with proper promise resolution for the data query
    db._queryBuilder.offset = jest.fn().mockResolvedValue(taskRows);

    const result = await taskService.getTeamTasks(db, { teamId: 'team-uuid-001' });

    expect(result.tasks).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(25);
  });

  it('returns empty list when team has no tasks', async () => {
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce({ count: '0' });
    db._queryBuilder.offset = jest.fn().mockResolvedValue([]);

    const result = await taskService.getTeamTasks(db, { teamId: 'team-uuid-empty' });

    expect(result.tasks).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('throws INVALID_ARGUMENT if teamId is not provided', async () => {
    const db = createMockDb();

    await expect(taskService.getTeamTasks(db, {})).rejects.toMatchObject({
      code: 'INVALID_ARGUMENT',
    });
  });

  it('formats task rows to remove deleted_at from the response', async () => {
    const taskRow = makeTaskRow({ deleted_at: null });
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce({ count: '1' });
    db._queryBuilder.offset = jest.fn().mockResolvedValue([taskRow]);

    const result = await taskService.getTeamTasks(db, { teamId: 'team-uuid-001' });

    expect(result.tasks[0]).not.toHaveProperty('deleted_at');
    expect(result.tasks[0]).toHaveProperty('id', taskRow.id);
    expect(result.tasks[0]).toHaveProperty('title', taskRow.title);
  });
});

// ── createTask ────────────────────────────────────────────────────────────────

describe('createTask', () => {
  it('creates a task with required fields and defaults status to todo', async () => {
    const newTaskRow = makeTaskRow({ status: 'todo' });
    const db = createMockDb();
    db._queryBuilder.returning.mockResolvedValue([newTaskRow]);

    const result = await taskService.createTask(db, {
      teamId: 'team-uuid-001',
      createdByUserId: 'user-uuid-001',
      title: 'Implement CSV export',
    });

    expect(result.status).toBe('todo');
    expect(result.title).toBe('Implement CSV export');
    expect(result.id).toBe(newTaskRow.id);
  });

  it('creates a task with an optional assignee who is a team member', async () => {
    const newTaskRow = makeTaskRow({ assignee_user_id: 'user-uuid-002' });
    const db = createMockDb();
    // isTeamMember check: first() call for team_members returns a member row
    db._queryBuilder.first.mockResolvedValueOnce({ user_id: 'user-uuid-002', team_id: 'team-uuid-001' });
    db._queryBuilder.returning.mockResolvedValue([newTaskRow]);

    const result = await taskService.createTask(db, {
      teamId: 'team-uuid-001',
      createdByUserId: 'user-uuid-001',
      title: 'Task with assignee',
      assigneeUserId: 'user-uuid-002',
    });

    expect(result.assignee_user_id).toBe('user-uuid-002');
  });

  it('throws ASSIGNEE_NOT_IN_TEAM if assignee is not a member of the team', async () => {
    const db = createMockDb();
    // isTeamMember returns null (not a member)
    db._queryBuilder.first.mockResolvedValueOnce(null);

    await expect(
      taskService.createTask(db, {
        teamId: 'team-uuid-001',
        createdByUserId: 'user-uuid-001',
        title: 'Task with bad assignee',
        assigneeUserId: 'user-uuid-outsider',
      })
    ).rejects.toMatchObject({ code: 'ASSIGNEE_NOT_IN_TEAM' });
  });

  it('throws INVALID_ARGUMENT if title is missing', async () => {
    const db = createMockDb();

    await expect(
      taskService.createTask(db, {
        teamId: 'team-uuid-001',
        createdByUserId: 'user-uuid-001',
        title: '',
      })
    ).rejects.toMatchObject({ code: 'INVALID_ARGUMENT' });
  });

  it('throws INVALID_ARGUMENT if teamId is missing', async () => {
    const db = createMockDb();

    await expect(
      taskService.createTask(db, {
        createdByUserId: 'user-uuid-001',
        title: 'No team provided',
      })
    ).rejects.toMatchObject({ code: 'INVALID_ARGUMENT' });
  });

  it('trims whitespace from title before saving', async () => {
    const db = createMockDb();
    db._queryBuilder.returning.mockResolvedValue([makeTaskRow({ title: 'Trimmed title' })]);

    await taskService.createTask(db, {
      teamId: 'team-uuid-001',
      createdByUserId: 'user-uuid-001',
      title: '  Trimmed title  ',
    });

    // Verify the insert call received the trimmed title
    const insertArgs = db._queryBuilder.insert.mock.calls[0][0];
    expect(insertArgs.title).toBe('Trimmed title');
  });
});

// ── updateTask ────────────────────────────────────────────────────────────────

describe('updateTask', () => {
  it('updates only the fields provided (partial update)', async () => {
    const existingTask = makeTaskRow({ status: 'todo' });
    const updatedTask = makeTaskRow({ status: 'in_progress' });
    const db = createMockDb();
    // findActiveTask returns existing task
    db._queryBuilder.first.mockResolvedValueOnce(existingTask);
    db._queryBuilder.returning.mockResolvedValue([updatedTask]);

    const result = await taskService.updateTask(db, {
      taskId: 'task-uuid-001',
      teamId: 'team-uuid-001',
      updates: { status: 'in_progress' },
    });

    expect(result.status).toBe('in_progress');
    const updateArgs = db._queryBuilder.update.mock.calls[0][0];
    expect(updateArgs).toHaveProperty('status', 'in_progress');
    expect(updateArgs).not.toHaveProperty('title'); // Not provided, should not be in patch
  });

  it('throws TASK_NOT_FOUND if task does not exist', async () => {
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(null); // Task not found

    await expect(
      taskService.updateTask(db, {
        taskId: 'nonexistent-task',
        teamId: 'team-uuid-001',
        updates: { status: 'done' },
      })
    ).rejects.toMatchObject({ code: 'TASK_NOT_FOUND' });
  });

  it('throws TASK_NOT_FOUND if task belongs to a different team', async () => {
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(null); // where({ team_id }) filters it out

    await expect(
      taskService.updateTask(db, {
        taskId: 'task-uuid-001',
        teamId: 'wrong-team-uuid',
        updates: { status: 'done' },
      })
    ).rejects.toMatchObject({ code: 'TASK_NOT_FOUND' });
  });
});

// ── deleteTask ────────────────────────────────────────────────────────────────

describe('deleteTask', () => {
  it('soft-deletes a task by setting deleted_at (does not hard delete)', async () => {
    const existingTask = makeTaskRow({ created_by_user_id: 'user-uuid-001' });
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(existingTask);
    db._queryBuilder.update.mockResolvedValue(1);

    await taskService.deleteTask(db, {
      taskId: 'task-uuid-001',
      teamId: 'team-uuid-001',
      requestingUserId: 'user-uuid-001',
      requestingUserRole: 'member',
    });

    // Verify soft delete: update was called with deleted_at, not a hard delete
    expect(db._queryBuilder.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String) })
    );
  });

  it('allows admins to delete tasks created by other users', async () => {
    const existingTask = makeTaskRow({ created_by_user_id: 'user-uuid-other' });
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(existingTask);
    db._queryBuilder.update.mockResolvedValue(1);

    // Should not throw — admin can delete any task
    await expect(
      taskService.deleteTask(db, {
        taskId: 'task-uuid-001',
        teamId: 'team-uuid-001',
        requestingUserId: 'user-uuid-admin',
        requestingUserRole: 'admin',
      })
    ).resolves.toBeUndefined();
  });

  it('allows owners to delete tasks created by other users', async () => {
    const existingTask = makeTaskRow({ created_by_user_id: 'user-uuid-other' });
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(existingTask);
    db._queryBuilder.update.mockResolvedValue(1);

    await expect(
      taskService.deleteTask(db, {
        taskId: 'task-uuid-001',
        teamId: 'team-uuid-001',
        requestingUserId: 'user-uuid-owner',
        requestingUserRole: 'owner',
      })
    ).resolves.toBeUndefined();
  });

  it('throws FORBIDDEN when a member tries to delete a task they did not create', async () => {
    const existingTask = makeTaskRow({ created_by_user_id: 'user-uuid-creator' });
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(existingTask);

    await expect(
      taskService.deleteTask(db, {
        taskId: 'task-uuid-001',
        teamId: 'team-uuid-001',
        requestingUserId: 'user-uuid-other-member',
        requestingUserRole: 'member',
      })
    ).rejects.toMatchObject({ code: 'FORBIDDEN' });
  });

  it('throws TASK_NOT_FOUND when task does not exist or is already deleted', async () => {
    const db = createMockDb();
    db._queryBuilder.first.mockResolvedValueOnce(null);

    await expect(
      taskService.deleteTask(db, {
        taskId: 'nonexistent-task-uuid',
        teamId: 'team-uuid-001',
        requestingUserId: 'user-uuid-001',
        requestingUserRole: 'member',
      })
    ).rejects.toMatchObject({ code: 'TASK_NOT_FOUND' });
  });

  it('throws INVALID_ARGUMENT if taskId is not provided', async () => {
    const db = createMockDb();

    await expect(
      taskService.deleteTask(db, {
        teamId: 'team-uuid-001',
        requestingUserId: 'user-uuid-001',
        requestingUserRole: 'member',
      })
    ).rejects.toMatchObject({ code: 'INVALID_ARGUMENT' });
  });
});
