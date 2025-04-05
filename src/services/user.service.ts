import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

type UserRole = 'USER' | 'ADMIN';

interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  notificationPreferences?: any;
}

export class UserService {
  // Register a new user
  async registerUser(data: UserCreateData) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    
    if (existingUser) {
      throw new Error('Email already in use');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationToken,
        role: data.role || 'USER',
      },
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      }
    };
  }

  // Verify email with token
  async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });
    
    if (!user) {
      throw new Error('Invalid verification token');
    }
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        verificationToken: null,
      },
    });
    
    return { success: true };
  }

  // Login user
  async loginUser(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Check if email is verified
    if (!user.verified) {
      throw new Error('Email not verified. Please check your email for verification instructions.');
    }
    
    // Generate auth token
    const token = this.generateAuthToken(user.id);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token
    };
  }

  // Request password reset
  async requestPasswordReset(email: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // For security, don't reveal that the email doesn't exist
      return {
        success: true,
        message: 'If your email is registered, you will receive a password reset link.',
      };
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    // Set token expiry (1 hour)
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpiry,
      },
    });
    
    // In a real implementation, send an email with the reset link
    
    return {
      success: true,
      message: 'If your email is registered, you will receive a password reset link.',
      // For development purposes only, return the token
      resetToken,
    };
  }

  // Reset password
  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });
    
    if (!user) {
      throw new Error('Invalid or expired reset token');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });
    
    return { success: true };
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      verified: user.verified,
    };
  }

  // Update user
  async updateUser(userId: string, data: UserUpdateData) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data
    });
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      role: updatedUser.role,
      verified: updatedUser.verified,
    };
  }

  // Delete user
  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    await prisma.user.delete({
      where: { id: userId }
    });
  }

  // Generate JWT token
  private generateAuthToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
  }
} 