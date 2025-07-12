import { baseServerUrl } from "@/lib/api";
import { TIME_15_MINS, TIME_2_DAYS } from "@repo/dto";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  const headers: any = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  if (refreshToken) {
    headers["Cookie"] = `refresh_token=${refreshToken}`;
  }

  const response = await fetch(`${baseServerUrl}/admin/auth/check-access`, {
    method: "GET",
    headers: headers,
    credentials: "include",
  });

  const { ok, tokens, message } = await response.json();

  if (!ok) {
    return NextResponse.redirect(
      new URL(`/?auth=failed&message=${encodeURIComponent(message)}`, req.url),
    );
  }

  const responseNext = NextResponse.next();
  const isProd = process.env.NEXT_PUBLIC_NODE_ENV === "production";

  responseNext.cookies.set({
    name: "access_token",
    value: tokens.accessToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: TIME_15_MINS,
  });

  responseNext.cookies.set({
    name: "refresh_token",
    value: tokens.refreshToken,
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: TIME_2_DAYS,
  });

  return responseNext;
}

export const config = {
  matcher: ["/admin/:path*"],
};
