import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      console.log('[v0] No password provided');
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    console.log('[v0] Verifying password. Input length:', password.length);
    const isValid = verifyAdminPassword(password);
    console.log('[v0] Password verification result:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { valid: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[v0] Error verifying password:', error);
    return NextResponse.json(
      { error: 'Failed to verify password' },
      { status: 500 }
    );
  }
}
