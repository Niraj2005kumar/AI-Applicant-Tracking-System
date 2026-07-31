import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Interviews.css";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get("/recruiter/interviews");

      const list = data.interviews || [];

      setInterviews(list);
      setFilteredInterviews(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredInterviews(interviews);
      return;
    }

    const filtered = interviews.filter((item) => {
      return (
        item.candidate?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.job?.title
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.recruiter?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredInterviews(filtered);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/interviews/${id}`, {
        status,
      });

      const updated = interviews.map((item) =>
        item._id === id
          ? { ...item, status }
          : item
      );

      setInterviews(updated);
      setFilteredInterviews(updated);

      alert("Interview status updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update interview."
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "#2563eb";
      case "completed":
        return "#16a34a";
      case "cancelled":
        return "#dc2626";
      case "rescheduled":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="interviews-page">
      <div className="page-header">
        <div>
          <h1>Interview Management</h1>
          <p>Manage all scheduled interviews.</p>
        </div>
      </div>

      <SearchBar
        placeholder="Search interviews..."
        onSearch={handleSearch}
      />

      {filteredInterviews.length === 0 ? (
        <div className="empty-state">
          <h3>No Interviews Found</h3>
        </div>
      ) : (
        <div className="interviews-grid">
          {filteredInterviews.map((item) => (
            <div
              className="interview-card"
              key={item._id}
            >
              <h2>{item.candidate?.name}</h2>

              <p>
                <strong>Job:</strong>{" "}
                {item.job?.title}
              </p>

              <p>
                <strong>Mode:</strong>{" "}
                {item.mode || "Online"}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  item.interviewDate
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {item.interviewTime}
              </p>

              <p>
                <strong>Status:</strong>

                <span
                  className="status-badge"
                  style={{
                    background: getStatusColor(
                      item.status
                    ),
                  }}
                >
                  {item.status}
                </span>
              </p>

              {item.mode === "Online" && item.meetingLink && (
                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-btn"
                >
                  Open Meeting
                </a>
              )}

              {item.mode === "Offline" && item.location && (
                <p>
                  <strong>Location:</strong>{" "}
                  {item.location}
                </p>
              )}

              <select
                value={item.status}
                onChange={(e) =>
                  updateStatus(
                    item._id,
                    e.target.value
                  )
                }
              >
                <option value="Scheduled">
                  Scheduled
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>

                <option value="Rescheduled">
                  Rescheduled
                </option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;