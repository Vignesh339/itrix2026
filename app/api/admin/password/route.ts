import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword, getPasswordHistory } from '@/lib/db';

// POST - Change password
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      );
    }

    // Validate password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return NextResponse.json(
        {
          error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
        },
        { status: 400 }
      );
    }

    const success = changeAdminPassword(currentPassword, newPassword);

    if (!success) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
}

// GET - Get password change history
export async function GET() {
  try {
    const history = getPasswordHistory();
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching password history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
