import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./JobForm.css";

const JobForm = ({ jobId = null }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    description: "",
    requirements: "",
    skills: "",
    experience: "",
    applicationDeadline: "",
    vacancies: "1",
    isActive: true,
  });

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const initializeForm = async () => {
      try {
        // 1. Fetch recruiter's company profile
        const { data: companyData } = await api.get("/recruiter/company");
        
        if (!companyData || !companyData._id) {
          setError("You must create a Company Profile before you can post jobs.");
          setLoading(false);
          return;
        }
        setCompany(companyData);

        // 2. Fetch job details if editing
        if (jobId) {
          const { data: jobRes } = await api.get(`/jobs/${jobId}`);
          if (jobRes.success && jobRes.job) {
            const job = jobRes.job;
            setFormData({
              title: job.title || "",
              location: job.location || "",
              jobType: job.jobType || "Full Time",
              salary: job.salary || "",
              description: job.description || "",
              requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
              skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
              experience: job.experience || "",
              applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split("T")[0] : "",
              vacancies: job.vacancies || "1",
              isActive: job.isActive !== undefined ? job.isActive : true,
            });
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load page details. Please complete your company profile.");
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company) {
      setError("Company profile is missing. Please set it up first.");
      return;
    }

    if (!formData.title || !formData.location || !formData.salary || !formData.description || !formData.applicationDeadline) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...formData,
        company: company._id,
        salary: Number(formData.salary),
        experience: Number(formData.experience) || 0,
        vacancies: Number(formData.vacancies) || 1,
        // Convert to arrays
        requirements: formData.requirements.split("\n").map(r => r.trim()).filter(Boolean),
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
      };

      if (jobId) {
        await api.put(`/jobs/${jobId}`, payload);
        setSuccess("Job updated successfully!");
      } else {
        await api.post("/jobs", payload);
        setSuccess("Job posted successfully!");
      }

      setTimeout(() => {
        navigate("/recruiter/jobs");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save job opening.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loader-container">Loading job workspace...</div>;
  }

  return (
    <div className="job-form-wrapper">
      <div className="job-form-card">
        <h2>{jobId ? "Edit Job Opening" : "Create New Job Opening"}</h2>
        <p className="subtitle">List vacancies and configure required technical skills for candidates.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {!company ? (
          <div className="no-company-state">
            <button className="create-btn" onClick={() => navigate("/recruiter/company")}>
              Setup Company Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA or Remote"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jobType">Job Type *</label>
                <select id="jobType" name="jobType" value={formData.jobType} onChange={handleChange}>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary">Annual Salary (USD) *</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 120000"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="experience">Required Experience (Years)</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vacancies">Number of Vacancies</label>
                <input
                  type="number"
                  id="vacancies"
                  name="vacancies"
                  value={formData.vacancies}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="applicationDeadline">Application Deadline *</label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active & Accepting Applications
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Required Skills (Comma separated) *</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, TypeScript, CSS"
                required
              />
              <small className="help-text">These skills are used by the AI engine to score applicant resumes.</small>
            </div>

            <div className="form-group">
              <label htmlFor="requirements">Additional Requirements (One per line)</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="Strong communication skills&#10;Experience with AWS deployments&#10;5+ years building production applications"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe roles and responsibilities in detail..."
                rows="6"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/recruiter/jobs")}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={saving}>
                {saving ? "Saving..." : jobId ? "Update Job Post" : "Publish Job Post"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default JobForm;
