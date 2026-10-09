import type { Metadata } from "next";
import { Feather, ShieldCheck, Sparkles } from "lucide-react";
import { SubmitForm } from "@/components/submit-form";

export const metadata: Metadata = {
  title: "Submit Your Work — MSB BHS Digital Magazine",
  description: "Share your writing, poetry, artwork, articles or stories with the MSB BHS Digital Magazine.",
};

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 md:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Guidelines & Editorial Vision */}
          <section className="lg:col-span-5 lg:sticky lg:top-24">
            <span className="font-mono text-xs tracking-[0.25em] text-[#C59B4B] uppercase font-bold">
              OPEN SUBMISSIONS · ALWAYS
            </span>
            <h1 className="mt-3 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F2952] leading-tight">
              Your Voice Belongs Here.
            </h1>
            <p className="mt-4 text-base text-[#475569] font-serif leading-relaxed">
              Every student has ideas, reflections, questions, and artwork that deserve to be read and seen. Submit your original pieces to the MSB BHS Digital Magazine.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#0F2952] text-[#C59B4B] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Feather size={15} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0F2952]">Create. Express. Inspire.</h3>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                    Share essays, stories, poetry, artwork, photography, and reflections in English, Urdu, or Lisan ud-Dawat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#C59B4B] text-[#0F2952] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0F2952]">Reviewed with Care</h3>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                    Faculty editors review every submission before it is published.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E5E9F0] shadow-sm">
                <div className="w-8 h-8 rounded-full bg-[#0F2952] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={15} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#0F2952]">A Lasting Student Archive</h3>
                  <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
                    Approved student work becomes part of the school&apos;s digital archive, with student attribution and readership records.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Submission Form */}
          <section className="lg:col-span-7">
            <SubmitForm />
          </section>
        </div>
      </div>
    </main>
  );
}
