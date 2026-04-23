import { NextRequest, NextResponse } from 'next/server';
import { verifyUserEmail, getUserByEmail } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'Email and verification token are required' },
        { status: 400 }
      );
    }

    const verified = await verifyUserEmail(email, token);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
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
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json(
        { success: false, message: 'Email and verification token are required' },
        { status: 400 }
      );
    }

    const verified = await verifyUserEmail(email, token);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification token' },
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

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login?verified=true`);
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?verified=false`
    );
  }
}
