import api from "../api/axios";

const authService = {
  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  login: async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

export default authService;