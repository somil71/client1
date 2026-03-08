import { Router } from 'express';
import { submitContact } from '../controllers/ContactController.js';

const router = Router();

// Public route for contact form submission
router.post('/', submitContact);

export default router;
