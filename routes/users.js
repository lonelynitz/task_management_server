import express from 'express';
import prisma from '../prisma.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users - List all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/users/:id - Update user (admin only)
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (role && !['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be admin or user.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(email !== undefined && { email }),
        ...(role !== undefined && { role }),
      },
      select: { id: true, username: true, email: true, role: true, createdAt: true },
    });

    res.json({ message: 'User updated successfully.', user: updatedUser });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users.' });
    }

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
