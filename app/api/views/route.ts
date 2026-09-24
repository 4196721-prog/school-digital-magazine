import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return new NextResponse(null, { status: 204 });
  try {
    const { postId } = await request.json(); if (typeof postId !== "string" || !/^[0-9a-f-]{36}$/i.test(postId)) return new NextResponse(null, { status: 204 });
    const viewer = request.cookies.get("magazine_reader")?.value ?? crypto.randomUUID();
    await createAdminClient().rpc("record_post_view", { p_post_id: postId, p_viewer_id: viewer });
    const response = new NextResponse(null, { status: 204 });
    if (!request.cookies.has("magazine_reader")) response.cookies.set("magazine_reader", viewer, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
    return response;
  } catch { return new NextResponse(null, { status: 204 }); }
}
