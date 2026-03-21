import { NextResponse } from 'next/server';
import { getAllScenarios, initializeDatabase, isInitialized } from '@/lib/db';
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
    const scenarios = getAllScenarios();
    return NextResponse.json({ scenarios });
  } catch (error) {
    console.error('Error fetching scenarios:', error);
    return NextResponse.json({ error: 'Failed to fetch scenarios' }, { status: 500 });
  }
}
