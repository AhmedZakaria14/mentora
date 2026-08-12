import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
  const mentorId=request.nextUrl.searchParams.get("mentorId");
  if(!mentorId) return NextResponse.json({error:"mentorId is required"},{status:400});
  return NextResponse.json({mentorId,timezone:"Africa/Cairo",slots:["2026-08-12T19:30:00+03:00","2026-08-13T17:00:00+03:00","2026-08-13T19:00:00+03:00"],source:"demo"});
}
