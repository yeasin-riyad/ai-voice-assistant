
import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    path: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    assistantName: {
      type: String,
      default: "Shifra",
      trim: true,
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
    },

    businessType: {
      type: String,
      trim: true,
      default: "",
    },

    businessDescription: {
      type: String,
      trim: true,
      default: "",
    },

    tone: {
      type: String,
      enum: ["friendly", "professional", "sales"],
      default: "friendly",
    },

    theme: {
      type: String,
      enum: ["light", "dark", "glass", "neon"],
      default: "dark",
    },

    enableVoice: {
      type: Boolean,
      default: true,
    },

    pages: {
      type: [pageSchema],
      default: [],
    },

    enableNavigation: {
      type: Boolean,
      default: false,
    },

    geminiApiKey: {
      type: String,
      select: false,
      default: null,
    },

    geminiStatus: {
      type: String,
      enum: ["active", "quota_exceeded", "invalid"],
      default: "active",
    },

    totalMessages: {
      type: Number,
      default: 0,
      min: 0,
    },

    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    requestLimit: {
      type: Number,
      default: 100,
      min: 0,
    },

    proExpiresAt: {
      type: Date,
      default: null,
    },

    isSetupComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
