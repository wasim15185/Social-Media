import jwt from "jsonwebtoken";

/**
 * Generates a JWT token for authentication.
 *
 * @param payload Data to encode inside token
 */
export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
