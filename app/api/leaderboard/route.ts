import { NextResponse } from 'next/server';
import {
  getPublicLeaderboard,
  initializeDatabase,
  isInitialized,
  isLeaderboardPublicEnabled,
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
    const enabled = isLeaderboardPublicEnabled();

    if (!enabled) {
      return NextResponse.json({ enabled: false, leaderboard: [] });
    }

    return NextResponse.json({
      enabled: true,
      leaderboard: getPublicLeaderboard(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
