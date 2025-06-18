import { NextRequest, NextResponse } from 'next/server';
import { userStore } from '@/src/lib/user-store';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = signUpSchema.safeParse(body);
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

    const { email, password, name, firstName, lastName, company, phone } = validationResult.data;

    // Check if user already exists
    if (userStore.emailExists(email)) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await userStore.create({
      email,
      password,
      name,
      provider: 'credentials',
      role: 'user',
      profile: {
        firstName: firstName || name.split(' ')[0],
        lastName: lastName || name.split(' ')[1] || '',
        company,
        phone,
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
      },
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
