import { NextRequest, NextResponse } from 'next/server';
import {
  initializeDatabase,
  isInitialized,
  isLeaderboardPublicEnabled,
  setLeaderboardPublicEnabled,
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function GET() {
  try {
    ensureInitialized();
    return NextResponse.json({ enabled: isLeaderboardPublicEnabled() });
  } catch (error) {
    console.error('Error getting leaderboard setting:', error);
    return NextResponse.json({ error: 'Failed to get leaderboard setting' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    ensureInitialized();
    const body = await request.json();
    const enabled = Boolean(body.enabled);
    setLeaderboardPublicEnabled(enabled);
    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    console.error('Error updating leaderboard setting:', error);
    return NextResponse.json({ error: 'Failed to update leaderboard setting' }, { status: 500 });
  }
}
