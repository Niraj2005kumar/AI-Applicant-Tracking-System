import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      salary,
      description,
      requirements,
      skills,
      experience,
      applicationDeadline,
      vacancies,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      jobType,
      salary,
      description,
      requirements,
      skills,
      experience,
      applicationDeadline,
      vacancies,
      recruiter: req.user._id,
    });

    const populatedJob = await Job.findById(job._id)
      .populate("company")
      .populate("recruiter", "name email");

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job: populatedJob,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      company,
      experience,
      salary,
      jobType,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isActive: true,
    };

    if (keyword) {
      query.$or = [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          description: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          skills: {
            $in: [new RegExp(keyword, "i")],
          },
        },
      ];
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (company) {
      query.company = company;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = {
        $gte: Number(experience),
      };
    }

    if (salary) {
      query.salary = {
        $gte: Number(salary),
      };
    }

    let sortOption = {
      createdAt: -1,
    };

    if (sort === "oldest") {
      sortOption = {
        createdAt: 1,
      };
    }

    if (sort === "salary") {
      sortOption = {
        salary: -1,
      };
    }

    if (sort === "experience") {
      sortOption = {
        experience: -1,
      };
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .populate("company")
      .populate("recruiter", "name email")
      .sort(sortOption)
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    res.status(200).json({
      success: true,
      totalJobs,
      currentPage,
      totalPages: Math.ceil(totalJobs / pageLimit),
      limit: pageLimit,
      jobs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("company")
      .populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

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

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("company")
      .populate("recruiter", "name email");

    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      job: updatedJob,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

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

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};