const requests = new Map();

export const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    const tracker = requests.get(ip);
    if (now - tracker.startTime > windowMs) {
      tracker.count = 1;
      tracker.startTime = now;
      return next();
    }

    tracker.count++;
    if (tracker.count > limit) {
      return res.status(429).json({
        message: 'Too many requests from this IP, please try again later after 15 minutes.',
      });
    }

    next();
  };
};
