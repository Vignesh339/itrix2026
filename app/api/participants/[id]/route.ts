import { NextRequest, NextResponse } from 'next/server';
import { 
  getParticipant, 
  getScenario,
  getScenarioComponents,
  getUnlockedSnippets,
  assignScenario,
  startTimer,
  lockParticipant,
  unlockParticipant,
  deleteParticipant,
  updateParticipant,
  logActivity, 
  logViolation,
  initializeDatabase,
  isInitialized,
  getViolations
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    
    const participant = getParticipant(id);
    
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    // Get scenario details if assigned
    let scenario = null;
    let components: Array<{
      id: number;
      name: string;
      description: string;
      pinout: string;
      category: string;
      code_snippet: string;
      is_unlocked?: boolean;
    }> = [];
    
    if (participant.scenario_id) {
      scenario = getScenario(participant.scenario_id);
      const scenarioComps = getScenarioComponents(participant.scenario_id);
      const unlockedIds = getUnlockedSnippets(id).map(s => s.component_id);
      
      components = scenarioComps.map(c => ({
        ...c,
        is_unlocked: unlockedIds.includes(c.id)
      }));
    }
    
    // Get unlocked snippets and violations
    const unlockedSnippets = getUnlockedSnippets(id);
    const violations = getViolations(id);
    
    return NextResponse.json({ 
      participant: {
        ...participant,
        scenario_title: scenario?.title,
        situation: scenario?.situation,
        what_to_build: scenario?.what_to_build,
        snippets_unlocked: unlockedSnippets.length,
        violation_count: violations.length
      }, 
      components,
      unlockedSnippets
    });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Failed to fetch participant' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    const body = await request.json();
    
    const participant = getParticipant(id);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }
    
    // Handle different update actions
    if (body.action === 'assign_scenario') {
      assignScenario(id, body.scenarioId);
      logActivity(id, 'scenario_assigned', `Assigned scenario ID: ${body.scenarioId}`);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'start_timer') {
      const duration = body.duration || 3600;
      startTimer(id, duration);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'lock') {
      lockParticipant(id);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'unlock') {
      unlockParticipant(id);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'reset') {
      updateParticipant(id, {
        timer_started_at: null,
        is_active: 0,
        is_locked: 0
      });
      // Note: In-memory store doesn't support deleting related records in reset
      // This would need additional cleanup functions
      logActivity(id, 'reset', 'Participant session reset');
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_violation') {
      logViolation(id, body.violationType, body.details);
      return NextResponse.json({ success: true });
    }
    
    if (body.action === 'log_activity') {
      logActivity(id, body.eventType, body.details);
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating participant:', error);
    return NextResponse.json({ error: 'Failed to update participant' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    ensureInitialized();
    const { id } = await params;
    
    deleteParticipant(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Failed to delete participant' }, { status: 500 });
  }
}
