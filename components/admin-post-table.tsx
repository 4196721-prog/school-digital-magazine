"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowUp, ArrowDown, Archive, RotateCcw, Star } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function AdminPostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingPost, setPendingPost] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  const [editorialBusyId, setEditorialBusyId] = useState<string | null>(null);

  async function updateEditorial(post: Post, action: "promote" | "lower" | "reset-rank" | "feature" | "unfeature") {
    if (busy || editorialBusyId) return;
    setEditorialBusyId(post.id);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not update this story's editorial settings.");
      const label = action === "feature" ? "Featured on the homepage" : action === "unfeature" ? "Removed from homepage features" : action === "reset-rank" ? "Returned to automatic ranking" : action === "promote" ? "Promoted" : "Lowered";
      setMessage(`${label}: “${post.title}”.`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update this story's editorial settings.");
    } finally {
      setEditorialBusyId(null);
    }
  }

  async function archivePost() {
    if (!pendingPost || busy) return;
    setBusy(true);
    const post = pendingPost;
    try {
      const response = await fetch(`/api/posts/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "archive" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Could not archive this post.");
      setMessage(`Archived “${post.title}”. The record has been retained.`);
      setPendingPost(null);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not archive this post.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <p className="admin-feedback" aria-live="polite">{message}</p>
    <p className="editorial-help">Promote moves a story to the top of the editorial order; Lower moves it below automatic stories. Reset restores publication-date ordering. Featured stories appear first on the homepage.</p>
    {posts.length ? <div className="admin-table-wrap"><table className="admin-table posts-table">
      <thead><tr><th>STORY</th><th>AUTHOR</th><th>CATEGORY</th><th>LANGUAGE</th><th>STATUS</th><th>EDITORIAL RANK</th><th>READS</th><th>DATE</th><th><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>{posts.map((post) => <tr key={post.id}>
        <td data-label="Story">{post.status === "published" ? <Link className="post-title-link" href={`/articles/${post.slug}`}>{post.title}<ArrowUpRight size={13}/></Link> : <span className="post-title-link">{post.title}</span>}</td>
        <td data-label="Student author">{post.author_name}<small>Class {post.class_name} · {post.section}</small></td>
        <td data-label="Category"><span className="admin-tag">{post.category}</span></td>
        <td data-label="Language">{post.language}</td>
        <td data-label="Status"><span className={`status-pill status-${post.status}`}>{post.status}</span></td>
        <td data-label="Editorial rank"><div className="editorial-status"><span className="editorial-rank">{(post.editorial_rank ?? 0) > 0 ? `Promoted · ${(post.editorial_rank ?? 0)}` : (post.editorial_rank ?? 0) < 0 ? `Lowered · ${Math.abs(post.editorial_rank ?? 0)}` : "Automatic"}</span>{post.editorial_featured && <span className="editorial-featured">Homepage feature</span>}</div></td>
        <td data-label="Reads">{post.view_count.toLocaleString()}</td>
        <td data-label="Submitted">{formatDate(post.submitted_at ?? post.published_at)}</td>
        <td data-label="Actions">{post.status === "published" ? <div className="editorial-actions">
          <button type="button" className="editorial-button" disabled={busy || editorialBusyId !== null} onClick={() => updateEditorial(post, "promote")} aria-label={`Promote ${post.title}`}><ArrowUp size={13}/> Promote</button>
          <button type="button" className="editorial-button" disabled={busy || editorialBusyId !== null} onClick={() => updateEditorial(post, "lower")} aria-label={`Lower ${post.title}`}><ArrowDown size={13}/> Lower</button>
          {(post.editorial_rank ?? 0) !== 0 && <button type="button" className="editorial-button" disabled={busy || editorialBusyId !== null} onClick={() => updateEditorial(post, "reset-rank")} aria-label={`Return ${post.title} to automatic ranking`}><RotateCcw size={13}/> Reset</button>}
          <button type="button" className="editorial-button" disabled={busy || editorialBusyId !== null} onClick={() => updateEditorial(post, post.editorial_featured ? "unfeature" : "feature")} aria-pressed={Boolean(post.editorial_featured)} aria-label={`${post.editorial_featured ? "Remove homepage feature from" : "Feature on homepage"} ${post.title}`}><Star size={13}/>{post.editorial_featured ? "Unfeature" : "Feature"}</button>
          <button type="button" className="remove-button" disabled={busy || editorialBusyId !== null} onClick={() => setPendingPost(post)}><Archive size={13}/> Archive</button>
        </div> : <span>—</span>}</td>
      </tr>)}</tbody>
    </table></div> : <div className="admin-empty"><span className="eyebrow">NO MATCHING POSTS</span><h2>A clear page for what comes next.</h2><p>Try adjusting your filters.</p><Link href="/admin/submissions" className="text-link">REVIEW PENDING SUBMISSIONS <ArrowUpRight size={14}/></Link></div>}
    {pendingPost && <div className="confirm-layer" role="presentation"><section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="archive-title" aria-describedby="archive-description"><span className="eyebrow">EDITORIAL DESK · ARCHIVE STORY</span><h2 id="archive-title">Archive this story?</h2><p id="archive-description"><b>{pendingPost.title}</b> will leave the public journal. Its post, student record, cover and analytics will be retained in the admin database.</p><div className="confirm-actions"><button className="confirm-cancel" disabled={busy} onClick={() => setPendingPost(null)}>Keep published</button><button className="confirm-remove" disabled={busy} onClick={archivePost}>{busy ? "Archiving…" : <><Archive size={14}/> Archive story</>}</button></div></section></div>}
  </>;
}
