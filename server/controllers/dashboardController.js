import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import Application from "../models/Application.js";

export const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user._id;

    const user = await User.findById(candidateId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const totalAppliedJobs = await Application.countDocuments({
      candidate: candidateId,
    });

    const totalSavedJobs = await Bookmark.countDocuments({
      candidate: candidateId,
    });

    const totalFavoriteJobs = await Bookmark.countDocuments({
      candidate: candidateId,
      isFavorite: true,
    });

    const recentApplications = await Application.find({
      candidate: candidateId,
    })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      })
      .sort({ createdAt: -1 })
      .limit(5);

    let profileCompletion = 0;

    if (user.name) profileCompletion += 15;
    if (user.email) profileCompletion += 15;
    if (user.phone) profileCompletion += 10;
    if (user.location) profileCompletion += 10;
    if (user.education) profileCompletion += 15;
    if (user.skills.length > 0) profileCompletion += 15;
    if (user.resume) profileCompletion += 20;

    res.status(200).json({
      success: true,
      dashboard: {
        totalAppliedJobs,
        totalSavedJobs,
        totalFavoriteJobs,
        resumeUploaded: !!user.resume,
        profileCompletion,
        recentApplications,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};