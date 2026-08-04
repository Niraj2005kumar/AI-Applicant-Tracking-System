import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { email, password, remember } = formData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setError("Please enter your email and password.");
    }

    try {
      setLoading(true);
      setError("");

      const data = await login({ email, password });

      if (data.user?.role === "admin") {

        navigate("/admin/dashboard");
      } else {

        setError("Access Denied. Administrator account required.");

        setTimeout(() => {
          logout();
          navigate("/admin/login");
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-bg" />

      <div className="admin-login-container">
        <div className="admin-login-brand">
          <div className="admin-login-logo">
            <span className="admin-logo-mark">AI</span>
            <div>
              <strong>AI ATS</strong>
              <small>Administration Center</small>
            </div>
          </div>
        </div>

        <div className="admin-login-card">
          <div className="admin-login-card-header">
            <div className="admin-shield-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <h1>Admin Sign In</h1>
            <p>Secure access to the administrator console</p>
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <label htmlFor="admin-email">Email address</label>

              <div className="admin-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="admin@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="admin-login-field">
              <label htmlFor="admin-password">Password</label>

              <div className="admin-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="admin-login-options">
              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="remember"
                  checked={remember}
                  onChange={handleChange}
                />
                <span>Remember me</span>
              </label>

              <button type="button" className="admin-forgot-link">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="admin-login-loading">
                  <span className="admin-spinner" />
                  Verifying...
                </span>
              ) : (
                "Sign in to Console"
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <span>Restricted area</span>
            <span className="admin-footer-dot">•</span>
            <span>Authorized administrators only</span>
          </div>

          <div className="admin-login-back">
            <Link to="/login">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to user login
            </Link>
          </div>
        </div>

        <p className="admin-login-copyright">
          © {new Date().getFullYear()} AI ATS Administration. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

