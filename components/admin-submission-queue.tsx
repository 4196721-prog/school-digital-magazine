"use client";
/* eslint @next/next/no-img-element: "off" -- cover URLs are dynamic public Supabase storage URLs. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { AdminSubmissionEditor } from "@/components/admin-submission-editor";

export function AdminSubmissionQueue({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPosts, setEditedPosts] = useState<Record<string, Post>>({});

  async function moderate(post: Post, action: "approve" | "reject") {
    if (busyId) return;
    setBusyId(post.id);
    setMessage("");
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update this submission.");
      setMessage(action === "approve" ? `Published “${post.title}”.` : `Rejected “${post.title}”.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update this submission.");
    } finally {
      setBusyId(null);
    }
  }

  return <>
    <p className="admin-feedback" aria-live="polite">{message}</p>
    {posts.length ? <div className="submission-queue">
      {posts.map((sourcePost) => {
        const post = editedPosts[sourcePost.id] ?? sourcePost;
        const editing = editingId === post.id;
        return <article className="submission-review-card" key={post.id}>
        <header><div><span className="eyebrow">{post.category} · {post.language}</span><h2>{post.title}</h2><p>{post.author_name} · Class {post.class_name}, Section {post.section}</p></div><time dateTime={post.submitted_at}>{formatDate(post.submitted_at ?? post.published_at)}</time></header>
        {post.cover_image && <img className="submission-cover" src={post.cover_image} alt={`Cover submitted with ${post.title}`} />}
        <div className={`submission-content${post.language === "Urdu" || post.language === "Lisan ud-Dawat" ? " submission-content-urdu" : ""}`} dir={post.language === "Urdu" || post.language === "Lisan ud-Dawat" ? "rtl" : "auto"} lang={post.language === "Urdu" ? "ur" : post.language === "Lisan ud-Dawat" ? "ar" : "en"}>{post.content}</div>
        {post.original_submission && <details className="original-submission"><summary>View original student submission</summary><div><b>{post.original_submission.title}</b><small>{post.original_submission.category} · {post.original_submission.language} · {post.original_submission.author_name}</small><p dir={post.original_submission.language === "Urdu" || post.original_submission.language === "Lisan ud-Dawat" ? "rtl" : "auto"}>{post.original_submission.content}</p></div></details>}
        {editing && <AdminSubmissionEditor post={post} onCancel={() => setEditingId(null)} onSaved={(savedPost) => { setEditedPosts((current) => ({ ...current, [savedPost.id]: savedPost })); setEditingId(null); setMessage(`Saved changes to “${savedPost.title}”. Review the updated version, then approve it separately.`); router.refresh(); }} />}
        <footer><span>Submitted for editorial review · {post.language}</span><div>{!editing && <button className="review-edit" type="button" disabled={busyId !== null} onClick={() => { setMessage(""); setEditingId(post.id); }}><Pencil size={14}/> Edit</button>}{!editing && <><button className="review-reject" disabled={busyId !== null} onClick={() => moderate(post, "reject")}><X size={14}/>{busyId === post.id ? "Saving…" : "Reject"}</button><button className="review-approve" disabled={busyId !== null} onClick={() => moderate(post, "approve")}><Check size={14}/>{busyId === post.id ? "Saving…" : "Approve & publish"}</button></>}</div></footer>
      </article>})}
    </div> : <div className="admin-empty"><span className="eyebrow">EDITORIAL DESK · INBOX CLEAR</span><h2>No submissions are waiting.</h2><p>New student work will appear here for review before it joins the public journal.</p></div>}
  </>;
}
