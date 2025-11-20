import express from 'express';
import { signUp , login, logout } from '../controllers/authController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup' , signUp);
router.post('/login' , login);
router.post('/logout' , auth , logout);

export default router;