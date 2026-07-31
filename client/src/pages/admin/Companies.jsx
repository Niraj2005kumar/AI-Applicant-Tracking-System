import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Companies.css";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/companies");
        if (data.success) {
          setCompanies(data.companies || []);
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

  const filteredCompanies = companies.filter((company) => {
    const text = `${company.name} ${company.industry} ${company.location}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

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
        {filteredCompanies.length === 0 ? (
          <div className="admin-empty">No companies found for the current search.</div>
        ) : (
          <div className="company-list">
            {filteredCompanies.map((company) => (
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
                  </div>
                </div>
                <div className="admin-action-row">
                  <span className="admin-badge verified">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
