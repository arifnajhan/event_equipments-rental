// libs/authUtils.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

export async function authenticateRequest() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    };
  }

  return { session };
}