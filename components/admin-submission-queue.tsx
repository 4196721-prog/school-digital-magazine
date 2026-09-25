"use client";
/* eslint @next/next/no-img-element: "off" -- cover URLs are dynamic public Supabase storage URLs. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function AdminSubmissionQueue({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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
      {posts.map((post) => <article className="submission-review-card" key={post.id}>
        <header><div><span className="eyebrow">{post.category} · {post.language}</span><h2>{post.title}</h2><p>{post.author_name} · Class {post.class_name}, Section {post.section}</p></div><time dateTime={post.submitted_at}>{formatDate(post.submitted_at ?? post.published_at)}</time></header>
        {post.cover_image && <img className="submission-cover" src={post.cover_image} alt={`Cover submitted with ${post.title}`} />}
        <div className={`submission-content${post.language === "Urdu" ? " submission-content-urdu" : ""}`} dir={post.language === "Urdu" ? "rtl" : "auto"} lang={post.language === "Urdu" ? "ur" : "en"}>{post.content}</div>
        <footer><span>Submitted for editorial review · {post.language}</span><div><button className="review-reject" disabled={busyId !== null} onClick={() => moderate(post, "reject")}><X size={14}/>{busyId === post.id ? "Saving…" : "Reject"}</button><button className="review-approve" disabled={busyId !== null} onClick={() => moderate(post, "approve")}><Check size={14}/>{busyId === post.id ? "Saving…" : "Approve & publish"}</button></div></footer>
      </article>)}
    </div> : <div className="admin-empty"><span className="eyebrow">EDITORIAL DESK · INBOX CLEAR</span><h2>No submissions are waiting.</h2><p>New student work will appear here for review before it joins the public journal.</p></div>}
  </>;
}
