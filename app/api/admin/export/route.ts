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
    const participants = getAllParticipants();

    const headers = [
      'ID',
      'Name',
      'Team',
      'College',
      'Department',
      'Phone',
      'Email',
      'Year',
      'Assigned Round',
      'Round 1 Score',
      'Round 1 Completed',
      'Round 2 Score',
      'Round 2 Completed',
      'Created At',
    ];

    const rows = participants.map((participant) => [
      participant.id,
      participant.name,
      participant.team_name || '',
      participant.college || '',
      participant.department || '',
      participant.phone || '',
      participant.email || '',
      participant.year || '',
      participant.assigned_round || '',
      participant.round1_score ?? 0,
      participant.round1_completed ? 'Yes' : 'No',
      participant.round2_score ?? 0,
      participant.round2_completed ? 'Yes' : 'No',
      participant.created_at,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => csvEscape(cell)).join(','))
      .join('\n');

    const fileName = `participants_export_${new Date().toISOString().slice(0, 10)}.csv`;

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
