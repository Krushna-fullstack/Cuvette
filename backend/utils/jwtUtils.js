import jwt from "jsonwebtoken";

export const generateVerificationToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "5h",
  });
};
