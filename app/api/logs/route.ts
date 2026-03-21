import { NextRequest, NextResponse } from 'next/server';
import { 
  getActivityLogs, 
  getViolations, 
  logViolation, 
  logActivity,
  getParticipant,
  getAllParticipants,
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

export async function GET(request: NextRequest) {
  try {
    ensureInitialized();
    
    const searchParams = request.nextUrl.searchParams;
    const participantId = searchParams.get('participantId') || undefined;
    const type = searchParams.get('type');
    
    // Get all participants for name lookup
    const participants = getAllParticipants();
    const participantMap = new Map(participants.map(p => [p.id, p.name]));
    
    if (type === 'violations') {
      const violations = getViolations(participantId);
      const violationsWithNames = violations.map(v => ({
        ...v,
        participant_name: participantMap.get(v.participant_id) || v.participant_id
      }));
      return NextResponse.json({ violations: violationsWithNames });
    }
    
    // Default: activity logs
    const logs = getActivityLogs(participantId);
    const logsWithNames = logs.map(l => ({
      ...l,
      participant_name: participantMap.get(l.participant_id) || l.participant_id
    }));
    return NextResponse.json({ logs: logsWithNames });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    ensureInitialized();
    const body = await request.json();
    const { participantId, type, eventType, violationType, details } = body;

    if (!participantId) {
      return NextResponse.json({ error: 'Participant ID required' }, { status: 400 });
    }

    // Check participant exists
    const participant = getParticipant(participantId);
    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    if (type === 'violation' && violationType) {
      logViolation(participantId, violationType, details);
      return NextResponse.json({ success: true });
    }

    if (eventType) {
      logActivity(participantId, eventType, details);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid log type' }, { status: 400 });
  } catch (error) {
    console.error('Error logging:', error);
    return NextResponse.json({ error: 'Failed to log' }, { status: 500 });
  }
}
