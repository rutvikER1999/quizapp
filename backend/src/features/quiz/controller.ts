import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../../types';
import Quiz from './model';

// Validation middleware
export const validateCreateQuiz = [
  body('title').trim().notEmpty().withMessage('Quiz title is required'),
  body('questions').isArray({ min: 1 }).withMessage('Quiz must have at least one question'),
  body('questions.*.type').isIn(['MCQ', 'Boolean', 'text']).withMessage('Invalid question type'),
  body('questions.*.question').trim().notEmpty().withMessage('Question text is required'),
  body('questions.*.answer').notEmpty().withMessage('Answer is required'),
  // Options are required only for MCQ and Boolean types
  body('questions.*.options')
    .optional()
    .custom((value, { req, path }) => {
      // Extract question index from path (e.g., "questions[2].options" -> 2)
      const match = path.match(/questions\[(\d+)\]/);
      if (!match) return true; // If we can't parse, skip validation
      
      const questionIndex = parseInt(match[1]);
      const questionType = req.body.questions?.[questionIndex]?.type;
      
      // Only validate options for MCQ and Boolean questions
      if (questionType === 'MCQ' || questionType === 'Boolean') {
        if (value === undefined || value === null || value === '' || 
            (Array.isArray(value) && value.length === 0)) {
          throw new Error('Options are required for MCQ and Boolean questions');
        }
      }
      // Text questions don't need options - validation passes
      return true;
    }),
];

// @desc    Create a new quiz
// @route   POST /api/quiz
// @access  Private
export const createQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { title, questions } = req.body;

    if (!req.user?.id) {
      res.status(401).json({
        status: 'error',
        message: 'User not authenticated',
      });
      return;
    }

    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          questions: quiz.questions,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating quiz',
    });
  }
};

// @desc    Get all quizzes
// @route   GET /api/quiz
// @access  Public
export const getAllQuizzes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quizzes = await Quiz.find()
      .select('-questions.answer')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: quizzes.length,
      data: {
        quizzes: quizzes.map(quiz => ({
          id: quiz._id,
          title: quiz.title,
          questionsCount: quiz.questions.length,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt,
        })),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching quizzes',
    });
  }
};

// @desc    Get a single quiz (without answers for taking quiz)
// @route   GET /api/quiz/:id
// @access  Public
export const getQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .select('-questions.answer')
      .populate('createdBy', 'name email');

    if (!quiz) {
      res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        quiz: {
          id: quiz._id,
          title: quiz.title,
          questions: quiz.questions,
          createdBy: quiz.createdBy,
          createdAt: quiz.createdAt,
        },
      },
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid quiz ID',
      });
      return;
    }
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching quiz',
    });
  }
};

// @desc    Submit quiz answers and get results
// @route   POST /api/quiz/:id/submit
// @access  Public
export const submitQuiz = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({
        status: 'error',
        message: 'Answers array is required',
      });
      return;
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      res.status(404).json({
        status: 'error',
        message: 'Quiz not found',
      });
      return;
    }

    if (answers.length !== quiz.questions.length) {
      res.status(400).json({
        status: 'error',
        message: 'Number of answers does not match number of questions',
      });
      return;
    }

    // Calculate results
    let correctCount = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;

      if (question.type === 'MCQ') {
        isCorrect = String(userAnswer) === String(question.answer);
      } else if (question.type === 'Boolean') {
        isCorrect = Boolean(userAnswer) === Boolean(question.answer);
      } else if (question.type === 'text') {
        isCorrect = String(userAnswer).toLowerCase().trim() === String(question.answer).toLowerCase().trim();
      }

      if (isCorrect) {
        correctCount++;
      }

      return {
        question: question.question,
        type: question.type,
        options: question.options,
        correctAnswer: question.answer,
        userAnswer: userAnswer,
        isCorrect: isCorrect,
      };
    });

    const score = (correctCount / quiz.questions.length) * 100;

    res.status(200).json({
      status: 'success',
      data: {
        quizId: quiz._id,
        quizTitle: quiz.title,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        wrongAnswers: quiz.questions.length - correctCount,
        score: Math.round(score * 100) / 100,
        results: results,
      },
    });
  } catch (error: any) {
    if (error.name === 'CastError') {
      res.status(400).json({
        status: 'error',
        message: 'Invalid quiz ID',
      });
      return;
    }
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error submitting quiz',
    });
  }
};

