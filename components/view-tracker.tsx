"use client";
import { useEffect } from "react";

const trackedViews = new Set<string>();

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    const day = new Date().toISOString().slice(0, 10);
    const key = `${postId}:${day}`;
    if (trackedViews.has(key)) return;

    try {
      if (sessionStorage.getItem(`magazine-view:${key}`)) return;
      sessionStorage.setItem(`magazine-view:${key}`, "1");
    } catch {
      // The database's daily unique constraint remains the final deduplication layer.
    }

    trackedViews.add(key);
    fetch("/api/views", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId }), keepalive: true }).catch(() => {
      trackedViews.delete(key);
      try {
        sessionStorage.removeItem(`magazine-view:${key}`);
      } catch {
        // Ignore storage failures and allow the server-side dedupe to protect counts.
      }
    });
  }, [postId]);
  return null;
}
