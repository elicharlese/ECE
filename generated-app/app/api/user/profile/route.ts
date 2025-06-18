import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/src/lib/user-store';
import { z } from 'zod';

const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }).optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = profileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    // In a real app, you would get the user ID from the session/JWT
    // For this demo, we'll assume we're updating the first user
    const userId = '1'; // This should come from authentication
    
    const updates = validationResult.data;
    
    // Update the user profile
    const updatedUser = await userStore.update(userId, {
      email: updates.email,
      profile: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        company: updates.company,
        phone: updates.phone,
        notifications: updates.notifications,
      },
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return updated user data without password
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would get the user ID from the session/JWT
    const userId = '1'; // This should come from authentication
    
    const user = userStore.getById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
