import { DashboardLayout } from "@/components/layout";
import { ProtectedRoute } from "@/components/protected-route";
import { useAdminStats } from "@/hooks/use-admin";
import { motion } from "framer-motion";
import { Users, Activity, Target, Database } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();

  if (isLoading || !stats) {
    return (
      <ProtectedRoute requireAdmin>
        <DashboardLayout isAdmin>
          <div className="space-y-6">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-80 rounded-2xl" />
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Total Predictions", value: stats.totalPredictions, icon: Activity, color: "text-primary", bg: "bg-primary/10" },
    { title: "Avg Accuracy", value: `${(stats.accuracyTrends[stats.accuracyTrends.length - 1]?.averageAccuracy * 100 || 0).toFixed(1)}%`, icon: Target, color: "text-secondary", bg: "bg-secondary/20" },
    { title: "System Status", value: "Healthy", icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <DashboardLayout isAdmin>
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display text-foreground">Platform Overview</h1>
          <p className="text-muted-foreground mt-1">Global metrics and real-time user activity tracking.</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="glass-card p-6 rounded-2xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-3xl font-display font-bold text-foreground">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="font-display font-bold text-lg mb-6 text-foreground">Model Accuracy Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.accuracyTrends}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v*100).toFixed(0)}%`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [`${(val * 100).toFixed(2)}%`, 'Accuracy']}
                  />
                  <Area type="monotone" dataKey="averageAccuracy" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="font-display font-bold text-lg mb-6 text-foreground">Most Predicted Crops</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.mostPredictedCrops}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="crop" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--secondary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h3 className="font-display font-bold text-lg text-foreground">Recent Platform Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30">
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Predicted Crop</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Disease Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 bg-white">
                {stats.recentActivity.map((activity) => (
                  <tr key={activity.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                      {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">User #{activity.userId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-primary">{activity.recommendedCrop}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary" style={{width: `${activity.confidenceScore * 100}%`}}></div>
                        </div>
                        {(activity.confidenceScore * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {activity.diseasePrediction === 'None' ? 
                        <span className="text-secondary font-medium">None</span> : 
                        <span className="text-destructive font-medium">{activity.diseasePrediction}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
