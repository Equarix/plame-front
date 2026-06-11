"use client";

import dynamic from "next/dynamic";

const AdminPersonasPage = dynamic(
  () => import("@/modules/admin/pages/AdminPersonasPage").then((mod) => mod.AdminPersonasPage),
  { ssr: false }
);

export default function Page() {
  return <AdminPersonasPage />;
}
