import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../lib/ApiError.js";

export const protectRoute = async (req, res, next) => {
  try {
    
    // Check if token exists in cookies
    const token = req.cookies.jwt;
    if (!token) {
      return next(new ApiError(401, "Unauthorized - No Token Provided"));
    }

    
    // Verify the token is validity
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new ApiError(401, "Invalid or Expired Token"));
    }

    // Find the user linked to the token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Attach user to req object for next middleware/controller
    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
