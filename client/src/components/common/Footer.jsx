import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>AI ATS</h2>
          <p>
            AI Powered Applicant Tracking System for Candidates,
            Recruiters and Administrators.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>

          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>

          <p>Email: support@aiats.com</p>
          <p>Phone: +91 9876543210</p>
          <p>India</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} AI ATS. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;