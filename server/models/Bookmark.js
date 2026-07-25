import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

bookmarkSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;