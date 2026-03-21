import { NextRequest, NextResponse } from 'next/server';
import {
  getWhitelistedApps,
  addWhitelistedApp,
  removeWhitelistedApp,
} from '@/lib/db';

export async function GET() {
  try {
    const apps = getWhitelistedApps();
    return NextResponse.json({ whitelisted_apps: apps });
  } catch (error) {
    console.error('Error fetching whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whitelist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, app_name } = body;

    if (!app_name || !action) {
      return NextResponse.json(
        { error: 'app_name and action are required' },
        { status: 400 }
      );
    }

    if (action === 'add') {
      addWhitelistedApp(app_name);
      return NextResponse.json({
        success: true,
        message: `Added ${app_name} to whitelist`,
      });
    } else if (action === 'remove') {
      removeWhitelistedApp(app_name);
      return NextResponse.json({
        success: true,
        message: `Removed ${app_name} from whitelist`,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "add" or "remove"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error managing whitelist:', error);
    return NextResponse.json(
      { error: 'Failed to manage whitelist' },
      { status: 500 }
    );
  }
}
