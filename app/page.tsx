import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { categories } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPosts({ sort: "latest", limit: 30 });
  const [lead, ...latest] = posts;
  const categoryRows = categories.map((category) => ({
    category,
    count: posts.filter((post) => post.category === category).length,
    latest: posts.find((post) => post.category === category),
  }));
  const shelves = categoryRows.filter((row) => row.latest).slice(0, 4);

  return <main className="home-page">
    <section className="home-hero">
      <div className="issue-line"><span>THE SCHOOL JOURNAL</span><i/> <span>ISSUE 01 · 2026</span><span className="issue-line-right">MADE HERE, READ EVERYWHERE</span></div>
      <div className="hero-composition">
        <div className="hero-intro">
          <span className="eyebrow"><Sparkles size={13}/> AN OPEN PAGE FOR EVERY VOICE</span>
          <h1>A school in<br/><em>full expression.</em></h1>
          <p>Ideas from the classroom, the courtyard and everywhere in between. Made by students, shared with the world.</p>
          <Link href="/submit" className="hero-submit">Your voice belongs here <ArrowUpRight size={16}/></Link>
          <div className="hero-footnote"><span>WORDS · IMAGES · IDEAS</span><span>EST. MMXXVI</span></div>
        </div>
        <div className="hero-feature-wrap">
          <span className="feature-annotation">ON THE COVER <b>01</b></span>
          {lead ? <Link href={`/articles/${lead.slug}`} className="hero-feature">
            <div className={`hero-picture${lead.cover_image ? " has-image" : " no-image"}`} style={lead.cover_image ? { backgroundImage: `url("${lead.cover_image}")` } : undefined}>
              <span className="hero-picture-label">FEATURED STORY</span><span className="hero-picture-mark">S<span>J</span></span>
            </div>
            <div className="hero-feature-copy" dir={lead.language === "Urdu" ? "rtl" : "ltr"}>
              <div className="eyebrow">{lead.category} <span>·</span> {lead.language}</div>
              <h2>{lead.title}</h2><p>{lead.content.replace(/\n/g, " ").slice(0, 150)}{lead.content.length > 150 ? "…" : ""}</p>
              <div className="byline"><span>BY <b>{lead.author_name}</b> · CLASS {lead.class_name} {lead.section}</span><span>READ THE STORY <ArrowRight size={14}/></span></div>
            </div>
          </Link> : <div className="hero-empty">
            <div className="empty-monogram">S<span>J</span></div><span className="eyebrow">THE FIRST EDITION IS OPEN</span>
            <h2>There’s room<br/>for your story.</h2><p>The journal is ready for its next voice. Publish a poem, a photograph, an idea or a story.</p>
            <Link href="/submit" className="text-link">WRITE THE OPENING STORY <ArrowUpRight size={14}/></Link>
          </div>}
        </div>
      </div>
      <div className="hero-index"><span>01 — STUDENT VOICES, WITHOUT A GATE</span><span>{String(posts.length).padStart(2, "0")} RECENT STORIES</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>

    <section className="latest-section page-section">
      <div className="section-heading"><div><span className="eyebrow">FRESH FROM THE JOURNAL</span><h2>New on <em>the page.</em></h2></div><Link href="/articles" className="text-link">THE FULL INDEX <ArrowRight size={15}/></Link></div>
      {latest.length ? <div className="latest-grid">{latest.slice(0, 3).map((post, index) => <PostCard key={post.id} post={post} variant={index === 0 ? "feature-card" : ""}/>)}</div> : <div className="latest-empty"><span className="empty-rule"/><p>Every issue starts somewhere.<br/><Link href="/submit">Make the next story yours <ArrowUpRight size={14}/></Link></p></div>}
    </section>

    <section className="category-section page-section">
      <div className="section-heading"><div><span className="eyebrow">EIGHT WAYS TO SEE IT</span><h2>Find your <em>corner.</em></h2></div><p>From sharp ideas to quiet moments, there’s a place for every kind of making.</p></div>
      <div className="category-index">{categoryRows.map(({ category, count, latest: item }, index) => <Link key={category} href={`/category/${encodeURIComponent(category)}`} className={`category-index-row category-row-${index + 1}`}>
        <span className="category-number">0{index + 1}</span><span className="category-name">{category}</span>
        <span className="category-latest">{item?.title ?? ""}</span><span className="category-count">{String(count).padStart(2, "0")} {count === 1 ? "STORY" : "STORIES"}</span><ArrowUpRight className="category-arrow" size={17}/>
      </Link>)}</div>
    </section>

    {shelves.length > 0 && <section className="voices-section page-section">
      <div className="section-heading"><div><span className="eyebrow">A FEW WAYS IN</span><h2>Read around. <em>Stay curious.</em></h2></div></div>
      <div className="voices-grid">{shelves.map(({ category, latest: post }, index) => post && <Link href={`/articles/${post.slug}`} key={category} className={`voice-tile voice-tile-${index + 1}`} dir={post.language === "Urdu" ? "rtl" : "ltr"}>
        <span className="eyebrow">{category} <i/> {post.language}</span><h3>{post.title}</h3><p>{post.content.replace(/\n/g, " ").slice(0, 100)}{post.content.length > 100 ? "…" : ""}</p><span className="voice-author">{post.author_name} · CLASS {post.class_name}</span><ArrowUpRight className="voice-arrow" size={17}/>
      </Link>)}</div>
    </section>}

    <section className="contribute-band"><div><span className="eyebrow">THE NEXT PAGE IS YOURS</span><h2>Make something.<br/><em>Let it be seen.</em></h2></div><p>A poem, a photograph, a small discovery, a big question. Your work belongs in the journal.</p><Link href="/submit" className="contribute-link">Submit your work <ArrowUpRight size={17}/></Link><span className="contribute-seal">OPEN<br/>SUBMISSIONS<br/><b>ALWAYS</b></span></section>
  </main>;
}
