import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Sidebar.css";

const MenuIcon = ({ name }) => {
  const paths = {
    dashboard:
      "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
    profile:
      "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    jobs:
      "M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 0h-4V4h4v2z",
    applied:
      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
    saved:
      "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
    resume:
      "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zm.5 8.5l-5-5L9.59 11.2 13 14.6l3.41-3.4 1.09 1.3z",
    notifications:
      "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
    interviews:
      "M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z",
    settings:
      "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
    company:
      "M10 4h4a2 2 0 0 1 2 2v2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2zm-4 6v8h12v-8H6zm2-2h8v2H8V8z",
    postjob:
      "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    manage:
      "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z",
    applicants:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    users:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    recruiters:
      "M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm6 13h-3v3h-2v-3H7v-2h3v-3h2v3h3v2z",
    candidates:
      "M15 14c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-6-6c1.66 0 3-1.34 3-3S10.66 2 9 2 6 3.34 6 5s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z",
    reports:
      "M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2 2H5V5h14v14zm0-16H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z",
    logout:
      "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
  };

  return (
    <span className="sidebar-link-icon">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={paths[name] || paths.dashboard} />
      </svg>
    </span>
  );
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const openHandler = () => setMobileOpen(true);
    window.addEventListener("ats:opensidebar", openHandler);
    return () => window.removeEventListener("ats:opensidebar", openHandler);
  }, []);

  const candidateLinks = [
    { name: "Dashboard", path: "/candidate/dashboard", icon: "dashboard" },
    { name: "Profile", path: "/candidate/profile", icon: "profile" },
    { name: "Jobs", path: "/jobs", icon: "jobs" },
    { name: "Applied Jobs", path: "/candidate/applied-jobs", icon: "applied" },
    { name: "Saved Jobs", path: "/candidate/saved-jobs", icon: "saved" },
    { name: "Resume", path: "/candidate/resume", icon: "resume" },
    { name: "Notifications", path: "/candidate/notifications", icon: "notifications" },
    { name: "Interviews", path: "/candidate/interviews", icon: "interviews" },
    { name: "Settings", path: "/candidate/profile", icon: "settings" },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: "dashboard" },
    { name: "Company Profile", path: "/recruiter/company", icon: "company" },
    { name: "Post Job", path: "/recruiter/post-job", icon: "postjob" },
    { name: "Manage Jobs", path: "/recruiter/jobs", icon: "manage" },
    { name: "Applicants", path: "/recruiter/applicants", icon: "applicants" },
    { name: "Interviews", path: "/recruiter/interviews", icon: "interviews" },
    { name: "Notifications", path: "/recruiter/notifications", icon: "notifications" },
    { name: "Settings", path: "/recruiter/profile", icon: "settings" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
    { name: "Users", path: "/admin/users", icon: "users" },
    { name: "Recruiters", path: "/admin/recruiters", icon: "recruiters" },
    { name: "Candidates", path: "/admin/candidates", icon: "candidates" },
    { name: "Companies", path: "/admin/companies", icon: "company" },
    { name: "Jobs", path: "/admin/jobs", icon: "jobs" },
    { name: "Applications", path: "/admin/applications", icon: "applied" },
    { name: "Reports", path: "/admin/reports", icon: "reports" },
    { name: "Settings", path: "/admin/settings", icon: "settings" },
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

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const getMenuLabel = () => {
    switch (user?.role) {
      case "candidate":
        return "Candidate Menu";
      case "recruiter":
        return "Recruiter Menu";
      case "admin":
        return "Admin Menu";
      default:
        return "Menu";
    }
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={closeMobile}
      />

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-mark">AI</div>
          <div className="sidebar-brand-text">
            <h2>AI ATS</h2>
            <p>{user?.role}</p>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          <div className="sidebar-menu-label">{getMenuLabel()}</div>
          {getLinks().map((item) => (
            <NavLink
              key={`${item.name}-${item.path}`}
              to={item.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <MenuIcon name={item.icon} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <MenuIcon name="logout" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
