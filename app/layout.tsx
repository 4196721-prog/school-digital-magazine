import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveals } from "@/components/scroll-reveals";
import Link from "next/link";

export const metadata: Metadata = { title: { default: "The School Journal — A school of many voices", template: "%s — The School Journal" }, description: "A public digital magazine for student stories, ideas and images.", openGraph: { title: "The School Journal", description: "Stories, ideas and images from our students.", type: "website" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ScrollReveals/><SiteHeader/>{children}<footer className="site-footer"><div className="footer-kicker"><span>THE SCHOOL JOURNAL</span><span>A STUDENT PUBLICATION · EST. 2026</span></div><div className="footer-main"><Link className="brand footer-brand" href="/"><span className="brand-mark">S<span>J</span></span><span className="brand-lockup"><strong>THE SCHOOL<br/>JOURNAL</strong><small>Ideas, made visible.</small></span></Link><p>A student-run space for the work<br/>we make and the stories we tell.</p><div className="footer-links"><Link href="/articles">Read the journal <span>↗</span></Link><Link href="/submit">Submit your work <span>↗</span></Link><Link href="/admin/login">Editorial desk <span>↗</span></Link></div></div><div className="footer-bottom"><span>© 2026 THE SCHOOL JOURNAL</span><span>MADE BY OUR STUDENTS · FOR EVERYONE</span><Link href="/">BACK TO TOP ↑</Link></div></footer></body></html>;
}
