"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Trash2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function AdminPostTable({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pendingPost, setPendingPost] = useState<Post | null>(null);
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!pendingPost || busy) return;
    setBusy(true);
    const post = pendingPost;
    const response = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setMessage(result.error); setBusy(false); setPendingPost(null); return; }
    setMessage(`Removed “${post.title}”.`);
    setBusy(false);
    setPendingPost(null);
    router.refresh();
  }

  return <>
    <p className="admin-feedback" aria-live="polite">{message}</p>
    {posts.length ? <div className="admin-table-wrap"><table className="admin-table posts-table">
      <thead><tr><th>STORY</th><th>AUTHOR</th><th>CATEGORY</th><th>LANGUAGE</th><th>READS</th><th>DATE</th><th><span className="sr-only">Actions</span></th></tr></thead>
      <tbody>{posts.map((post) => <tr key={post.id}>
        <td data-label="Story"><Link className="post-title-link" href={`/articles/${post.slug}`}>{post.title}<ArrowUpRight size={13}/></Link></td>
        <td data-label="Student author">{post.author_name}<small>Class {post.class_name} · {post.section}</small></td>
        <td data-label="Category"><span className="admin-tag">{post.category}</span></td>
        <td data-label="Language">{post.language}</td>
        <td data-label="Reads">{post.view_count.toLocaleString()}</td>
        <td data-label="Published">{formatDate(post.published_at)}</td>
        <td data-label="Action"><button className="remove-button" onClick={() => setPendingPost(post)}><Trash2 size={13}/> Remove</button></td>
      </tr>)}</tbody>
    </table></div> : <div className="admin-empty"><span className="eyebrow">NO PUBLISHED STORIES</span><h2>A clear page for what comes next.</h2><p>New student work will appear here as soon as it is published.</p><Link href="/submit" className="text-link">OPEN SUBMISSIONS <ArrowUpRight size={14}/></Link></div>}
    {pendingPost && <div className="confirm-layer" role="presentation"><section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="remove-title" aria-describedby="remove-description"><span className="eyebrow">EDITORIAL DESK · REMOVE STORY</span><h2 id="remove-title">Remove this story?</h2><p id="remove-description"><b>{pendingPost.title}</b> will be removed from the public journal. Its uploaded cover and any now-empty student record will also be removed.</p><div className="confirm-actions"><button className="confirm-cancel" disabled={busy} onClick={() => setPendingPost(null)}>Keep story</button><button className="confirm-remove" disabled={busy} onClick={remove}>{busy ? "Removing…" : <><Trash2 size={14}/> Remove story</>}</button></div></section></div>}
  </>;
}
