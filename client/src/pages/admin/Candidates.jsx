import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Candidates.css";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

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
        {filteredCandidates.length === 0 ? (
          <div className="admin-empty">No candidates found for the current search.</div>
        ) : (
          <div className="candidate-list">
            {filteredCandidates.map((candidate) => (
              <div key={candidate._id} className="candidate-item">
                <div className="candidate-details">
                  <strong>{candidate.name}</strong>
                  <span>{candidate.email}</span>
                  <span>Experience: {candidate.experience || 0} years</span>
                  <span>ATS Score: {candidate.atsScore || 0}%</span>
                  <div className="candidate-skills">
                    {(candidate.skills || []).slice(0, 6).map((skill) => (
                      <span key={skill} className="candidate-skill">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="admin-action-row">
                  <span className="admin-badge verified">Resume Ready</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Candidates;
