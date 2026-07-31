import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalCandidates: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    totalInterviews: 0,
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, usersRes, jobsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users"),
          api.get("/admin/jobs"),
        ]);

        if (statsRes.data.success && statsRes.data.stats) {
          setStats({
            ...statsRes.data.stats,
            totalCandidates: statsRes.data.stats.totalUsers || 0,
            totalInterviews: 0,
          });
        }

        if (usersRes.data.success) {
          setUsers(usersRes.data.users || []);
        }

        if (jobsRes.data.success) {
          const jobList = jobsRes.data.jobs || [];
          setJobs(jobList);

          if (jobList.length > 0) {
            const appRequests = jobList.slice(0, 5).map((job) => api.get(`/api/applications/job/${job._id}`));
            const appResponses = await Promise.all(appRequests);
            const recentApps = appResponses.flatMap((response) => response.data.applications || []);
            setApplications(recentApps.slice(0, 8));
          } else {
            setApplications([]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load the admin dashboard right now.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, accent: "blue" },
    { label: "Recruiters", value: stats.totalRecruiters, accent: "green" },
    { label: "Candidates", value: stats.totalCandidates, accent: "yellow" },
    { label: "Companies", value: stats.totalCompanies, accent: "purple" },
    { label: "Jobs", value: stats.totalJobs, accent: "red" },
    { label: "Applications", value: stats.totalApplications, accent: "indigo" },
    { label: "Interviews", value: stats.totalInterviews, accent: "teal" },
  ];

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor hiring health, system accounts, and recruitment activity from one view.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-stats-row">
        {statCards.map((card) => (
          <div key={card.label} className={`admin-stat-box border-${card.accent}`}>
            <h3>{card.value}</h3>
            <p>{card.label}</p>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="admin-panel-card">
          <div className="panel-header">
            <div>
              <h3>Hiring Funnel Overview</h3>
              <p className="panel-subtitle">Charts are wired for the next analytics upgrade.</p>
            </div>
          </div>

          <div className="chart-placeholder">
            <div className="chart-bars">
              {[40, 70, 55, 90, 75].map((height, index) => (
                <div key={index} className="chart-bar" style={{ height: `${height}%` }} />
              ))}
            </div>
            <p>API-ready analytics panel for occupations, application volume, and hiring velocity.</p>
          </div>
        </div>

        <div className="admin-panel-card">
          <div className="panel-header">
            <div>
              <h3>Recent Users</h3>
              <p className="panel-subtitle">Latest account activity</p>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="empty-state-card">No user records available yet.</div>
          ) : (
            <div className="recent-list">
              {users.slice(0, 5).map((user) => (
                <div key={user._id} className="recent-item">
                  <div>
                    <strong>{user.name}</strong>
                    <p>{user.email}</p>
                  </div>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="admin-panel-card">
          <div className="panel-header">
            <div>
              <h3>Recent Jobs</h3>
              <p className="panel-subtitle">Latest openings published</p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state-card">No recent jobs found.</div>
          ) : (
            <div className="recent-list">
              {jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="recent-item">
                  <div>
                    <strong>{job.title}</strong>
                    <p>{job.company?.name || "Company"} • {job.location}</p>
                  </div>
                  <span className="status-badge active">{job.isActive ? "Active" : "Closed"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel-card">
          <div className="panel-header">
            <div>
              <h3>Recent Applications</h3>
              <p className="panel-subtitle">Newest candidate submissions</p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="empty-state-card">No application activity available yet.</div>
          ) : (
            <div className="recent-list">
              {applications.map((application) => (
                <div key={application._id} className="recent-item">
                  <div>
                    <strong>{application.candidate?.name || "Candidate"}</strong>
                    <p>{application.job?.title || "Job"}</p>
                  </div>
                  <span className={`status-badge ${application.status?.toLowerCase()}`}>{application.status || "Pending"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;