import { LayoutDashboard, GraduationCap, FileText, Settings, LogOut, ShieldCheck, FolderOpen, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import "../styles/Layout.css";

export default function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Scholarships", path: "/scholarships", icon: GraduationCap },
    { label: "Profile Builder", path: "/profile-builder", icon: FileText },
    { label: "Document Vault", path: "/vault", icon: FolderOpen },
  ];

  const role = user?.publicMetadata?.role || "student";

  // Role-based links
  if (role === "admin" || user?.emailAddresses?.some(e => e.emailAddress.includes('admin'))) {
    navItems.push({ label: "Admin Panel", path: "/admin", icon: ShieldCheck });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span>EduGrant</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button onClick={() => signOut()} className="nav-item w-full text-left">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

