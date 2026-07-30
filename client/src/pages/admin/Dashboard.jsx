import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    interviews: 0,
    recentJobs: [],
    recentApplicants: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/recruiter/dashboard");

      setDashboard({
        totalJobs: data.totalJobs || 0,
        activeJobs: data.activeJobs || 0,
        totalApplicants: data.totalApplicants || 0,
        interviews: data.interviews || 0,
        recentJobs: data.recentJobs || [],
        recentApplicants: data.recentApplicants || [],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="recruiter-dashboard">
      <div className="dashboard-header">
        <h1>Recruiter Dashboard</h1>
        <p>Manage jobs, applicants and interviews.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>{dashboard.totalJobs}</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.activeJobs}</h2>
          <p>Active Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.totalApplicants}</h2>
          <p>Total Applicants</p>
        </div>

        <div className="stat-card">
          <h2>{dashboard.interviews}</h2>
          <p>Scheduled Interviews</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Recent Jobs</h2>

          {dashboard.recentJobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            dashboard.recentJobs.map((job) => (
              <div className="list-item" key={job._id}>
                <h3>{job.title}</h3>

                <p>{job.location}</p>

                <small>
                  {new Date(job.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </div>

        <div className="section-card">
          <h2>Recent Applicants</h2>

          {dashboard.recentApplicants.length === 0 ? (
            <p>No applicants yet.</p>
          ) : (
            dashboard.recentApplicants.map((applicant) => (
              <div className="list-item" key={applicant._id}>
                <h3>{applicant.name}</h3>

                <p>{applicant.email}</p>

                <small>
                  {applicant.job?.title}
                </small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;