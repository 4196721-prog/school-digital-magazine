import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { categories, languages } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
const recent = new Map<string, number[]>();
const schema = z.object({ author_name: z.string().trim().min(2).max(90), class_name: z.string().trim().min(1).max(20), section: z.string().trim().min(1).max(20), title: z.string().trim().min(2).max(140), category: z.enum(categories), language: z.enum(languages), content: z.string().trim().min(10).max(20000), rights: z.literal("on"), website: z.string().max(0).optional() });
const plain = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  try {
    const db = createAdminClient(); let query = db.from("posts").select("id,slug,title,author_name,class_name,section,category,language,content,cover_image,published_at,view_count").eq("status", "published");
    const rawQ = search.get("q"); const q = rawQ?.replace(/[,%()]/g, " ").trim().slice(0, 100); if (q) query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%,author_name.ilike.%${q}%`);
    const category = search.get("category"); if (category && categories.includes(category as (typeof categories)[number])) query = query.eq("category", category);
    const language = search.get("language"); if (language && languages.includes(language as (typeof languages)[number])) query = query.eq("language", language);
    query = search.get("sort") === "popular" ? query.order("view_count", { ascending: false }) : query.order("published_at", { ascending: false });
    const { data, error } = await query.limit(100); if (error) throw error;
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Stories are temporarily unavailable." }, { status: 503 }); }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Submissions are temporarily unavailable. The editors need to connect the magazine database first." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now(); const attempts = (recent.get(ip) ?? []).filter((time) => now - time < 60 * 60 * 1000);
  if (attempts.length >= 5) return NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
  let uploadPath: string | null = null;
  try {
    const form = await request.formData(); const parsed = schema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) return NextResponse.json({ error: "Please check all required fields and try again." }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ error: "Unable to accept this submission." }, { status: 400 });
    const values = parsed.data; const db = createAdminClient();
    const { data: accepted, error: rateError } = await db.rpc("record_submission_attempt", { p_ip: ip });
    if (rateError) throw new Error("Rate limit check failed");
    if (!accepted) return NextResponse.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
    const uploaded = form.get("cover");
    let coverImage: string | null = null;
    if (uploaded instanceof File && uploaded.size > 0) {
      if (uploaded.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(uploaded.type)) return NextResponse.json({ error: "Choose a JPG, PNG or WebP image under 5 MB." }, { status: 400 });
      const extension = uploaded.type === "image/jpeg" ? "jpg" : uploaded.type.split("/")[1]; uploadPath = `${crypto.randomUUID()}.${extension}`;
      const { error } = await db.storage.from("magazine-covers").upload(uploadPath, uploaded, { contentType: uploaded.type, upsert: false });
      if (error) throw error;
      coverImage = db.storage.from("magazine-covers").getPublicUrl(uploadPath).data.publicUrl;
    }
    const author = plain(values.author_name); const className = plain(values.class_name); const section = plain(values.section);
    const { data: student, error: studentError } = await db.from("students").upsert({ name: author, class_name: className, section }, { onConflict: "name,class_name,section" }).select("id").single();
    if (studentError) throw studentError;
    const title = plain(values.title); const slug = `${slugify(title)}-${crypto.randomUUID().slice(0, 8)}`;
    const { data, error } = await db.from("posts").insert({ slug, title, author_name: author, class_name: className, section, student_id: student.id, category: values.category, language: values.language, content: plain(values.content), cover_image: coverImage, status: "pending" }).select("slug,status").single();
    if (error) throw error;
    attempts.push(now); recent.set(ip, attempts);
    return NextResponse.json({ slug: data.slug, status: data.status }, { status: 201 });
  } catch (error) {
    if (uploadPath) { try { await createAdminClient().storage.from("magazine-covers").remove([uploadPath]); } catch {} }
    console.error("post submission failed", error);
    return NextResponse.json({ error: "We couldn't submit your work just now. Please try again in a moment." }, { status: 500 });
  }
}
