import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminNav } from "@/components/admin-nav";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  await requireAdmin();
  const db = createAdminClient();
  const { data: students } = await db.from("students").select("id,name,class_name,section").order("name");
  const { data: posts } = await db.from("posts").select("student_id,category,view_count");
  const rows = (students ?? []).map((student) => {
    const contributed = (posts ?? []).filter((post) => post.student_id === student.id);
    return { ...student, count: contributed.length, views: contributed.reduce((sum, post) => sum + post.view_count, 0), categories: [...new Set(contributed.map((post) => post.category))] };
  }).sort((a, b) => b.count - a.count);

  return <main className="admin-shell">
    <header className="admin-header"><div><span className="eyebrow">THE SCHOOL JOURNAL · EDITORIAL DESK</span><h1>Student voices<span className="admin-heading-period">.</span></h1><p>Real contributors and the work they have shared.</p></div><div className="admin-count-mark"><b>{String(rows.length).padStart(2, "0")}</b><span>AUTHORS</span></div></header>
    <AdminNav active="Students"/>
    {rows.length ? <div className="admin-table-wrap"><table className="admin-table students-table">
      <thead><tr><th>STUDENT</th><th>CLASS & SECTION</th><th>POSTS</th><th>READS</th><th>CONTRIBUTED TO</th></tr></thead>
      <tbody>{rows.map((student, index) => <tr key={student.id}>
        <td data-label="Student"><span className="student-row"><span className="student-index">{String(index + 1).padStart(2, "0")}</span><b>{student.name}</b></span></td>
        <td data-label="Class & section">{student.class_name} <span className="section-dot">·</span> {student.section}</td>
        <td data-label="Posts"><b className="table-number">{student.count}</b></td>
        <td data-label="Reads"><b className="table-number">{student.views.toLocaleString()}</b></td>
        <td data-label="Categories"><span className="category-pills">{student.categories.length ? student.categories.map((category) => <span key={category}>{category}</span>) : <span>—</span>}</span></td>
      </tr>)}</tbody>
    </table></div> : <div className="admin-empty"><span className="eyebrow">THE CONTRIBUTORS’ PAGE</span><h2>The first byline is still waiting.</h2><p>Student names, classes, readership and contributions will appear here after their first story goes live.</p></div>}
  </main>;
}
