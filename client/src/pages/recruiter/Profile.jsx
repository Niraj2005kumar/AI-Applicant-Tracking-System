import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    designation: "",
    about: "",
    avatar: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/recruiter/profile");

      setProfile({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        designation: data.designation || "",
        about: data.about || "",
        avatar: data.avatar || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setProfile({
      ...profile,
      avatar: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);
      formData.append("company", profile.company);
      formData.append(
        "designation",
        profile.designation
      );
      formData.append("about", profile.about);

      if (profile.avatar instanceof File) {
        formData.append("avatar", profile.avatar);
      }

      await api.put(
        "/recruiter/profile",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert("Profile updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update profile."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Recruiter Profile</h1>
        <p>Manage your recruiter account.</p>
      </div>

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <div className="avatar-section">
          {typeof profile.avatar === "string" &&
          profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Profile"
              className="avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              Profile
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </div>

        <div className="form-group">
          <label>Name</label>

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Company</label>

          <input
            type="text"
            name="company"
            value={profile.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Designation</label>

          <input
            type="text"
            name="designation"
            value={profile.designation}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>About</label>

          <textarea
            rows="5"
            name="about"
            value={profile.about}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="save-btn"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;