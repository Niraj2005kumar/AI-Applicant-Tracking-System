import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import Home from "../pages/common/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/common/NotFound";

import CandidateDashboard from "../pages/candidate/Dashboard";
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Candidate Routes */}
          <Route element={<RoleRoute allowedRoles={["candidate"]} />}>
            <Route
              path="/candidate/dashboard"
              element={<CandidateDashboard />}
            />
          </Route>

          {/* Recruiter Routes */}
          <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
            <Route
              path="/recruiter/dashboard"
              element={<RecruiterDashboard />}
            />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;