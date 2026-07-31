import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Applications.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/applications/my");

      const list = data.applications || [];

      setApplications(list);
      setFilteredApplications(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredApplications(applications);
      return;
    }

    const filtered = applications.filter((item) => {
      return (
        item.job?.title
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.job?.company?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.status
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredApplications(filtered);
  };

  const withdrawApplication = async (applicationId) => {
    const confirm = window.confirm(
      "Are you sure you want to withdraw this application?"
    );

    if (!confirm) return;

    try {
      await api.delete(`/applications/${applicationId}`);

      const updated = applications.filter(
        (item) => item._id !== applicationId
      );

      setApplications(updated);
      setFilteredApplications(updated);

      alert("Application withdrawn successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to withdraw application."
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "#f59e0b";

      case "reviewed":
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
    <div className="applications-page">
      <div className="applications-header">
        <h1>My Applications</h1>

        <p>
          Track all the jobs you have applied for.
        </p>
      </div>

      <SearchBar
        placeholder="Search applications..."
        onSearch={handleSearch}
      />

      {filteredApplications.length === 0 ? (
        <div className="empty-state">
          <h3>No Applications Found</h3>
        </div>
      ) : (
        <div className="applications-grid">
          {filteredApplications.map((application) => (
            <div
              key={application._id}
              className="application-card"
            >
              <h2>{application.job?.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {application.job?.company?.name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.job?.location}
              </p>

              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(
                  application.createdAt
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Status:</strong>

                <span
                  className="status-badge"
                  style={{
                    background:
                      getStatusColor(application.status),
                  }}
                >
                  {application.status}
                </span>
              </p>

              <button
                className="withdraw-btn"
                onClick={() =>
                  withdrawApplication(
                    application._id
                  )
                }
              >
                Withdraw
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;