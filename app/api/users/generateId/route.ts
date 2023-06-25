import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await prismaClient.user.create({
    data: {}
  });
  return NextResponse.json(user);
}

