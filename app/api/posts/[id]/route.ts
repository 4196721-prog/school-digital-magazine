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
  const db = createAdminClient();
  if (["promote", "lower", "reset-rank", "feature", "unfeature"].includes(action)) {
    const { data, error } = await db.rpc("update_published_post_editorial", {
      p_post_id: id,
      p_action: action,
    });
    if (error) return NextResponse.json({ error: "Could not update this story's editorial settings." }, { status: 500 });
    const updated = Array.isArray(data) ? data[0] : data;
    if (!updated) return NextResponse.json({ error: "Only published stories can be ranked or featured." }, { status: 409 });
    return NextResponse.json({
      ok: true,
      editorial_rank: updated.editorial_rank,
      editorial_featured: updated.editorial_featured,
    });
  }
  if (!transition) return NextResponse.json({ error: "Unsupported post action." }, { status: 400 });

  const update: { status: PostStatus; published_at?: string } = { status: transition.to };
  if (action === "approve") update.published_at = new Date().toISOString();
  const { data, error } = await db.from("posts").update(update).eq("id", id).eq("status", transition.from).select("id,status").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update the post." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "This post has already changed state. Refresh and try again." }, { status: 409 });
  return NextResponse.json({ ok: true, status: data.status });
}
