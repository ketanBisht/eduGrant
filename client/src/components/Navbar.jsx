import { Moon, Sun, Menu } from "lucide-react";
import "../styles/Layout.css";
import { useUser, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onMenuClick }) {
  const { user, isLoaded } = useUser();
  const { theme, toggleTheme } = useTheme();

  if (!isLoaded) return null;

  return (
    <header className="navbar">
      <div className="navbar-start">
        <button className="mobile-toggle" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        {/* Breadcrumb or Page Title can go here */}
        <h1>Overview</h1>
      </div>

      <div className="navbar-end">
        <button 
          onClick={toggleTheme}
          className="p-2 transition-colors nav-icon-btn"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>



        <div className="user-profile">
          <UserButton 
            appearance={{
              baseTheme: theme === 'dark' ? dark : undefined,
            }}
          />
          <div className="user-info hidden sm:flex">
            <span className="user-name">{user?.fullName || "User"}</span>
            <span className="user-role">{user?.publicMetadata?.role || "Student"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
