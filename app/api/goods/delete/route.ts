import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const uId = request.headers.get('X-Middleware-UID') ?? '';
  const payload = await request.json();
  const found = await prismaClient.good.findFirstOrThrow({where: {id: payload.id, userId: uId}});
  const data = await prismaClient.good.delete({ where: { name_userId: {name: found.name, userId: uId} } });
  return NextResponse.json(data)
}

