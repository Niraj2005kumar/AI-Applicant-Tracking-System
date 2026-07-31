import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/jobs");
        if (data.success) {
          const jobList = data.jobs || [];
          const appRequests = jobList.map((job) => api.get(`/api/applications/job/${job._id}`));
          const appResponses = await Promise.all(appRequests);
          const flattened = appResponses.flatMap((response) => response.data.applications || []);
          setApplications(flattened);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((application) => {
    const text = `${application.candidate?.name || ""} ${application.job?.title || ""} ${application.status || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="applications-page">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p>Track applications across the hiring pipeline with status visibility.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <SearchBar placeholder="Search applications" onSearch={setSearch} />
      </div>

      <div className="applications-card">
        {filteredApplications.length === 0 ? (
          <div className="admin-empty">No application records are available yet.</div>
        ) : (
          <div className="application-list">
            {filteredApplications.map((application) => (
              <div key={application._id} className="application-item">
                <div className="application-meta">
                  <strong>{application.candidate?.name || "Candidate"}</strong>
                  <span>Recruiter: {application.job?.recruiter?.name || "N/A"}</span>
                  <span>Job: {application.job?.title || "Job"}</span>
                </div>
                <span className={`admin-badge ${application.status?.toLowerCase() || "pending"}`}>
                  {application.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
