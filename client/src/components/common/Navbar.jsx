import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const openMobileMenu = () => {
    window.dispatchEvent(new CustomEvent("ats:opensidebar"));
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-toggle"
          onClick={openMobileMenu}
          aria-label="Open navigation menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div className="navbar-logo">
          <div className="navbar-logo-mark">AI</div>
          <Link to="/">AI ATS</Link>
        </div>
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isAuthenticated && user?.role === "candidate" && (
          <>
            <Link to="/jobs">Jobs</Link>
            <Link to="/candidate/dashboard">Dashboard</Link>
          </>
        )}

        {isAuthenticated && user?.role === "recruiter" && (
          <>
            <Link to="/recruiter/dashboard">Dashboard</Link>
            <Link to="/recruiter/jobs">My Jobs</Link>
          </>
        )}

        {isAuthenticated && user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard">Admin</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn-login">
              Login
            </Link>

            <Link to="/register" className="btn-register">
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="navbar-user">
              {user?.name}
            </span>

            <button
              className="btn-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
