import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import { AuthRequest } from '../../types';
import User from './model';
import { config } from '../../config/env';

// Generate JWT Token
const generateToken = (id: string, email: string, role: string): string => {
  const secret = config.jwtSecret;
  if (!secret || secret === 'your-secret-key-change-in-production') {
    throw new Error('JWT_SECRET must be set in environment variables');
  }
  return jwt.sign({ id, email, role }, secret, {
    expiresIn: config.jwtExpire,
  } as jwt.SignOptions);
};

// Validation middleware
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (
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

    const { email, password } = req.body;

    // Check if user exists and get password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const userId = (user._id as mongoose.Types.ObjectId).toString();
    const token = generateToken(userId, user.email, user.role);

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error logging in',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: (user._id as mongoose.Types.ObjectId).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching user',
    });
  }
};

