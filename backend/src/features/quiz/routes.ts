import { Router } from 'express';
import { createQuiz, getAllQuizzes, getQuiz, submitQuiz, validateCreateQuiz } from './controller';
import { protect } from '../../middleware/auth';

const router = Router();

router.post('/', protect, validateCreateQuiz, createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuiz);
router.post('/:id/submit', submitQuiz);

export default router;

