import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

interface UserCreateData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName?: string;
  role?: string;
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
        hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        verificationToken,
        role: data.role || 'USER',
      },
    });
    
    // Create organization if name provided
    let organization = null;
    if (data.organizationName) {
      organization = await prisma.organization.create({
        data: {
          name: data.organizationName,
          ownerId: user.id,
          members: {
            create: {
              userId: user.id,
              role: 'OWNER',
            },
          },
        },
      });
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified,
      },
      organization,
      verificationToken,
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
    const passwordValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!passwordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Check if email is verified
    if (!user.verified) {
      throw new Error('Email not verified. Please check your email for verification instructions.');
    }
    
    // Generate auth token
    const token = this.generateAuthToken(user.id);
    
    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.createHash('sha256').update(token).digest('hex'),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userAgent: 'Unknown', // This would be populated from the request in a real implementation
      },
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
      session: {
        id: session.id,
        expires: session.expires,
      },
    };
  }

  // Logout user
  async logoutUser(token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Delete session
    await prisma.session.deleteMany({
      where: { token: hashedToken },
    });
    
    return { success: true };
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
        resetToken: hashedToken,
        resetTokenExpiry: tokenExpiry,
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
        resetToken: hashedToken,
        resetTokenExpiry: {
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
        hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    
    // Invalidate all sessions
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });
    
    return { success: true };
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        verified: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
        bio: true,
        phone: true,
        notificationPreferences: true,
        organizations: {
          include: {
            organization: true,
          },
        },
        plan: true,
        subscription: true,
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  }

  // Update user
  async updateUser(userId: string, data: UserUpdateData) {
    // Validate email is unique if changing
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId },
        },
      });
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        bio: true,
        phone: true,
        notificationPreferences: true,
      },
    });
    
    return updatedUser;
  }

  // Change password
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Verify current password
    const passwordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    
    if (!passwordValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        hashedPassword,
      },
    });
    
    return { success: true };
  }

  // Upload avatar
  async updateAvatar(userId: string, avatarUrl: string) {
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: avatarUrl,
      },
    });
    
    return { success: true, avatar: avatarUrl };
  }

  // Get user organizations
  async getUserOrganizations(userId: string) {
    const organizations = await prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: true,
      },
    });
    
    return organizations.map(member => ({
      id: member.organization.id,
      name: member.organization.name,
      role: member.role,
      createdAt: member.organization.createdAt,
      logo: member.organization.logo,
    }));
  }

  // Create organization
  async createOrganization(userId: string, name: string) {
    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });
    
    return organization;
  }

  // Update notification preferences
  async updateNotificationPreferences(userId: string, preferences: any) {
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: preferences,
      },
    });
    
    return { success: true, preferences };
  }

  // Generate JWT auth token
  private generateAuthToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
  }

  // Verify JWT token
  verifyAuthToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }

  // Check if user has active session
  async validateSession(token: string): Promise<string | null> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find session
    const session = await prisma.session.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gt: new Date(),
        },
      },
    });
    
    if (!session) {
      return null;
    }
    
    return session.userId;
  }

  // Get all users (admin only)
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (params.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { firstName: { contains: params.search, mode: 'insensitive' } },
        { lastName: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          verified: true,
          createdAt: true,
          plan: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);
    
    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Update user role (admin only)
  async updateUserRole(userId: string, role: string) {
    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
      },
    });
    
    return { success: true };
  }

  // Delete user (admin only or self)
  async deleteUser(userId: string) {
    // Delete user sessions
    await prisma.session.deleteMany({
      where: { userId },
    });
    
    // Delete user organization memberships
    await prisma.organizationMember.deleteMany({
      where: { userId },
    });
    
    // Delete user
    await prisma.user.delete({
      where: { id: userId },
    });
    
    return { success: true };
  }

  // Google OAuth login/register
  async handleGoogleAuth(googleProfile: {
    email: string;
    given_name: string;
    family_name: string;
    picture?: string;
  }) {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email: googleProfile.email },
    });
    
    if (!user) {
      // Register new user
      user = await prisma.user.create({
        data: {
          email: googleProfile.email,
          firstName: googleProfile.given_name,
          lastName: googleProfile.family_name,
          avatar: googleProfile.picture,
          hashedPassword: '', // No password for OAuth users
          verified: true, // Google already verified the email
          role: 'USER',
        },
      });
    }
    
    // Generate auth token
    const token = this.generateAuthToken(user.id);
    
    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: crypto.createHash('sha256').update(token).digest('hex'),
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        userAgent: 'OAuth Login',
      },
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
      session: {
        id: session.id,
        expires: session.expires,
      },
    };
  }
} 