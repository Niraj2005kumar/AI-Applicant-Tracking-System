import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import "./Companies.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 6;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const [companiesRes, jobsRes] = await Promise.all([
          api.get("/admin/companies"),
          api.get("/admin/jobs"),
        ]);

        if (companiesRes.data.success) {
          setCompanies(companiesRes.data.companies || []);
        }

        if (jobsRes.data.success) {
          setJobs(jobsRes.data.jobs || []);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const getJobCount = (company) => {
    return jobs.filter(
      (job) => job.company?._id === company._id || job.company === company._id
    ).length;
  };

  const filteredCompanies = companies.filter((company) => {
    const text = `${company.name} ${company.industry} ${company.location}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedCompanies = filteredCompanies.slice((currentPage - 1) * limit, currentPage * limit);

  const handleDelete = async () => {
    if (!selectedCompany) return;

    try {
      setDeleting(true);
      const { data } = await api.delete(`/admin/companies/${selectedCompany._id}`);
      if (data.success) {
        setCompanies((prev) => prev.filter((item) => item._id !== selectedCompany._id));
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete the selected company.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="companies-page">
      <div className="page-header">
        <div>
          <h1>Companies</h1>
          <p>Inspect companies, industries, and ownership details for the platform.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <SearchBar placeholder="Search companies" onSearch={setSearch} />
      </div>

      <div className="companies-card">
        {paginatedCompanies.length === 0 ? (
          <div className="admin-empty">No companies found for the current search.</div>
        ) : (
          <div className="company-list">
            {paginatedCompanies.map((company) => (
              <div key={company._id} className="company-item">
                <div className="company-meta">
                  {company.logo ? (
                    <img src={company.logo} alt={company.name} className="company-logo" />
                  ) : (
                    <div className="company-logo-placeholder">Logo</div>
                  )}
                  <div>
                    <strong>{company.name}</strong>
                    <p>{company.industry}</p>
                    <p>{company.location || "Location not provided"}</p>
                    <p>Owner: {company.owner?.name || "Unassigned"}</p>
                    <p>{getJobCount(company)} job{getJobCount(company) === 1 ? "" : "s"}</p>
                  </div>
                </div>
                <div className="admin-action-row">
                  <button
                    className="admin-action-btn delete"
                    onClick={() => setSelectedCompany(company)}
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
        isOpen={Boolean(selectedCompany)}
        title={selectedCompany?.name || "Company Details"}
        onClose={() => setSelectedCompany(null)}
        onConfirm={handleDelete}
        confirmText="Delete Company"
        cancelText="Close"
        loading={deleting}
      >
        {selectedCompany && (
          <div className="admin-modal-list">
            <p><strong>Industry:</strong> {selectedCompany.industry}</p>
            <p><strong>Location:</strong> {selectedCompany.location || "Not provided"}</p>
            <p><strong>Website:</strong> {selectedCompany.website || "Not provided"}</p>
            <p><strong>Size:</strong> {selectedCompany.companySize || "Not provided"}</p>
            <p><strong>Owner:</strong> {selectedCompany.owner?.name || "Unassigned"}</p>
            <p><strong>Active Jobs:</strong> {getJobCount(selectedCompany)}</p>
            <p><strong>Joined:</strong> {new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Companies;

