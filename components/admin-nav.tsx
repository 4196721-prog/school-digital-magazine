import Link from "next/link";
import { AdminLogout } from "@/components/admin-logout";

export function AdminNav({ active }: { active: string }) {
  return <nav className="admin-nav" aria-label="Editorial desk">
    <span className="admin-nav-label">DESK</span>
    <Link href="/admin" className={active === "Overview" ? "active" : ""}>Overview</Link>
    <Link href="/admin/submissions" className={active === "Pending" ? "active" : ""}>Pending submissions</Link>
    <Link href="/admin/posts" className={active === "Posts" ? "active" : ""}>Posts</Link>
    <Link href="/admin/students" className={active === "Students" ? "active" : ""}>Students</Link>
    <Link href="/admin/analytics" className={active === "Analytics" ? "active" : ""}>Analytics</Link>
    <Link href="/" className="admin-view-link">← View magazine</Link>
    <AdminLogout/>
  </nav>;
}
