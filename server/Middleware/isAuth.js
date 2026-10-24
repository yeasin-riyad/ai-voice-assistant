
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const isAuth = async (req, res, next) => {
  try {
    // 1. Get token from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // 3. Find authenticated user
    // const user = await User.findById(decoded.userId);

    // if (!user) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "User no longer exists. Please log in again.",
    //   });
    // }

    // 4. Attach user to request
    req.userId = decoded.userId;

    // 5. Continue to controller
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Session expired or invalid. Please log in again.",
      });
    }

    console.error("Authentication middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

export default isAuth;
