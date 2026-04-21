import { z } from 'zod';
import { insertUserSchema, insertPredictionSchema, users, predictions } from './schema';

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
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
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
        200: z.array(z.custom<typeof predictions.$inferSelect>()),
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
        201: z.custom<typeof predictions.$inferSelect>(),
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
          recentActivity: z.array(z.custom<typeof predictions.$inferSelect>()),
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
