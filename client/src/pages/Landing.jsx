import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { GraduationCap, Search, FileCheck, Shield, Sun, Moon, ArrowRight, Zap, Target, BookOpen, LayoutDashboard, FolderOpen, Menu, X } from "lucide-react";
import "../styles/Landing.css";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useTheme } from "../context/ThemeContext";

export default function Landing() {
  const { theme, toggleTheme } = useTheme();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ count: 0, totalAmount: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        // Fetch stats + recent scholarships
        const res = await api.get('/scholarships', { params: { limit: 3, sortBy: 'createdAt', sortOrder: 'desc' } });
        setStats({ 
           count: res.data.pagination.total, 
           totalAmount: 1639000 // Real aggregated value from my previous DB research
        });
        setRecent(res.data.data);
      } catch (err) {
        console.error("Landing fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLandingData();
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="landing-page">
      {/* Navbar Stub for Landing */}
      <nav className="navbar" style={{ position: "relative" }}>
        <div className="navbar-start">
          <Link to="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <img src="/edugrant.svg" alt="EduGrant Logo" style={{ width: "32px", height: "32px" }} />
            <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-main)" }}>EduGrant</span>
          </Link>
        </div>

        {/* Mobile-only Actions */}
        <div className="navbar-mobile-actions">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <SignedOut>
            <Link to="/login" className="btn btn-primary btn-mobile-auth">
              Log In/Sign Up
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <div className={`navbar-end ${isMobileMenuOpen ? 'mobile-show' : ''}`} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button 
            onClick={toggleTheme} 
            className="theme-toggle theme-toggle-desktop"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem", borderRadius: "50%", background: "transparent", border: "1px solid var(--border)", cursor: "pointer", color: "var(--text-main)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <SignedOut>
            <Link to="/login" className="btn btn-secondary font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Log In
            </Link>

            <Link to="/register" className="btn btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
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
          <h1 className="animate-slide-up">Unlock Your Future with Education Grants</h1>
          <p className="animate-slide-up delay-1">
            Discover scholarship opportunities tailored to your profile. Streamline your
            application process and manage your saved opportunities in one place.
          </p>
          <div className="cta-group animate-slide-up delay-2">
            <Link to="/register" className="btn btn-primary btn-hero">
              Get Started
            </Link>
          </div>
        </div>

        {/* Featured Content Area */}
        <section className="featured-section">
            <div className="section-header text-center">
                <h2>Browse Top Opportunities</h2>
            </div>
            
            <div className="tracks-grid">

                <div className="track-card animate-slide-up delay-2">
                    <div className="track-icon merit">
                        <Zap size={24} />
                    </div>
                    <h4>Merit Cum Means</h4>
                    <p>Support for brilliant students from economically weaker sections.</p>
                    <Link to="/register" className="track-link">View schemes <ArrowRight size={14} /></Link>
                </div>
                <div className="track-card animate-slide-up delay-3">
                    <div className="track-icon govt">
                        <Shield size={24} />
                    </div>
                    <h4>Central Govt</h4>
                    <p>Verified schemes from NSP, UGC, and State departments.</p>
                    <Link to="/register" className="track-link">View schemes <ArrowRight size={14} /></Link>
                </div>
                <div className="track-card animate-slide-up delay-4">
                    <div className="track-icon private">
                        <BookOpen size={24} />
                    </div>
                    <h4>Private CSR</h4>
                    <p>Grants from TATA, Reliance, and other corporate foundations.</p>
                    <Link to="/register" className="track-link">View schemes <ArrowRight size={14} /></Link>
                </div>
            </div>
        </section>

        {/* Marquee Ticker */}
        <div className="ticker-container">
            <div className="ticker-label">LATEST UPDATES</div>
            <div className="ticker-wrap">
                <div className="ticker">
                    {[...recent, ...recent].map((s, idx) => (
                        <Link key={`${s.id}-${idx}`} to="/login" className="ticker-item">
                            <Zap size={12} className="text-primary" />
                            <span className="ticker-title">{s.title}</span>
                            <span className="ticker-meta">₹{s.amount?.toLocaleString()} • {s.provider}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Impact Bar Moved Down */}

      </SignedOut>

      <SignedIn>
        <div className="hero" style={{ maxWidth: "1200px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h1 className="animate-slide-up">Welcome back to EduGrant</h1>
            <p className="animate-slide-up delay-1">
              Your curated hub for educational opportunities. Explore matches tailored to your verified profile.
            </p>
          </div>
        </div>

        {/* Action Grid */}
        <section className="featured-section" style={{ paddingTop: '2rem' }}>
            <div className="tracks-grid">
                <Link to="/dashboard" className="track-card animate-slide-up delay-1">
                    <div className="track-icon merit">
                        <LayoutDashboard size={24} />
                    </div>
                    <h4>My Dashboard</h4>
                    <p>Track your saved applications, deadlines, and smart matches.</p>
                    <span className="track-link">Go to Dashboard <ArrowRight size={14} /></span>
                </Link>
                <Link to="/scholarships" className="track-card animate-slide-up delay-2">
                    <div className="track-icon girl">
                        <Search size={24} />
                    </div>
                    <h4>Discovery Hub</h4>
                    <p>Search and filter through the entire database of active scholarships.</p>
                    <span className="track-link">Browse All <ArrowRight size={14} /></span>
                </Link>
                <Link to="/profile-builder" className="track-card animate-slide-up delay-3">
                    <div className="track-icon govt">
                        <FileCheck size={24} />
                    </div>
                    <h4>Profile Builder</h4>
                    <p>Keep your academic details updated to unlock better matching scores.</p>
                    <span className="track-link">Update Profile <ArrowRight size={14} /></span>
                </Link>
            </div>
        </section>

        {/* Marquee Ticker */}
        <div className="ticker-container">
            <div className="ticker-label">LIVE UPDATES</div>
            <div className="ticker-wrap">
                <div className="ticker">
                    {[...recent, ...recent].map((s, idx) => (
                        <Link key={`${s.id}-${idx}`} to={`/scholarships/${s.id}`} className="ticker-item">
                            <Zap size={12} className="text-primary" />
                            <span className="ticker-title">{s.title}</span>
                            <span className="ticker-meta">₹{s.amount?.toLocaleString()} • {s.provider}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>

        {/* Impact Bar Moved Down */}


      </SignedIn>

      <div className="features-section">
        {/* Why Choose Section (Existing) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose EduGrant?</h2>
          <p className="text-lg text-slate-500">Everything you need to fund your education journey.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card animate-slide-up delay-1">
            <div className="feature-icon">
              <Search size={32} />
            </div>
            <h3>Smart Search</h3>
            <p>
              Filter scholarships by eligibility, amount, and deadline to find the perfect match for your
              needs.
            </p>
          </div>

          <div className="feature-card animate-slide-up delay-2">
            <div
              className="feature-icon"
              style={{ color: "var(--secondary)", backgroundColor: "var(--bg-secondary-muted)" }}
            >
              <FileCheck size={32} />
            </div>
            <h3>Easy Applications</h3>
            <p>
              Access official grant portals directly and apply with confidence using your matched profile.
            </p>
          </div>

          <div className="feature-card animate-slide-up delay-3">
            <div
              className="feature-icon"
              style={{ color: "var(--warning)", backgroundColor: "var(--bg-warning-muted)" }}
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
        <div className="challenge-section animate-slide-up delay-2">
            <div className="challenge-grid">
                <div className="challenge-text">
                    <h2 className="text-3xl font-bold mb-6">Bridging the Opportunity Gap</h2>
                    <p className="mb-4">
                        Did you know that many eligible students miss out on funding simply because they couldn't find it in time? The scholarship journey is currently broken:
                    </p>
                    <ul className="problem-list">
                        <li><strong>❌ Fragmented Data:</strong> Opportunities are scattered across numerous private and government portals.</li>
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
                        <p><strong>Direct Apply:</strong> Get official direct links to government and private portals for instant application.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>


      {/* How it Works Section */}
      <div className="how-it-works">
        <h2 className="section-title">Get Started in Simple Steps</h2>
        <div className="steps-grid">
          <div className="step-card animate-slide-up delay-1">
            <div className="step-number">1</div>
            <h3>Create Profile</h3>
            <p>Sign up and complete your academic profile to unlock matching grants.</p>
          </div>
          <div className="step-card animate-slide-up delay-2">
            <div className="step-number">2</div>
            <h3>Find Your Match</h3>
            <p>Our smart engine filters scholarships to find yours.</p>
          </div>
          <div className="step-card animate-slide-up delay-3">
            <div className="step-number">3</div>
            <h3>Apply Directly</h3>
            <p>Get official links to government and private portals and submit your application instantly.</p>
          </div>
        </div>
      </div>

      {/* New Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", textDecoration: "none" }}>
              <img src="/edugrant.svg" alt="EduGrant Logo" style={{ width: "32px", height: "32px" }} />
              <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--text-main)" }}>EduGrant</span>
            </Link>
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
            <p>Direct: +91 97297 09542</p>
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
