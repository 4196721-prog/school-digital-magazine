import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Sparkles, BookOpen, PenLine } from "lucide-react";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { HeroSection } from "@/components/hero-section";
import { CategoryPanel } from "@/components/category-panel";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const posts = await getPosts({ sort: "latest", limit: 20 });
  const [lead, ...latest] = posts;

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#111827]">
      {/* 1. Cinematic Hero Section with Clean Background and HTML UI */}
      <HeroSection />

      {/* 2. Explore by Category Panel */}
      <CategoryPanel />

      {/* 3. Featured Story Spotlight (if any lead post exists) */}
      {lead && (
        <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8EEF5]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.2em] font-bold text-[#0F2952] uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-[#C59B4B]" />
                FEATURED STORY · ISSUE 01
              </span>
              <span className="w-12 h-[1px] bg-[#C59B4B] rounded-full hidden sm:inline-block" />
            </div>
            <Link
              href="/articles"
              className="text-xs md:text-sm font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors flex items-center gap-1 group"
            >
              <span>Explore All</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[#E5E9F0] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Cover */}
            <div className="relative lg:col-span-7 min-h-[320px] lg:min-h-[460px] bg-[#0F2952] overflow-hidden group">
              {lead.cover_image ? (
                <Image
                  src={lead.cover_image}
                  alt={lead.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F2952] via-[#1E3A6E] to-[#C59B4B]/70 flex items-center justify-center p-8 text-center text-white">
                  <div className="font-serif italic text-4xl opacity-20">MSB BHS JOURNAL</div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#0B1B3D]/80 backdrop-blur-md border border-white/20">
                  {lead.category}
                </span>
                <span className="font-mono text-xs opacity-90">{formatDate(lead.published_at)}</span>
              </div>
            </div>

            {/* Story Details */}
            <div
              className="lg:col-span-5 p-7 sm:p-10 lg:p-12 flex flex-col justify-center"
              dir={lead.language === "Urdu" ? "rtl" : "ltr"}
            >
              <div className="flex items-center gap-2 text-xs font-mono text-[#C59B4B] font-bold tracking-widest uppercase mb-3">
                <span>{lead.category}</span>
                <span>·</span>
                <span>{lead.language}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F2952] hover:text-[#C59B4B] transition-colors leading-tight">
                <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#475569] leading-relaxed line-clamp-4">
                {lead.content.replace(/\n/g, " ").slice(0, 240)}…
              </p>

              {/* Byline */}
              <div className="mt-8 pt-6 border-t border-[#F1F4F9] flex items-center justify-between">
                <div>
                  <span className="block text-xs font-mono text-[#8E9CAE] uppercase tracking-wider">
                    WRITTEN BY
                  </span>
                  <span className="text-sm font-bold text-[#0F2952]">
                    {lead.author_name} · Class {lead.class_name} {lead.section}
                  </span>
                </div>

                <Link
                  href={`/articles/${lead.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2952] text-white text-xs font-semibold hover:bg-[#C59B4B] transition-colors shadow-sm group"
                >
                  <span>Read Story</span>
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Latest Stories Grid */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8EEF5]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-[0.2em] font-bold text-[#0F2952] uppercase">
              NEW ON THE PAGE
            </span>
            <span className="w-12 h-[1px] bg-[#C59B4B] rounded-full hidden sm:inline-block" />
          </div>
          <Link
            href="/articles"
            className="text-xs md:text-sm font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors flex items-center gap-1 group"
          >
            <span>All Publications</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {latest.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {latest.slice(0, 6).map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E5E9F0] p-12 text-center max-w-xl mx-auto my-8">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4F6F9] text-[#0F2952] mb-4">
              <BookOpen size={22} />
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#0F2952]">
              Every Issue Starts Somewhere
            </h3>
            <p className="mt-2 text-sm text-[#64748B] max-w-md mx-auto">
              Be the first to publish a poem, article, story, or photograph in the MSB BHS Digital Magazine.
            </p>
            <Link
              href="/submit"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F2952] text-white text-sm font-semibold hover:bg-[#C59B4B] transition-colors"
            >
              <span>Submit Your Voice</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </section>

      {/* 5. Editorial Vision & Submission Banner */}
      <section className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 my-20 md:my-28">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0B1B3D] via-[#10254C] to-[#0A1735] text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C59B4B]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
              OPEN SUBMISSIONS · MSB HAIDERY &amp; BADRI HIGH SCHOOL
            </span>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              From Pen to Page, <br />
              <span className="text-[#C59B4B] italic">From Ideas to Impact.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#CBD5E1] leading-relaxed">
              Every poem, photograph, reflective article, and inventive thought has a home in this journal. Share your perspective and leave your mark on the school community.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C59B4B] text-[#0B1B3D] text-sm font-bold shadow-lg hover:bg-white hover:text-[#0B1B3D] transition-all duration-200"
              >
                <PenLine size={16} />
                <span>Submit Your Work</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/20 transition-colors"
              >
                <span>About the Magazine</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
