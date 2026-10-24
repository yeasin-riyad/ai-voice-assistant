
import jwt from "jsonwebtoken";

export const genToken = (userId) => {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { userId },
      secret,
      { expiresIn: "7d" }
    );

    return token;
  } catch (error) {
    throw error;
  }
};
