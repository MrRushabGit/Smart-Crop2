import { useUser } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth");
    } else if (!isLoading && user && requireAdmin && !user.email.includes("admin")) {
      // Very basic admin check based on email for UI purposes
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-display font-medium text-lg animate-pulse">Loading AgriNova...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (requireAdmin && !user.email.includes("admin")) return null;

  return <>{children}</>;
}
