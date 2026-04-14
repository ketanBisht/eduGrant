import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ScholarshipList from "./pages/ScholarshipList";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileBuilder from "./pages/ProfileBuilder";
import Vault from "./pages/Vault";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />

        {/* Clerk Auth */}
        <Route path="/register/*" element={<Register />} />
        <Route path="/login/*" element={<Login />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scholarships" element={<ScholarshipList />} />
          <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
