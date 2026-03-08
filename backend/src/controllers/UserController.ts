import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';
import { UpdateProfileSchema } from '../utils/validation.js';

export const getProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  res.json({
    success: true,
    data: req.user
  });
});

export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError(401, 'Authentication required');
  }

  const validatedData = UpdateProfileSchema.parse(req.body);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...(validatedData.name && { name: validatedData.name }),
    },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  });
});
