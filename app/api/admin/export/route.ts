import { NextResponse } from 'next/server';
import {
  getAllParticipants,
  initializeDatabase,
  isInitialized,
} from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

function ensureInitialized() {
  if (!isInitialized()) {
    initializeDatabase();
    seedDatabase();
  }
}

function csvEscape(value: unknown): string {
  const raw = value === null || value === undefined ? '' : String(value);
  if (/[,"\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export async function GET() {
  try {
    ensureInitialized();
    const participants = getAllParticipants()
      .filter((participant) => {
        const hasRound1Data = (participant.round1_total_questions || 0) > 0 || (participant.round1_answered || 0) > 0 || !!participant.round1_completed;
        return hasRound1Data || participant.assigned_round === 'round1';
      })
      .sort((a, b) => {
        const scoreDiff = (b.round1_score || 0) - (a.round1_score || 0);
        if (scoreDiff !== 0) return scoreDiff;
        const completionDiff = Number(Boolean(b.round1_completed)) - Number(Boolean(a.round1_completed));
        if (completionDiff !== 0) return completionDiff;
        return (a.team_name || '').localeCompare(b.team_name || '');
      });

    const headers = [
      'Rank',
      'ID',
      'Team',
      'Round 1 Score',
      'Round 1 Completed',
      'Round 1 Answered',
      'Round 1 Total Questions',
      'Assigned Round',
      'Member 1',
      'Member 1 College',
      'Member 1 Department',
      'Member 1 Phone',
      'Member 1 Email',
      'Member 1 Year',
      'Member 2',
      'Member 2 College',
      'Member 2 Department',
      'Member 2 Phone',
      'Member 2 Email',
      'Member 2 Year',
      'Member 3',
      'Member 3 College',
      'Member 3 Department',
      'Member 3 Phone',
      'Member 3 Email',
      'Member 3 Year',
      'Created At',
    ];

    const rows = participants.map((participant, index) => [
      index + 1,
      participant.id,
      participant.team_name || '',
      participant.round1_score ?? 0,
      participant.round1_completed ? 'Yes' : 'No',
      participant.round1_answered ?? 0,
      participant.round1_total_questions ?? 0,
      participant.assigned_round || '',
      participant.member1_name || participant.name,
      participant.member1_college || participant.college || '',
      participant.member1_department || participant.department || '',
      participant.member1_phone || participant.phone || '',
      participant.member1_email || participant.email || '',
      participant.member1_year || participant.year || '',
      participant.member2_name || '',
      participant.member2_college || '',
      participant.member2_department || '',
      participant.member2_phone || '',
      participant.member2_email || '',
      participant.member2_year || '',
      participant.member3_name || '',
      participant.member3_college || '',
      participant.member3_department || '',
      participant.member3_phone || '',
      participant.member3_email || '',
      participant.member3_year || '',
      participant.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(','))
      .join('\n');

    const fileName = `round1_teams_scores_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting participants:', error);
    return NextResponse.json({ error: 'Failed to export participants' }, { status: 500 });
  }
}
