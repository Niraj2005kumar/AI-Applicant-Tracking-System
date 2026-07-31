import { useEffect, useState } from "react";
import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import SearchBar from "../../components/common/SearchBar";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get("/notifications");

      const list = data.notifications || [];

      setNotifications(list);
      setFilteredNotifications(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredNotifications(notifications);
      return;
    }

    const filtered = notifications.filter((item) => {
      return (
        item.title
          ?.toLowerCase()
          .includes(keyword.toLowerCase()) ||
        item.message
          ?.toLowerCase()
          .includes(keyword.toLowerCase())
      );
    });

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      const updated = notifications.map((item) =>
        item._id === id
          ? { ...item, isRead: true }
          : item
      );

      setNotifications(updated);
      setFilteredNotifications(updated);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to mark notification as read."
      );
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/notifications/${id}`);

      const updated = notifications.filter(
        (item) => item._id !== id
      );

      setNotifications(updated);
      setFilteredNotifications(updated);

      alert("Notification deleted successfully.");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete notification."
      );
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>View recruiter notifications and updates.</p>
        </div>
      </div>

      <SearchBar
        placeholder="Search notifications..."
        onSearch={handleSearch}
      />

      {filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <h3>No Notifications Found</h3>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-card ${
                notification.isRead
                  ? "read"
                  : "unread"
              }`}
            >
              <div className="notification-content">
                <h2>{notification.title}</h2>

                <p>{notification.message}</p>

                <small>
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </small>
              </div>

              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    className="read-btn"
                    onClick={() =>
                      markAsRead(notification._id)
                    }
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNotification(
                      notification._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;