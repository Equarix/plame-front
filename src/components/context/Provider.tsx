"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import AuthProvider from "./AuthContext";
import { Toaster } from "sonner";

const queryClient = new QueryClient()

export function Provider({ children }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {children}
                <Toaster richColors position="top-right" />
            </AuthProvider>
        </QueryClientProvider>
    )
}