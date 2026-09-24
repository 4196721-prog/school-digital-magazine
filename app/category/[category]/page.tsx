import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories } from "@/lib/types";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category } = await params; return { title: category }; }
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!categories.includes(category as (typeof categories)[number])) notFound();
  const posts = await getPosts({ category });
  return <main className="listing-page"><div className="listing-intro"><span className="eyebrow">EXPLORE · {category.toUpperCase()}</span><h1>{category}<br/><em>from our halls.</em></h1><p>Work and words from our student community.</p></div>{posts.length ? <div className="story-grid listing-grid">{posts.map((post) => <PostCard key={post.id} post={post}/>)}</div> : <div className="empty-state"><h2>The page is still taking shape.</h2><p>Be the first to share something in {category.toLowerCase()}.</p><a href="/submit" className="dark-button">Submit your work ↗</a></div>}</main>;
}
