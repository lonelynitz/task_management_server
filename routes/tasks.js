import express from 'express';
import prisma from '../prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

const taskInclude = {
  assignedUser: { select: { id: true, username: true } },
  creator: { select: { id: true, username: true } },
};

function formatTask(task) {
  return {
    ...task,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    assigned_to: task.assignedTo,
    created_by: task.createdBy,
    assigned_to_name: task.assignedUser?.username || null,
    created_by_name: task.creator?.username || null,
    assignedUser: undefined,
    creator: undefined,
  };
}

// GET /api/tasks - Get tasks (admin sees all, user sees only assigned)
router.get('/', authenticate, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      tasks = await prisma.task.findMany({
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
      });
    } else {
      tasks = await prisma.task.findMany({
        where: { assignedTo: req.user.id },
        include: taskInclude,
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json({ tasks: tasks.map(formatTask) });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
      include: taskInclude,
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. You can only view your own tasks.' });
    }

    res.json({ task: formatTask(task) });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/tasks - Create a task (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, assigned_to, priority, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Task title is required.' });
    }

    const validStatus = status || 'Pending';
    if (!['Pending', 'In Progress', 'Completed'].includes(validStatus)) {
      return res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed.' });
    }

    const validPriority = priority || 'Medium';
    if (!['Low', 'Medium', 'High'].includes(validPriority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High.' });
    }

    if (assigned_to) {
      const assignee = await prisma.user.findUnique({ where: { id: assigned_to } });
      if (!assignee) {
        return res.status(400).json({ error: 'Assigned user not found.' });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        assignedTo: assigned_to || null,
        createdBy: req.user.id,
        priority: validPriority,
        status: validStatus,
      },
      include: taskInclude,
    });

    res.status(201).json({ message: 'Task created successfully.', task: formatTask(task) });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user.role === 'admin') {
      const { title, description, assigned_to, priority, status } = req.body;

      if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed.' });
      }

      if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
        return res.status(400).json({ error: 'Priority must be Low, Medium, or High.' });
      }

      if (assigned_to) {
        const assignee = await prisma.user.findUnique({ where: { id: assigned_to } });
        if (!assignee) {
          return res.status(400).json({ error: 'Assigned user not found.' });
        }
      }

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description: description || null }),
          ...(assigned_to !== undefined && { assignedTo: assigned_to || null }),
          ...(priority !== undefined && { priority }),
          ...(status !== undefined && { status }),
          updatedAt: new Date(),
        },
        include: taskInclude,
      });

      res.json({ message: 'Task updated successfully.', task: formatTask(updatedTask) });
    } else {
      if (task.assignedTo !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only update your own tasks.' });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
      }

      if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({ error: 'Status must be Pending, In Progress, or Completed.' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(req.params.id) },
        data: { status, updatedAt: new Date() },
        include: taskInclude,
      });

      res.json({ message: 'Task updated successfully.', task: formatTask(updatedTask) });
    }
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/tasks/:id - Delete a task (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
