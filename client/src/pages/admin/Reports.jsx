import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Reports.css";

const Reports = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/stats");
        if (data.success && data.stats) {
          setStats(data.stats);
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
          <h3>Hiring Report</h3>
          <div className="reports-chart">Application volume and hiring rate trend placeholder.</div>
        </div>
        <div className="reports-card">
          <h3>Monthly Statistics</h3>
          <div className="reports-list">
            <div className="reports-item"><span>Active Jobs</span><strong>{stats.totalJobs}</strong></div>
            <div className="reports-item"><span>Applications</span><strong>{stats.totalApplications}</strong></div>
            <div className="reports-item"><span>Recruiters</span><strong>{stats.totalRecruiters}</strong></div>
            <div className="reports-item"><span>Members</span><strong>{stats.totalUsers}</strong></div>
          </div>
        </div>
      </div>

      <div className="reports-card">
        <h3>Dashboard Analytics</h3>
        <div className="reports-list">
          <div className="reports-item"><span>Candidate pipeline</span><strong>Healthy</strong></div>
          <div className="reports-item"><span>Recruiter productivity</span><strong>Stable</strong></div>
          <div className="reports-item"><span>Company coverage</span><strong>Expanding</strong></div>
          <div className="reports-item"><span>Hiring readiness</span><strong>Ready</strong></div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
