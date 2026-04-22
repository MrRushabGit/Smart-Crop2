import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function usePredictions() {
  return useQuery({
    queryKey: [api.predictions.list.path],
    queryFn: async () => {
      const API_BASE = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${API_BASE}${api.predictions.list.path}`, { 
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch predictions");
      return api.predictions.list.responses[200].parse(await res.json());
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      const responseData = await res.json().catch(() => null);
      
      if (!res.ok || !responseData) {
        throw new Error(responseData?.message || responseData?.error || "Failed to generate prediction");
      }
      
      // Handle the { success: true, data: ... } wrapper format
      const resultData = responseData.data ? responseData.data : responseData;
      return api.predictions.create.responses[201].parse(resultData);
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
