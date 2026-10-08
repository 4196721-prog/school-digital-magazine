import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveals } from "@/components/scroll-reveals";
import Link from "next/link";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { MsbLogo, BhsLogo } from "@/components/school-logos";

export const metadata: Metadata = {
  title: {
    default: "MSB BHS Digital Magazine — From Pen to Page, From Ideas to Impact",
    template: "%s — MSB BHS Digital Magazine",
  },
  description:
    "The joint digital magazine of MSB Haidery and Badri High School. Celebrating student voices, literature, artwork, journalism and ideas.",
  openGraph: {
    title: "MSB BHS Digital Magazine",
    description: "From Pen to Page, From Ideas to Impact — Student voices from MSB Haidery & Badri High School.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#111827] antialiased selection:bg-[#C59B4B]/30 selection:text-[#0B1B3D]">
        <ScrollReveals />
        <SiteHeader />

        <div className="flex-1 w-full">{children}</div>

        {/* Global Footer */}
        <footer className="w-full bg-[#0B1B3D] text-white border-t border-[#162D5A] mt-auto">
          {/* Top Banner */}
          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 border-b border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              {/* Brand and Mission */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#C59B4B] text-[#0B1B3D] flex items-center justify-center font-bold">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-lg text-white tracking-wide block">
                      MSB BHS <span className="text-[#C59B4B]">DIGITAL MAGAZINE</span>
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8] tracking-widest uppercase">
                      MSB HAIDERY &amp; BADRI HIGH SCHOOL
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#CBD5E1] font-serif leading-relaxed max-w-sm mt-1">
                  From Pen to Page, From Ideas to Impact. A collaborative digital publication showcasing the voices, creativity, and intellect of our students.
                </p>

                {/* Micro School Badges */}
                <div className="flex items-center gap-4 mt-2 pt-4 border-t border-white/10">
                  <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                    <MsbLogo variant="white" className="h-8 w-auto" />
                    <span className="text-[11px] font-mono text-[#E2E8F0]">MSB Haidery</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 flex items-center gap-2">
                    <BhsLogo variant="white" className="h-6 w-auto" />
                    <span className="text-[11px] font-mono text-[#E2E8F0]">Badri High School</span>
                  </div>
                </div>
              </div>

              {/* Navigation Column */}
              <div>
                <h4 className="font-mono text-xs font-bold text-[#C59B4B] tracking-[0.2em] uppercase mb-4">
                  NAVIGATION
                </h4>
                <ul className="space-y-2.5 text-sm text-[#E2E8F0] font-sans">
                  <li>
                    <Link href="/" className="hover:text-[#C59B4B] transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/articles" className="hover:text-[#C59B4B] transition-colors">
                      Explore Journal
                    </Link>
                  </li>
                  <li>
                    <Link href="/submit" className="hover:text-[#C59B4B] transition-colors">
                      Submit Your Voice
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-[#C59B4B] transition-colors">
                      About the Publication
                    </Link>
                  </li>
                  <li>
                    <Link href="/search" className="hover:text-[#C59B4B] transition-colors">
                      Search Index
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Categories Column */}
              <div>
                <h4 className="font-mono text-xs font-bold text-[#C59B4B] tracking-[0.2em] uppercase mb-4">
                  CATEGORIES
                </h4>
                <ul className="space-y-2.5 text-sm text-[#E2E8F0] font-sans">
                  <li>
                    <Link href="/category/Articles" className="hover:text-[#C59B4B] transition-colors">
                      Articles
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Blogs" className="hover:text-[#C59B4B] transition-colors">
                      Blogs &amp; Essays
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Poetry" className="hover:text-[#C59B4B] transition-colors">
                      Poetry &amp; Verse
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Stories" className="hover:text-[#C59B4B] transition-colors">
                      Stories &amp; Prose
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Artwork" className="hover:text-[#C59B4B] transition-colors">
                      Artwork &amp; Design
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Audio" className="hover:text-[#C59B4B] transition-colors">
                      Audio &amp; Podcasts
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/Video" className="hover:text-[#C59B4B] transition-colors">
                      Video &amp; Media
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Editorial Desk Column */}
              <div>
                <h4 className="font-mono text-xs font-bold text-[#C59B4B] tracking-[0.2em] uppercase mb-4">
                  EDITORIAL DESK
                </h4>
                <p className="text-xs text-[#CBD5E1] leading-relaxed mb-4">
                  Every submission is reviewed by faculty editors before publication to uphold editorial excellence.
                </p>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-[#C59B4B] hover:text-[#0B1B3D] text-xs font-mono font-semibold transition-all duration-200 border border-white/15"
                >
                  <span>Editor Sign In</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#94A3B8]">
            <span>© 2026 MSB BHS DIGITAL MAGAZINE · ALL RIGHTS RESERVED</span>
            <div className="flex items-center gap-6">
              <span>MSB HAIDERY</span>
              <span>·</span>
              <span>BADRI HIGH SCHOOL</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
