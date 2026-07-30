import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/common/Loader";
import "./Resume.css";

const Resume = () => {
  const { user, token } = useAuth();
  
  const [resumePath, setResumePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Parsed details from resume (fetched from profile or mock matching)
  const [profileDetails, setProfileDetails] = useState({
    skills: [],
    experience: 0,
    education: "",
    location: "",
  });

  const fetchProfileResume = async () => {
    try {
      const { data } = await api.get("/auth/profile");
      if (data.success && data.user) {
        setResumePath(data.user.resume || "");
        setProfileDetails({
          skills: data.user.skills || [],
          experience: data.user.experience || 0,
          education: data.user.education || "",
          location: data.user.location || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch resume status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileResume();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
    setSuccess("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF or DOCX file to upload.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();
      formData.append("resume", file);

      const { data } = await api.put("/users/upload-resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setSuccess("Resume uploaded and parsed successfully!");
        setResumePath(data.resume || "");
        // Refresh profile details to load parsed fields
        await fetchProfileResume();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete your resume?");
    if (!confirm) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await api.delete("/users/delete-resume");
      if (data.success) {
        setSuccess("Resume deleted successfully.");
        setResumePath("");
        setProfileDetails({
          skills: [],
          experience: 0,
          education: "",
          location: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to delete resume.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="resume-page-wrapper">
      <div className="resume-header">
        <h1>My Resume</h1>
        <p>Upload your resume to automatically parse your skills and sync them with your candidate profile.</p>
      </div>

      {error && <div className="resume-alert alert-danger">{error}</div>}
      {success && <div className="resume-alert alert-success">{success}</div>}

      <div className="resume-grid-layout">
        {/* Upload Column */}
        <div className="resume-card-box upload-card">
          <h3>{resumePath ? "Update Resume" : "Upload Resume"}</h3>
          <p className="formats-info">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="file-drop-area">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                id="resume-file-input"
              />
              <label htmlFor="resume-file-input" className="file-label">
                <span className="upload-icon">📁</span>
                <span>{file ? file.name : "Select or drag file here"}</span>
              </label>
            </div>

            <button type="submit" className="upload-submit-btn" disabled={uploading}>
              {uploading ? "Parsing & Uploading..." : resumePath ? "Re-upload & Parse" : "Upload & Parse Resume"}
            </button>
          </form>

          {resumePath && (
            <div className="resume-actions-zone">
              <a
                href={`http://localhost:5000${resumePath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-resume-link"
              >
                📄 View Current Resume
              </a>
              <button onClick={handleDelete} className="delete-resume-btn">
                🗑️ Delete Resume
              </button>
            </div>
          )}
        </div>

        {/* AI Parsed Details Column */}
        <div className="resume-card-box details-card">
          <h3>AI Parsed Profile Data</h3>
          <p className="formats-info">These details are extracted directly from your resume and used for ATS Job Match screening.</p>

          {resumePath ? (
            <div className="parsed-details">
              <div className="parsed-item">
                <strong>Extracted Skills:</strong>
                {profileDetails.skills.length > 0 ? (
                  <div className="skills-badge-container">
                    {profileDetails.skills.map((skill, index) => (
                      <span key={index} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <span className="no-detail">No skills extracted yet. Try re-uploading a clearer PDF.</span>
                )}
              </div>

              <div className="parsed-row-group">
                <div className="parsed-item">
                  <strong>Years of Experience:</strong>
                  <span className="val-text">{profileDetails.experience} Years</span>
                </div>

                <div className="parsed-item">
                  <strong>Highest Education:</strong>
                  <span className="val-text">{profileDetails.education || "Bachelor's Degree"}</span>
                </div>
              </div>

              <div className="parsed-item">
                <strong>Extracted Location:</strong>
                <span className="val-text">{profileDetails.location || "Not specified"}</span>
              </div>

              <div className="ats-recommendation-box">
                <span className="star-icon">✨</span>
                <div>
                  <h4>ATS Parsing Tip</h4>
                  <p>Keep your resume structure clean and simple. Avoid tables, charts, or images in your PDF to achieve a 100% extraction accuracy rate.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-parsed-state">
              <span className="empty-icon">🤖</span>
              <h4>Waiting for Resume</h4>
              <p>Upload a resume to let our AI parsing service populate your skills, education, and years of experience automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;
