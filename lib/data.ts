import { createAdminClient, } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { demoPosts, type Post } from "@/lib/types";

export async function getPosts(options: { search?: string; category?: string; language?: string; sort?: string; limit?: number } = {}): Promise<Post[]> {
  const { search, category, language, sort, limit } = options;
  if (!isSupabaseConfigured()) {
    let rows = [...demoPosts];
    if (search) rows = rows.filter((post) => `${post.title} ${post.content} ${post.author_name}`.toLowerCase().includes(search.toLowerCase()));
    if (category) rows = rows.filter((post) => post.category === category);
    if (language) rows = rows.filter((post) => post.language === language);
    rows.sort((a, b) => sort === "popular" ? b.view_count - a.view_count : Date.parse(b.published_at) - Date.parse(a.published_at));
    return limit ? rows.slice(0, limit) : rows;
  }
  const db = createAdminClient();
  let query = db.from("posts").select("id,slug,title,author_name,class_name,section,category,language,content,cover_image,published_at,view_count").eq("status", "published");
  if (search) { const term = search.replace(/[,%()]/g, " ").trim().slice(0, 100); query = query.or(`title.ilike.%${term}%,content.ilike.%${term}%,author_name.ilike.%${term}%`); }
  if (category) query = query.eq("category", category);
  if (language) query = query.eq("language", language);
  query = sort === "popular" ? query.order("view_count", { ascending: false }) : query.order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function getPost(slug: string): Promise<Post | null> {
  let normalizedSlug = slug;
  try { normalizedSlug = decodeURIComponent(slug); } catch {}
  if (!isSupabaseConfigured()) return demoPosts.find((post) => post.slug === normalizedSlug) ?? null;
  const { data, error } = await createAdminClient().from("posts").select("*").eq("slug", normalizedSlug).eq("status", "published").maybeSingle();
  if (error) throw new Error(error.message);
  return data as Post | null;
}
