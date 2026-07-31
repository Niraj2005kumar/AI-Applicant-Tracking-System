import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import "./Recruiters.css";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 6;

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/users");
        if (data.success) {
          setRecruiters((data.users || []).filter((user) => user.role === "recruiter"));
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load recruiter records right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiters();
  }, []);

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const text = `${recruiter.name} ${recruiter.email} ${recruiter.company || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecruiters.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecruiters = filteredRecruiters.slice((currentPage - 1) * limit, currentPage * limit);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="recruiter-page">
      <div className="page-header">
        <div>
          <h1>Recruiters</h1>
          <p>Review recruiter accounts, their verification status, and company alignment.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <SearchBar placeholder="Search recruiters" onSearch={setSearch} />
      </div>

      <div className="recruiter-card">
        <div className="recruiter-grid">
          <div className="admin-mini-card">
            <h3>{recruiters.length}</h3>
            <p>Total Recruiters</p>
          </div>
          <div className="admin-mini-card">
            <h3>{recruiters.filter((item) => item.isVerified).length}</h3>
            <p>Verified</p>
          </div>
          <div className="admin-mini-card">
            <h3>{recruiters.filter((item) => !item.isVerified).length}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      <div className="recruiter-card">
        {paginatedRecruiters.length === 0 ? (
          <div className="admin-empty">No recruiters matched the current search.</div>
        ) : (
          <div className="recruiter-list">
            {paginatedRecruiters.map((recruiter) => (
              <div key={recruiter._id} className="recruiter-item">
                <div className="recruiter-meta">
                  <strong>{recruiter.name}</strong>
                  <span>{recruiter.email}</span>
                  <span>Company: {recruiter.company || "Pending assignment"}</span>
                </div>
                <div className="admin-action-row">
                  <span className={`admin-badge ${recruiter.isVerified ? "verified" : "pending"}`}>
                    {recruiter.isVerified ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Recruiters;
