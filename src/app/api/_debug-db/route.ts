export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // ← relative path

export async function GET() {
  try {
    const hasDb = !!process.env.DATABASE_URL;
    const hasDirect = !!process.env.DIRECT_URL;

    const [now] = await prisma.$queryRawUnsafe<any[]>('select now() as now');

    return NextResponse.json({
      ok: true,
      envs: { DATABASE_URL: hasDb, DIRECT_URL: hasDirect },
      dbNow: now?.now ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, name: err?.name, message: err?.message, code: err?.code },
      { status: 500 }
    );
  }
}
