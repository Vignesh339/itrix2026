import { beforeEach, describe, expect, it } from 'vitest';

import { POST as createParticipant } from '@/app/api/participants/route';
import { GET as getRound1Questions } from '@/app/api/round1/questions/route';
import { POST as postRound1Response, GET as getRound1Responses } from '@/app/api/round1/responses/route';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 response review route integration', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('returns attended/right/wrong summary with reviewed questions', async () => {
    const createRes = await createParticipant(
      makeJsonRequest({
        name: 'Review Student',
        teamName: 'Review Team',
        phone: '0123456789',
        email: 'review@example.com',
        assignedRound: 'round1',
      }) as never
    );

    expect(createRes.status).toBe(200);
    const createBody = (await createRes.json()) as { participant: { id: string } };
    const participantId = createBody.participant.id;

    const questionsRes = await getRound1Questions(
      new Request(`http://localhost/api/round1/questions?participantId=${participantId}&action=start`) as never
    );
    expect(questionsRes.status).toBe(200);
    const questionsBody = (await questionsRes.json()) as {
      questions: Array<{ id: number; options?: Array<{ id: string }> }>;
    };

    const first = questionsBody.questions[0];
    const answer = first.options?.[0]?.id || 'A';

    const responseRes = await postRound1Response(
      makeJsonRequest({
        participantId,
        questionId: first.id,
        answer,
        timeTaken: 8,
      }) as never
    );
    expect(responseRes.status).toBe(201);

    const reviewRes = await getRound1Responses(
      new Request(`http://localhost/api/round1/responses?participantId=${participantId}&action=review`) as never
    );

    expect(reviewRes.status).toBe(200);
    const reviewBody = (await reviewRes.json()) as {
      review: Array<{ question_id: number; is_correct: boolean }>;
      summary: { attended: number; right: number; wrong: number };
    };

    expect(reviewBody.summary.attended).toBe(1);
    expect(reviewBody.summary.right + reviewBody.summary.wrong).toBe(1);
    expect(reviewBody.review.length).toBe(1);
    expect(reviewBody.review[0].question_id).toBe(first.id);
  });
});
