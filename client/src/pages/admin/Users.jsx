import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/common/Modal";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/admin/users");
        if (data.success) {
          setUsers(data.users || []);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load users at the moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filter === "all" ? true : user.role === filter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / limit));
  const currentPage = Math.min(page, totalPages);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * limit, currentPage * limit);

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleting(true);
      const { data } = await api.delete(`/admin/users/${selectedUser._id}`);
      if (data.success) {
        setUsers((prev) => prev.filter((item) => item._id !== selectedUser._id));
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to delete the selected user.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p>Manage platform users, filter by role, and review account details.</p>
        </div>
      </div>

      {error && <div className="admin-alert alert-danger">{error}</div>}

      <div className="admin-card">
        <div className="admin-toolbar">
          <SearchBar placeholder="Search users by name or email" onSearch={setSearch} />

          <div className="admin-filter-group">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Roles</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-stat-row">
          <div className="admin-mini-card">
            <h3>{users.length}</h3>
            <p>Total Accounts</p>
          </div>
          <div className="admin-mini-card">
            <h3>{users.filter((item) => item.role === "candidate").length}</h3>
            <p>Candidates</p>
          </div>
          <div className="admin-mini-card">
            <h3>{users.filter((item) => item.role === "recruiter").length}</h3>
            <p>Recruiters</p>
          </div>
          <div className="admin-mini-card">
            <h3>{users.filter((item) => item.role === "admin").length}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty">No users matched your current search.</td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`admin-badge ${user.role}`}>{user.role}</span></td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-action-row">
                        <button className="admin-action-btn" onClick={() => setSelectedUser(user)}>
                          View
                        </button>
                        <button className="admin-action-btn delete" onClick={() => setSelectedUser(user)} disabled={user.role === "admin"}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal
        isOpen={Boolean(selectedUser)}
        title={selectedUser?.name || "User Details"}
        onClose={() => setSelectedUser(null)}
        onConfirm={handleDelete}
        confirmText="Delete User"
        cancelText="Close"
        loading={deleting}
      >
        {selectedUser && (
          <div className="admin-modal-list">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Phone:</strong> {selectedUser.phone || "Not provided"}</p>
            <p><strong>Location:</strong> {selectedUser.location || "Not provided"}</p>
            <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
