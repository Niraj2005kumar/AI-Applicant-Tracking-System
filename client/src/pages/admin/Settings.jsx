import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Settings.css";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/auth/me");
        if (data.success) {
          setProfile(data.user);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load your admin profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin profile, password, notifications, and security preferences.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="settings-card">
        <h3>Admin Profile</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Name</label>
            <input value={profile?.name || ""} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profile?.email || ""} readOnly />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={profile?.phone || "Not provided"} readOnly />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input value={profile?.role || "admin"} readOnly />
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h3>Password & Security</h3>
        <div className="settings-list">
          <div className="settings-item">
            <span>Change password</span>
            <button className="create-btn">Update</button>
          </div>
          <div className="settings-item">
            <span>Enable MFA</span>
            <span className="settings-toggle">Enabled</span>
          </div>
          <div className="settings-item">
            <span>Session timeout</span>
            <span className="settings-toggle">30 mins</span>
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h3>Notifications</h3>
        <div className="settings-list">
          <div className="settings-item">
            <span>New applications</span>
            <span className="settings-toggle">On</span>
          </div>
          <div className="settings-item">
            <span>Recruiter approvals</span>
            <span className="settings-toggle">On</span>
          </div>
          <div className="settings-item">
            <span>System alerts</span>
            <span className="settings-toggle">On</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
