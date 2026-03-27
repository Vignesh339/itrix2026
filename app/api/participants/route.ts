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
    const {
      name,
      member1Name,
      member2Name,
      member3Name,
      teamName,
      id: providedId,
      autoAssignScenario = true,
      assignedRound,
      phone,
      email,
      year,
      college,
      department,
      member1Phone,
      member1Email,
      member1Year,
      member1College,
      member1Department,
      member2Phone,
      member2Email,
      member2Year,
      member2College,
      member2Department,
      member3Phone,
      member3Email,
      member3Year,
      member3College,
      member3Department,
    } = body;

    const leadName = member1Name || name;
    const leadPhone = member1Phone || phone;
    const leadEmail = member1Email || email;
    const leadYear = member1Year || year;
    const leadCollege = member1College || college;
    const leadDepartment = member1Department || department;

    if (!leadName) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!teamName) {
      return NextResponse.json({ error: 'Team name is required' }, { status: 400 });
    }
    if (!leadPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    if (!leadEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!leadCollege) {
      return NextResponse.json({ error: 'College is required' }, { status: 400 });
    }
    if (!leadDepartment) {
      return NextResponse.json({ error: 'Department is required' }, { status: 400 });
    }

    if (member2Name && (!member2Phone || !member2Email || !member2College || !member2Department)) {
      return NextResponse.json({ error: 'Member 2 requires phone, email, college, and department.' }, { status: 400 });
    }

    if (member3Name && (!member3Phone || !member3Email || !member3College || !member3Department)) {
      return NextResponse.json({ error: 'Member 3 requires phone, email, college, and department.' }, { status: 400 });
    }

    const normalizedTeam = String(teamName).trim().toLowerCase();
    const teamExists = getAllParticipants().some(
      (participant) => (participant.team_name || '').trim().toLowerCase() === normalizedTeam
    );
    if (teamExists) {
      return NextResponse.json({ error: 'This team already has a login. Use one team login for all rounds.' }, { status: 400 });
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
    const participant = createParticipant(
      leadName,
      participantId,
      teamName,
      assignedRound,
      leadPhone,
      leadEmail,
      leadYear,
      leadCollege,
      leadDepartment,
      member2Name,
      member3Name,
      member2Phone,
      member2Email,
      member2Year,
      member2College,
      member2Department,
      member3Phone,
      member3Email,
      member3Year,
      member3College,
      member3Department
    );

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

    logActivity(participantId, 'participant_created', `New participant created: ${leadName} (${assignedRound || 'unassigned'})`);

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
