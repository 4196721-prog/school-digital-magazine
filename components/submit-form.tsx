"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, UploadCloud } from "lucide-react";
import { categories } from "@/lib/types";

export function SubmitForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");

    const formData = new FormData(formElement);
    try {
      const response = await fetch("/api/posts", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Something went wrong. Please check your submission.");
      }
      formElement.reset();
      setSelectedFileName(null);
      setSuccess(true);
      setMessage(
        "Thank you for sharing your work. It has been securely sent to the editorial desk and will appear in the journal once reviewed and approved."
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-3xl border border-[#E5E9F0] p-8 sm:p-12 shadow-md text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <span className="font-mono text-xs tracking-[0.2em] text-[#C59B4B] uppercase font-bold">
          RECEIVED BY EDITORIAL DESK
        </span>
        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-[#0F2952]">
          Your Voice is Under Consideration
        </h2>
        <p className="mt-3 text-sm text-[#475569] leading-relaxed">{message}</p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/articles"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0F2952] text-white text-xs sm:text-sm font-semibold hover:bg-[#C59B4B] transition-colors"
          >
            <span>Explore the Journal</span>
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F4F6F9] text-[#0F2952] text-xs sm:text-sm font-semibold hover:bg-[#EEF2F6] transition-colors"
          >
            Submit Another Piece
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      className="bg-white rounded-3xl border border-[#E5E9F0] p-6 sm:p-10 md:p-12 shadow-md space-y-6"
      onSubmit={submit}
    >
      {/* Editorial Disclaimer Banner */}
      <div className="rounded-2xl bg-[#FAF8F5] border border-[#EEDFC6] p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-2 h-2 rounded-full bg-[#C59B4B] mt-1.5 flex-shrink-0" />
        <div className="text-xs text-[#5C451D] leading-relaxed">
          <strong className="font-semibold block text-[#0F2952] mb-0.5">
            Editorial Guidelines
          </strong>
          All student submissions are respectfully reviewed by the faculty editorial desk before publication. Please submit original work you created or have permission to share.
        </div>
      </div>

      {/* Author Name */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
          Student Name <span className="text-[#DC2626]">*</span>
        </label>
        <input
          name="author_name"
          required
          maxLength={90}
          placeholder="e.g. Fatima Zahra or Ali Asghar"
          className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] transition-all"
        />
      </div>

      {/* Class and Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
            Class <span className="text-[#DC2626]">*</span>
          </label>
          <input
            name="class_name"
            required
            maxLength={20}
            placeholder="e.g. 9 or 10 or O-Level"
            className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
            Section <span className="text-[#DC2626]">*</span>
          </label>
          <input
            name="section"
            required
            maxLength={20}
            placeholder="e.g. A, B, or C"
            className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] transition-all"
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
          Title of Your Work <span className="text-[#DC2626]">*</span>
        </label>
        <input
          name="title"
          required
          minLength={2}
          maxLength={140}
          placeholder="Give your piece a thoughtful, memorable title"
          className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] transition-all"
        />
      </div>

      {/* Category and Language */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
            Category <span className="text-[#DC2626]">*</span>
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] transition-all"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
            Language <span className="text-[#DC2626]">*</span>
          </label>
          <select
            name="language"
            required
            defaultValue="English"
            className="w-full px-4 py-3 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] transition-all"
          >
            <option value="English">English</option>
            <option value="Urdu">Urdu</option>
            <option value="Lisan ud-Dawat">Lisan ud-Dawat</option>
          </select>
        </div>
      </div>

      {/* Content Textarea */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
          Your Work <span className="text-[#DC2626]">*</span>
        </label>
        <textarea
          name="content"
          required
          minLength={10}
          maxLength={20000}
          rows={9}
          placeholder="Write or paste your poem, story, article, or reflections here…"
          className="w-full p-4 rounded-xl bg-[#F4F6F9] border border-[#E2E8F0] focus:border-[#C59B4B] focus:bg-white focus:outline-none text-sm text-[#0F2952] placeholder-[#8E9CAE] transition-all font-serif leading-relaxed"
        />
      </div>

      {/* Cover Image Upload */}
      <div>
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#0F2952] mb-2">
          Cover Image <span className="text-[#8E9CAE] font-normal">(Optional · JPG, PNG, WebP up to 5 MB)</span>
        </label>
        <div className="relative border-2 border-dashed border-[#D5DDE8] hover:border-[#C59B4B] rounded-2xl p-6 text-center bg-[#FAFBFD] transition-colors">
          <input
            name="cover"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setSelectedFileName(file ? file.name : null);
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
            <UploadCloud size={24} className="text-[#C59B4B]" />
            <span className="text-xs font-medium text-[#0F2952]">
              {selectedFileName ? (
                <span className="text-[#0F2952] font-semibold">{selectedFileName}</span>
              ) : (
                "Click or drag an image here to upload a cover photo or artwork"
              )}
            </span>
            <span className="text-[11px] text-[#8E9CAE]">JPG, PNG or WebP under 5 MB</span>
          </div>
        </div>
      </div>

      {/* Honeypot field for spam prevention */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Rights & Integrity Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="rights"
            required
            className="mt-0.5 w-4 h-4 rounded text-[#0F2952] focus:ring-[#C59B4B] border-[#D5DDE8]"
          />
          <span className="text-xs text-[#475569] leading-relaxed">
            I confirm this is my original work (or I have permission to share it) and agree to editorial review by MSB Haidery and Badri High School before publication.
          </span>
        </label>
      </div>

      {/* Error Message */}
      {message && (
        <p className="p-3 rounded-xl bg-[#FEE2E2] text-[#991B1B] text-xs font-medium" role="alert">
          {message}
        </p>
      )}

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={busy}
        className="w-full py-3.5 px-6 rounded-full bg-[#0F2952] hover:bg-[#C59B4B] text-white text-sm font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
      >
        <span>{busy ? "Submitting to Editorial Desk…" : "Send to the Editors"}</span>
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
