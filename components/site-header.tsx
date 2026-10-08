"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, Menu, X } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/articles" },
    { label: "Submit", href: "/submit" },
    { label: "About", href: "/about" },
  ];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="fixed top-2.5 sm:top-3.5 left-0 right-0 z-50 px-3 sm:px-6 w-full max-w-[960px] mx-auto pointer-events-none transition-all">
      <div className="w-full pointer-events-auto bg-white rounded-full shadow-[0_8px_30px_rgba(11,27,61,0.12)] border border-[#E5EBF2] px-4 sm:px-7 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-4 md:gap-8 transition-all duration-300">
        {/* Left: Magazine Book Emblem and School Monogram */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 text-[#0B1B3D] hover:text-[#C59B4B] transition-colors flex-shrink-0 group"
          aria-label="MSB BHS Digital Magazine Home"
        >
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#0B1B3D] text-white flex items-center justify-center shadow-sm group-hover:bg-[#C59B4B] transition-colors">
            <BookOpen size={15} strokeWidth={2.2} />
          </div>
          <span className="font-editorial font-bold text-xs sm:text-[15px] tracking-tight text-[#0B1B3D]">
            MSB <span className="text-[#C59B4B]">BHS</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium text-[#1E293B]"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 font-editorial text-[16px] tracking-tight transition-colors hover:text-[#C59B4B] ${
                  isActive ? "text-[#0B1B3D] font-semibold" : "text-[#334155]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#C59B4B] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search Pill & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center bg-[#F1F4F9] hover:bg-[#E9EEF5] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C59B4B]/30 rounded-full px-4 py-2 transition-all duration-200 border border-transparent focus-within:border-[#C59B4B]"
          >
            <Search size={15} className="text-[#64748B] flex-shrink-0 mr-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, poetry, stories..."
              className="bg-transparent text-xs text-[#0B1B3D] placeholder-[#94A3B8] focus:outline-none w-40 md:w-48 lg:w-56 font-sans font-normal"
              aria-label="Search articles"
            />
          </form>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#0B1B3D] hover:bg-[#F1F4F9] transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="pointer-events-auto md:hidden mt-2 bg-white/98 backdrop-blur-lg rounded-2xl shadow-xl border border-[#E8EEF5] p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3 pb-4 border-b border-[#EEF2F7]">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between text-base py-1.5 font-serif ${
                    isActive ? "text-[#0F2952] font-bold" : "text-[#475569]"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C59B4B]" />}
                </Link>
              );
            })}
          </nav>

          <form onSubmit={handleSearchSubmit} className="mt-4 flex items-center bg-[#F4F6F9] rounded-full px-4 py-2 border border-[#E2E8F0]">
            <Search size={16} className="text-[#64748B] mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles, stories..."
              className="w-full bg-transparent text-sm text-[#0F2952] focus:outline-none"
            />
          </form>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#64748B]">
            <span>MSB Haidery &amp; Badri High School</span>
            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="text-[#0F2952] font-semibold hover:underline"
            >
              Editorial Desk ↗
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
