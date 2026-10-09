"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  FileText,
  PenLine,
  Palette,
  AudioLines,
  Video,
  ArrowRight,
} from "lucide-react";
import { displayCategories, categoryMeta } from "@/lib/types";

const iconMap = {
  book: BookOpen,
  "file-text": FileText,
  feather: PenLine,
  library: BookOpen,
  palette: Palette,
  mic: AudioLines,
  video: Video,
};

export function CategoryPanel() {
  return (
    <section className="category-panel-wrapper relative z-20 -mt-10 sm:-mt-14 md:-mt-16 lg:-mt-20 px-3 sm:px-6 lg:px-8 max-w-[1560px] mx-auto">
      <div className="category-panel bg-white rounded-2xl sm:rounded-3xl lg:rounded-[32px] shadow-[0_16px_50px_rgba(11,27,61,0.09)] border border-[#E9EDF4] p-3.5 sm:p-6 lg:p-7 transition-all hover:shadow-[0_20px_55px_rgba(11,27,61,0.12)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-5 border-b border-[#EEF2F7]">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-cinzel text-[11px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.24em] font-bold text-[#0A1838] uppercase">
              EXPLORE BY CATEGORY
            </span>
            <span className="w-8 sm:w-16 h-[1.5px] bg-[#C59B4B] rounded-full inline-block" />
          </div>
          <Link
            href="/articles"
            className="group flex items-center gap-1 sm:gap-1.5 font-editorial text-xs sm:text-sm font-semibold text-[#0A1838] hover:text-[#C59B4B] transition-colors"
          >
            <span>View All</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 7 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3.5 lg:gap-3.5 mt-3.5 sm:mt-5">
          {displayCategories.map((category) => {
            const meta = categoryMeta[category];
            const Icon = iconMap[meta.icon as keyof typeof iconMap] || BookOpen;

            return (
              <Link
                key={category}
                href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="group flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border border-[#E2E8F0] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#C59B4B] hover:shadow-md last:col-span-2 sm:last:col-span-1"
              >
                {/* Visual Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EEF2F7]">
                  <Image
                    src={meta.image}
                    alt={`${category} category`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1838]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Footer Pill: Icon, Name, Circular Horizontal Arrow */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 bg-white group-hover:bg-[#FAFBFD] transition-colors gap-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex-shrink-0 text-[#0A1838] group-hover:text-[#C59B4B] transition-colors">
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <span className="text-xs sm:text-[13px] font-bold text-[#0A1838] truncate font-editorial tracking-tight">
                      {category}
                    </span>
                  </div>

                  <span className="flex-shrink-0 w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-[#F5ECE0] text-[#0A1838] flex items-center justify-center transition-all duration-200 group-hover:bg-[#0A1838] group-hover:text-white">
                    <ArrowRight size={12} strokeWidth={2.2} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
