import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = { title: "All stories" };
export const dynamic = "force-dynamic";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; language?: string; sort?: string }> }) {
  const params = await searchParams;
  const posts = await getPosts({ search: params.q, category: params.category, language: params.language, sort: params.sort });
  const filtered = Boolean(params.q || params.category || params.language);
  return <main className="listing-page">
    <div className="listing-intro"><span className="eyebrow">THE JOURNAL · INDEX</span><h1>Every story<br/><em>has a place.</em></h1><p>Words, images and ideas from the people in our halls.</p></div>
    <form className="filter-bar" action="/articles"><input name="q" defaultValue={params.q} placeholder="Search stories, names, ideas…" aria-label="Search stories"/><select name="category" defaultValue={params.category ?? ""} aria-label="Filter by category"><option value="">All categories</option>{["Articles","Blogs","Poetry","Stories","Artwork","Photography","School Activities","Achievements"].map((category) => <option key={category}>{category}</option>)}</select><select name="language" defaultValue={params.language ?? ""} aria-label="Filter by language"><option value="">Every language</option><option>English</option><option>Urdu</option></select><select name="sort" defaultValue={params.sort ?? "latest"} aria-label="Sort stories"><option value="latest">Latest</option><option value="popular">Most read</option></select><button>Search <ArrowUpRight size={14}/></button></form>
    {posts.length ? <div className="story-grid listing-grid">{posts.map((post) => <PostCard key={post.id} post={post}/>)}</div> : <div className="empty-state"><span className="eyebrow">{filtered ? "NO MATCHES IN THIS ISSUE" : "THE FIRST ISSUE IS OPEN"}</span><h2>{filtered ? "Nothing on this page yet." : "The journal is ready for its first story."}</h2><p>{filtered ? "Try another search or filter, or add a story to the section." : "Student work appears here as soon as it is published. Add a poem, photograph, idea or story to begin."}</p><Link href="/submit" className="text-link">SUBMIT YOUR WORK <ArrowUpRight size={14}/></Link></div>}
  </main>;
}
