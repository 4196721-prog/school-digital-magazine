import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Eye } from "lucide-react";
import { getPost, getPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PostCard } from "@/components/post-card";
import { ViewTracker } from "@/components/view-tracker";
import { ShareButton } from "@/components/share-button";

function createDescription(content: string) {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;

  const excerpt = normalized.slice(0, 160);
  const sentence = excerpt.match(/^.*?[.!?۔](?=\s|$)/u)?.[0]?.trim();
  if (sentence) return sentence;

  const lastSpace = excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0, lastSpace > 0 ? lastSpace : excerpt.length).trimEnd()}…`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const description = post ? createDescription(post.content) : undefined;
  return post ? { title: post.title, description, openGraph: { title: post.title, description, images: post.cover_image ? [post.cover_image] : [] } } : { title: "Story not found" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = (await getPosts({ category: post.category, limit: 4 })).filter((item) => item.id !== post.id).slice(0, 3);
  const rtl = post.language === "Urdu";

  return <main className="article-page">
    <ViewTracker postId={post.id}/>
    <div className="article-topline"><Link href="/articles" className="back-link"><ArrowLeft size={15}/> ALL STORIES</Link><span>THE SCHOOL JOURNAL <i/> FEATURE</span></div>
    <header className="article-header" dir={rtl ? "rtl" : "ltr"}>
      <div className="article-category"><span>{post.category}</span><i/><span>{post.language}</span></div>
      <h1>{post.title}</h1>
      <div className="article-byline">
        <span className="author-monogram">{post.author_name.slice(0, 1)}</span>
        <span className="article-author"><b>{post.author_name}</b><small>CLASS {post.class_name} · SECTION {post.section}</small></span>
        <span className="article-date"><small>ISSUE 01 · {formatDate(post.published_at)}</small><span><Eye size={14}/> {post.view_count.toLocaleString()} reads</span></span>
      </div>
    </header>
    {post.cover_image && <div className="article-cover" role="img" aria-label={`Cover image for ${post.title}`} style={{ backgroundImage: `url("${post.cover_image}")` }}><span>THE SCHOOL JOURNAL · {post.category.toUpperCase()}</span></div>}
    <div className="article-reading-layout">
      <aside className="article-margin-note"><span>01</span><i/> A STUDENT VOICE<br/>IN THE JOURNAL</aside>
      <article className={`article-content ${rtl ? "rtl-content" : ""}`} dir={rtl ? "rtl" : "ltr"}>
        {post.content.split(/\n\n+/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </article>
    </div>
    <div className="article-share"><span>PASS THE STORY ALONG</span><ShareButton slug={post.slug}/><Link href="/submit" className="article-submit-link">Add your voice <ArrowUpRight size={14}/></Link></div>
    {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">KEEP READING</span><h2>More from <em>{post.category.toLowerCase()}.</em></h2></div><Link href={`/category/${encodeURIComponent(post.category)}`} className="text-link">EXPLORE SECTION <ArrowUpRight size={14}/></Link></div><div className="story-grid">{related.map((item) => <PostCard key={item.id} post={item}/>)}</div></section>}
  </main>;
}
