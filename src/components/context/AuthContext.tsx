"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useLocaleStorage";
import Cookie from "js-cookie";
import type { ApiResponse, AuthResponse, UserData } from "@/interface/response.interface";
import { useMutation } from "@tanstack/react-query";
import type { AuthSchemaType } from "@/schemas/auth/login.schema";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContextProps {
    user?: AuthResponse;
    token: string;
    // register: (data: RegisterSchemaType) => void;
    // isLoadRegister: boolean;
    logout: () => void;
    setUser: (user: AuthResponse) => void;
    setToken: (token: string) => void;
    login: (data: AuthSchemaType) => void;
    isLoadLogin: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser, deleteUser] = useLocalStorage<AuthResponse | undefined>(
        "user",
        undefined
    );
    const [token, setToken] = useState<string>(() => user?.token || "");
    const router = useRouter();

    useEffect(() => {
        if (user) {
            Cookie.set("token", user.token);
        }
    }, [user]);

    const { mutate: login, isPending: isLoadLogin } = useMutation({
        mutationFn: async (data: AuthSchemaType) => {
            const res = await Api.post("/auth/login", data);
            console.log(res.data)
            return res.data as ApiResponse<UserData>;
        },
        onSuccess: ({ body: data, token: authToken }) => {
            const authUser: AuthResponse = {
                userId: data.userId,
                name: data.name,
                lastName: data.lastName,
                username: data.username,
                role: data.role,
                token: authToken!,
            };
            setUser(authUser);
            setToken(authToken!);
            Cookie.set("token", authToken!);
            toast.success("Inicio de sesión exitoso");
            router.push("/");
        },
        onError: (e) => {
            console.log(e)
            toast.error("Error al iniciar sesión o credenciales inválidas");
        },
    });

    const logout = () => {
        deleteUser();
        setToken("");
        Cookie.remove("token");
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                // register,
                // isLoadRegister,
                logout,
                setUser,
                setToken,
                login,
                isLoadLogin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}