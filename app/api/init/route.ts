import { NextResponse } from 'next/server';
import { isInitialized, initializeDatabase } from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

export async function POST() {
  try {
    initializeDatabase();
    seedDatabase();
    
    return NextResponse.json({ success: true, message: 'Database initialized and seeded' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ 
      initialized: isInitialized()
    });
  } catch (error) {
    return NextResponse.json({ initialized: false });
  }
}
