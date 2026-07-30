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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">AI ATS</Link>
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