import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Reports.css";

const Reports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalRecruiters: 0,
    totalAdmins: 0,
    totalJobs: 0,
    totalActiveJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    totalInterviews: 0,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");

        const [statsRes, appsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/applications"),
        ]);

        if (statsRes.data.success && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        }

        if (appsRes.data.success) {
          setApplications(appsRes.data.applications || []);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load report snapshots.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Compute application status distribution from real MongoDB data
  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusBars = [
    { label: "Pending", count: statusCounts.Pending || 0, color: "#f59e0b" },
    { label: "Reviewed", count: statusCounts.Reviewed || 0, color: "#7c3aed" },
    { label: "Shortlisted", count: statusCounts.Shortlisted || 0, color: "#2563eb" },
    { label: "Rejected", count: statusCounts.Rejected || 0, color: "#dc2626" },
    { label: "Hired", count: statusCounts.Hired || 0, color: "#0f766e" },
  ];

  const maxStatusCount = Math.max(1, ...statusBars.map((item) => item.count));

  const hireRate =
    stats.totalApplications > 0
      ? Math.round(((statusCounts.Hired || 0) / stats.totalApplications) * 100)
      : 0;

  const shortlistRate =
    stats.totalApplications > 0
      ? Math.round(((statusCounts.Shortlisted || 0) / stats.totalApplications) * 100)
      : 0;

  return (
    <div className="reports-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Review high-level recruiting analytics and monthly reporting summaries.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="reports-grid">
        <div className="reports-card">
          <h3>Application Pipeline</h3>

          {applications.length === 0 ? (
            <div className="reports-chart">No application data available yet.</div>
          ) : (
            <div className="reports-chart">
              <div className="reports-bars">
                {statusBars.map((item) => (
                  <div key={item.label} className="reports-bar-col">
                    <div className="reports-bar-track">
                      <div
                        className="reports-bar-fill"
                        style={{
                          height: `${(item.count / maxStatusCount) * 100}%`,
                          background: item.color,
                        }}
                      />
                    </div>
                    <strong>{item.count}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="reports-card">
          <h3>Monthly Statistics</h3>
          <div className="reports-list">
            <div className="reports-item"><span>Total Users</span><strong>{stats.totalUsers}</strong></div>
            <div className="reports-item"><span>Active Jobs</span><strong>{stats.totalActiveJobs}</strong></div>
            <div className="reports-item"><span>Applications</span><strong>{stats.totalApplications}</strong></div>
            <div className="reports-item"><span>Interviews</span><strong>{stats.totalInterviews}</strong></div>
            <div className="reports-item"><span>Recruiters</span><strong>{stats.totalRecruiters}</strong></div>
            <div className="reports-item"><span>Companies</span><strong>{stats.totalCompanies}</strong></div>
          </div>
        </div>
      </div>

      <div className="reports-card">
        <h3>Hiring Analytics</h3>
        <div className="reports-list">
          <div className="reports-item">
            <span>Shortlist rate</span>
            <strong>{shortlistRate}%</strong>
          </div>
          <div className="reports-item">
            <span>Hire rate</span>
            <strong>{hireRate}%</strong>
          </div>
          <div className="reports-item">
            <span>Candidate pipeline</span>
            <strong>{stats.totalCandidates} candidates</strong>
          </div>
          <div className="reports-item">
            <span>Recruiter productivity</span>
            <strong>
              {stats.totalRecruiters > 0
                ? Math.round(stats.totalJobs / stats.totalRecruiters)
                : 0}{" "}
              jobs / recruiter
            </strong>
          </div>
          <div className="reports-item">
            <span>Company coverage</span>
            <strong>{stats.totalCompanies} companies</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
