import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Add a lightweight Prisma query here once the database is migrated.
  return NextResponse.json({
    ok: true,
    service: "finance-tracker",
  });
}

