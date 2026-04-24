import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, createUser, getUserByEmail } from '@/lib/auth';

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

    const user = await createUser(
      name,
      email,
      passwordHash,
      null, // No verification token needed
      parsedAge,
      normalizedRole
    );

    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully. You can now login.',
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
