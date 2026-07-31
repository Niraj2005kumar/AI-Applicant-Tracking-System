import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import "./Jobs.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/jobs");
        if (data.success) {
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.company?.name || ""} ${job.location}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * limit, currentPage * limit);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="jobs-page">
      <div className="page-header">
        <div>
          <h1>Jobs</h1>
          <p>Review all active job listings and their current status.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <SearchBar placeholder="Search jobs" onSearch={setSearch} />
      </div>

      <div className="jobs-card">
        {paginatedJobs.length === 0 ? (
          <div className="admin-empty">No jobs match the current search.</div>
        ) : (
          <div className="jobs-list">
            {paginatedJobs.map((job) => (
              <div key={job._id} className="job-item">
                <div className="job-meta">
                  <strong>{job.title}</strong>
                  <span>{job.company?.name || "Company"}</span>
                  <span>{job.location} • {job.jobType}</span>
                </div>
                <div className="admin-action-row">
                  <span className={`admin-badge ${job.isActive ? "verified" : "pending"}`}>
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Jobs;
