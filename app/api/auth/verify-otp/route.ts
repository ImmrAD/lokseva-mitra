import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, getUserByEmail } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const verified = await verifyOTP(email, otp);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (user) {
      try {
        await sendWelcomeEmail(email, user.name);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Email verified successfully. You can now login.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 }
    );
  }
}