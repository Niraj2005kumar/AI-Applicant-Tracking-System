import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import "./Recruiters.css";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersRes, companiesRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/companies"),
        ]);

        if (usersRes.data.success) {
          setRecruiters((usersRes.data.users || []).filter((user) => user.role === "recruiter"));
        }

        if (companiesRes.data.success) {
          setCompanies(companiesRes.data.companies || []);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load recruiter records right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCompanyName = (recruiter) => {
    const company = companies.find(
      (c) => c.owner?._id === recruiter._id || c.owner === recruiter._id
    );
    return company?.name || "Pending assignment";
  };

  const getCompanyCount = (recruiter) => {
    return companies.filter(
      (c) => c.owner?._id === recruiter._id || c.owner === recruiter._id
    ).length;
  };

  const filteredRecruiters = recruiters.filter((recruiter) => {
    const companyName = getCompanyName(recruiter);
    const text = `${recruiter.name} ${recruiter.email} ${companyName}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecruiters.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecruiters = filteredRecruiters.slice((currentPage - 1) * limit, currentPage * limit);

  const handleDelete = async () => {
    if (!selectedRecruiter) return;

    try {
      setDeleting(true);
      const { data } = await api.delete(`/admin/users/${selectedRecruiter._id}`);
      if (data.success) {
        setRecruiters((prev) => prev.filter((item) => item._id !== selectedRecruiter._id));
        setSelectedRecruiter(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete the selected recruiter.");
    } finally {
      setDeleting(false);
    }
  };

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
                  <span>Company: {getCompanyName(recruiter)}</span>
                  <span>
                    {getCompanyCount(recruiter)} company
                    {getCompanyCount(recruiter) === 1 ? "" : "ies"}
                  </span>
                </div>
                <div className="admin-action-row">
                  <span className={`admin-badge ${recruiter.isVerified ? "verified" : "pending"}`}>
                    {recruiter.isVerified ? "Verified" : "Pending"}
                  </span>
                  <button
                    className="admin-action-btn delete"
                    onClick={() => setSelectedRecruiter(recruiter)}
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
        isOpen={Boolean(selectedRecruiter)}
        title={selectedRecruiter?.name || "Recruiter Details"}
        onClose={() => setSelectedRecruiter(null)}
        onConfirm={handleDelete}
        confirmText="Delete Recruiter"
        cancelText="Close"
        loading={deleting}
      >
        {selectedRecruiter && (
          <div className="admin-modal-list">
            <p><strong>Email:</strong> {selectedRecruiter.email}</p>
            <p><strong>Company:</strong> {getCompanyName(selectedRecruiter)}</p>
            <p><strong>Phone:</strong> {selectedRecruiter.phone || "Not provided"}</p>
            <p><strong>Location:</strong> {selectedRecruiter.location || "Not provided"}</p>
            <p><strong>Joined:</strong> {new Date(selectedRecruiter.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Recruiters;

