import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 8;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/applications");
        if (data.success) {
          setApplications(data.applications || []);
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
    const text = `${application.candidate?.name || ""} ${application.job?.title || ""} ${application.job?.company?.name || ""} ${application.status || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredApplications.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * limit, currentPage * limit);

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
        {paginatedApplications.length === 0 ? (
          <div className="admin-empty">No application records are available yet.</div>
        ) : (
          <div className="application-list">
            {paginatedApplications.map((application) => (
              <div key={application._id} className="application-item">
                <div className="application-meta">
                  <strong>{application.candidate?.name || "Candidate"}</strong>
                  <span>Job: {application.job?.title || "Job"}</span>
                  <span>Company: {application.job?.company?.name || "N/A"}</span>
                  <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="admin-action-row">
                  <span className={`admin-badge ${application.status?.toLowerCase() || "pending"}`}>
                    {application.status || "Pending"}
                  </span>
                  <span className="admin-badge verified">ATS {application.atsScore || 0}%</span>
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

export default Applications;
