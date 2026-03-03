import { Link, useLocation } from "wouter";
import { Leaf, LayoutDashboard, History, Settings, LogOut, BarChart3 } from "lucide-react";
import { useUser, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export function DashboardLayout({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const [location] = useLocation();
  const { data: user } = useUser();
  const logout = useLogout();

  const navigation = isAdmin ? [
    { name: "Overview", href: "/admin", icon: BarChart3 },
  ] : [
    { name: "Advisory", href: "/dashboard", icon: LayoutDashboard },
    { name: "History", href: "/dashboard/history", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border/50 px-4 py-6 flex flex-col">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Leaf className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            AgriNova
            {isAdmin && <span className="text-xs text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>}
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"}
                `}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-border/50">
          <div className="px-4 py-3 mb-2">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
