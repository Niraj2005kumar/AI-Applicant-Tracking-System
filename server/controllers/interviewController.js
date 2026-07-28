import mongoose from "mongoose";
import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import sendEmail from "../utils/sendEmail.js";

export const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      interviewDate,
      interviewTime,
      mode,
      meetingLink,
      location,
      notes,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application id.",
      });
    }

    if (!interviewDate || !interviewTime || !mode) {
      return res.status(400).json({
        success: false,
        message: "Interview date, time and mode are required.",
      });
    }

    if (!["Online", "Offline"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview mode.",
      });
    }

    const application = await Application.findById(applicationId)
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

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (application.status !== "Shortlisted") {
      return res.status(400).json({
        success: false,
        message: "Interview can only be scheduled for shortlisted candidates.",
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

    const existingInterview = await Interview.findOne({
      application: applicationId,
    });

    if (existingInterview) {
      return res.status(400).json({
        success: false,
        message: "Interview already scheduled for this application.",
      });
    }

    const interview = await Interview.create({
      candidate: application.candidate._id,
      recruiter: req.user._id,
      company: application.job.company._id,
      job: application.job._id,
      application: application._id,
      interviewDate,
      interviewTime,
      mode,
      meetingLink: meetingLink || "",
      location: location || "",
      notes: notes || "",
    });

    try {
      await sendEmail({
        to: application.candidate.email,
        subject: "Interview Scheduled",
        html: `
          <h2>Hello ${application.candidate.name},</h2>

          <p>Congratulations!</p>

          <p>Your interview has been scheduled.</p>

          <p><strong>Company:</strong> ${application.job.company.name}</p>

          <p><strong>Job Title:</strong> ${application.job.title}</p>

          <p><strong>Date:</strong> ${new Date(
            interviewDate
          ).toLocaleDateString()}</p>

          <p><strong>Time:</strong> ${interviewTime}</p>

          <p><strong>Mode:</strong> ${mode}</p>

          ${
            mode === "Online"
              ? `<p><strong>Meeting Link:</strong> ${meetingLink}</p>`
              : `<p><strong>Location:</strong> ${location}</p>`
          }

          <p><strong>Notes:</strong> ${notes || "N/A"}</p>

          <br>

          <p>Best Regards,</p>

          <p>AI Powered Applicant Tracking System</p>
        `,
      });
    } catch (emailError) {
      console.error(emailError);
    }

    const scheduledInterview = await Interview.findById(interview._id)
      .populate(
        "candidate",
        "name email phone profileImage"
      )
      .populate("company", "name logo website location")
      .populate("job", "title location salary")
      .populate("recruiter", "name email");

    res.status(201).json({
      success: true,
      message: "Interview scheduled successfully.",
      interview: scheduledInterview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecruiterInterviews = async (req, res) => {
  try {
    const { status, mode, date, sort = "latest" } = req.query;

    const filter = {
      recruiter: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (mode) {
      filter.mode = mode;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filter.interviewDate = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { interviewDate: 1 };
        break;

      case "status":
        sortOption = { status: 1 };
        break;

      default:
        sortOption = { interviewDate: -1 };
    }

    const interviews = await Interview.find(filter)
      .populate(
        "candidate",
        "name email phone profileImage resume skills experience education location"
      )
      .populate(
        "company",
        "name logo website location"
      )
      .populate(
        "job",
        "title location salary jobType"
      )
      .sort(sortOption);

    const statistics = {
      total: interviews.length,
      scheduled: interviews.filter(
        (item) => item.status === "Scheduled"
      ).length,
      completed: interviews.filter(
        (item) => item.status === "Completed"
      ).length,
      cancelled: interviews.filter(
        (item) => item.status === "Cancelled"
      ).length,
      rescheduled: interviews.filter(
        (item) => item.status === "Rescheduled"
      ).length,
    };

    res.status(200).json({
      success: true,
      statistics,
      totalInterviews: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getCandidateInterviews = async (req, res) => {
  try {
    const { status, mode, sort = "latest" } = req.query;

    const filter = {
      candidate: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (mode) {
      filter.mode = mode;
    }

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { interviewDate: 1 };
        break;

      case "status":
        sortOption = { status: 1 };
        break;

      default:
        sortOption = { interviewDate: -1 };
    }

    const interviews = await Interview.find(filter)
      .populate(
        "company",
        "name logo website industry location"
      )
      .populate(
        "job",
        "title description location salary jobType"
      )
      .populate(
        "recruiter",
        "name email phone profileImage"
      )
      .sort(sortOption);

    const statistics = {
      total: interviews.length,
      scheduled: interviews.filter(
        (item) => item.status === "Scheduled"
      ).length,
      completed: interviews.filter(
        (item) => item.status === "Completed"
      ).length,
      cancelled: interviews.filter(
        (item) => item.status === "Cancelled"
      ).length,
      rescheduled: interviews.filter(
        (item) => item.status === "Rescheduled"
      ).length,
    };

    res.status(200).json({
      success: true,
      statistics,
      totalInterviews: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSingleInterview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview id.",
      });
    }

    const interview = await Interview.findById(id)
      .populate(
        "candidate",
        "name email phone profileImage resume skills experience education location bio"
      )
      .populate(
        "recruiter",
        "name email phone profileImage"
      )
      .populate(
        "company",
        "name logo website industry description location companySize foundedYear"
      )
      .populate(
        "job",
        "title description location salary jobType requirements skills experience vacancies"
      )
      .populate(
        "application",
        "status coverLetter resume appliedAt"
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    const isRecruiter =
      interview.recruiter._id.toString() === req.user._id.toString();

    const isCandidate =
      interview.candidate._id.toString() === req.user._id.toString();

    if (!isRecruiter && !isCandidate) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    res.status(200).json({
      success: true,
      interview: {
        _id: interview._id,
        candidate: interview.candidate,
        recruiter: interview.recruiter,
        company: interview.company,
        job: interview.job,
        application: interview.application,
        interviewDate: interview.interviewDate,
        interviewTime: interview.interviewTime,
        mode: interview.mode,
        meetingLink: interview.meetingLink,
        location: interview.location,
        notes: interview.notes,
        status: interview.status,
        createdAt: interview.createdAt,
        updatedAt: interview.updatedAt,
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

export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      interviewDate,
      interviewTime,
      mode,
      meetingLink,
      location,
      notes,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview id.",
      });
    }

    const interview = await Interview.findById(id)
      .populate(
        "candidate",
        "name email phone profileImage"
      )
      .populate(
        "company",
        "name logo website"
      )
      .populate(
        "job",
        "title"
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (mode && !["Online", "Offline"].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview mode.",
      });
    }

    if (
      status &&
      ![
        "Scheduled",
        "Completed",
        "Cancelled",
        "Rescheduled",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview status.",
      });
    }

    if (interviewDate) {
      interview.interviewDate = interviewDate;
    }

    if (interviewTime) {
      interview.interviewTime = interviewTime;
    }

    if (mode) {
      interview.mode = mode;
    }

    if (meetingLink !== undefined) {
      interview.meetingLink = meetingLink;
    }

    if (location !== undefined) {
      interview.location = location;
    }

    if (notes !== undefined) {
      interview.notes = notes;
    }

    if (status) {
      interview.status = status;
    }

    await interview.save();

    try {
      await sendEmail({
        to: interview.candidate.email,
        subject: "Interview Updated",
        html: `
          <h2>Hello ${interview.candidate.name},</h2>

          <p>Your interview details have been updated.</p>

          <p><strong>Company:</strong> ${interview.company.name}</p>

          <p><strong>Job Title:</strong> ${interview.job.title}</p>

          <p><strong>Date:</strong> ${new Date(
            interview.interviewDate
          ).toLocaleDateString()}</p>

          <p><strong>Time:</strong> ${interview.interviewTime}</p>

          <p><strong>Mode:</strong> ${interview.mode}</p>

          ${
            interview.mode === "Online"
              ? `<p><strong>Meeting Link:</strong> ${interview.meetingLink}</p>`
              : `<p><strong>Location:</strong> ${interview.location}</p>`
          }

          <p><strong>Status:</strong> ${interview.status}</p>

          <p><strong>Notes:</strong> ${interview.notes || "N/A"}</p>

          <br>

          <p>Best Regards,</p>

          <p>AI Powered Applicant Tracking System</p>
        `,
      });
    } catch (emailError) {
      console.error(emailError);
    }

    const updatedInterview = await Interview.findById(interview._id)
      .populate(
        "candidate",
        "name email phone profileImage"
      )
      .populate(
        "recruiter",
        "name email"
      )
      .populate(
        "company",
        "name logo website"
      )
      .populate(
        "job",
        "title location salary"
      );

    res.status(200).json({
      success: true,
      message: "Interview updated successfully.",
      interview: updatedInterview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const cancelInterview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interview id.",
      });
    }

    const interview = await Interview.findById(id)
      .populate(
        "candidate",
        "name email phone profileImage"
      )
      .populate(
        "company",
        "name logo website"
      )
      .populate(
        "job",
        "title"
      );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found.",
      });
    }

    if (interview.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (interview.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Interview is already cancelled.",
      });
    }

    interview.status = "Cancelled";

    await interview.save();

    try {
      await sendEmail({
        to: interview.candidate.email,
        subject: "Interview Cancelled",
        html: `
          <h2>Hello ${interview.candidate.name},</h2>

          <p>We regret to inform you that your scheduled interview has been cancelled.</p>

          <p><strong>Company:</strong> ${interview.company.name}</p>

          <p><strong>Job Title:</strong> ${interview.job.title}</p>

          <p><strong>Interview Date:</strong> ${new Date(
            interview.interviewDate
          ).toLocaleDateString()}</p>

          <p><strong>Interview Time:</strong> ${interview.interviewTime}</p>

          <p><strong>Status:</strong> Cancelled</p>

          <br>

          <p>If the recruiter schedules another interview, you will receive a new notification.</p>

          <br>

          <p>Best Regards,</p>

          <p>AI Powered Applicant Tracking System</p>
        `,
      });
    } catch (emailError) {
      console.error(emailError);
    }

    const cancelledInterview = await Interview.findById(interview._id)
      .populate(
        "candidate",
        "name email phone profileImage"
      )
      .populate(
        "recruiter",
        "name email"
      )
      .populate(
        "company",
        "name logo website"
      )
      .populate(
        "job",
        "title location salary"
      );

    res.status(200).json({
      success: true,
      message: "Interview cancelled successfully.",
      interview: cancelledInterview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};