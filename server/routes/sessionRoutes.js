import express from 'express';
import {
  getSessions,
  createSession,
  deleteSession,
} from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getSessions)
  .post(createSession);

router.route('/:id')
  .delete(deleteSession);

export default router;
