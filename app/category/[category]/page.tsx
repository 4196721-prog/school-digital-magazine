import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { categories, displayCategories, categoryMeta, DisplayCategory } from "@/lib/types";
import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/post-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  return {
    title: `${category} — MSB BHS Digital Magazine`,
    description: `Explore student contributions in ${category} from MSB Haidery and Badri High School.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);

  const isValidCategory =
    displayCategories.includes(category as DisplayCategory) ||
    categories.includes(category as (typeof categories)[number]);

  if (!isValidCategory) notFound();

  const posts = await getPosts({ category });
  const meta = categoryMeta[category as DisplayCategory];

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 md:py-20">
      <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Categories</span>
          </Link>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
            SECTION · {category.toUpperCase()}
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F2952] leading-tight">
            {category}
          </h1>
          <p className="mt-3 text-base text-[#475569] font-serif leading-relaxed">
            {meta?.description || `Explore student contributions in ${category.toLowerCase()} from our community.`}
          </p>
        </div>

        {/* Grid or Empty State */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E5E9F0] p-12 text-center max-w-xl mx-auto my-12 shadow-sm">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4F6F9] text-[#0F2952] mb-4">
              <BookOpen size={22} />
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#0F2952]">
              The {category} Desk is Open
            </h2>
            <p className="mt-2 text-sm text-[#64748B] max-w-md mx-auto">
              Be the first contributor from MSB Haidery or Badri High School to share your work in this section.
            </p>
            <div className="mt-6">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F2952] text-white text-xs sm:text-sm font-semibold hover:bg-[#C59B4B] transition-colors shadow-sm"
              >
                <span>Submit to {category}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
