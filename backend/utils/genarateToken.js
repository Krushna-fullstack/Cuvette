import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, role, res) => {
  // Include role in the JWT payload
  const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    sameSite: true,
    // secure: process.env.NODE_ENV !== "development",
  });
};
