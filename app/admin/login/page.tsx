import type { Metadata } from "next";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
export const metadata: Metadata = { title: "Editorial desk sign in" };
export default function AdminLoginPage() { return <main className="admin-login-page"><Link href="/" className="back-link">← BACK TO THE JOURNAL</Link><div className="login-card"><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Good to see<br/><em>you again.</em></h1><p>Sign in with your editorial account to monitor the journal.</p><AdminLoginForm/><small>Admin access is managed through Supabase Auth. Student contributions are reviewed before publication.</small></div></main>; }
