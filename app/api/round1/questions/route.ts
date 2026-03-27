import { NextRequest, NextResponse } from 'next/server';
import {
  getRound1Questions,
  getRound1Question,
  createRound1Question,
  clearRound1Questions,
  deleteRound1Question,
  startOrGetRound1Session,
  getRound1AssignedQuestions,
  getRound1Responses,
  getRound1UnlockedSection,
  advanceRound1Section,
} from '@/lib/db';
import { buildRound1QuestionSet } from '@/lib/round1-question-bank';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const questionId = searchParams.get('id');
    const participantId = searchParams.get('participantId');
    const action = searchParams.get('action');

    if (questionId) {
      const question = getRound1Question(parseInt(questionId, 10));
      if (!question) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      return NextResponse.json({ question });
    }

    if (participantId && action === 'start') {
      const existingPool = getRound1Questions();
      const snippetQuestions = existingPool.filter((q) => q.type === 'snippet-coding');
      const snippetMetaMissing =
        snippetQuestions.length > 0 &&
        snippetQuestions.some(
          (q) => !q.sourceNodes?.length || !q.targetNodes?.length || !q.expectedConnections?.length
        );

      const sectionBCount = existingPool.filter((q) => q.section === 'B').length;
      const needsRegen = existingPool.length === 0 || snippetMetaMissing || sectionBCount < 20;

      if (needsRegen) {
        clearRound1Questions();
        const generated = buildRound1QuestionSet();
        generated.forEach((q) => createRound1Question(q));
      }

      const session = startOrGetRound1Session(participantId, 66);
      const assignedQuestions = getRound1AssignedQuestions(participantId);
      const responses = getRound1Responses(participantId);
      const unlockedSection = getRound1UnlockedSection(participantId);

      return NextResponse.json({
        session,
        questions: assignedQuestions,
        responses,
        unlockedSection,
      });
    }

    const questions = getRound1Questions(section || undefined);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error fetching Round 1 questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body?.action;

    if (action === 'advance_section') {
      const participantId = body?.participantId;
      if (!participantId) {
        return NextResponse.json({ error: 'Participant ID is required' }, { status: 400 });
      }
      const unlockedSection = advanceRound1Section(participantId);
      return NextResponse.json({ success: true, unlockedSection });
    }

    if (action !== 'generate_curated_round1_pool' && action !== 'generate_iot_pool') {
      return NextResponse.json(
        {
          error:
            'Manual Round 1 question entry is disabled. Use curated generation action: generate_curated_round1_pool',
        },
        { status: 400 }
      );
    }

    const generated = buildRound1QuestionSet();
    clearRound1Questions();
    const inserted = generated.map((q) => createRound1Question(q));

    return NextResponse.json(
      {
        success: true,
        message: 'Curated Round 1 question set generated',
        questions: inserted,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating Round 1 question pool:', error);
    return NextResponse.json({ error: 'Failed to create question pool' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Manual Round 1 question editing is disabled. Regenerate curated pool instead.' },
    { status: 400 }
  );
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    const success = deleteRound1Question(parseInt(id, 10));
    if (!success) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Round 1 question:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
