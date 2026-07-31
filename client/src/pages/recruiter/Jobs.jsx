import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Jobs.css";

const Jobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/recruiter/jobs");

      const list = data.jobs || [];

      setJobs(list);
      setFilteredJobs(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.location?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.jobType?.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setFilteredJobs(filtered);
  };

  const deleteJob = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/jobs/${jobId}`);

      const updated = jobs.filter((job) => job._id !== jobId);

      setJobs(updated);
      setFilteredJobs(updated);

      alert("Job deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete job."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="recruiter-jobs-page">
      <div className="page-header">
        <div>
          <h1>My Jobs</h1>
          <p>Manage all your posted jobs.</p>
        </div>

        <button
          className="create-btn"
          onClick={() => navigate("/recruiter/jobs/new")}
        >
          + Post New Job
        </button>
      </div>

      <SearchBar
        placeholder="Search jobs..."
        onSearch={handleSearch}
      />

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No Jobs Found</h3>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h2>{job.title}</h2>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Job Type:</strong>{" "}
                {job.jobType}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {job.salary}
              </p>

              <p>
                <strong>Applicants:</strong>{" "}
                {job.applicantsCount || 0}
              </p>

              <p>
                <strong>Status:</strong>

                <span
                  className={`status ${
                    job.isActive ? "active" : "closed"
                  }`}
                >
                  {job.isActive ? "Active" : "Closed"}
                </span>
              </p>

              <div className="job-actions">
                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(
                      `/recruiter/jobs/edit/${job._id}`
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="view-btn"
                  onClick={() =>
                    navigate(
                      `/recruiter/applicants/${job._id}`
                    )
                  }
                >
                  Applicants
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;