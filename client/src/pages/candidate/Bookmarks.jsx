import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      const { data } = await api.get("/bookmarks");

      const jobs = data.bookmarks || [];

      setBookmarks(jobs);
      setFilteredBookmarks(jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }

    const filtered = bookmarks.filter((item) => {
      return (
        item.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.company?.name
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.location
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredBookmarks(filtered);
  };

  const applyJob = async (jobId) => {
    try {
      await api.post(`/applications/${jobId}`);

      alert("Application submitted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to apply for this job."
      );
    }
  };

  const removeBookmark = async (jobId) => {
    const confirmDelete = window.confirm(
      "Remove this job from bookmarks?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/bookmarks/${jobId}`);

      const updated = bookmarks.filter(
        (job) => job._id !== jobId
      );

      setBookmarks(updated);
      setFilteredBookmarks(updated);

      alert("Bookmark removed successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to remove bookmark."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="bookmarks-page">
      <div className="bookmarks-header">
        <h1>Bookmarked Jobs</h1>

        <p>Your saved jobs for future applications.</p>
      </div>

      <SearchBar
        placeholder="Search bookmarked jobs..."
        onSearch={handleSearch}
      />

      {filteredBookmarks.length === 0 ? (
        <div className="empty-state">
          <h3>No Bookmarked Jobs Found</h3>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {filteredBookmarks.map((job) => (
            <div
              key={job._id}
              className="bookmark-card"
            >
              <h2>{job.title}</h2>

              <p>
                <strong>Company:</strong>{" "}
                {job.company?.name}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {job.salary}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {job.experience}
              </p>

              <p>
                <strong>Job Type:</strong>{" "}
                {job.jobType}
              </p>

              <div className="bookmark-actions">
                <button
                  className="apply-btn"
                  onClick={() =>
                    applyJob(job._id)
                  }
                >
                  Apply
                </button>

                <button
                  className="remove-btn"
                  onClick={() =>
                    removeBookmark(job._id)
                  }
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;