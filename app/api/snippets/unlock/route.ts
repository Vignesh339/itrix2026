import { NextRequest, NextResponse } from 'next/server';
import { 
  getParticipant, 
  getComponent,
  unlockSnippet, 
  initializeDatabase, 
  isInitialized 
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureInitialized();
    const body = await request.json();
    const { participantId, componentId } = body;
    
    if (!participantId || !componentId) {
      return NextResponse.json({ error: 'Participant ID and Component ID are required' }, { status: 400 });
    }
    
    // Check if participant exists and is not locked
    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    if (participant.is_locked) {
      return NextResponse.json({ error: 'Dashboard is locked' }, { status: 403 });
    }
    
    // Unlock the snippet
    const result = unlockSnippet(participantId, componentId);
    
    if (!result.success) {
      return NextResponse.json({ success: true, alreadyUnlocked: true });
    }
    
    // Get the snippet
    const component = getComponent(componentId);
    
    return NextResponse.json({ 
      success: true, 
      snippet: component?.code_snippet 
    });
  } catch (error) {
    console.error('Error unlocking snippet:', error);
    return NextResponse.json({ error: 'Failed to unlock snippet' }, { status: 500 });
  }
}
