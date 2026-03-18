import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Search, FileCheck, Shield, Sun, Moon } from "lucide-react";
import "../styles/Landing.css";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Landing() {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark") || 
           localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="landing-page">
      {/* Navbar Stub for Landing */}
      <nav className="navbar" style={{ position: "relative" }}>
        <div className="navbar-start">
          <div className="brand" style={{ fontSize: "1.5rem" }}>
            <GraduationCap size={32} />
            EduGrant
          </div>
        </div>
        <div className="navbar-end" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <SignedOut>
            <Link to="/scholarships" className="font-medium hover:text-primary transition-colors">Scholarships</Link>
          </SignedOut>
          <button 
            onClick={toggleTheme} 
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", borderRadius: "50%", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-main)" }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/* <Link to="/login" className="btn text-slate-600 hover:text-primary font-medium">
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link> */}
          <SignedOut>
            <Link to="/login" className="btn btn-secondary font-medium">
              Log In
            </Link>

            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      <SignedOut>
        <div className="hero">
          <h1>Unlock Your Future with Education Grants</h1>
          <p>
            Discover thousands of scholarship opportunities tailored to your profile. Streamline your
            application process and track your success in one place.
          </p>
          <div className="cta-group">
            <Link to="/register" className="btn btn-primary btn-hero">
              Get Started
            </Link>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="hero">
          <h1>Welcome to EduGrant</h1>
          <p>
            Your central hub for finding scholarships and tracking your educational journey.
          </p>
          <div className="cta-group" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "3rem" }}>
            <Link to="/scholarships" className="feature-card" style={{ textDecoration: "none", flex: "1", minWidth: "280px", maxWidth: "350px" }}>
              <div className="feature-icon" style={{ color: "var(--primary)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                <Search size={32} />
              </div>
              <h3 style={{ color: "var(--text-main)" }}>Scholarships</h3>
              <p style={{ color: "var(--text-muted)" }}>Browse and apply for newly available public and private grants.</p>
            </Link>
            
            <Link to="/dashboard" className="feature-card" style={{ textDecoration: "none", flex: "1", minWidth: "280px", maxWidth: "350px" }}>
              <div className="feature-icon" style={{ color: "var(--secondary)", backgroundColor: "rgba(99, 102, 241, 0.1)" }}>
                <GraduationCap size={32} />
              </div>
              <h3 style={{ color: "var(--text-main)" }}>My Dashboard</h3>
              <p style={{ color: "var(--text-muted)" }}>View your applications and track your success rates.</p>
            </Link>
          </div>
        </div>
      </SignedIn>

      <div className="features-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EduGrant?</h2>
          <p className="text-lg text-slate-500">Everything you need to fund your education journey.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <Search size={32} />
            </div>
            <h3>Smart Search</h3>
            <p>
              Filter scholarships by eligibility, amount, and deadline to find the perfect match for your
              needs.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{ color: "#6366f1", backgroundColor: "rgba(99, 102, 241, 0.1)" }}
            >
              <FileCheck size={32} />
            </div>
            <h3>Easy Applications</h3>
            <p>
              Apply to multiple grants with a unified profile and track your application status in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{ color: "#f59e0b", backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            >
              <Shield size={32} />
            </div>
            <h3>Verified Listings</h3>
            <p>
              Access legitimate opportunities verified by our admin team, ensuring you apply with confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
