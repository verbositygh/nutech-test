import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import * as jose from 'jose';
import getKeyArray from "@/app/lib/getKeyArray";

export async function POST(request: NextRequest) {
  const uId = (await request.json()).id ?? '';
  const user = await prismaClient.user.findUniqueOrThrow({ where: { id: uId } });
  const jwt = await new jose.SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(getKeyArray(process.env.JWT_KEY as unknown as string));
  const authToken = await prismaClient.authToken.create({
    data: {
      user: {
        connect: user,
      },
      token: jwt,
    },
    include: {
      user: true,
    }
  })
  return NextResponse.json(authToken);
}
