"use client";
import { useState } from "react";
import Link from "next/link";
import { categories } from "@/lib/types";

export function SubmitForm() {
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [success, setSuccess] = useState(false); const [publishedPath, setPublishedPath] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); const formElement = event.currentTarget; setBusy(true); setMessage(""); const formData = new FormData(formElement); try { const response = await fetch("/api/posts", { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Something went wrong. Please try again."); formElement.reset(); setSuccess(true); setPublishedPath(`/articles/${result.slug}`); setMessage("Your work is published and ready to share."); } catch (error) { setMessage(error instanceof Error ? error.message : "Something went wrong."); } finally { setBusy(false); } }
  if (success) return <div className="success-panel"><span className="success-mark">✓</span><span className="eyebrow">LIVE IN THE JOURNAL</span><h2>Your voice is<br/><em>out in the world.</em></h2><p>{message}</p><Link className="dark-button" href={publishedPath}>Read your story ↗</Link></div>;
  return <form className="submission-form" onSubmit={submit}>
    <div className="form-note"><b>BEFORE YOU BEGIN <span>01 / 02</span></b><span>Your work is published as soon as you submit it. Please share work you made or have permission to publish. An editor can remove content that breaks our community standards.</span></div>
    <label>Student name<input name="author_name" required maxLength={90} placeholder="Your name"/></label>
    <div className="form-row"><label>Class<input name="class_name" required maxLength={20} placeholder="e.g. 9"/></label><label>Section<input name="section" required maxLength={20} placeholder="e.g. A"/></label></div>
    <label>Title<input name="title" required minLength={2} maxLength={140} placeholder="Give your work a title"/></label>
    <div className="form-row"><label>Category<select name="category" required defaultValue=""><option value="" disabled>Choose a category</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label><label>Language<select name="language" required defaultValue="English"><option>English</option><option>Urdu</option></select></label></div>
    <label>Your work<textarea name="content" required minLength={10} maxLength={20000} rows={10} placeholder="Write or paste your story, poem, article…"/></label>
    <label>Cover image <span className="optional">OPTIONAL · JPG, PNG OR WEBP · UP TO 5 MB</span><input name="cover" type="file" accept="image/png,image/jpeg,image/webp"/></label>
    <label className="honeypot" aria-hidden="true">Leave this empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="checkbox-line"><input type="checkbox" name="rights" required/><span>I made this work or have permission to share it. I understand it will be public immediately.</span></label>
    {message && <p className="form-error" role="alert">{message}</p>}<button className="dark-button submit-button" disabled={busy}>{busy ? "Publishing…" : "Publish my work ↗"}</button>
  </form>;
}
