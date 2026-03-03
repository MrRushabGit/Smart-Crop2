import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const login = useLogin();
  const register = useRegister();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login.mutate({ email: formData.email, password: formData.password });
    } else {
      register.mutate(formData);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-white mb-12">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Leaf className="w-7 h-7" />
            </div>
            <span className="font-display font-bold text-3xl">AgriNova</span>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold font-display text-white mb-6 leading-tight">
              Intelligence for <br/>Modern Agriculture.
            </h1>
            <p className="text-primary-foreground/80 text-lg max-w-md">
              Join thousands of forward-thinking farmers leveraging predictive AI to maximize yield and minimize risks.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md glass-card rounded-3xl p-8"
        >
          <div className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="font-display font-bold text-2xl text-foreground">AgriNova</span>
          </div>

          <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Log In</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="h-12 rounded-xl bg-background border-border focus-visible:ring-primary/20"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@farm.co" 
                  className="h-12 rounded-xl bg-background border-border focus-visible:ring-primary/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {isLogin && <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>}
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-12 rounded-xl bg-background border-border focus-visible:ring-primary/20"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all mt-6"
                disabled={login.isPending || register.isPending}
              >
                {(login.isPending || register.isPending) ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
