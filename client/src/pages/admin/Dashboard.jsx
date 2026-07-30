import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
  });

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin statistics.");
    }
  };

  const fetchTabDetails = async () => {
    try {
      setError("");
      if (activeTab === "users") {
        const { data } = await api.get("/admin/users");
        if (data.success) setUsers(data.users);
      } else if (activeTab === "companies") {
        const { data } = await api.get("/admin/companies");
        if (data.success) setCompanies(data.companies);
      } else if (activeTab === "jobs") {
        const { data } = await api.get("/admin/jobs");
        if (data.success) setJobs(data.jobs);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to retrieve ${activeTab} data.`);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await fetchStats();
      await fetchTabDetails();
      setLoading(false);
    };
    loadDashboard();
  }, [activeTab]);

  const handleDeleteUser = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user profile?");
    if (!confirm) return;

    try {
      setError("");
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) {
        setSuccess("User deleted successfully.");
        setUsers(users.filter((u) => u._id !== userId));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    }
  };

  const handleDeleteCompany = async (companyId) => {
    const confirm = window.confirm("Are you sure you want to delete this company profile?");
    if (!confirm) return;

    try {
      setError("");
      const { data } = await api.delete(`/admin/companies/${companyId}`);
      if (data.success) {
        setSuccess("Company profile deleted successfully.");
        setCompanies(companies.filter((c) => c._id !== companyId));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete company.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job vacancy listing?");
    if (!confirm) return;

    try {
      setError("");
      const { data } = await api.delete(`/admin/jobs/${jobId}`);
      if (data.success) {
        setSuccess("Job listing deleted successfully.");
        setJobs(jobs.filter((j) => j._id !== jobId));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete job.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Administration Hub</h1>
          <p>System metrics monitoring and recruitment data records audit management.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}
      {success && <div className="admin-alert alert-success">{success}</div>}

      {/* Admin Stats Grid */}
      <div className="admin-stats-row">
        <div className="admin-stat-box border-blue">
          <h3>{stats.totalUsers}</h3>
          <p>Candidates</p>
        </div>
        <div className="admin-stat-box border-green">
          <h3>{stats.totalRecruiters}</h3>
          <p>Recruiters</p>
        </div>
        <div className="admin-stat-box border-yellow">
          <h3>{stats.totalJobs}</h3>
          <p>Active Openings</p>
        </div>
        <div className="admin-stat-box border-purple">
          <h3>{stats.totalCompanies}</h3>
          <p>Companies</p>
        </div>
        <div className="admin-stat-box border-red">
          <h3>{stats.totalApplications}</h3>
          <p>Applications</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="admin-panel-card">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Manage Users
          </button>
          <button
            className={`tab-btn ${activeTab === "companies" ? "active" : ""}`}
            onClick={() => setActiveTab("companies")}
          >
            🏢 Manage Companies
          </button>
          <button
            className={`tab-btn ${activeTab === "jobs" ? "active" : ""}`}
            onClick={() => setActiveTab("jobs")}
          >
            💼 Manage Jobs
          </button>
        </div>

        {/* Tab Contents */}
        <div className="tab-contents">
          {activeTab === "users" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-td">No registered users found.</td>
                    </tr>
                  ) : (
                    users.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.email}</td>
                        <td>
                          <span className={`role-badge ${item.role}`}>
                            {item.role}
                          </span>
                        </td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteUser(item._id)}
                            className="delete-icon-btn"
                            disabled={item.role === "admin"}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Company Logo</th>
                    <th>Company Name</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Owner</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-td">No companies listed.</td>
                    </tr>
                  ) : (
                    companies.map((item) => (
                      <tr key={item._id}>
                        <td>
                          {item.logo ? (
                            <img src={item.logo} alt="" className="table-logo" />
                          ) : (
                            <div className="logo-placeholder-sm">Logo</div>
                          )}
                        </td>
                        <td><strong>{item.name}</strong></td>
                        <td>{item.industry}</td>
                        <td>{item.location || "N/A"}</td>
                        <td>{item.owner?.name || "N/A"}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteCompany(item._id)}
                            className="delete-icon-btn"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "jobs" && (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Location</th>
                    <th>Vacancies</th>
                    <th>Recruiter</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-td">No active job posts found.</td>
                    </tr>
                  ) : (
                    jobs.map((item) => (
                      <tr key={item._id}>
                        <td><strong>{item.title}</strong></td>
                        <td>{item.company?.name || "N/A"}</td>
                        <td>{item.location}</td>
                        <td>{item.vacancies}</td>
                        <td>{item.recruiter?.name || "N/A"}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteJob(item._id)}
                            className="delete-icon-btn"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;