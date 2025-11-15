import { Router } from 'express';
import { login, getMe, validateLogin } from './controller';
import { protect } from '../../middleware/auth';
import { authLimiter } from '../../middleware/security';

const router = Router();

router.post('/login', authLimiter, validateLogin, login);
router.get('/me', protect, getMe);

export default router;

