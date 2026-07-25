import Bookmark from "../models/Bookmark.js";
import Job from "../models/Job.js";

export const bookmarkJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const existingBookmark = await Bookmark.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (existingBookmark) {
      return res.status(409).json({
        success: false,
        message: "Job already bookmarked.",
      });
    }

    const bookmark = await Bookmark.create({
      candidate: req.user._id,
      job: jobId,
    });

    const populatedBookmark = await Bookmark.findById(bookmark._id)
      .populate({
        path: "job",
        populate: [
          {
            path: "company",
          },
          {
            path: "recruiter",
            select: "name email",
          },
        ],
      });

    res.status(201).json({
      success: true,
      message: "Job bookmarked successfully.",
      bookmark: populatedBookmark,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      candidate: req.user._id,
    })
      .populate({
        path: "job",
        populate: [
          {
            path: "company",
          },
          {
            path: "recruiter",
            select: "name email",
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalBookmarks: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { jobId } = req.params;

    const bookmark = await Bookmark.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found.",
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const { jobId } = req.params;

    const bookmark = await Bookmark.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found.",
      });
    }

    bookmark.isFavorite = !bookmark.isFavorite;

    await bookmark.save();

    res.status(200).json({
      success: true,
      message: bookmark.isFavorite
        ? "Job added to favorites."
        : "Job removed from favorites.",
      bookmark,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};