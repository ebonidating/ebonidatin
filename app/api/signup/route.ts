import { start } from "@/workflow/api";

export const dynamic = 'force-dynamic'
import { handleUserSignup } from "@/workflows/user-signup";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  await start(handleUserSignup, [email]);
  return NextResponse.json({ message: "User signup workflow started" });
}
