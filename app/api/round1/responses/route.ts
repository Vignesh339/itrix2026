import { NextRequest, NextResponse } from 'next/server';
import {
  recordRound1Response,
  getRound1Responses,
  createRound1Result,
  getRound1Result,
} from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { participantId, questionId, answer, timeTaken } = body;

    if (!participantId || !questionId || answer === undefined || timeTaken === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = recordRound1Response(participantId, questionId, answer, timeTaken);
    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error('Error recording Round 1 response:', error);
    return NextResponse.json(
      { error: 'Failed to record response' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get('participantId');
    const action = searchParams.get('action');

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      );
    }

    if (action === 'submit') {
      const result = createRound1Result(participantId);
      return NextResponse.json({ result });
    }

    if (action === 'result') {
      const result = getRound1Result(participantId);
      if (!result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 });
      }
      return NextResponse.json({ result });
    }

    const responses = getRound1Responses(participantId);
    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching Round 1 responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}
