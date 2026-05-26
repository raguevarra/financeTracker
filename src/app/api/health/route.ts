/*
GET route to check that the API service is healthy
*/
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: Add a lightweight Prisma query here once the database is migrated.

  // Return a simple service health response
  return NextResponse.json({
    ok: true,
    service: "finance-tracker",
  });
}
