"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, PenLine, ArrowRight } from "lucide-react";
import { MsbLogo, BhsLogo, SchoolDivider } from "@/components/school-logos";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden flex flex-col items-center justify-between min-h-[580px] sm:min-h-[660px] md:min-h-[720px] lg:min-h-[780px] xl:min-h-[840px] pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-24 lg:pb-32 select-none">
      {/* Background Layer: Clean Photographic Background Source of Truth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <Image
          src="/images/hero-16k.png"
          alt="MSB Haidery and Badri High School Campus at Sunset"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Subtle Natural Sun Softening Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] select-none overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-[52.55%] -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] md:w-[480px] lg:w-[560px] h-[280px] sm:h-[380px] md:h-[480px] lg:h-[560px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle closest-side, rgba(255, 215, 120, 0.45) 0%, rgba(245, 175, 75, 0.28) 28%, rgba(230, 140, 50, 0.14) 52%, rgba(210, 115, 30, 0.04) 75%, transparent 100%)",
            filter: "blur(36px)",
          }}
        />
      </div>

      {/* Screen Reader & SEO Accessibility */}
      <h1 className="sr-only">MSB Haidery &amp; Badri High School Digital Magazine</h1>
      <p className="sr-only">From Pen to Page, From Ideas to Impact. Your Pen. Your Voice. Your Story.</p>

      {/* Hero Content Overlay: Real HTML & Typography */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* School Logos in the Sky — Visibly Enlarged & Proportionally Balanced */}
        <div className="flex items-center justify-center gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 mb-3 sm:mb-4 md:mb-5 lg:mb-6 select-none">
          <MsbLogo className="h-[72px] sm:h-[94px] md:h-[114px] lg:h-[136px] xl:h-[146px] w-auto drop-shadow-sm" />
          <SchoolDivider className="h-[58px] sm:h-[74px] md:h-[88px] lg:h-[104px] xl:h-[114px] w-auto" />
          <BhsLogo className="h-[52px] sm:h-[66px] md:h-[80px] lg:h-[96px] xl:h-[105px] w-auto" />
        </div>

        {/* Main Title: MSB BHS DIGITAL MAGAZINE with Directional Entrance Motion */}
        <div className="flex flex-col items-center justify-center tracking-tight leading-[1.06] text-center select-none">
          <h2 className="hero-motion-left-title font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[68px] font-black text-[#0A1838] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] tracking-wide leading-none">
            MSB BHS
          </h2>
          <span className="hero-motion-right-title font-cinzel text-xl sm:text-2xl md:text-4xl lg:text-[46px] xl:text-[52px] font-extrabold mt-1 sm:mt-2 gold-metallic-text tracking-wider leading-none">
            DIGITAL MAGAZINE
          </span>
        </div>

        {/* Ornamental Divider with Diamond: Subtle Fade */}
        <div className="hero-motion-fade-divider flex items-center justify-center gap-2.5 sm:gap-3 my-2 sm:my-3">
          <span className="w-8 sm:w-14 h-[1.5px] bg-[#C59B4B]/80" />
          <span className="w-2 h-2 rotate-45 border-[1.5px] border-[#C59B4B] bg-[#FFF8EB]" />
          <span className="w-8 sm:w-14 h-[1.5px] bg-[#C59B4B]/80" />
        </div>

        {/* Tagline 1: Enters from LEFT */}
        <p className="hero-motion-left-tagline font-editorial text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-[#0A1838] max-w-2xl px-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] leading-snug">
          From Pen to Page, From Ideas to Impact
        </p>

        {/* Tagline 2: Enters from RIGHT */}
        <p className="hero-motion-right-subtagline mt-0.5 sm:mt-1 font-editorial text-xs sm:text-sm md:text-[15px] font-normal text-[#1E293B] tracking-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Your Pen. Your Voice. Your Story.
        </p>

        {/* CTA Buttons: Fade & Slide Upward */}
        <div className="hero-motion-up-cta mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 pointer-events-auto">
          {/* Primary CTA: Explore the Magazine */}
          <Link
            href="/articles"
            className="group w-[260px] sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#091732] !text-white font-sans text-xs sm:text-[15px] font-semibold shadow-[0_6px_22px_rgba(9,23,50,0.35)] hover:bg-[#122650] hover:shadow-[0_8px_28px_rgba(9,23,50,0.45)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <BookOpen size={16} className="!text-white group-hover:scale-110 transition-transform" />
            <span className="!text-white">Explore the Magazine</span>
            <ArrowRight size={14} className="!text-white group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Secondary CTA: Submit Your Voice */}
          <Link
            href="/submit"
            className="group w-[260px] sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#0A1838] font-sans text-xs sm:text-[15px] font-semibold border border-[#D5DDE8] shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-[#C59B4B] hover:text-[#0A1838] hover:bg-white hover:shadow-[0_6px_22px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <PenLine size={15} className="text-[#0A1838] group-hover:scale-110 transition-transform" />
            <span>Submit Your Voice</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
