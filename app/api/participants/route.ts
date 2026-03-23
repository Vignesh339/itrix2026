import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllParticipants, 
  createParticipant, 
  initializeDatabase, 
  isInitialized, 
  getParticipant,
  getAllScenarios,
  assignScenario,
  logActivity
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

// Generate a unique 6-character alphanumeric ID
function generateUniqueId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar-looking characters
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
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
    const { name, teamName, id: providedId, autoAssignScenario = true, assignedRound } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Generate unique ID if not provided
    let participantId = providedId?.toUpperCase();
    if (!participantId) {
      // Generate and ensure uniqueness
      do {
        participantId = generateUniqueId();
      } while (getParticipant(participantId));
    }
    
    // Check if ID already exists
    const existing = getParticipant(participantId);
    if (existing) {
      return NextResponse.json({ error: 'Participant ID already exists' }, { status: 400 });
    }

    // Create participant with assigned round
    const participant = createParticipant(name, participantId, teamName, assignedRound);

    // Auto-assign a random scenario if enabled and participant is for Round 2
    let assignedScenario = null;
    if (autoAssignScenario && assignedRound !== 'round1') {
      const scenarios = getAllScenarios();
      const participants = getAllParticipants();
      
      // Find scenarios that haven't been assigned yet
      const assignedScenarioIds = new Set(
        participants
          .filter(p => p.scenario_id && p.id !== participantId)
          .map(p => p.scenario_id)
      );
      
      const availableScenarios = scenarios.filter(s => !assignedScenarioIds.has(s.id));
      
      if (availableScenarios.length > 0) {
        // Pick a random available scenario
        const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
        assignScenario(participantId, randomScenario.id);
        assignedScenario = randomScenario;
        logActivity(participantId, 'scenario_assigned', `Auto-assigned scenario: ${randomScenario.title}`);
      }
    }

    logActivity(participantId, 'participant_created', `New participant created: ${name} (${assignedRound || 'unassigned'})`);

    return NextResponse.json({ 
      success: true, 
      participant: {
        ...participant,
        scenario_id: assignedScenario?.id || null,
        scenario_title: assignedScenario?.title || null,
      },
      generatedId: participantId,
    });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Failed to create participant' }, { status: 500 });
  }
}
