import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtUserPayload } from '../types';
import { config } from '../config/env';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized, no token provided',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtUserPayload;
      
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
      
      next();
    } catch (error) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized, token failed',
      });
      return;
    }
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Not authorized',
    });
    return;
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Not authorized',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'User role is not authorized to access this route',
      });
      return;
    }

    next();
  };
};

