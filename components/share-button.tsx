"use client";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
export function ShareButton({ slug }: { slug: string }) { const [copied, setCopied] = useState(false); return <button className="share-button" onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/articles/${slug}`); setCopied(true); window.setTimeout(() => setCopied(false), 2000); }}>{copied ? "Link copied ✓" : <>Copy story link <ArrowUpRight size={14}/></>}</button>; }
