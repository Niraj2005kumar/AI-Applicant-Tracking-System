import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import InterviewForm from "../../components/interview/InterviewForm";
import "./Applicants.css";

const Applicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedulingApplication, setSchedulingApplication] = useState(null);

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
              <div className="applicant-card-header">
                <div>
                  <h2>{applicant.name}</h2>
                  <span className="job-indicator">{applicant.job?.title}</span>
                </div>
                {/* AI Score Badge */}
                <div className="ai-score-badge">
                  <span className="score-val">{applicant.atsScore}%</span>
                  <span className="score-label">ATS Score</span>
                </div>
              </div>

              <div className="applicant-details">
                <p>
                  <strong>Email:</strong> {applicant.email}
                </p>
                <p>
                  <strong>Phone:</strong> {applicant.phone || "Not provided"}
                </p>
                <p>
                  <strong>AI Match Rating:</strong>
                  <span className={`recommendation-tag ${applicant.recommendation?.toLowerCase().replace(" ", "-")}`}>
                    {applicant.recommendation || "Neutral"}
                  </span>
                </p>
                
                {/* Match Score Meter */}
                <div className="ats-score-meter-container">
                  <div 
                    className="ats-score-meter-fill" 
                    style={{ 
                      width: `${applicant.atsScore}%`,
                      background: applicant.atsScore >= 80 ? "#16a34a" : applicant.atsScore >= 60 ? "#2563eb" : "#f59e0b"
                    }}
                  />
                </div>
              </div>

              <div className="applicant-status-row">
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
              </div>

              <div className="card-actions-wrapper">
                {applicant.resume && (
                  <a
                    href={`http://localhost:5000${applicant.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-resume-btn-link"
                  >
                    📄 View Resume
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
                  className="status-dropdown-select"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>

                {applicant.status === "shortlisted" && (
                  <button
                    onClick={() => setSchedulingApplication(applicant)}
                    className="schedule-btn-applicants"
                  >
                    📅 Schedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {schedulingApplication && (
        <InterviewForm
          applicationId={schedulingApplication._id}
          candidateName={schedulingApplication.name}
          jobTitle={schedulingApplication.job?.title}
          onClose={() => setSchedulingApplication(null)}
          onSuccess={fetchApplicants}
        />
      )}
    </div>
  );
};

export default Applicants;