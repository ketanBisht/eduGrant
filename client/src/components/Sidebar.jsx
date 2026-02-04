import { Bell } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import "../styles/Layout.css";

export default function Navbar() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <header className="navbar">
      <div className="navbar-start">
        {/* Breadcrumb or Page Title */}
        <h1>Overview</h1>
      </div>

      <div className="navbar-end">
        {/* Notifications */}
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        {/* User Profile */}
        <div className="user-profile">
          <div className="avatar">{user?.firstName?.charAt(0) || "U"}</div>

          <div className="user-info hidden sm:flex">
            <span className="user-name">{user?.fullName || "User"}</span>
            <span className="user-role">{user?.publicMetadata?.role || "Student"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
