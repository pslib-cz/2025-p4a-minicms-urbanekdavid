import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { analytics } = body;

  return NextResponse.json({ success: true, analytics: !!analytics });
}
