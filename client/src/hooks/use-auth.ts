import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function useUser() {
  return useQuery({
    queryKey: [api.auth.me.path],
    queryFn: async () => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.auth.me.path}`, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch user");
      return api.auth.me.responses[200].parse(await res.json());
    },
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.login.input>) => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.auth.login.path}`, {
        method: api.auth.login.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid credentials");
        throw new Error("Login failed");
      }
      return api.auth.login.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      toast({ title: "Welcome back", description: "Successfully logged in." });
      // Redirect based on email domain or property (simple mock admin check)
      if (user.email.includes("admin")) {
        setLocation("/admin");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: (error: Error) => {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.auth.register.input>) => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.auth.register.path}`, {
        method: api.auth.register.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation failed");
        }
        throw new Error("Registration failed");
      }
      return api.auth.register.responses[201].parse(await res.json());
    },
    onSuccess: (user) => {
      queryClient.setQueryData([api.auth.me.path], user);
      toast({ title: "Account created", description: "Welcome to AgriNova!" });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.auth.logout.path}`, {
        method: api.auth.logout.method,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => {
      queryClient.setQueryData([api.auth.me.path], null);
      toast({ title: "Logged out", description: "You have been successfully logged out." });
      setLocation("/");
    },
  });
}
