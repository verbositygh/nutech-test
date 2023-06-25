import { NextRequest, NextResponse } from "next/server";
import authentication from "./app/api/authentication";

export const config = {
  matcher: ['/api/goods/:path*', '/api/users/logout']
}

export async function middleware(request: NextRequest) {
  try {
    const authData = await authentication(request);
    const headers = new Headers(request.headers);
    headers.set('X-Middleware-UID', authData.payload.id as string);
    return NextResponse.next({
      headers
    });
  } catch (e) {
    return NextResponse.json({ error: 'Token is invalid' }, { status: 403 });
  }
}
