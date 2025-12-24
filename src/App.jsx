import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ScholarshipList from './pages/ScholarshipList';
import ScholarshipDetail from './pages/ScholarshipDetail';
import Applications from './pages/Applications';
import AdminPanel from './pages/AdminPanel';

import DashboardLayout from './components/DashboardLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scholarships" element={<ScholarshipList />} />
            <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
