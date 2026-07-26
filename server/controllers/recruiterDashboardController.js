import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const companies = await Company.find({
      owner: recruiterId,
    }).select("_id");

    const companyIds = companies.map((company) => company._id);

    const totalCompanies = companies.length;

    const totalJobs = await Job.countDocuments({
      recruiter: recruiterId,
    });

    const activeJobs = await Job.countDocuments({
      recruiter: recruiterId,
      isActive: true,
    });

    const closedJobs = await Job.countDocuments({
      recruiter: recruiterId,
      isActive: false,
    });

    const recruiterJobs = await Job.find({
      recruiter: recruiterId,
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const recentJobs = await Job.find({
      recruiter: recruiterId,
    })
      .populate("company", "name logo")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalCompanies,
        totalJobs,
        activeJobs,
        closedJobs,
        totalApplications,
        companies: companyIds.length,
        recentJobs,
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

export const getJobStatistics = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({
      recruiter: recruiterId,
    })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    const statistics = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({
          job: job._id,
        });

        const pendingApplications = await Application.countDocuments({
          job: job._id,
          status: "Pending",
        });

        const reviewedApplications = await Application.countDocuments({
          job: job._id,
          status: "Reviewed",
        });

        const shortlistedApplications = await Application.countDocuments({
          job: job._id,
          status: "Shortlisted",
        });

        const rejectedApplications = await Application.countDocuments({
          job: job._id,
          status: "Rejected",
        });

        return {
          jobId: job._id,
          title: job.title,
          company: job.company,
          totalApplications,
          pendingApplications,
          reviewedApplications,
          shortlistedApplications,
          rejectedApplications,
          vacancies: job.vacancies,
          isActive: job.isActive,
          createdAt: job.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      totalJobs: statistics.length,
      statistics,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecentApplications = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const recruiterJobs = await Job.find({
      recruiter: recruiterId,
    }).select("_id");

    const jobIds = recruiterJobs.map((job) => job._id);

    const recentApplications = await Application.find({
      job: { $in: jobIds },
    })
      .populate({
        path: "candidate",
        select: "name email profileImage resume skills experience",
      })
      .populate({
        path: "job",
        select: "title company location jobType salary",
        populate: {
          path: "company",
          select: "name logo location",
        },
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      totalApplications: recentApplications.length,
      applications: recentApplications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getTopJobs = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({
      recruiter: recruiterId,
    })
      .populate("company", "name logo")
      .sort({ createdAt: -1 });

    const topJobs = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications = await Application.countDocuments({
          job: job._id,
        });

        return {
          jobId: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          salary: job.salary,
          vacancies: job.vacancies,
          isActive: job.isActive,
          totalApplications,
          createdAt: job.createdAt,
        };
      })
    );

    topJobs.sort(
      (a, b) => b.totalApplications - a.totalApplications
    );

    res.status(200).json({
      success: true,
      totalJobs: topJobs.length,
      topJobs: topJobs.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};