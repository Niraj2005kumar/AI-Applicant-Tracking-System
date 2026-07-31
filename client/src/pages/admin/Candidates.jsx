import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import "./Candidates.css";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 6;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/users");
        if (data.success) {
          setCandidates((data.users || []).filter((user) => user.role === "candidate"));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load candidates.");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    const text = `${candidate.name} ${candidate.email} ${candidate.skills?.join(" ") || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * limit, currentPage * limit);

  const handleDelete = async () => {
    if (!selectedCandidate) return;

    try {
      setDeleting(true);
      const { data } = await api.delete(`/admin/users/${selectedCandidate._id}`);
      if (data.success) {
        setCandidates((prev) => prev.filter((item) => item._id !== selectedCandidate._id));
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete the selected candidate.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="candidates-page">
      <div className="page-header">
        <div>
          <h1>Candidates</h1>
          <p>Review candidate profiles, skills, experience, and ATS-ready details.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <SearchBar placeholder="Search candidates" onSearch={setSearch} />
      </div>

      <div className="candidates-card">
        {paginatedCandidates.length === 0 ? (
          <div className="admin-empty">No candidates found for the current search.</div>
        ) : (
          <div className="candidate-list">
            {paginatedCandidates.map((candidate) => (
              <div key={candidate._id} className="candidate-item">
                <div className="candidate-details">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.email}</span>
                  <span>Location: {candidate.location || "Not provided"}</span>
                  <span>Experience: {candidate.experience || 0} years</span>
                  <span>Education: {candidate.education || "Not provided"}</span>
                  <div className="candidate-skills">
                    {(candidate.skills || []).slice(0, 6).map((skill) => (
                      <span key={skill} className="candidate-skill">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="admin-action-row">
                  <span className={`admin-badge ${candidate.resume ? "verified" : "pending"}`}>
                    {candidate.resume ? "Resume Uploaded" : "No Resume"}
                  </span>
                  <button
                    className="admin-action-btn delete"
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={Boolean(selectedCandidate)}
        title={selectedCandidate?.name || "Candidate Details"}
        onClose={() => setSelectedCandidate(null)}
        onConfirm={handleDelete}
        confirmText="Delete Candidate"
        cancelText="Close"
        loading={deleting}
      >
        {selectedCandidate && (
          <div className="admin-modal-list">
            <p><strong>Email:</strong> {selectedCandidate.email}</p>
            <p><strong>Phone:</strong> {selectedCandidate.phone || "Not provided"}</p>
            <p><strong>Location:</strong> {selectedCandidate.location || "Not provided"}</p>
            <p><strong>Experience:</strong> {selectedCandidate.experience || 0} years</p>
            <p><strong>Education:</strong> {selectedCandidate.education || "Not provided"}</p>
            <p><strong>Resume:</strong> {selectedCandidate.resume ? "Uploaded" : "Not uploaded"}</p>
            <p><strong>Joined:</strong> {new Date(selectedCandidate.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Candidates;

