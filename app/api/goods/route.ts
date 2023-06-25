import prismaClient from "@/app/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const uId = request.headers.get('X-Middleware-UID') ?? '';
  const params = new URL(request.url).searchParams;
  const pageParam: number = isNaN(parseInt(params.get('page') ?? '1')) ? 1 : parseInt(params.get('page') ?? '1');
  const searchParam: string = params.get('search') ?? '';
  const page = pageParam < 1 ? 1 : pageParam;
  const perPage = 10;
  const where = {
      userId: uId,
      name: {
        contains: searchParam,
      },
    };
  const count = await prismaClient.good.count({where});
  const goods = await prismaClient.good.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    where,
    orderBy: {
      createdAt: 'desc',
    }
  });
  const pages = Math.ceil(count / perPage);
  return NextResponse.json({
    data: goods,
    perPage: perPage,
    currentPage: page > pages ? 1 : page,
    pages: pages,
    count
  });
}

export async function POST(request: NextRequest) {
  const uId = request.headers.get('X-Middleware-UID') ?? '';
  const payload = await request.json();
  delete payload.id;
  const data = await prismaClient.good.create({
    data: {
      ...payload,
      userId: uId,
    }
  });
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  const uId = request.headers.get('X-Middleware-UID') ?? '';
  const payload = await request.json();
  const payloadWithoutId = { ...payload };
  delete payloadWithoutId.id;
  let data;
  try {
    if (payload.id) {
      const existing = await prismaClient.good.findUnique({ where: { id: payload.id } });
      if (!existing || existing?.userId !== uId) {
        return NextResponse.json({ error: 'Resource does not exist' }, { status: 404 });
      }
      data = await prismaClient.good.update({
        where: { id: payload.id },
        data: {
          ...payloadWithoutId,
          userId: uId,
        }
      });
    } else {
      data = await prismaClient.good.create({
        data: {
          ...payloadWithoutId,
          userId: uId,
        }
      })
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 400 });
  }
}

