import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Feather, ShieldCheck, ArrowRight } from "lucide-react";
import { MsbLogo, BhsLogo, SchoolDivider } from "@/components/school-logos";

export const metadata: Metadata = {
  title: "About the Magazine",
  description:
    "Learn about the collaborative vision of MSB Haidery and Badri High School for the MSB BHS Digital Magazine.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* School Logos Lockup */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <MsbLogo className="h-16 w-auto" />
            <SchoolDivider className="h-12 text-[#C59B4B]" />
            <BhsLogo className="h-14 w-auto" />
          </div>

          <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
            ABOUT THE PUBLICATION
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F2952] leading-tight">
            Two Schools. One Common Canvas.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#475569] font-serif leading-relaxed">
            The MSB BHS Digital Magazine is a joint editorial platform dedicated to celebrating student inquiry, creative literature, journalism, artwork, and campus life across MSB Haidery and Badri High School.
          </p>
        </div>

        {/* Vision Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16">
          <div className="bg-white rounded-2xl p-8 border border-[#E5E9F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#0F2952] text-[#C59B4B] flex items-center justify-center mb-5">
              <Feather size={22} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0F2952]">From Pen to Page</h3>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              We empower young writers, poets, and journalists to refine their craft, explore bold ideas, and articulate their voices with clarity and nuance.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E5E9F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#C59B4B] text-[#0F2952] flex items-center justify-center mb-5">
              <Sparkles size={22} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0F2952]">Ideas to Impact</h3>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Our classrooms and courtyards are filled with original perspectives on science, ethics, society, and art that deserve a wider stage.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-[#E5E9F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#0F2952] text-white flex items-center justify-center mb-5">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#0F2952]">Editorial Integrity</h3>
            <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
              Every contribution is respectfully reviewed by our faculty editorial desk, ensuring work meets the highest standards of safety and excellence.
            </p>
          </div>
        </div>

        {/* Participating Institutions */}
        <div className="mt-16 bg-white rounded-3xl p-8 sm:p-12 border border-[#E5E9F0] shadow-sm">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2952] text-center mb-10">
            Our Institutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#EEF2F7]">
            <div className="flex flex-col items-center text-center pt-6 md:pt-0">
              <MsbLogo className="h-20 w-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-[#0F2952]">MSB Haidery</h3>
              <p className="mt-2 text-sm text-[#64748B] leading-relaxed max-w-sm">
                Committed to holistic education, intellectual rigor, moral values, and nurturing inquisitive minds capable of shaping the future.
              </p>
            </div>

            <div className="flex flex-col items-center text-center pt-6 md:pt-0 md:pl-12">
              <BhsLogo className="h-16 w-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-[#0F2952]">Badri High School</h3>
              <p className="mt-2 text-sm text-[#64748B] leading-relaxed max-w-sm">
                Fostering leadership, creative excellence, cultural enrichment, and academic distinction across every student milestone.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#0F2952] text-white text-sm font-semibold hover:bg-[#C59B4B] transition-colors shadow-md"
          >
            <span>Submit Your Work</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}
