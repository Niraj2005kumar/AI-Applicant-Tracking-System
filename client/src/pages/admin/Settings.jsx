import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Settings.css";

const Settings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/auth/me");
        if (data.success) {
          setProfile(data.user);
          setProfileForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            location: data.user.location || "",
            bio: data.user.bio || "",
          });
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

  const handleProfileChange = (e) => {
    setProfileForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    setError("");

    try {
      setProfileSaving(true);

      const { data } = await api.put("/admin/profile", {
        name: profileForm.name,
        phone: profileForm.phone,
        location: profileForm.location,
        bio: profileForm.bio,
      });

      if (data.success) {
        setProfileMessage("Profile updated successfully.");

        // Keep stored user in sync
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.name = data.user.name;
          localStorage.setItem("user", JSON.stringify(parsed));
        }

        setProfile((prev) => ({
          ...prev,
          ...data.user,
        }));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setError("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return setError("Please fill in both password fields.");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return setError("New password and confirmation do not match.");
    }

    if (passwordForm.newPassword.length < 6) {
      return setError("New password must be at least 6 characters long.");
    }

    try {
      setPasswordSaving(true);

      const { data } = await api.put("/admin/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (data.success) {
        setPasswordMessage("Password updated successfully.");
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Unable to update password.");
    } finally {
      setPasswordSaving(false);
    }
  };

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
      {profileMessage && <div className="admin-alert alert-success">{profileMessage}</div>}
      {passwordMessage && <div className="admin-alert alert-success">{passwordMessage}</div>}

      <form className="settings-card" onSubmit={handleProfileSubmit}>
        <h3>Admin Profile</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input value={profileForm.email} readOnly />
            <small className="settings-hint">Email cannot be changed.</small>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileChange}
              placeholder="Enter your phone"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input value={profile?.role || "admin"} readOnly />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={profileForm.location}
              onChange={handleProfileChange}
              placeholder="Enter your location"
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              placeholder="Short bio"
              rows="3"
            />
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="create-btn" disabled={profileSaving}>
            {profileSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>

      <form className="settings-card" onSubmit={handlePasswordSubmit}>
        <h3>Password & Security</h3>
        <div className="settings-grid">
          <div className="form-group">
            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              placeholder="Min 6 characters"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              required
            />
          </div>
        </div>

        <div className="settings-actions">
          <button type="submit" className="create-btn" disabled={passwordSaving}>
            {passwordSaving ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

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
