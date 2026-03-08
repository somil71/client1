import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import { LoginInput, RegisterInput } from '../utils/validation.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || '',
      { expiresIn: process.env.JWT_EXPIRY || '7d' } as any
    );
  }

  async register(data: RegisterInput): Promise<{ user: any; token: string }> {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const user = new User(data);
    await user.save();

    const token = this.generateToken(user._id.toString());

    return {
      user: user.toJSON(),
      token
    };
  }

  async login(data: LoginInput): Promise<{ user: any; token: string }> {
    const user = await User.findOne({ email: data.email }).select('+password');

    if (!user || !(await user.comparePassword(data.password))) {
      throw new AppError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new AppError(403, 'User account is inactive');
    }

    const token = this.generateToken(user._id.toString());

    return {
      user: user.toJSON(),
      token
    };
  }

  async verifyToken(token: string): Promise<string> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as any;
      return decoded.userId;
    } catch (error) {
      throw new AppError(401, 'Invalid or expired token');
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }
}

export default new AuthService();
