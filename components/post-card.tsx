import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post, variant = "" }: { post: Post; variant?: string }) {
  const rtl = post.language === "Urdu" || post.language === "Lisan ud-Dawat";

  return (
    <article
      className={`group flex flex-col bg-white rounded-2xl border border-[#E5E9F0] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C59B4B]/50 transition-all duration-300 hover:-translate-y-1 ${variant} ${
        rtl ? "text-right" : "text-left"
      }`}
    >
      {/* Card Image */}
      <Link
        href={`/articles/${post.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-[#EEF2F7]"
        aria-label={`Read story: ${post.title}`}
      >
        {post.cover_image ? (
          <Image
            src={post.cover_image}
            alt={`Cover image for ${post.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-106"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F2952] via-[#1A3868] to-[#C59B4B]/80 flex items-center justify-center p-6 text-white text-center">
            <span className="font-serif italic text-3xl font-light opacity-30 select-none">
              MSB BHS
            </span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3D]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category & Language Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-white/95 text-[#0F2952] shadow-sm">
            {post.category}
          </span>
          {post.language && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-[#0B1B3D]/80 backdrop-blur-sm text-white">
              {post.language}
            </span>
          )}
        </div>

        {/* Floating Circular Arrow */}
        <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white text-[#0F2952] flex items-center justify-center shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 md:p-6" dir={rtl ? "rtl" : "ltr"}>
        {/* Meta Byline */}
        <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2.5">
          <span className="font-semibold text-[#0F2952]">{post.author_name}</span>
          <span>{formatDate(post.published_at)}</span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg md:text-xl font-bold text-[#0F2952] group-hover:text-[#C59B4B] transition-colors line-clamp-2 leading-snug">
          <Link href={`/articles/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p
          className={`mt-2 text-xs md:text-sm text-[#475569] line-clamp-2 leading-relaxed flex-1 ${
            rtl ? "font-serif text-base" : "font-sans"
          }`}
        >
          {post.content.replace(/\n/g, " ").slice(0, 140)}
          {post.content.length > 140 ? "…" : ""}
        </p>

        {/* Bottom Bar: Class details and View count */}
        <div className="mt-4 pt-3.5 border-t border-[#F1F4F9] flex items-center justify-between text-xs text-[#64748B] font-mono">
          <span>
            CLASS {post.class_name} · {post.section}
          </span>

          <span className="flex items-center gap-1.5 text-[#0F2952] font-semibold">
            <Eye size={13} className="text-[#C59B4B]" />
            {post.view_count.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}
