"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const TRegistroCrearPage = dynamic(
  () => import("@/modules/dashboard/pages/TRegistroCrearPage").then((mod) => mod.TRegistroCrearPage),
  { ssr: false }
);

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Cargando formulario...</div>}>
      <TRegistroCrearPage />
    </Suspense>
  );
}
