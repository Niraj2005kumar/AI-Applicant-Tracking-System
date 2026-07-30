import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Applicants.css";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data } = await api.get("/recruiter/applicants");

      const list = data.applicants || [];

      setApplicants(list);
      setFilteredApplicants(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredApplicants(applicants);
      return;
    }

    const filtered = applicants.filter((item) => {
      return (
        item.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.email?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.job?.title?.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setFilteredApplicants(filtered);
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status,
      });

      const updated = applicants.map((item) =>
        item._id === applicationId
          ? { ...item, status }
          : item
      );

      setApplicants(updated);
      setFilteredApplicants(updated);

      alert("Application status updated.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update status."
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f59e0b";
      case "reviewing":
        return "#2563eb";
      case "shortlisted":
        return "#16a34a";
      case "rejected":
        return "#dc2626";
      case "hired":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="applicants-page">
      <div className="page-header">
        <div>
          <h1>Applicants</h1>
          <p>Manage all job applicants.</p>
        </div>
      </div>

      <SearchBar
        placeholder="Search applicants..."
        onSearch={handleSearch}
      />

      {filteredApplicants.length === 0 ? (
        <div className="empty-state">
          <h3>No Applicants Found</h3>
        </div>
      ) : (
        <div className="applicants-grid">
          {filteredApplicants.map((applicant) => (
            <div
              className="applicant-card"
              key={applicant._id}
            >
              <h2>{applicant.name}</h2>

              <p>
                <strong>Email:</strong>{" "}
                {applicant.email}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {applicant.phone}
              </p>

              <p>
                <strong>Applied For:</strong>{" "}
                {applicant.job?.title}
              </p>

              <p>
                <strong>Status:</strong>

                <span
                  className="status-badge"
                  style={{
                    background: getStatusColor(
                      applicant.status
                    ),
                  }}
                >
                  {applicant.status}
                </span>
              </p>

              {applicant.resume && (
                <a
                  href={applicant.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-btn"
                >
                  View Resume
                </a>
              )}

              <select
                value={applicant.status}
                onChange={(e) =>
                  updateStatus(
                    applicant._id,
                    e.target.value
                  )
                }
              >
                <option value="pending">
                  Pending
                </option>

                <option value="reviewing">
                  Reviewing
                </option>

                <option value="shortlisted">
                  Shortlisted
                </option>

                <option value="rejected">
                  Rejected
                </option>

                <option value="hired">
                  Hired
                </option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applicants;