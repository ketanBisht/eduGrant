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
        <div className="hero" style={{ maxWidth: "1200px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1>Welcome to EduGrant</h1>
            <p>
              Your central hub for finding scholarships and tracking your educational journey.
            </p>
          </div>
          <div className="cta-group" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "3rem" }}>
            <Link to="/scholarships" className="feature-card" style={{ textDecoration: "none", flex: "1", minWidth: "250px", maxWidth: "320px" }}>
              <div className="feature-icon" style={{ color: "var(--primary)", backgroundColor: "rgba(16, 185, 129, 0.1)" }}>
                <Search size={32} />
              </div>
              <h3 style={{ color: "var(--text-main)", fontSize: "1.25rem" }}>Scholarships</h3>
              <p style={{ color: "var(--text-muted)" }}>Browse and apply for newly available public and private grants.</p>
            </Link>

            <Link to="/dashboard" className="feature-card" style={{ textDecoration: "none", flex: "1", minWidth: "250px", maxWidth: "320px" }}>
              <div className="feature-icon" style={{ color: "var(--secondary)", backgroundColor: "rgba(99, 102, 241, 0.1)" }}>
                <GraduationCap size={32} />
              </div>
              <h3 style={{ color: "var(--text-main)", fontSize: "1.25rem" }}>My Dashboard</h3>
              <p style={{ color: "var(--text-muted)" }}>View your applications and track your success rates.</p>
            </Link>

            <Link to="/applications" className="feature-card" style={{ textDecoration: "none", flex: "1", minWidth: "250px", maxWidth: "320px" }}>
              <div className="feature-icon" style={{ color: "var(--warning)", backgroundColor: "rgba(245, 158, 11, 0.1)" }}>
                <FileCheck size={32} />
              </div>
              <h3 style={{ color: "var(--text-main)", fontSize: "1.25rem" }}>My Applications</h3>
              <p style={{ color: "var(--text-muted)" }}>Review and manage all your active scholarship applications.</p>
            </Link>
          </div>
        </div>
      </SignedIn>

      <div className="features-section">
        {/* Why Choose Section (Existing) */}
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

        {/* New Problem vs Solution Section */}
        <div className="challenge-section">
            <div className="challenge-grid">
                <div className="challenge-text">
                    <h2 className="text-3xl font-bold mb-6">Bridging the Opportunity Gap</h2>
                    <p className="mb-4">
                        Did you know that over <strong>65% of eligible students</strong> miss out on funding simply because they couldn't find it in time? The scholarship journey is currently broken:
                    </p>
                    <ul className="problem-list">
                        <li><strong>❌ Fragmented Data:</strong> Opportunities are scattered across 500+ private and government portals.</li>
                        <li><strong>❌ Complex Eligibility:</strong> Complex criteria make it hard to know if you're actually eligible.</li>
                        <li><strong>❌ Missed Deadlines:</strong> Manually tracking dates leads to missed chances for career-changing funds.</li>
                    </ul>
                </div>
                <div className="solution-card">
                    <h3 className="text-emerald-500 font-bold mb-4">How EduGrant Solves This:</h3>
                    <div className="solution-item">
                        <div className="solution-dot"></div>
                        <p><strong>Unified Data:</strong> We scrape the web's major portals to bring every legitimate scholarship to one screen.</p>
                    </div>
                    <div className="solution-item">
                        <div className="solution-dot"></div>
                        <p><strong>Smart Matching:</strong> Our engine maps your profile to eligibility criteria instantly.</p>
                    </div>
                    <div className="solution-item">
                        <div className="solution-dot"></div>
                        <p><strong>Live Tracking:</strong> Store saved grants and track active applications from your personal dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>


      {/* How it Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">Get Started in 3 Simple Steps</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Profile</h3>
            <p>Sign up and complete your academic profile to unlock matching grants.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Find Your Match</h3>
            <p>Our smart engine filters thousands of scholarships to find yours.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Submit & Track</h3>
            <p>Apply directly and track the progress of your applications in one dashboard.</p>
          </div>
        </div>
      </div>

      {/* New Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand" style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              <GraduationCap size={32} />
              EduGrant
            </div>
            <p>Empowering students to achieve their dreams through verified scholarship opportunities.</p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/scholarships">Find Scholarships</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Login Portal</Link>
          </div>

          <div className="footer-contact">
            <h4>Support & Contact</h4>
            <p>Email: edugrantsupport@gmail.com</p>
            <p>Direct: +91 97297 XXXXX</p>
            <p>Hours: Mon - Fri, 9 AM - 6 PM</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EduGrant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
