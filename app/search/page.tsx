import type { Metadata } from "next";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";
export const metadata: Metadata = { title: "Search the journal" };
export const dynamic = "force-dynamic";
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const { q = "" } = await searchParams; const posts = q ? await getPosts({ search: q }) : []; return <main className="listing-page"><div className="listing-intro"><span className="eyebrow">LOOKING FOR SOMETHING?</span><h1>Find your<br/><em>next read.</em></h1></div><form className="search-page-form" action="/search"><input name="q" defaultValue={q} placeholder="Try a name, a category, an idea…"/><button>Search ↗</button></form>{q && (posts.length ? <div className="story-grid listing-grid">{posts.map((post) => <PostCard key={post.id} post={post}/>)}</div> : <div className="empty-state"><h2>No matches yet.</h2><p>Try another word, or browse all stories.</p></div>)}</main>; }
