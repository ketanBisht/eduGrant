import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ScholarshipList from "./pages/ScholarshipList";
import ScholarshipDetail from "./pages/ScholarshipDetail";
import Applications from "./pages/Applications";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* Clerk Auth */}
      {/* Register Route */}
      <Route
        path="/register/*"
        element={<SignUp path="/register" routing="path" signInUrl="/login" fallbackRedirectUrl="/" />}
      />
      {/* Login Route */}
      <Route
        path="/login/*"
        element={<SignIn path="/login" routing="path" signUpUrl="/register" fallbackRedirectUrl="/" />}
      />
      {/* <Route path="/login/*" element={<SignIn routing="path" fallbackRedirectUrl="/dashboard" />} /> */}
      {/* <Route path="/register/*" element={<SignUp routing="path" fallbackRedirectUrl="/dashboard" />} /> */}

      {/* Protected */}
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
        <Route path="/applications" element={<Applications />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}

export default App;

// import { Routes, Route } from "react-router-dom";

// import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
// import ProtectedRoute from "./components/ProtectedRoute";
// import { SignIn, SignUp } from "@clerk/clerk-react";

// // Pages
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Dashboard from "./pages/Dashboard";
// import ScholarshipList from "./pages/ScholarshipList";
// import ScholarshipDetail from "./pages/ScholarshipDetail";
// import Applications from "./pages/Applications";
// import AdminPanel from "./pages/AdminPanel";

// import DashboardLayout from "./components/DashboardLayout";

// function App() {
//   return (
//     <>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Landing />} />
//         {/* <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} /> */}

//         {/* Clerk Auth Routes */}
//         <Route path="/login/*" element={<SignIn routing="path" fallbackRedirectUrl="/dashboard" />} />
//         <Route path="/register/*" element={<SignUp routing="path" fallbackRedirectUrl="/dashboard" />} />

//         {/* Protected */}
//         <Route
//           element={
//             <ProtectedRoute>
//               <DashboardLayout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/scholarships" element={<ScholarshipList />} />
//           <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
//           <Route path="/applications" element={<Applications />} />
//           <Route path="/admin" element={<AdminPanel />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;
