import { ApiError } from "../lib/ApiError.js";
import cloudinary from "../lib/cloudinary.js";
import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/* -------------------------------- SIGNUP -------------------------------- */
export const signup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  try {
    //All fields validation
    if (!fullName || !email || !password) {
      return next(new ApiError(400, "All fields are required"));
    }

    // Password validation
    if (password.length < 6) {
      return next(new ApiError(400, "Password must be at least 6 characters"));
    }

    // User already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ApiError(400, "User with this email already exists"));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Token Generate
    genrateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.log("Signup controller error:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};




/* -------------------------------- LOGIN -------------------------------- */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // All fields present
    if (!email || !password) {
      return next(new ApiError(400, "All fields are required"));
    }

    // User exists check
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(400, "Invalid credentials"));
    }

    // Password check
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(new ApiError(401, "Incorrect password"));
    }

    // Token
    genrateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });

  } catch (error) {
    console.log("Login controller error:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};




/* -------------------------------- LOGOUT -------------------------------- */
export const logout = async (_, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Logout controller error:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};




/* ----------------------------- UPDATE PROFILE ----------------------------- */
export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic } = req.body;    
    const userId = req.user._id;    

    // Profile pic required
    if (!profilePic) {
      return next(new ApiError(400, "Profile picture is required"));
    }

    // Cloudinary upload
    const uploadedImage = await cloudinary.uploader.upload(profilePic);
    
    // U: Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    return res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Update profile controller error:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};




/* -------------------------------- CHECK AUTH -------------------------------- */
export const checkAuth = (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Check auth controller error:", error.message);
    return next(new ApiError(500, "Internal Server Error"));
  }
};
