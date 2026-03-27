import { beforeEach, describe, expect, it } from 'vitest';

import { GET as startRound1, POST as generatePool } from '@/app/api/round1/questions/route';
import {
  createParticipant,
  createRound1Question,
  startOrGetRound1Session,
} from '@/lib/db';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round1 stale session recovery', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('rebuilds invalid existing session with curated pool questions', async () => {
    createParticipant('Legacy User', 'POLD01', 'Team Legacy', 'round1');

    createRound1Question({
      type: 'mcq',
      title: 'Legacy question',
      scenario: 'Legacy content',
      section: 'A',
      difficulty: 'Easy',
      score: 5,
      timeLimit: 60,
      options: [
        { id: 'A', text: 'A1' },
        { id: 'B', text: 'B1' },
        { id: 'C', text: 'C1' },
        { id: 'D', text: 'D1' },
      ],
      correctAnswer: 'A',
    });

    const staleSession = startOrGetRound1Session('POLD01', 31);
    expect(staleSession.question_ids.length).toBeGreaterThan(0);

    await generatePool(makeJsonRequest({ action: 'generate_curated_round1_pool' }) as never);

    const res = await startRound1(
      new Request('http://localhost/api/round1/questions?participantId=POLD01&action=start') as never
    );
    const body = (await res.json()) as { questions: Array<{ type: string }> };

    expect(res.status).toBe(200);
    expect(body.questions).toHaveLength(66);
    expect(body.questions.some((q) => q.type === 'simulation')).toBe(true);
    expect(body.questions.some((q) => q.type === 'matching' || q.type === 'component-matching')).toBe(true);
  });
});
