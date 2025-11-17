import rateLimit from "express-rate-limit";
import { ApiError } from "../lib/ApiError.js";

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,               // 5 attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again after 1 minute.",
  },
  handler: (req, res, next, options) => {
    return next(new ApiError(429, options.message.message));
  },
});





export const signupRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 mins
  max: 3,
  message: {
    message: "Too many signup attempts. Try later.",
  },
  handler: (req, res, next, options) => {
    return next(new ApiError(429, options.message.message));
  },
});

