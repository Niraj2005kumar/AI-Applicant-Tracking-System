import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/candidate");
        if (data.success && data.dashboard) {
          const db = data.dashboard;
          setStats([
            {
              title: "Applied Jobs",
              value: db.totalAppliedJobs || 0,
              color: "#2563eb",
            },
            {
              title: "Saved Jobs",
              value: db.totalSavedJobs || 0,
              color: "#16a34a",
            },
            {
              title: "Resume Status",
              value: db.resumeUploaded ? "Uploaded" : "Missing",
              color: "#f59e0b",
            },
            {
              title: "Profile Completion",
              value: `${db.profileCompletion || 0}%`,
              color: "#dc2626",
            },
          ]);
          setRecentApplications(db.recentApplications || []);
        }
      } catch (error) {
        console.error("Error loading candidate dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="candidate-dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || "Candidate"} 👋</h1>
        <p>Manage your profile, jobs, applications, and interviews from one place.</p>
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
            <Link to="/candidate/profile" className="action-btn">
              Edit Profile
            </Link>
            <Link to="/candidate/resume" className="action-btn">
              Upload Resume
            </Link>
            <Link to="/candidate/applied-jobs" className="action-btn">
              View Applications
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Recent Applications</h2>
          {recentApplications.length === 0 ? (
            <p className="no-activity">You haven't applied for any jobs yet.</p>
          ) : (
            <ul className="activity-list">
              {recentApplications.map((app) => (
                <li key={app._id} className="app-item">
                  <div>
                    <strong>{app.job?.title}</strong>
                    <span className="company-text"> at {app.job?.company?.name || "Company"}</span>
                  </div>
                  <span className={`status-tag ${app.status?.toLowerCase()}`}>
                    {app.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Candidate Profile Summary</h2>
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
              <td>{user?.role?.toUpperCase()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;