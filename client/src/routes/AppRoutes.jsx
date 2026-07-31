import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

// Layouts
import CandidateLayout from "../layouts/CandidateLayout";
import RecruiterLayout from "../layouts/RecruiterLayout";
import AdminLayout from "../layouts/AdminLayout";

// Common / Auth Pages
import Home from "../pages/common/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import NotFound from "../pages/common/NotFound";

// Candidate Pages
import CandidateDashboard from "../pages/candidate/Dashboard";
import CandidateProfile from "../pages/candidate/Profile";
import CandidateJobs from "../pages/candidate/Jobs";
import CandidateApplications from "../pages/candidate/Applications";
import CandidateBookmarks from "../pages/candidate/Bookmarks";
import CandidateResume from "../pages/candidate/Resume";
import CandidateNotifications from "../pages/candidate/Notifications";

// Recruiter Pages
import RecruiterDashboard from "../pages/recruiter/Dashboard";
import RecruiterCompany from "../pages/recruiter/Companies";
import RecruiterJobs from "../pages/recruiter/Jobs";
import ManageJobForm from "../pages/recruiter/ManageJobForm";
import RecruiterApplicants from "../pages/recruiter/Applicants";
import RecruiterInterviews from "../pages/recruiter/Interviews";
import RecruiterNotifications from "../pages/recruiter/Notifications";
import RecruiterProfile from "../pages/recruiter/Profile";

// Admin Pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminRecruiters from "../pages/admin/Recruiters";
import AdminCandidates from "../pages/admin/Candidates";
import AdminCompanies from "../pages/admin/Companies";
import AdminJobs from "../pages/admin/Jobs";
import AdminApplications from "../pages/admin/Applications";
import AdminReports from "../pages/admin/Reports";
import AdminSettings from "../pages/admin/Settings";

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
          
          {/* Candidate Role block */}
          <Route element={<RoleRoute allowedRoles={["candidate"]} />}>
            <Route element={<CandidateLayout />}>
              <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
              <Route path="/candidate/profile" element={<CandidateProfile />} />
              <Route path="/candidate/resume" element={<CandidateResume />} />
              <Route path="/candidate/applied-jobs" element={<CandidateApplications />} />
              <Route path="/candidate/saved-jobs" element={<CandidateBookmarks />} />
              <Route path="/candidate/notifications" element={<CandidateNotifications />} />
              <Route path="/jobs" element={<CandidateJobs />} />
            </Route>
          </Route>

          {/* Recruiter Role block */}
          <Route element={<RoleRoute allowedRoles={["recruiter"]} />}>
            <Route element={<RecruiterLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
              <Route path="/recruiter/company" element={<RecruiterCompany />} />
              <Route path="/recruiter/profile" element={<RecruiterProfile />} />
              <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
              <Route path="/recruiter/jobs/new" element={<ManageJobForm />} />
              <Route path="/recruiter/post-job" element={<ManageJobForm />} />
              <Route path="/recruiter/jobs/edit/:id" element={<ManageJobForm />} />
              <Route path="/recruiter/applicants" element={<RecruiterApplicants />} />
              <Route path="/recruiter/applicants/:jobId" element={<RecruiterApplicants />} />
              <Route path="/recruiter/interviews" element={<RecruiterInterviews />} />
              <Route path="/recruiter/notifications" element={<RecruiterNotifications />} />
            </Route>
          </Route>

          {/* Admin Role block */}
          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/recruiters" element={<AdminRecruiters />} />
              <Route path="/admin/candidates" element={<AdminCandidates />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/jobs" element={<AdminJobs />} />
              <Route path="/admin/applications" element={<AdminApplications />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;