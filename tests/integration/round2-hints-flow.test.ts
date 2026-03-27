import { beforeEach, describe, expect, it } from 'vitest';

import { POST as createParticipant } from '@/app/api/participants/route';
import { GET as getParticipant, PATCH as patchParticipant } from '@/app/api/participants/[id]/route';
import { POST as unlockSnippet } from '@/app/api/snippets/unlock/route';

function makeJsonRequest(body: unknown): Request {
  return new Request('http://localhost/api/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('round2 component access scoring integration', () => {
  beforeEach(() => {
    (globalThis as { __iotStore?: unknown }).__iotStore = undefined;
  });

  it('applies component access penalty and computes score on round2 completion', async () => {
    const createRes = await createParticipant(
      makeJsonRequest({
        name: 'Round2 Student',
        teamName: 'Flow Team',
        phone: '0123456789',
        email: 'flow@example.com',
        assignedRound: 'round2',
      }) as never
    );

    expect(createRes.status).toBe(200);
    const createBody = (await createRes.json()) as { participant: { id: string } };
    const participantId = createBody.participant.id;

    const initialRes = await getParticipant(
      new Request(`http://localhost/api/participants/${participantId}`) as never,
      { params: Promise.resolve({ id: participantId }) }
    );
    expect(initialRes.status).toBe(200);

    const participantBody = (await initialRes.json()) as {
      components: Array<{ id: number }>;
      round2HintSummary: { totalComponents: number };
    };
    expect(participantBody.components.length).toBeGreaterThan(0);

    const hintRes = await unlockSnippet(
      makeJsonRequest({
        participantId,
        componentId: participantBody.components[0].id,
      }) as never
    );
    expect(hintRes.status).toBe(200);
    const accessBody = (await hintRes.json()) as {
      success: boolean;
      snippet: string;
    };
    expect(accessBody.success).toBe(true);
    expect(accessBody.snippet).toContain('void setup()');

    const completeRes = await patchParticipant(
      makeJsonRequest({ action: 'complete_round2' }) as never,
      { params: Promise.resolve({ id: participantId }) }
    );
    expect(completeRes.status).toBe(200);
    const completeBody = (await completeRes.json()) as {
      success: boolean;
      round2Summary: { baseScore: number; maxPenalty: number; totalPenalty: number; finalScore: number };
    };
    expect(completeBody.success).toBe(true);
    expect(completeBody.round2Summary.baseScore).toBe(100);
    expect(completeBody.round2Summary.maxPenalty).toBe(30);
    expect(completeBody.round2Summary.totalPenalty).toBeGreaterThan(0);
    expect(completeBody.round2Summary.finalScore).toBeLessThan(100);
  });
});
