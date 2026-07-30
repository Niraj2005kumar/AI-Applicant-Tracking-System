import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import "./Companies.css";

const Companies = () => {
  const [loading, setLoading] = useState(true);

  const [company, setCompany] = useState({
    name: "",
    website: "",
    industry: "",
    companySize: "",
    location: "",
    founded: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const { data } = await api.get("/recruiter/company");

      setCompany({
        name: data.name || "",
        website: data.website || "",
        industry: data.industry || "",
        companySize: data.companySize || "",
        location: data.location || "",
        founded: data.founded || "",
        description: data.description || "",
        logo: data.logo || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogo = (e) => {
    setCompany({
      ...company,
      logo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", company.name);
      formData.append("website", company.website);
      formData.append("industry", company.industry);
      formData.append("companySize", company.companySize);
      formData.append("location", company.location);
      formData.append("founded", company.founded);
      formData.append("description", company.description);

      if (company.logo instanceof File) {
        formData.append("logo", company.logo);
      }

      await api.put("/recruiter/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Company profile updated successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update company."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="company-page">
      <div className="company-header">
        <h1>Company Profile</h1>
        <p>Manage your company information.</p>
      </div>

      <form
        className="company-form"
        onSubmit={handleSubmit}
      >
        <div className="logo-section">
          {typeof company.logo === "string" &&
          company.logo ? (
            <img
              src={company.logo}
              alt="Company Logo"
              className="company-logo"
            />
          ) : (
            <div className="logo-placeholder">
              Logo
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleLogo}
          />
        </div>

        <div className="form-group">
          <label>Company Name</label>

          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Website</label>

          <input
            type="url"
            name="website"
            value={company.website}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Industry</label>

          <input
            type="text"
            name="industry"
            value={company.industry}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Company Size</label>

          <input
            type="text"
            name="companySize"
            value={company.companySize}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location</label>

          <input
            type="text"
            name="location"
            value={company.location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Founded Year</label>

          <input
            type="number"
            name="founded"
            value={company.founded}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>

          <textarea
            rows="5"
            name="description"
            value={company.description}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="save-btn"
        >
          Save Company
        </button>
      </form>
    </div>
  );
};

export default Companies;