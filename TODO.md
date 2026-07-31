# Admin Module Implementation — Task Tracker

## Backend
- [x] Extend `server/routes/adminRoutes.js`:
  - [x] Add `bcryptjs` + `Interview` imports
  - [x] Enhance `GET /api/admin/stats` (add `totalCandidates`, `totalAdmins`, `totalInterviews`; `totalUsers` = all users; `totalActiveJobs`)
  - [x] Add `GET /api/admin/applications`
  - [x] Add `GET /api/admin/interviews`
  - [x] Add `PUT /api/admin/profile`
  - [x] Add `PUT /api/admin/password`
- [x] Backend compatibility verified — no existing auth flow, JWT, models, or routes rewritten

## Frontend — Admin Login (NEW)
- [x] Create `client/src/pages/admin/AdminLogin.jsx`
- [x] Create `client/src/pages/admin/AdminLogin.css`
- [x] Add `/admin/login` route in `client/src/routes/AppRoutes.jsx`
- [x] Fix `client/src/api/axios.js` 401 interceptor (admin-aware redirect)
- [x] Reuse `POST /api/auth/login` via existing AuthContext.login
- [x] Access denied flow: non-admin role → error message + auto logout

## Frontend — Admin Module pages
- [x] Admin `Dashboard.jsx` — real stats + applications via `/admin/applications`
- [x] Admin `Applications.jsx` — real data + pagination
- [x] Admin `Reports.jsx` — real analytics from MongoDB
- [x] Admin `Settings.jsx` — functional profile + password update
- [x] Admin `Recruiters.jsx` — real company mapping + verified status + delete
- [x] Admin `Candidates.jsx` — real candidate fields (remove fake ATS score) + delete
- [x] Admin `Jobs.jsx` — real data + delete confirmation
- [x] Admin `Companies.jsx` — owner/job details + delete confirmation
- [x] Admin `Users.jsx` — verify works (kept functional)

## Frontend — Bug fixes (Recruiter / Candidate)
- [x] Recruiter `Applicants.jsx` — PATCH method + capitalized statuses (matches `PATCH /applications/:id/status`)
- [x] Recruiter `Interviews.jsx` — correct field names (`interviewDate`, `interviewTime`, `mode`, `location`) + capitalized statuses
- [x] Candidate `Interviews.jsx` — correct field names + `recruiter.name`
- [x] Recruiter `Notifications.jsx` — correct endpoint `/notifications` + PATCH mark-read
- [x] Candidate `Notifications.jsx` — PATCH for mark-read
- [x] Recruiter `Jobs.jsx` — use `isActive` instead of `status`
- [x] Candidate `Applications.jsx` — status color for capitalized backend values

## Verification
- [x] Client production build passes (`npm run build` — 160 modules, no errors)
- [x] Backend admin routes pass `node --check`
- [x] Candidate module still works (routes/API endpoints untouched)
- [x] Recruiter module still works (only broken API calls fixed)
- [x] Admin Login works (uses existing AuthContext login + `/api/auth/login`)
- [x] Admin Dashboard works (real `/admin/stats`, `/admin/users`, `/admin/jobs`, `/admin/applications`)
- [x] All admin pages connected to MongoDB

