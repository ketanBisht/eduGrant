import { Bell } from "lucide-react";
import "../styles/Layout.css";
import { useUser } from "@clerk/clerk-react";

export default function Navbar() {
  // const { user } = useAuth();
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <header className="navbar">
      <div className="navbar-start">
        {/* Breadcrumb or Page Title can go here */}
        <h1>Overview</h1>
      </div>

      <div className="navbar-end">
        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
          <Bell size={20} />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>

        <div className="user-profile">
          <div className="avatar">{user?.name?.charAt(0) || "U"}</div>
          <div className="user-info hidden sm:flex">
            {/* <span className="user-name">{user?.name || "Guest"}</span>
            <span className="user-role">{user?.role || "Visitor"}</span> */}
            <span className="user-name">{user?.fullName || "User"}</span>
            <span className="user-role">{user?.publicMetadata?.role || "Student"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
