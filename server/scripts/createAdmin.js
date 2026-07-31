import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@aiats.com";
    const password = "Admin@12345";
    const name = "System Admin";

    const existing = await User.findOne({ email });

    if (existing) {
      console.log(`✅ Admin already exists: ${email}`);
      console.log("   Role:", existing.role);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      phone: "",
      location: "",
      bio: "System administrator for AI ATS.",
    });

    console.log("✅ Admin account created successfully.");
    console.log("----------------------------------------");
    console.log("   Email:   ", admin.email);
    console.log("   Password:", password);
    console.log("   Role:    ", admin.role);
    console.log("----------------------------------------");
    console.log("   Login URL: http://localhost:5173/admin/login");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message);
    process.exit(1);
  }
};

createAdmin();

