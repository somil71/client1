import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import EmailService from '../services/EmailService.js';
import { AppError, asyncHandler } from '../middleware/errorHandler.js';

const ContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9\-\+\(\)\s]{10,}$/, 'Invalid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000)
});

export const submitContact = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = ContactSchema.parse(req.body);

  try {
    // Send email to admin
    await EmailService.sendContactNotification(
      process.env.ADMIN_EMAIL || 'admin@moksh.org',
      validatedData.name,
      validatedData.email,
      validatedData.subject,
      validatedData.message
    );

    // Send confirmation email to user
    await EmailService.sendContactConfirmation(
      validatedData.email,
      validatedData.name,
      validatedData.subject
    );
  } catch (error) {
    console.error('Failed to send contact emails:', error);
    // Don't fail the request if email fails
  }

  res.status(201).json({
    success: true,
    message: 'Thank you for contacting us. We will get back to you soon.'
  });
});
