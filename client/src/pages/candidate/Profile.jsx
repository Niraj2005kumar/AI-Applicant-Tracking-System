import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();

  const getInitialFormData = (currentUser) => ({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    location: currentUser?.location || "",
    skills: currentUser?.skills || "",
    experience: currentUser?.experience || "",
    bio: currentUser?.bio || "",
  });

  const [formData, setFormData] = useState(() => getInitialFormData(user));

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await api.put("/candidate/profile", formData);

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-profile">
      <div className="profile-card">
        <h1>My Profile</h1>

        {message && (
          <div className="profile-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone</label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Skills</label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>

            <textarea
              rows="5"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="save-btn"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;