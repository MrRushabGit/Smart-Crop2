import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  if (token) {
    return { "Authorization": `Bearer ${token}` };
  }
  return {};
}

export function usePredictions() {
  return useQuery({
    queryKey: [api.predictions.list.path],
    queryFn: async () => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.predictions.list.path}`, { 
        headers: { ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error("Failed to fetch predictions");
      return await res.json();
    },
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: z.infer<typeof api.predictions.create.input>) => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.predictions.create.path}`, {
        method: api.predictions.create.method,
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await res.json().catch(() => null);
      
      if (!res.ok || !responseData) {
        throw new Error(responseData?.message || responseData?.error || "Failed to generate prediction");
      }
      
      // Handle the { success: true, data: ... } wrapper format
      const resultData = responseData.data ? responseData.data : responseData;
      return resultData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.predictions.list.path] });
      toast({ title: "Prediction Complete", description: "Your crop analysis is ready." });
    },
    onError: (error: Error) => {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    },
  });
}

