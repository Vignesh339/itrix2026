import { NextRequest, NextResponse } from 'next/server';
import { getAllParticipants, createParticipant, initializeDatabase, isInitialized, getParticipant } from '@/lib/db';
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
    const participants = getAllParticipants();
    return NextResponse.json({ participants });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureInitialized();
    const body = await request.json();
    const { name, id } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const participantId = id || `p-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Check if ID already exists
    const existing = getParticipant(participantId);
    if (existing) {
      return NextResponse.json({ error: 'Participant ID already exists' }, { status: 400 });
    }

    const participant = createParticipant(name, participantId);

    return NextResponse.json({ success: true, participant });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 });
  }
}
