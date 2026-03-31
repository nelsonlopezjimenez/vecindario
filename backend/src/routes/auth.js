import { Router } from 'express';
import {
  register, login, getMe,
  getLoginImages, getRegistrationImages,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/images/new',     getRegistrationImages);
router.get('/images/:email',  getLoginImages);
router.post('/register',      register);
router.post('/login',         login);
router.get('/me',             protect, getMe);

export default router;