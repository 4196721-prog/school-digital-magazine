import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, variant = "" }: { post: Post; variant?: string }) {
  const rtl = post.language === "Urdu";
  return <article className={`post-card ${variant}${rtl ? " rtl-card" : ""}`}>
    <Link href={`/articles/${post.slug}`} className="card-image-link" aria-label={`Read ${post.title}`}>
      <div className={`card-image ${post.cover_image ? "has-image" : "no-image"}`} style={post.cover_image ? { backgroundImage: `url("${post.cover_image}")` } : undefined} role="img" aria-label={post.cover_image ? `Cover image for ${post.title}` : "Text-only story"}>
        <span className="image-category">{post.category}</span><span className="image-language">{post.language}</span>
        {!post.cover_image && <span className="no-image-letter">{post.category === "Poetry" ? "¶" : "S"}</span>}
        <span className="card-image-arrow"><ArrowUpRight size={17}/></span>
      </div>
    </Link>
    <div className="card-copy" dir={rtl ? "rtl" : "ltr"}>
      <div className="card-meta"><span>{post.author_name}</span><span>{formatDate(post.published_at)}</span></div>
      <h3><Link href={`/articles/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.content.replace(/\n/g, " ").slice(0, 130)}{post.content.length > 130 ? "…" : ""}</p>
      <div className="card-bottom"><span>CLASS {post.class_name} · {post.section}</span><Link className="read-more" href={`/articles/${post.slug}`}>Read <ArrowUpRight size={14}/></Link></div>
    </div>
  </article>;
}
