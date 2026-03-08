import { z } from 'zod';

export const CreateRequestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z
    .string()
    .regex(/^[0-9\-\+\(\)\s]{10,}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address'),
  city: z.string().min(2, 'City is required').max(100),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  typeOfHelp: z.enum(['antim-kit', 'pandit', 'cremation', 'community-support', 'other']),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  urgencyLevel: z.enum(['low', 'medium', 'high', 'critical']).default('medium')
});

export const UpdateRequestStatusSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'approved', 'rejected', 'completed']),
  adminNotes: z.string().max(1000).optional(),
  responseMessage: z.string().max(2000).optional()
});

export const AssignVolunteerSchema = z.object({
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID')
});

export const SendMessageSchema = z.object({
  responseMessage: z
    .string()
    .min(5, 'Message must be at least 5 characters')
    .max(2000, 'Message cannot exceed 2000 characters')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'staff', 'user']).default('user')
});

export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
});

export type CreateRequestInput = z.infer<typeof CreateRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof UpdateRequestStatusSchema>;
export type AssignVolunteerInput = z.infer<typeof AssignVolunteerSchema>;
export type SendMessageInput = z.infer<typeof SendMessageSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
