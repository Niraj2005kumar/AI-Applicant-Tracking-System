import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const candidateLinks = [
    { name: "Dashboard", path: "/candidate/dashboard" },
    { name: "Profile", path: "/candidate/profile" },
    { name: "Jobs", path: "/jobs" },
    { name: "Applied Jobs", path: "/candidate/applied-jobs" },
    { name: "Saved Jobs", path: "/candidate/saved-jobs" },
    { name: "Resume", path: "/candidate/resume" },
    { name: "Notifications", path: "/notifications" },
    { name: "Settings", path: "/settings" },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/recruiter/dashboard" },
    { name: "Company Profile", path: "/recruiter/company" },
    { name: "Post Job", path: "/recruiter/post-job" },
    { name: "Manage Jobs", path: "/recruiter/jobs" },
    { name: "Applicants", path: "/recruiter/applicants" },
    { name: "Interviews", path: "/recruiter/interviews" },
    { name: "Notifications", path: "/notifications" },
    { name: "Settings", path: "/settings" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Recruiters", path: "/admin/recruiters" },
    { name: "Companies", path: "/admin/companies" },
    { name: "Jobs", path: "/admin/jobs" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Notifications", path: "/notifications" },
    { name: "Settings", path: "/settings" },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case "candidate":
        return candidateLinks;
      case "recruiter":
        return recruiterLinks;
      case "admin":
        return adminLinks;
      default:
        return [];
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>AI ATS</h2>

        <p>{user?.role?.toUpperCase()}</p>
      </div>

      <div className="sidebar-user">
        <h4>{user?.name}</h4>
        <p>{user?.email}</p>
      </div>

      <nav className="sidebar-menu">
        {getLinks().map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;