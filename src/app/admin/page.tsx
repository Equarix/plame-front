"use client";

import dynamic from "next/dynamic";

const AdminDashboardPage = dynamic(
  () => import("@/modules/admin/pages/AdminDashboardPage").then((mod) => mod.AdminDashboardPage),
  { ssr: false }
);

export default function Page() {
  return <AdminDashboardPage />;
}
