import express from 'express';
import { getMe , getLogs } from '../controllers/userController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me' , auth , getMe);
router.get('/logs' , auth , getLogs);

export default router;