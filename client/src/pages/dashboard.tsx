import { useState } from "react";
import { DashboardLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatePrediction } from "@/hooks/use-predictions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Leaf, AlertTriangle, CheckCircle2, Sprout, Droplets, Target, Activity } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const createPrediction = useCreatePrediction();
  
  const [formData, setFormData] = useState({
    farmArea: "",
    irrigationType: "",
    fertilizerUsed: "",
    pesticideUsed: "",
    soilType: "",
    season: "",
    waterUsage: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPrediction.mutate({
      farmArea: Number(formData.farmArea),
      irrigationType: formData.irrigationType,
      fertilizerUsed: Number(formData.fertilizerUsed),
      pesticideUsed: Number(formData.pesticideUsed),
      soilType: formData.soilType,
      season: formData.season,
      waterUsage: Number(formData.waterUsage),
    });
  };

  const result = createPrediction.data;
  const metricsData = result ? [
    { subject: 'Accuracy', A: result.metrics.accuracy * 100, fullMark: 100 },
    { subject: 'Precision', A: result.metrics.precision * 100, fullMark: 100 },
    { subject: 'Recall', A: result.metrics.recall * 100, fullMark: 100 },
    { subject: 'F1 Score', A: result.metrics.f1Score * 100, fullMark: 100 },
  ] : [];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Smart Advisory</h1>
          <p className="text-muted-foreground mt-1">Enter your field parameters to get AI-driven insights.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold font-display text-foreground mb-6 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Field Parameters
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Farm Area (Acres)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 5.5" 
                      required
                      value={formData.farmArea}
                      onChange={e => setFormData({...formData, farmArea: e.target.value})}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Water Usage (Liters)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 1500" 
                      required
                      value={formData.waterUsage}
                      onChange={e => setFormData({...formData, waterUsage: e.target.value})}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fertilizer (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 50" 
                      required
                      value={formData.fertilizerUsed}
                      onChange={e => setFormData({...formData, fertilizerUsed: e.target.value})}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pesticide (kg)</Label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 10" 
                      required
                      value={formData.pesticideUsed}
                      onChange={e => setFormData({...formData, pesticideUsed: e.target.value})}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Select onValueChange={v => setFormData({...formData, soilType: v})} required>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select soil type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loamy">Loamy</SelectItem>
                      <SelectItem value="Clay">Clay</SelectItem>
                      <SelectItem value="Sandy">Sandy</SelectItem>
                      <SelectItem value="Silt">Silt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Irrigation Type</Label>
                  <Select onValueChange={v => setFormData({...formData, irrigationType: v})} required>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select irrigation" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Drip">Drip Irrigation</SelectItem>
                      <SelectItem value="Sprinkler">Sprinkler</SelectItem>
                      <SelectItem value="Flood">Flood</SelectItem>
                      <SelectItem value="Rainfed">Rainfed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Season</Label>
                  <Select onValueChange={v => setFormData({...formData, season: v})} required>
                    <SelectTrigger className="bg-background"><SelectValue placeholder="Select season" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
                      <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
                      <SelectItem value="Zaid">Zaid (Summer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-md rounded-xl mt-4" 
                  disabled={createPrediction.isPending}
                >
                  {createPrediction.isPending ? "Analyzing..." : "Generate Advisory"}
                </Button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !createPrediction.isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-white/40"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-6">
                    <Target className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Awaiting Parameters</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Enter your field data on the left to generate an AI-powered crop recommendation and risk analysis.
                  </p>
                </motion.div>
              )}

              {createPrediction.isPending && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center p-12 border border-border/50 rounded-2xl bg-white shadow-sm"
                >
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <Leaf className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Processing Data</h3>
                  <p className="text-muted-foreground">Running parameters through the prediction engine...</p>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Primary Recommendation Card */}
                  <div className="bg-gradient-to-br from-primary to-[#0a2e22] rounded-3xl p-8 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                    
                    <div className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium uppercase tracking-wider mb-4">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                      Recommended Crop
                    </div>
                    
                    <h2 className="text-5xl font-display font-bold mb-6">{result.recommendedCrop}</h2>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-sm text-primary-foreground/70 mb-1">Confidence Score</div>
                        <div className="text-2xl font-bold font-display">{(result.confidenceScore * 100).toFixed(1)}%</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                        <div className="text-sm text-primary-foreground/70 mb-1">Disease Risk</div>
                        <div className="text-lg font-bold font-display flex items-center gap-2">
                          {result.diseasePrediction === 'None' ? (
                            <span className="text-secondary">Low</span>
                          ) : (
                            <><AlertTriangle className="w-4 h-4 text-destructive" /> High</>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Analysis Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        Disease Advisory
                      </h3>
                      {result.diseasePrediction === 'None' ? (
                        <p className="text-muted-foreground">Based on the parameters, the conditions are optimal. No major disease risks detected for the selected crop.</p>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-destructive font-medium">Risk Detected: {result.diseasePrediction}</p>
                          <p className="text-sm text-muted-foreground">Consider adjusting irrigation schedules and applying preventive organic fungicides suitable for {result.soilType} soil.</p>
                        </div>
                      )}
                    </div>

                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Model Performance
                      </h3>
                      <div className="h-48 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={metricsData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                            <Radar name="Metrics" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
