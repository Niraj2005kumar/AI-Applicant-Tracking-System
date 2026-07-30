import { useEffect, useState } from "react";
import api from "../../api/axios";
import SearchBar from "../../components/common/SearchBar";
import Loader from "../../components/common/Loader";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get("/jobs");

      const jobList = data.jobs || [];

      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.company?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        job.location
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredJobs(filtered);
  };

  const applyJob = async (jobId) => {
    try {
      await api.post(`/applications/${jobId}`);

      alert("Application submitted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to apply."
      );
    }
  };

  const bookmarkJob = async (jobId) => {
    try {
      await api.post(`/bookmarks/${jobId}`);

      alert("Job bookmarked.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to bookmark."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Available Jobs</h1>

        <p>
          Search and apply for your dream job.
        </p>
      </div>

      <SearchBar
        placeholder="Search jobs..."
        onSearch={handleSearch}
      />

      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <h3>No Jobs Found.</h3>
        ) : (
          filteredJobs.map((job) => (
            <div
              className="job-card"
              key={job._id}
            >
              <h2>{job.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {job.company?.name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {job.salary}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {job.experience}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {job.jobType}
              </p>

              <p>{job.description}</p>

              <div className="job-actions">
                <button
                  onClick={() =>
                    applyJob(job._id)
                  }
                >
                  Apply
                </button>

                <button
                  onClick={() =>
                    bookmarkJob(job._id)
                  }
                >
                  Bookmark
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Jobs;