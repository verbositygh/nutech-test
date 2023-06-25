import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = (await request.json()).token
  const authToken = await prismaClient.authToken.findUniqueOrThrow({ where: { token }, include: { user: true } });
  return NextResponse.json(authToken.user);
}
