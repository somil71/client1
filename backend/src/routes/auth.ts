import { Router } from 'express';
import { login, signup, register, getCurrentUser } from '../controllers/AuthController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/signup', signup); // Public user registration

// Admin routes
router.post('/register', authenticate, authorize('admin'), register);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
