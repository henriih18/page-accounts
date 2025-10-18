"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    // Avoid redirect loops
    if (pathname === "/auth/signin" || pathname === "/auth/signup") {
      return;
    }

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (requireAdmin && session.user.role !== "ADMIN") {
      router.push("/dashboard");
      return;
    }
  }, [session, status, router, requireAdmin, pathname]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Avoid redirect loops
  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    return <>{children}</>;
  }

  if (!session) {
    return null;
  }

  if (requireAdmin && session.user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}