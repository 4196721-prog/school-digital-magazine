import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Filter } from "lucide-react";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";
import { displayCategories } from "@/lib/types";

export const metadata: Metadata = {
  title: "Explore the Journal",
  description: "Browse articles, poetry, stories, blogs and artwork from students of MSB Haidery and Badri High School.",
};

export const dynamic = "force-dynamic";

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; language?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const posts = await getPosts({
    search: params.q,
    category: params.category,
    language: params.language,
    sort: params.sort,
  });
  const filtered = Boolean(params.q || params.category || params.language);

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
            THE ARCHIVE · ALL WORKS
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F2952] leading-tight">
            Every Voice. Every Medium.
          </h1>
          <p className="mt-3 text-base text-[#475569] font-serif leading-relaxed">
            Discover articles, poetry, artwork, stories, and reflections from the students of MSB Haidery and Badri High School.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl md:rounded-3xl border border-[#E5E9F0] p-4 sm:p-6 mb-10 shadow-sm">
          <form action="/articles" method="GET" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9CAE]" />
              <input
                name="q"
                defaultValue={params.q}
                placeholder="Search by title, student name, or topic…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F4F6F9] border border-transparent focus:border-[#C59B4B] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0F2952] placeholder-[#8E9CAE]"
              />
            </div>

            {/* Category Dropdown */}
            <div className="lg:col-span-3">
              <select
                name="category"
                defaultValue={params.category ?? ""}
                className="w-full px-4 py-2.5 rounded-full bg-[#F4F6F9] border border-transparent focus:border-[#C59B4B] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0F2952]"
              >
                <option value="">All Categories</option>
                {displayCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Dropdown */}
            <div className="lg:col-span-2">
              <select
                name="language"
                defaultValue={params.language ?? ""}
                className="w-full px-4 py-2.5 rounded-full bg-[#F4F6F9] border border-transparent focus:border-[#C59B4B] focus:bg-white focus:outline-none text-xs sm:text-sm text-[#0F2952]"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Lisan ud-Dawat">Lisan ud-Dawat</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 px-5 rounded-full bg-[#0F2952] hover:bg-[#C59B4B] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Filter size={14} />
                <span>Filter</span>
              </button>
            </div>
          </form>
        </div>

        {/* Posts Grid or Empty State */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E5E9F0] p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-[#0F2952]">
              {filtered ? "No Matches Found" : "The Archive is Ready"}
            </h2>
            <p className="mt-2 text-sm text-[#64748B]">
              {filtered
                ? "Try adjusting your search terms or clearing the category filters."
                : "Student works will appear here as soon as they are approved by the editorial desk."}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              {filtered && (
                <Link
                  href="/articles"
                  className="px-5 py-2.5 rounded-full bg-[#F4F6F9] text-[#0F2952] text-xs font-semibold hover:bg-[#E5E9F0] transition-colors"
                >
                  Clear Filters
                </Link>
              )}
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0F2952] text-white text-xs font-semibold hover:bg-[#C59B4B] transition-colors"
              >
                <span>Submit a Story</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
