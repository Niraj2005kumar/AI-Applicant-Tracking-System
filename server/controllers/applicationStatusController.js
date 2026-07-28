import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";
import { createNotification } from "./notificationController.js";

const validStatuses = [
  "Pending",
  "Reviewed",
  "Shortlisted",
  "Rejected",
  "Hired",
];

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Application status is required.",
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const job = await Job.findById(application.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    application.status = status;

    await application.save();

    const updatedApplication = await Application.findById(application._id)
      .populate(
        "candidate",
        "name email phone profileImage resume skills experience education location bio"
      )
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo website location",
        },
      });

    const candidate = updatedApplication.candidate;
    const jobDetails = updatedApplication.job;
    const company = jobDetails.company;

    let message = "";

    switch (status) {
      case "Reviewed":
        message = "Your application has been reviewed by the recruiter.";
        break;

      case "Shortlisted":
        message =
          "Congratulations! You have been shortlisted for the next round.";
        break;

      case "Rejected":
        message = "Thank you for applying. Unfortunately, you were not selected.";
        break;

      case "Hired":
        message = "Congratulations! You have been selected for this position.";
        break;

      default:
        message = "Your application status has been updated.";
    }

    try {
      await createNotification({
        recipient: candidate._id,
        sender: req.user._id,
        title: "Application Status Updated",
        message: `Your application for ${jobDetails.title} is now ${status}.`,
        type: "Application",
        relatedId: updatedApplication._id,
      });

      await sendEmail({
        to: candidate.email,
        subject: "Application Status Updated",
        html: `
          <h2>Hello ${candidate.name},</h2>

          <p>Your application for <strong>${jobDetails.title}</strong> at
          <strong>${company.name}</strong> has been updated.</p>

          <p><strong>Current Status:</strong> ${status}</p>

          <p>${message}</p>

          <br>

          <p>Best Regards,</p>
          <p>AI Powered Applicant Tracking System</p>
        `,
      });
    } catch (emailError) {
      console.error(emailError);
    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application: updatedApplication,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getApplicationsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status.",
      });
    }

    const recruiterJobs = await Job.find({
      recruiter: req.user._id,
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
      status,
    })
      .populate(
        "candidate",
        "name email phone profileImage resume skills experience education location bio"
      )
      .populate({
        path: "job",
        select: "title location salary jobType company",
        populate: {
          path: "company",
          select: "name logo location",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status,
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getSingleApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id.",
      });
    }

    const application = await Application.findById(id)
      .populate(
        "candidate",
        "name email phone profileImage resume skills experience education location bio"
      )
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name logo website industry location companySize",
        },
      });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    const job = await Job.findById(application.job._id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    res.status(200).json({
      success: true,
      application: {
        _id: application._id,
        candidate: application.candidate,
        job: application.job,
        resume: application.resume,
        coverLetter: application.coverLetter,
        status: application.status,
        appliedAt: application.appliedAt,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
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

export const getApplicationStatistics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const recruiterJobs = await Job.find({
      recruiter: recruiterId,
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const [
      totalApplications,
      pending,
      reviewed,
      shortlisted,
      rejected,
      hired,
    ] = await Promise.all([
      Application.countDocuments({
        job: { $in: jobIds },
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Pending",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Reviewed",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Shortlisted",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Rejected",
      }),
      Application.countDocuments({
        job: { $in: jobIds },
        status: "Hired",
      }),
    ]);

    const statusWiseApplications = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statistics: {
        totalApplications,
        pending,
        reviewed,
        shortlisted,
        rejected,
        hired,
      },
      statusWiseApplications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
