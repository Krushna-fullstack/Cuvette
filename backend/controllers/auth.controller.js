import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { generateVerificationToken } from "../utils/jwtUtils.js";
import { sendVerificationEmail } from "../utils/nodemailer.js";
import { generateTokenAndSetCookie } from "../utils/genarateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role, mobile } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
      isVerified: false,
    });
    await newUser.save();

    const verificationToken = generateVerificationToken(newUser);
    await sendVerificationEmail(newUser.email, verificationToken);

    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified) {
      console.log("Email not verified for user:", user.email); // Add this line
      return res.status(403).json({ error: "Email not verified" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
