import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import crypto from "crypto";
import { spawn } from "child_process";
import path from "path";

// Simple hash function for passwords
const hashPassword = (password: string) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Session & Passport
  app.use(session({
    secret: process.env.SESSION_SECRET || 'agrinova_super_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      if (user.password !== hashPassword(password)) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth Routes
  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
      const user = await storage.createUser({
        ...input,
        password: hashPassword(input.password)
      });
      req.login(user, (err) => {
        if (err) throw err;
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.login.path, passport.authenticate('local'), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: "Logout failed" });
      res.status(200).send();
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  });

  // Prediction Routes
  app.get(api.predictions.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const predictions = await storage.getUserPredictions((req.user as any).id);
    res.status(200).json(predictions);
  });

  app.post(api.predictions.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.predictions.create.input.parse(req.body);
      
      // Call Python Script for ML Prediction
      const pythonProcess = spawn('python3', [
        path.join(process.cwd(), 'server', 'ml.py'),
        JSON.stringify(input)
      ]);

      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error("Python script failed:", errorOutput);
          return res.status(500).json({ message: "Prediction model failed" });
        }

        try {
          const mlResult = JSON.parse(output.trim());
          const prediction = await storage.createPrediction({
            userId: (req.user as any).id,
            inputValues: input,
            recommendedCrop: mlResult.recommendedCrop,
            diseasePrediction: mlResult.diseasePrediction,
            confidenceScore: mlResult.confidenceScore,
            metrics: mlResult.metrics
          });
          res.status(201).json(prediction);
        } catch (e) {
          console.error("Failed to parse Python output:", output);
          res.status(500).json({ message: "Invalid output from model" });
        }
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin Routes
  app.get(api.admin.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Simple admin check: in a real app, verify role
    const stats = await storage.getAdminStats();
    res.status(200).json(stats);
  });

  return httpServer;
}
