import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { categories, languages, type PostStatus } from "@/lib/types";
import { z } from "zod";

const transitions: Record<string, { from: PostStatus; to: PostStatus }> = {
  approve: { from: "pending", to: "published" },
  reject: { from: "pending", to: "rejected" },
  archive: { from: "published", to: "archived" },
};
const editSchema = z.object({
  action: z.literal("edit"),
  title: z.string().trim().min(2).max(140),
  content: z.string().trim().min(10).max(20000),
  category: z.enum(categories),
  language: z.enum(languages),
  author_name: z.string().trim().min(2).max(90),
  class_name: z.string().trim().min(1).max(20),
  section: z.string().trim().min(1).max(20),
}).strict();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user || user.app_metadata.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid post ID." }, { status: 400 });
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const action = typeof body === "object" && body !== null && "action" in body && typeof body.action === "string" ? body.action : "";
  if (action === "edit") {
    const parsed = editSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Check the title, story, category, language, and author details." }, { status: 400 });
    const { data, error } = await createAdminClient().rpc("edit_pending_post", {
      p_post_id: id,
      p_editor_id: user.id,
      p_title: parsed.data.title,
      p_content: parsed.data.content,
      p_category: parsed.data.category,
      p_language: parsed.data.language,
      p_author_name: parsed.data.author_name,
      p_class_name: parsed.data.class_name,
      p_section: parsed.data.section,
    });
    if (error) return NextResponse.json({ error: "Could not save the edited submission." }, { status: 500 });
    if (!data) return NextResponse.json({ error: "This submission is no longer pending. Refresh the queue before editing." }, { status: 409 });
    return NextResponse.json({ ok: true, ...data });
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
