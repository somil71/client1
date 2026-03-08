import { describe, it, expect } from 'vitest';
import {
  CreateRequestSchema,
  UpdateRequestStatusSchema,
  LoginSchema,
  RegisterSchema,
} from '../src/utils/validation';

describe('Validation Schemas', () => {
  describe('CreateRequestSchema', () => {
    it('should validate a correct request', async () => {
      const validRequest = {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@example.com',
        city: 'Mumbai',
        address: '123 Main Street',
        typeOfHelp: 'antim-kit',
        description: 'We need assistance with funeral arrangements',
        urgencyLevel: 'high',
      };

      const result = await CreateRequestSchema.parseAsync(validRequest);
      expect(result).toBeDefined();
      expect(result.name).toBe('John Doe');
    });

    it('should fail with short name', async () => {
      const invalidRequest = {
        name: 'A',
        phone: '9876543210',
        email: 'john@example.com',
        city: 'Mumbai',
        address: '123 Main Street',
        typeOfHelp: 'antim-kit',
        description: 'We need assistance with funeral arrangements',
      };

      try {
        await CreateRequestSchema.parseAsync(invalidRequest);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors[0].message).toContain('at least 2 characters');
      }
    });

    it('should fail with invalid email', async () => {
      const invalidRequest = {
        name: 'John Doe',
        phone: '9876543210',
        email: 'invalid-email',
        city: 'Mumbai',
        address: '123 Main Street',
        typeOfHelp: 'antim-kit',
        description: 'We need assistance with funeral arrangements',
      };

      try {
        await CreateRequestSchema.parseAsync(invalidRequest);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors[0].message).toContain('Invalid email');
      }
    });

    it('should fail with short description', async () => {
      const invalidRequest = {
        name: 'John Doe',
        phone: '9876543210',
        email: 'john@example.com',
        city: 'Mumbai',
        address: '123 Main Street',
        typeOfHelp: 'antim-kit',
        description: 'Short',
      };

      try {
        await CreateRequestSchema.parseAsync(invalidRequest);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors[0].message).toContain('at least 10 characters');
      }
    });
  });

  describe('LoginSchema', () => {
    it('should validate correct login credentials', async () => {
      const validLogin = {
        email: 'admin@moksh.org',
        password: 'password123',
      };

      const result = await LoginSchema.parseAsync(validLogin);
      expect(result.email).toBe('admin@moksh.org');
    });

    it('should fail with invalid email', async () => {
      const invalidLogin = {
        email: 'not-an-email',
        password: 'password123',
      };

      try {
        await LoginSchema.parseAsync(invalidLogin);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors[0].message).toContain('Invalid email');
      }
    });

    it('should fail with short password', async () => {
      const invalidLogin = {
        email: 'admin@moksh.org',
        password: '123',
      };

      try {
        await LoginSchema.parseAsync(invalidLogin);
        expect.fail('Should have thrown validation error');
      } catch (error: any) {
        expect(error.errors[0].message).toContain('at least 6 characters');
      }
    });
  });

  describe('RegisterSchema', () => {
    it('should validate correct registration data', async () => {
      const validRegister = {
        name: 'John Doe',
        email: 'john@moksh.org',
        password: 'SecurePass123',
        role: 'staff',
      };

      const result = await RegisterSchema.parseAsync(validRegister);
      expect(result.role).toBe('staff');
    });

    it('should have default role as user', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john@moksh.org',
        password: 'SecurePass123',
      };

      const result = await RegisterSchema.parseAsync(registerData);
      expect(result.role).toBe('user');
    });
  });

  describe('UpdateRequestStatusSchema', () => {
    it('should validate status update', async () => {
      const validUpdate = {
        status: 'approved',
        responseMessage: 'Your request has been approved',
        adminNotes: 'Follow up with family',
      };

      const result = await UpdateRequestStatusSchema.parseAsync(validUpdate);
      expect(result.status).toBe('approved');
    });

    it('should allow partial updates', async () => {
      const partialUpdate = {
        status: 'reviewing',
      };

      const result = await UpdateRequestStatusSchema.parseAsync(partialUpdate);
      expect(result.status).toBe('reviewing');
      expect(result.responseMessage).toBeUndefined();
    });
  });
});
