"use client";

export function AdminLogout() {
  return (
    <button
      className="admin-logout"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.assign("/admin/login");
      }}
    >
      Sign out
    </button>
  );
}
