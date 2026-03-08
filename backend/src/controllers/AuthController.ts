import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService.js';
import { LoginSchema, RegisterSchema } from '../utils/validation.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = LoginSchema.parse(req.body);
  const { user, token } = await AuthService.login(validatedData);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Only admins can register new users
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError(403, 'Only admins can create new users');
  }

  const validatedData = RegisterSchema.parse(req.body);
  const { user, token } = await AuthService.register(validatedData);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user,
      token
    }
  });
});

// Public user signup (separate from admin registration)
export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = RegisterSchema.parse(req.body);
  const { user, token } = await AuthService.register({
    ...validatedData,
    role: 'user' // Users register as regular users
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: {
      user,
      token
    }
  });
});

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }

    res.json({
      success: true,
      data: req.user
    });
  }
);
