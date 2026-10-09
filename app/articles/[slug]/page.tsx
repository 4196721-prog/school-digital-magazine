import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Eye, Calendar } from "lucide-react";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const description = post ? createDescription(post.content) : undefined;
  return post
    ? {
        title: post.title,
        description,
        openGraph: {
          title: post.title,
          description,
          images: post.cover_image ? [post.cover_image] : [],
        },
      }
    : { title: "Story not found" };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = (await getPosts({ category: post.category, limit: 4 }))
    .filter((item) => item.id !== post.id)
    .slice(0, 3);
  const rtl = post.language === "Urdu" || post.language === "Lisan ud-Dawat";

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-10 md:py-16">
      {/* View Tracking Component */}
      <ViewTracker postId={post.id} />

      <article className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E8EEF5]">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to All Works</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
            <span className="uppercase tracking-wider font-bold text-[#0F2952]">{post.category}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />
            <span>{post.language}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className={`mb-10 ${rtl ? "text-right" : "text-left"}`} dir={rtl ? "rtl" : "ltr"}>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#0F2952] leading-[1.12] tracking-tight">
            {post.title}
          </h1>

          {/* Byline and Stats */}
          <div className="mt-8 pt-6 border-t border-[#E8EEF5] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#0F2952] text-[#C59B4B] font-serif font-bold text-lg flex items-center justify-center shadow-sm">
                {post.author_name.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <span className="block font-bold text-sm sm:text-base text-[#0F2952]">
                  {post.author_name}
                </span>
                <span className="block text-xs font-mono text-[#64748B]">
                  Class {post.class_name} · Section {post.section}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[#C59B4B]" />
                {formatDate(post.published_at)}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#0F2952]">
                <Eye size={14} className="text-[#C59B4B]" />
                {post.view_count.toLocaleString()} reads
              </span>
            </div>
          </div>
        </header>

        {/* Cover Image (if present) */}
        {post.cover_image && (
          <div className="relative aspect-[16/9] w-full rounded-2xl md:rounded-3xl overflow-hidden mb-12 shadow-md bg-[#EEF2F7]">
            <Image
              src={post.cover_image}
              alt={`Cover image for ${post.title}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className={`prose prose-lg max-w-none text-[#1E293B] font-serif text-lg sm:text-xl leading-[1.9] sm:leading-[2.05] ${
            rtl ? "text-right font-urdu text-xl sm:text-2xl leading-[2.3]" : ""
          }`}
          dir={rtl ? "rtl" : "ltr"}
        >
          {post.content.split(/\n\n+/).map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Social Share and Contribution Footer */}
        <div className="mt-14 pt-8 border-t border-[#E8EEF5] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShareButton slug={post.slug} />
          </div>

          <Link
            href="/submit"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors"
          >
            <span>Have a story to tell? Submit your voice</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Related Works in this category */}
        {related.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8EEF5]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-mono text-xs tracking-[0.2em] font-bold text-[#C59B4B] uppercase">
                  EXPLORE MORE
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#0F2952] mt-1">
                  More from {post.category}
                </h3>
              </div>

              <Link
                href={`/category/${encodeURIComponent(post.category)}`}
                className="text-xs font-semibold text-[#0F2952] hover:text-[#C59B4B] transition-colors flex items-center gap-1"
              >
                <span>View Section</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <PostCard key={item.id} post={item} />
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
