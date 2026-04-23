import { NextRequest, NextResponse } from 'next/server';
import {
  hashPassword,
  generateVerificationToken,
  createUser,
  getUserByEmail,
} from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, age, role } = await request.json();
    const parsedAge = age !== undefined ? Number(age) : undefined;
    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    if (parsedAge !== undefined && (Number.isNaN(parsedAge) || parsedAge <= 0)) {
      return NextResponse.json(
        { success: false, message: 'Age must be a positive number' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    const user = await createUser(
      name,
      email,
      passwordHash,
      verificationToken,
      parsedAge,
      normalizedRole
    );

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken, name);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still return success, user can request resend
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        userId: user._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
