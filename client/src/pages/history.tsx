import { DashboardLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { usePredictions } from "@/hooks/use-predictions";
import { format } from "date-fns";
import { Sprout, AlertTriangle, Calendar, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { data: predictions, isLoading } = usePredictions();

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Prediction History</h1>
          <p className="text-muted-foreground mt-1">Review your past agricultural advisories and outcomes.</p>
        </div>

        <div className="space-y-4">
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-6">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}

          {predictions?.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-white rounded-3xl border border-border/50">
              <Sprout className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-1">No History Yet</h3>
              <p className="text-muted-foreground">Run your first prediction to see it here.</p>
            </div>
          )}

          {predictions?.map((pred) => (
            <div key={pred.id} className="glass-card p-6 rounded-2xl hover:shadow-lg transition-all duration-200 border-l-4" style={{ borderLeftColor: 'hsl(var(--primary))' }}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-foreground flex items-center gap-2">
                      {pred.recommendedCrop}
                      <span className="text-xs font-sans font-medium px-2 py-1 rounded-full bg-secondary/20 text-primary">
                        {(pred.confidenceScore * 100).toFixed(1)}% Confidence
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(pred.timestamp), 'MMM d, yyyy')}</span>
                      <span>•</span>
                      <span>Area: {pred.inputValues.farmArea} Acres</span>
                      <span>•</span>
                      <span>Soil: {pred.inputValues.soilType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 bg-muted/30 p-3 rounded-xl min-w-[200px]">
                  <div className="text-sm font-medium text-foreground flex items-center gap-2">
                    Disease Risk: 
                    {pred.diseasePrediction === 'None' ? (
                      <span className="flex items-center text-secondary gap-1"><CheckCircle2 className="w-4 h-4" /> Low</span>
                    ) : (
                      <span className="flex items-center text-destructive gap-1"><AlertTriangle className="w-4 h-4" /> {pred.diseasePrediction}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
