"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, PenLine, ArrowRight } from "lucide-react";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  const angleRef = useRef(0);
  const biasRef = useRef({ x: 0, y: 0 });
  const targetBiasRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      if (lightRef.current) {
        lightRef.current.style.transform = "translate3d(0, 0, 0) translate(-50%, -50%)";
      }
      return;
    }

    let rafId: number;
    let lastTime = performance.now();

    // 8.0 seconds per complete 360° circular revolution
    const ORBIT_PERIOD_MS = 8000;
    const ORBIT_ANGULAR_SPEED = (2 * Math.PI) / ORBIT_PERIOD_MS;

    const animate = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      // Continuous infinite 360° orbital loop
      angleRef.current = (angleRef.current + ORBIT_ANGULAR_SPEED * dt) % (2 * Math.PI);

      // Smooth lerp for gentle cursor bias (0.05 factor)
      biasRef.current.x += (targetBiasRef.current.x - biasRef.current.x) * 0.05;
      biasRef.current.y += (targetBiasRef.current.y - biasRef.current.y) * 0.05;

      const isMobile = window.innerWidth < 640;
      const orbitRadius = isMobile ? 70 : 120;

      const orbitX = Math.cos(angleRef.current) * orbitRadius;
      const orbitY = Math.sin(angleRef.current) * orbitRadius;

      if (lightRef.current) {
        const finalX = orbitX + biasRef.current.x;
        const finalY = orbitY + biasRef.current.y;
        lightRef.current.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "touch") return;
    if (!heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const heroCenterX = rect.width / 2;
    const heroCenterY = rect.height * 0.47;

    // Gently bias orbit center towards cursor position (clamped inside blurred center area)
    const rawOffsetX = (e.clientX - rect.left - heroCenterX) * 0.16;
    const rawOffsetY = (e.clientY - rect.top - heroCenterY) * 0.16;

    const maxBiasX = 75;
    const maxBiasY = 55;

    targetBiasRef.current = {
      x: Math.max(-maxBiasX, Math.min(maxBiasX, rawOffsetX)),
      y: Math.max(-maxBiasY, Math.min(maxBiasY, rawOffsetY)),
    };
  };

  const handlePointerLeave = () => {
    targetBiasRef.current = { x: 0, y: 0 };
  };

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate w-full min-h-[500px] sm:min-h-[580px] md:min-h-[640px] lg:min-h-[700px] xl:min-h-[750px] flex flex-col justify-start overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20"
    >
      {/* Background Layer: Real Photographic Hero Background from Master Reference */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <div className="relative w-full h-[133.5%] -top-9 sm:top-0">
          <Image
            src="/images/hero-background.png"
            alt="MSB Haidery and Badri High School Campus at Sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Visible Cinematic Orbiting Light (Continuously traveling over blurred center area) */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden select-none"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-[47%] w-0 h-0 pointer-events-none">
          <div
            ref={lightRef}
            className="absolute top-0 left-0 w-[500px] h-[500px] sm:w-[580px] sm:h-[580px] rounded-full pointer-events-none blur-3xl will-change-transform"
            style={{
              background:
                "radial-gradient(circle closest-side, rgba(255, 252, 240, 0.58) 0%, rgba(255, 228, 150, 0.42) 25%, rgba(240, 180, 70, 0.22) 50%, rgba(215, 145, 40, 0.07) 75%, transparent 100%)",
              mixBlendMode: "screen",
            }}
          />
        </div>
      </div>

      {/* Accessible Title for Screen Readers */}
      <h2 className="sr-only">MSB Haidery &amp; Badri High School Digital Magazine</h2>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-1 sm:mt-3 md:mt-5">
        {/* Spacer corresponding to the native school logos positioned in the sky */}
        <div className="h-10 sm:h-14 md:h-16 lg:h-20 w-full pointer-events-none" aria-hidden="true" />

        {/* Main Title: MSB BHS DIGITAL MAGAZINE */}
        <h1 className="flex flex-col items-center justify-center font-cinzel tracking-tight leading-[1.06] text-center select-none">
          <span className="hero-motion-left-title text-3xl sm:text-4xl md:text-5xl lg:text-[62px] xl:text-[68px] font-black text-[#0A1838] drop-shadow-[0_2px_4px_rgba(255,255,255,0.7)] tracking-wide">
            MSB BHS
          </span>
          <span className="hero-motion-right-title text-xl sm:text-2xl md:text-4xl lg:text-[48px] xl:text-[54px] font-extrabold mt-0.5 sm:mt-1 gold-metallic-text tracking-wider">
            DIGITAL MAGAZINE
          </span>
        </h1>

        {/* Ornamental Divider with Diamond */}
        <div className="hero-motion-fade-divider flex items-center justify-center gap-2.5 sm:gap-3 my-2 sm:my-2.5">
          <span className="w-8 sm:w-14 h-[1.5px] bg-[#C59B4B]/80" />
          <span className="w-2 h-2 rotate-45 border-[1.5px] border-[#C59B4B] bg-[#FFF8EB]" />
          <span className="w-8 sm:w-14 h-[1.5px] bg-[#C59B4B]/80" />
        </div>

        {/* Taglines */}
        <p className="hero-motion-left-tagline font-editorial text-sm sm:text-base md:text-lg lg:text-[20px] font-medium text-[#0A1838] max-w-2xl px-2 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] leading-snug">
          From Pen to Page, From Ideas to Impact
        </p>

        <p className="hero-motion-right-subtagline mt-0.5 sm:mt-1 font-editorial text-xs sm:text-sm md:text-[15px] font-normal text-[#1E293B] tracking-normal drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          Your Pen. Your Voice. Your Story.
        </p>

        {/* CTA Buttons */}
        <div className="hero-motion-up-cta mt-4 sm:mt-5 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
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


