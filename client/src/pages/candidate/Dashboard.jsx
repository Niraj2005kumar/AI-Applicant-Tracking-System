import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Applied Jobs",
      value: 12,
      color: "#2563eb",
    },
    {
      title: "Saved Jobs",
      value: 8,
      color: "#16a34a",
    },
    {
      title: "Interviews",
      value: 3,
      color: "#f59e0b",
    },
    {
      title: "Profile Completion",
      value: "85%",
      color: "#dc2626",
    },
  ];

  const activities = [
    "Applied for Frontend Developer",
    "Resume updated successfully",
    "Interview scheduled with ABC Pvt Ltd",
    "Saved Software Engineer job",
  ];

  return (
    <div className="candidate-dashboard">
      <div className="dashboard-header">
        <h1>
          Welcome, {user?.name || "Candidate"} 👋
        </h1>

        <p>
          Manage your profile, jobs, applications and interviews from one place.
        </p>
      </div>

      <div className="dashboard-stats">
        {stats.map((item, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              borderTop: `5px solid ${item.color}`,
            }}
          >
            <h2>{item.value}</h2>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-section">
        <div className="dashboard-card">
          <h2>Quick Actions</h2>

          <div className="quick-actions">
            <Link to="/jobs" className="action-btn">
              Browse Jobs
            </Link>

            <Link
              to="/candidate/profile"
              className="action-btn"
            >
              Edit Profile
            </Link>

            <Link
              to="/candidate/resume"
              className="action-btn"
            >
              Upload Resume
            </Link>

            <Link
              to="/candidate/applied-jobs"
              className="action-btn"
            >
              View Applications
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Activity</h2>

          <ul className="activity-list">
            {activities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Candidate Information</h2>

        <table className="candidate-info">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{user?.name}</td>
            </tr>

            <tr>
              <td>Email</td>
              <td>{user?.email}</td>
            </tr>

            <tr>
              <td>Role</td>
              <td>{user?.role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;