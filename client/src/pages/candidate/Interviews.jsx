import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Interviews.css";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const { data } = await api.get("/interviews/my");

      const list = data.interviews || [];

      setInterviews(list);
      setFilteredInterviews(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredInterviews(interviews);
      return;
    }

    const filtered = interviews.filter((item) => {
      return (
        item.job?.title
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.company?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.interviewer
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredInterviews(filtered);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "#2563eb";

      case "completed":
        return "#16a34a";

      case "cancelled":
        return "#dc2626";

      case "pending":
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
      <div className="interviews-header">
        <h1>My Interviews</h1>

        <p>Manage your upcoming interviews.</p>
      </div>

      <SearchBar
        placeholder="Search interviews..."
        onSearch={handleSearch}
      />

      {filteredInterviews.length === 0 ? (
        <div className="empty-state">
          <h3>No Interviews Scheduled</h3>
        </div>
      ) : (
        <div className="interviews-grid">
          {filteredInterviews.map((item) => (
            <div
              className="interview-card"
              key={item._id}
            >
              <h2>{item.job?.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {item.company?.name}
              </p>

              <p>
                <strong>Interviewer:</strong>{" "}
                {item.interviewer}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  item.date
                ).toLocaleDateString()}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {item.time}
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

              {item.meetingLink && (
                <a
                  href={item.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="meeting-btn"
                >
                  Join Meeting
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Interviews;