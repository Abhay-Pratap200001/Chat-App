import express from 'express'
import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.Controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { loginRateLimiter, signupRateLimiter } from '../middleware/rateLimit.middleware.js'

const router = express.Router()

router.post("/signup", signupRateLimiter, signup);
router.post("/login", loginRateLimiter, login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default  router


