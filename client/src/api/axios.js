import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const storedUser = localStorage.getItem("user");
      const role = storedUser ? JSON.parse(storedUser)?.role : null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Route admin users to the admin login on session expiry
      if (role === "admin") {
        if (window.location.pathname !== "/admin/login") {
          window.location.href = "/admin/login";
        }
      } else if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Handle role/permission mismatch: redirect user to their home dashboard
      const storedUser = localStorage.getItem("user");
      const role = storedUser ? JSON.parse(storedUser)?.role : null;

      if (role === "candidate") {
        if (window.location.pathname !== "/candidate/dashboard") {
          window.location.href = "/candidate/dashboard";
        }
      } else if (role === "recruiter") {
        if (window.location.pathname !== "/recruiter/dashboard") {
          window.location.href = "/recruiter/dashboard";
        }
      } else if (role === "admin") {
        if (window.location.pathname !== "/admin/dashboard") {
          window.location.href = "/admin/dashboard";
        }
      } else {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;