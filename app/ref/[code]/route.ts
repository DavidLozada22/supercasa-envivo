import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const clean = code.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "ref";
  const url = new URL("/envivo", request.url);
  url.searchParams.set("ref", clean);
  const response = NextResponse.redirect(url);
  response.cookies.set("sc_ref", clean, {
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
