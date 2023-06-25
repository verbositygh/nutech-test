import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const uId = request.headers.get('X-Middleware-UID') ?? '';
  const user = await prismaClient.user.findUniqueOrThrow({ where: { id: uId } });
  await prismaClient.user.delete({ where: { id: uId } });
  return NextResponse.json(user);
}

