import rateLimit from 'express-rate-limit';

// Helper to bridge Express middleware with Next.js API routes
function initMiddleware(middleware: any) {
  return (req: any, res: any) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 30, // Limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

export const rateLimitMiddleware = initMiddleware(limiter);
