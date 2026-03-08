import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/UserController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Protected routes
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

export default router;
