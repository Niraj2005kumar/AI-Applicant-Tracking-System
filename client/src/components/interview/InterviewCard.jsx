import "./InterviewCard.css";

const InterviewCard = ({ interview, onUpdateStatus, userRole }) => {
  const { _id, candidate, job, interviewDate, interviewTime, mode, meetingLink, location, notes, status } = interview;

  const dateObj = new Date(interviewDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const getStatusClass = (statusVal) => {
    switch (statusVal?.toLowerCase()) {
      case "scheduled":
        return "status-scheduled";
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      case "rescheduled":
        return "status-rescheduled";
      default:
        return "";
    }
  };

  return (
    <div className={`interview-card-item ${status?.toLowerCase() === "cancelled" ? "cancelled-opacity" : ""}`}>
      <div className="card-top">
        <div className="card-meta">
          <span className="job-tag">{job?.title || "Job opening"}</span>
          <span className={`status-pill ${getStatusClass(status)}`}>{status}</span>
        </div>
        
        {userRole === "recruiter" && status === "Scheduled" && (
          <div className="card-actions-dropdown">
            <select
              value={status}
              onChange={(e) => onUpdateStatus(_id, e.target.value)}
              className="status-selector"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}
      </div>

      <div className="card-info">
        <h3>{userRole === "recruiter" ? candidate?.name : "Interview details"}</h3>
        <p className="email-sub">{userRole === "recruiter" && candidate?.email}</p>

        <div className="time-details">
          <div className="detail-item">
            <span className="icon">📅</span>
            <span>{formattedDate}</span>
          </div>
          <div className="detail-item">
            <span className="icon">🕒</span>
            <span>{interviewTime}</span>
          </div>
          <div className="detail-item">
            <span className="icon">{mode === "Online" ? "💻" : "📍"}</span>
            <span>{mode} Interview</span>
          </div>
        </div>

        {mode === "Online" && meetingLink && (
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn join-btn"
          >
            💻 Join Meeting
          </a>
        )}

        {mode === "Offline" && location && (
          <div className="location-info">
            <strong>Address:</strong> {location}
          </div>
        )}

        {notes && (
          <div className="notes-box">
            <strong>Notes:</strong> {notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;
