import { useState } from "react";
import api from "../../api/axios";
import "./InterviewForm.css";

const InterviewForm = ({ applicationId, candidateName, jobTitle, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    mode: "Online",
    meetingLink: "",
    location: "",
    notes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.interviewDate || !formData.interviewTime) {
      setError("Please select both date and time for the interview.");
      return;
    }

    if (formData.mode === "Online" && !formData.meetingLink) {
      setError("Meeting link is required for Online interviews.");
      return;
    }

    if (formData.mode === "Offline" && !formData.location) {
      setError("Location address is required for Offline interviews.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        applicationId,
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        mode: formData.mode,
        meetingLink: formData.mode === "Online" ? formData.meetingLink : "",
        location: formData.mode === "Offline" ? formData.location : "",
        notes: formData.notes,
      };

      await api.post("/interviews", payload);
      alert("Interview scheduled successfully!");
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to schedule interview.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="interview-modal-backdrop">
      <div className="interview-modal-card">
        <div className="modal-header">
          <h3>Schedule Interview</h3>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>

        <div className="candidate-summary">
          <p><strong>Candidate:</strong> {candidateName}</p>
          <p><strong>Position:</strong> {jobTitle}</p>
        </div>

        {error && <div className="modal-alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="form-group">
              <label htmlFor="interviewDate">Date *</label>
              <input
                type="date"
                id="interviewDate"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="interviewTime">Time *</label>
              <input
                type="time"
                id="interviewTime"
                name="interviewTime"
                value={formData.interviewTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mode">Interview Mode</label>
            <select
              id="mode"
              name="mode"
              value={formData.mode}
              onChange={handleChange}
            >
              <option value="Online">Online (Video Call)</option>
              <option value="Offline">Offline (In-Person)</option>
            </select>
          </div>

          {formData.mode === "Online" ? (
            <div className="form-group">
              <label htmlFor="meetingLink">Meeting Link (e.g. Google Meet, Zoom) *</label>
              <input
                type="url"
                id="meetingLink"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/abc-defg-hij"
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="location">Office Location Address *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 4th Floor, Sector 62, Noida"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="notes">Notes / Instructions for Candidate</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Please bring a copy of your resume and portfolio..."
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={saving}>
              {saving ? "Scheduling..." : "Schedule Interview"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewForm;
