import { z } from 'zod';
export type User = {
  id: number;
  name: string;
  email: string;
  signupDate: Date;
};

export type Prediction = {
  id: number;
  userId: number;
  inputValues: unknown;
  recommendedCrop: string;
  diseasePrediction: string;
  confidenceScore: number;
  metrics: unknown;
  timestamp: Date;
};

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPredictionSchema = z.object({
  farmArea: z.number().positive(),
  irrigationType: z.string(),
  fertilizerUsed: z.number().nonnegative(),
  pesticideUsed: z.number().nonnegative(),
  soilType: z.string(),
  season: z.string(),
  waterUsage: z.number().positive(),
});

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    me: {
      method: 'GET' as const,
      path: '/api/user' as const,
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<User>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout' as const,
      responses: {
        200: z.void(),
      },
    }
  },
  predictions: {
    list: {
      method: 'GET' as const,
      path: '/api/predictions' as const,
      responses: {
        200: z.array(z.custom<Prediction>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/predictions' as const,
      input: z.object({
        farmArea: z.number(),
        irrigationType: z.string(),
        fertilizerUsed: z.number(),
        pesticideUsed: z.number(),
        soilType: z.string(),
        season: z.string(),
        waterUsage: z.number(),
      }),
      responses: {
        201: z.custom<Prediction>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        500: errorSchemas.internal,
      },
    }
  },
  admin: {
    stats: {
      method: 'GET' as const,
      path: '/api/admin/stats' as const,
      responses: {
        200: z.object({
          totalUsers: z.number(),
          totalPredictions: z.number(),
          mostPredictedCrops: z.array(z.object({ crop: z.string(), count: z.number() })),
          accuracyTrends: z.array(z.object({ date: z.string(), averageAccuracy: z.number() })),
          recentActivity: z.array(z.custom<Prediction>()),
        }),
        401: errorSchemas.unauthorized,
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
