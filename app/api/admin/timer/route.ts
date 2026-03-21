import { NextRequest, NextResponse } from 'next/server';
import { setGlobalTimerDuration, getGlobalTimerDuration } from '@/lib/db';

export async function GET() {
  try {
    const duration = getGlobalTimerDuration();
    return NextResponse.json({
      global_timer_duration: duration,
      minutes: Math.floor(duration / 60),
    });
  } catch (error) {
    console.error('Error fetching global timer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { duration } = body;

    if (!duration || typeof duration !== 'number' || duration <= 0) {
      return NextResponse.json(
        { error: 'Valid duration in seconds is required' },
        { status: 400 }
      );
    }

    setGlobalTimerDuration(duration);

    return NextResponse.json({
      success: true,
      global_timer_duration: duration,
      minutes: Math.floor(duration / 60),
    });
  } catch (error) {
    console.error('Error setting global timer:', error);
    return NextResponse.json(
      { error: 'Failed to set timer' },
      { status: 500 }
    );
  }
}
