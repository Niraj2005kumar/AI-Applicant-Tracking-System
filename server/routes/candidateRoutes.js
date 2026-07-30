import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("candidate"),
  async (req, res) => {
    try {
      const { name, phone, location, skills, experience, bio } = req.body;
      
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (location !== undefined) user.location = location;
      if (bio !== undefined) user.bio = bio;
      if (experience !== undefined) user.experience = Number(experience) || 0;
      
      if (skills !== undefined) {
        user.skills = Array.isArray(skills) 
          ? skills 
          : skills.split(",").map(s => s.trim()).filter(Boolean);
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          location: user.location,
          skills: user.skills,
          experience: user.experience,
          bio: user.bio,
          resume: user.resume
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

export default router;
