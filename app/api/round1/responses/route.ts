import { NextRequest, NextResponse } from 'next/server';
import {
  recordRound1Response,
  getRound1Responses,
  getRound1ResponseReview,
  createRound1Result,
  getRound1Result,
  isRound1SessionExpired,
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

    if (isRound1SessionExpired(participantId)) {
      const existingResult = getRound1Result(participantId);
      const result = existingResult || createRound1Result(participantId);
      return NextResponse.json(
        { error: 'Round 1 has ended', result },
        { status: 410 }
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
      const existingResult = getRound1Result(participantId);
      const result = existingResult || createRound1Result(participantId);
      return NextResponse.json({ result });
    }

    if (action === 'result') {
      const result = getRound1Result(participantId);
      if (!result) {
        return NextResponse.json({ error: 'Result not found' }, { status: 404 });
      }
      return NextResponse.json({ result });
    }

    if (action === 'review') {
      const review = getRound1ResponseReview(participantId);
      const attendedItems = review.filter((item) => item.answer !== undefined && item.answer !== null && (Array.isArray(item.answer) ? item.answer.length > 0 : String(item.answer).trim().length > 0));
      const right = attendedItems.filter((item) => item.is_correct).length;
      const wrong = attendedItems.length - right;
      return NextResponse.json({
        review,
        summary: {
          attended: attendedItems.length,
          right,
          wrong,
        },
      });
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
