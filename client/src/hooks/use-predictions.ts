import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

export function usePredictions() {
  return useQuery({
    queryKey: [api.predictions.list.path],
    queryFn: async () => {
      const res = await fetch(api.predictions.list.path, { credentials: "include" });
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
      const res = await fetch(api.predictions.create.path, {
        method: api.predictions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate prediction");
      }
      return api.predictions.create.responses[201].parse(await res.json());
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
