// middlewares/auth.js
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const isCompany = (req, res, next) => {
  if (req.user.role !== "company") {
    return res
      .status(403)
      .json({ error: "Access denied. Only companies can post jobs." });
  }
  next();
};
