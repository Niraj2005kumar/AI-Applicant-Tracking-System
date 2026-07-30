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

    const filtered = notifications.filter((item) =>
      item.message
        ?.toLowerCase()
        .includes(keyword.toLowerCase())
    );

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

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
          "Unable to update notification."
      );
    }
  };

  const deleteNotification = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this notification?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/notifications/${id}`);

      const updated = notifications.filter(
        (item) => item._id !== id
      );

      setNotifications(updated);
      setFilteredNotifications(updated);
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
      <div className="notifications-header">
        <h1>Notifications</h1>

        <p>
          Stay updated with your latest job activities.
        </p>
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
                <h3>
                  {notification.title}
                </h3>

                <p>
                  {notification.message}
                </p>

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
                      markAsRead(
                        notification._id
                      )
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