import { Link } from "wouter";
import { motion } from "framer-motion";
import { Leaf, Sprout, TrendingUp, ShieldCheck, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b-0 rounded-none bg-white/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground">AgriNova</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="font-medium hover:bg-primary/5">Log in</Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 shadow-lg shadow-primary/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 relative">
        {/* Subtle background decorative blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl -z-10 mix-blend-multiply" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Smart Crop Advisory Platform
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-display text-foreground leading-[1.1] mb-6">
              Cultivate the Future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Precision AI.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              AgriNova empowers modern farmers with data-driven crop recommendations, disease predictions, and comprehensive agricultural analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button size="lg" className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white text-lg shadow-xl shadow-primary/20 hover:-translate-y-1 transition-all">
                  Start Predicting <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 text-lg">
                View Demo
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* landing page hero scenic green agricultural field */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 aspect-[4/3] border-4 border-white">
              <img 
                src="https://pixabay.com/get/g428f7d98aebfc130cba7583aefb9b980c16cf9869535b70151fe47ead8906e2a4d7cb7edcb047b4464a17bfd19124287d09a8cf9897ae11dd3df9b500dd27edd_1280.jpg" 
                alt="Smart farming field" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent mix-blend-multiply" />
            </div>
            
            {/* Floating Glass Card */}
            <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-2xl animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                  <p className="text-2xl font-bold font-display text-foreground">94.8%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-display text-foreground mb-4">Enterprise-Grade Agronomy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Built on robust machine learning models to provide actionable insights for your specific soil and environmental conditions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sprout,
                title: "Crop Recommendation",
                desc: "Get precise crop suggestions based on your soil type, climate, and historical farm data."
              },
              {
                icon: ShieldCheck,
                title: "Disease Prediction",
                desc: "Identify potential crop risks before they manifest using predictive environmental modeling."
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                desc: "Track your farm's performance with beautiful, real-time charts and confidence metrics."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-background border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary mb-6">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
