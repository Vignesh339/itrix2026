import { beforeEach, describe, expect, it } from 'vitest';

import { GET as getQuestions, POST as generatePool } from '@/app/api/round1/questions/route';
import { GET as resultGet, POST as responsePost } from '@/app/api/round1/responses/route';
import { createParticipant } from '@/lib/db';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 top-down integration flow', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('runs full API flow from question assignment to final result', async () => {
    const generated = await generatePool(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);
    expect(generated.status).toBe(201);

    createParticipant('Integration Student', 'top-down-1', 'Team T', 'round1');

    const startReq = new Request('http://localhost/api/round1/questions?participantId=top-down-1&action=start');
    const startRes = await getQuestions(startReq as never);
    const startBody = (await startRes.json()) as {
      questions: Array<{ id: number; type: string; correctAnswer?: string }>;
    };

    expect(startRes.status).toBe(200);
    expect(startBody.questions).toHaveLength(66);

    const firstMcq = startBody.questions.find((q) => q.type === 'mcq');
    expect(firstMcq).toBeDefined();

    const responseRes = await responsePost(
      makeJsonRequest({
        participantId: 'top-down-1',
        questionId: firstMcq!.id,
        answer: firstMcq!.correctAnswer || 'A',
        timeTaken: 12,
      }) as never
    );
    expect(responseRes.status).toBe(201);

    const submitReq = new Request('http://localhost/api/round1/responses?participantId=top-down-1&action=submit');
    const submitRes = await resultGet(submitReq as never);
    const submitBody = (await submitRes.json()) as { result: { participant_id: string; total_questions: number } };

    expect(submitRes.status).toBe(200);
    expect(submitBody.result.participant_id).toBe('top-down-1');
    expect(submitBody.result.total_questions).toBe(66);
  });
});
