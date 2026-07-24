import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 100,
    },

    logo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      required: [true, "Industry is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+",
      ],
      default: "1-10",
    },

    foundedYear: {
      type: Number,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;