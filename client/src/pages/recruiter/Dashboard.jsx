import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalJobs: 0,
    activeJobs: 0,
    closedJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
    recentJobs: [],
  });

  const [jobStats, setJobStats] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: dbRes } = await api.get("/recruiter-dashboard/recruiter");
        if (dbRes.success && dbRes.dashboard) {
          setData(dbRes.dashboard);
        }

        const { data: statsRes } = await api.get("/recruiter-dashboard/job-stats");
        if (statsRes.success && statsRes.statistics) {
          setJobStats(statsRes.statistics);
        }
      } catch (error) {
        console.error("Error loading recruiter dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Find max applications for SVG chart scaling
  const maxApplications = jobStats.reduce((max, item) => Math.max(max, item.totalApplications), 0) || 5;

  return (
    <div className="recruiter-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Recruiter Command Center</h1>
          <p>Track job metrics, parse resume rankings, and schedule interviews.</p>
        </div>
        <button
          className="create-btn"
          onClick={() => navigate("/recruiter/jobs/new")}
        >
          + Post New Job
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-row">
        <div className="metric-card shadow-sm border-top-blue">
          <h3>{data.totalJobs}</h3>
          <p>Total Job Posts</p>
        </div>
        <div className="metric-card shadow-sm border-top-green">
          <h3>{data.activeJobs}</h3>
          <p>Active Job Posts</p>
        </div>
        <div className="metric-card shadow-sm border-top-yellow">
          <h3>{data.totalApplications}</h3>
          <p>Total Applications</p>
        </div>
        <div className="metric-card shadow-sm border-top-red">
          <h3>{data.totalCompanies > 0 ? "Configured" : "Not Set"}</h3>
          <p>Company Profile</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* SVG Chart Panel */}
        <div className="panel-card chart-panel">
          <h3>Application Pipeline by Role</h3>
          <p className="panel-subtitle">Total applications per job posting</p>

          {jobStats.length === 0 ? (
            <div className="chart-empty-state">
              <p>Post jobs and receive candidate applications to see analytics charts.</p>
            </div>
          ) : (
            <div className="svg-chart-container">
              <svg viewBox="0 0 500 240" className="pipeline-svg">
                {/* Y-Axis lines */}
                <line x1="50" y1="20" x2="480" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="80" x2="480" y2="80" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="50" y1="200" x2="480" y2="200" stroke="#94a3b8" />

                {/* Bars */}
                {jobStats.slice(0, 5).map((stat, index) => {
                  const barWidth = 40;
                  const spacing = 75;
                  const x = 70 + index * spacing;
                  const barHeight = (stat.totalApplications / maxApplications) * 160;
                  const y = 200 - barHeight;

                  return (
                    <g key={stat.jobId} className="chart-bar-group">
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        fill="url(#barGradient)"
                        rx="6"
                      />
                      <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0f172a">
                        {stat.totalApplications}
                      </text>
                      {/* Truncated job title */}
                      <text x={x + barWidth / 2} y="220" textAnchor="middle" fontSize="9" fontWeight="500" fill="#64748b">
                        {stat.title.length > 10 ? stat.title.slice(0, 10) + "..." : stat.title}
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>

        {/* Recent Activity / Jobs */}
        <div className="panel-card activity-panel">
          <h3>Recent Job Vacancies</h3>
          <p className="panel-subtitle">Latest postings and states</p>

          {data.recentJobs.length === 0 ? (
            <div className="empty-panel-state">
              <p>No job postings found.</p>
              <Link to="/recruiter/post-job" className="btn-link">Post your first vacancy</Link>
            </div>
          ) : (
            <div className="recent-list">
              {data.recentJobs.map((job) => (
                <div key={job._id} className="recent-job-item">
                  <div className="job-info">
                    <h4>{job.title}</h4>
                    <p>{job.location} • {job.jobType}</p>
                  </div>
                  <span className={`status-badge ${job.isActive ? "active" : "inactive"}`}>
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applications list table summary */}
      <div className="panel-card table-panel shadow-sm">
        <div className="panel-header">
          <div>
            <h3>Job Application Statistics</h3>
            <p className="panel-subtitle">Review ATS match performance per opening</p>
          </div>
          <Link to="/recruiter/applicants" className="view-all-link">Manage Applicants &rarr;</Link>
        </div>

        {jobStats.length === 0 ? (
          <div className="empty-panel-state">
            <p>No applicant statistics available yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Total Candidates</th>
                  <th>Pending Review</th>
                  <th>Shortlisted</th>
                  <th>Rejected</th>
                  <th>Positions Left</th>
                </tr>
              </thead>
              <tbody>
                {jobStats.map((stat) => (
                  <tr key={stat.jobId}>
                    <td><strong>{stat.title}</strong></td>
                    <td><span className="count-badge blue">{stat.totalApplications}</span></td>
                    <td><span className="count-badge yellow">{stat.pendingApplications}</span></td>
                    <td><span className="count-badge green">{stat.shortlistedApplications}</span></td>
                    <td><span className="count-badge red">{stat.rejectedApplications}</span></td>
                    <td>{stat.vacancies}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
