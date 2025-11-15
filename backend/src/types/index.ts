import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

