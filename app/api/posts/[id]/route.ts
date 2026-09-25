import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { PostStatus } from "@/lib/types";

const transitions: Record<string, { from: PostStatus; to: PostStatus }> = {
  approve: { from: "pending", to: "published" },
  reject: { from: "pending", to: "rejected" },
  archive: { from: "published", to: "archived" },
};

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user || user.app_metadata.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
  let action: string;
  try {
    const body = await request.json();
    action = typeof body.action === "string" ? body.action : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const transition = transitions[action];
  if (!transition) return NextResponse.json({ error: "Unsupported post action." }, { status: 400 });

  const db = createAdminClient();
  const update: { status: PostStatus; published_at?: string } = { status: transition.to };
  if (action === "approve") update.published_at = new Date().toISOString();
  const { data, error } = await db.from("posts").update(update).eq("id", id).eq("status", transition.from).select("id,status").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update the post." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "This post has already changed state. Refresh and try again." }, { status: 409 });
  return NextResponse.json({ ok: true, status: data.status });
}
