import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";

export const metadata: Metadata = {
  title: "Search the Journal — MSB BHS Digital Magazine",
  description: "Search articles, stories, poetry, and student perspectives.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const posts = q.trim() ? await getPosts({ search: q.trim() }) : [];

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
            SEARCH THE JOURNAL
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F2952]">
            Find Your Next Read
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#475569] font-serif">
            Search by keyword, author name, topic, or category.
          </p>

          {/* Search Form */}
          <form action="/search" method="GET" className="mt-8 relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E9CAE]" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Search articles, poetry, stories, artwork…"
              className="w-full pl-12 pr-28 py-3.5 rounded-full bg-white border border-[#D5DDE8] focus:border-[#C59B4B] focus:ring-2 focus:ring-[#0F2952]/10 focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] shadow-sm"
              autoFocus={!q}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-[#0F2952] text-white text-xs font-semibold hover:bg-[#C59B4B] transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {q && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between pb-3 border-b border-[#E8EEF5]">
              <span className="text-xs font-mono text-[#64748B]">
                Found <b>{posts.length}</b> {posts.length === 1 ? "result" : "results"} for “{q}”
              </span>
            </div>

            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E5E9F0] p-12 text-center max-w-md mx-auto my-12 shadow-sm">
                <h3 className="font-serif text-xl font-bold text-[#0F2952]">No Matches Found</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#64748B]">
                  We couldn’t find any stories matching “{q}”. Try another search term or explore all publications.
                </p>
                <Link
                  href="/articles"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F2952] text-white text-xs font-semibold hover:bg-[#C59B4B] transition-colors"
                >
                  <span>Browse All Stories</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
