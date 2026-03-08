import { Router } from 'express';
import multer from 'multer';
import {
  createRequest,
  getRequest,
  listRequests,
  updateRequestStatus,
  assignVolunteer,
  getStatistics,
  getMyRequests
} from '../controllers/RequestController.js';
import { authenticate, authorize, optionalAuthenticate } from '../middleware/auth.js';

const upload = multer({
  dest: process.env.UPLOAD_DIR || './uploads',
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880')
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'pdf,jpg,jpeg,png,doc,docx').split(',');
    const ext = file.mimetype.split('/')[1];
    if (allowedTypes.includes(ext) || allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

const router = Router();

// Public routes
router.post('/', optionalAuthenticate, upload.array('documents', 5), createRequest);

// Admin-only route (more specific, must come before /:id)
router.get('/dashboard/stats', authenticate, authorize('admin', 'staff'), getStatistics);

// User-specific route
router.get('/me', authenticate, getMyRequests);

// Public route for getting specific request
router.get('/:id', getRequest);

// Admin routes
router.get('/', authenticate, authorize('admin', 'staff'), listRequests);
router.patch('/:id/status', authenticate, authorize('admin', 'staff'), updateRequestStatus);
router.post('/:id/assign', authenticate, authorize('admin'), assignVolunteer);

export default router;
