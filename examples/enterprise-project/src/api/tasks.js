/**
 * tasks.js — Route handlers for the /tasks API
 *
 * All routes require authentication (enforced by the `authenticate` middleware).
 * Authorization (can this user access this team's tasks?) is enforced in the service layer.
 *
 * Routes:
 *   GET    /tasks            List tasks for the authenticated user's team
 *   POST   /tasks            Create a new task
 *   PATCH  /tasks/:id        Update a task (title, description, status, assignee, due_date)
 *   DELETE /tasks/:id        Soft-delete a task
 */

const express = require('express');
const { z } = require('zod');
const taskService = require('../services/task-service');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// ── Input schemas (Zod) ──────────────────────────────────────────────────────

const CreateTaskSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title cannot be empty')
    .max(255, 'title must be 255 characters or fewer'),
  description: z.string().max(10000).optional(),
  assignee_user_id: z.string().uuid('assignee_user_id must be a valid UUID').optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'due_date must be in YYYY-MM-DD format')
    .optional(),
});

const UpdateTaskSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().max(10000).nullable().optional(),
    status: z.enum(['todo', 'in_progress', 'done']).optional(),
    assignee_user_id: z.string().uuid().nullable().optional(),
    due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'at least one field must be provided to update',
  });

const ListTasksQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(25),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
  assignee_user_id: z.string().uuid().optional(),
});

// ── GET /tasks ────────────────────────────────────────────────────────────────

/**
 * List tasks for the authenticated user's team.
 *
 * Query params:
 *   page           - Page number (default: 1)
 *   per_page       - Items per page, max 100 (default: 25)
 *   status         - Filter by status: todo | in_progress | done
 *   assignee_user_id - Filter by assignee UUID
 *
 * Response: 200 { data: Task[], meta: { total, page, per_page, total_pages } }
 */
router.get('/', validate(ListTasksQuerySchema, 'query'), async (req, res, next) => {
  try {
    const { page, per_page, status, assignee_user_id } = req.validatedQuery;

    const result = await taskService.getTeamTasks(req.db, {
      teamId: req.user.teamId,
      page,
      perPage: per_page,
      filters: { status, assigneeUserId: assignee_user_id },
    });

    res.json({
      data: result.tasks,
      meta: {
        total: result.total,
        page: result.page,
        per_page: result.perPage,
        total_pages: Math.ceil(result.total / result.perPage),
      },
    });
  } catch (err) {
    next(err);
  }
});

// ── POST /tasks ───────────────────────────────────────────────────────────────

/**
 * Create a new task in the authenticated user's team.
 *
 * Body: { title, description?, assignee_user_id?, due_date? }
 *
 * Response: 201 Task
 */
router.post('/', validate(CreateTaskSchema, 'body'), async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.db, {
      teamId: req.user.teamId,
      createdByUserId: req.user.id,
      title: req.validatedBody.title,
      description: req.validatedBody.description,
      assigneeUserId: req.validatedBody.assignee_user_id,
      dueDate: req.validatedBody.due_date,
    });

    res.status(201).json(task);
  } catch (err) {
    // Service throws a named error if assignee is not a team member
    if (err.code === 'ASSIGNEE_NOT_IN_TEAM') {
      return res.status(422).json({
        error: {
          code: 'ASSIGNEE_NOT_IN_TEAM',
          message: 'The specified assignee is not a member of this team',
        },
      });
    }
    next(err);
  }
});

// ── PATCH /tasks/:id ──────────────────────────────────────────────────────────

/**
 * Update fields on an existing task.
 * The authenticated user must be a member of the task's team.
 *
 * Body: { title?, description?, status?, assignee_user_id?, due_date? }
 *       At least one field must be provided.
 *
 * Response: 200 Task (updated)
 */
router.patch('/:id', validate(UpdateTaskSchema, 'body'), async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.db, {
      taskId: req.params.id,
      teamId: req.user.teamId,
      updates: {
        title: req.validatedBody.title,
        description: req.validatedBody.description,
        status: req.validatedBody.status,
        assigneeUserId: req.validatedBody.assignee_user_id,
        dueDate: req.validatedBody.due_date,
      },
    });

    res.json(task);
  } catch (err) {
    if (err.code === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found or has been deleted' },
      });
    }
    if (err.code === 'ASSIGNEE_NOT_IN_TEAM') {
      return res.status(422).json({
        error: {
          code: 'ASSIGNEE_NOT_IN_TEAM',
          message: 'The specified assignee is not a member of this team',
        },
      });
    }
    next(err);
  }
});

// ── DELETE /tasks/:id ─────────────────────────────────────────────────────────

/**
 * Soft-delete a task. The task is marked as deleted but not removed from the database.
 * Only team members can delete tasks; only admins/owners can delete tasks assigned to others.
 *
 * Response: 204 No Content
 */
router.delete('/:id', async (req, res, next) => {
  try {
    await taskService.deleteTask(req.db, {
      taskId: req.params.id,
      teamId: req.user.teamId,
      requestingUserId: req.user.id,
      requestingUserRole: req.user.teamRole,
    });

    res.status(204).send();
  } catch (err) {
    if (err.code === 'TASK_NOT_FOUND') {
      return res.status(404).json({
        error: { code: 'TASK_NOT_FOUND', message: 'Task not found or has been deleted' },
      });
    }
    if (err.code === 'FORBIDDEN') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this task',
        },
      });
    }
    next(err);
  }
});

module.exports = router;
