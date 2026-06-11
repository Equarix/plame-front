"use client";

import dynamic from "next/dynamic";

const TRegistroCrearPage = dynamic(
  () => import("@/modules/dashboard/pages/TRegistroCrearPage").then((mod) => mod.TRegistroCrearPage),
  { ssr: false }
);

export default function Page() {
  return <TRegistroCrearPage />;
}
