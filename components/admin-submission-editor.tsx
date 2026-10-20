"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { Category, Language, Post } from "@/lib/types";
import { categories, languages } from "@/lib/types";

type EditableFields = Pick<Post, "title" | "content" | "category" | "language" | "author_name" | "class_name" | "section">;

export function AdminSubmissionEditor({ post, onCancel, onSaved }: { post: Post; onCancel: () => void; onSaved: (post: Post) => void }) {
  const initial: EditableFields = {
    title: post.title,
    content: post.content,
    category: post.category,
    language: post.language,
    author_name: post.author_name,
    class_name: post.class_name,
    section: post.section,
  };
  const [fields, setFields] = useState<EditableFields>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dirty = Object.keys(initial).some((key) => fields[key as keyof EditableFields] !== initial[key as keyof EditableFields]);

  useEffect(() => {
    if (!dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const warnBeforeNavigation = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const destination = new URL(link.href, window.location.href);
      if (destination.href === window.location.href) return;
      if (!window.confirm("You have unsaved changes. Leave this page and discard them?")) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", warnBeforeNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", warnBeforeNavigation, true);
    };
  }, [dirty]);

  function update<K extends keyof EditableFields>(key: K, value: EditableFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "edit", ...fields }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not save the edited submission.");
      onSaved({ ...result.post, original_submission: result.original_submission } as Post);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save the edited submission.");
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    if (dirty && !window.confirm("Discard these unsaved changes and close the editor?")) return;
    onCancel();
  }

  return <form className="submission-edit-form" onSubmit={save}>
    <div className="submission-edit-heading"><div><span className="eyebrow">EDIT PENDING SUBMISSION</span><h3>Review and revise the story</h3></div><p>Saving keeps this submission pending. Approve it separately after reviewing the saved version.</p></div>
    <div className="submission-edit-grid">
      <label>Title<input required minLength={2} maxLength={140} value={fields.title} onChange={(event) => update("title", event.target.value)} /></label>
      <label>Student author<input required minLength={2} maxLength={90} value={fields.author_name} onChange={(event) => update("author_name", event.target.value)} /></label>
      <label>Class<input required maxLength={20} value={fields.class_name} onChange={(event) => update("class_name", event.target.value)} /></label>
      <label>Section<input required maxLength={20} value={fields.section} onChange={(event) => update("section", event.target.value)} /></label>
      <label>Category<select value={fields.category} onChange={(event) => update("category", event.target.value as Category)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
      <label>Language<select value={fields.language} onChange={(event) => update("language", event.target.value as Language)}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
      <label className="submission-edit-body">Story body<textarea required minLength={10} maxLength={20000} rows={10} value={fields.content} dir={fields.language === "Urdu" || fields.language === "Lisan ud-Dawat" ? "rtl" : "auto"} onChange={(event) => update("content", event.target.value)} /></label>
    </div>
    <p className="submission-edit-error" aria-live="polite">{error}</p>
    <div className="submission-edit-actions"><button type="button" className="review-reject" disabled={busy} onClick={cancel}>Cancel</button><button type="submit" className="review-approve" disabled={busy || !dirty}>{busy ? "Saving…" : "Save Changes"}</button></div>
  </form>;
}
