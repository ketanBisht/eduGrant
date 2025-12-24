import { Link } from 'react-router-dom';
import { GraduationCap, Search, FileCheck, Shield } from 'lucide-react';
import '../styles/Landing.css';

export default function Landing() {
    return (
        <div className="landing-page">
            {/* Navbar Stub for Landing */}
            <nav className="navbar" style={{ position: 'relative' }}>
                <div className="navbar-start">
                    <div className="brand" style={{ fontSize: '1.5rem' }}>
                        <GraduationCap size={32} />
                        EduGrant
                    </div>
                </div>
                <div className="navbar-end">
                    <Link to="/login" className="btn text-slate-600 hover:text-primary font-medium">Log In</Link>
                    <Link to="/register" className="btn btn-primary">Sign Up</Link>
                </div>
            </nav>

            <div className="hero">
                <h1>Unlock Your Future with Education Grants</h1>
                <p>
                    Discover thousands of scholarship opportunities tailored to your profile.
                    Streamline your application process and track your success in one place.
                </p>
                <div className="cta-group">
                    <Link to="/register" className="btn btn-primary btn-hero">
                        Get Started
                    </Link>
                    <Link to="/login" className="btn btn-hero border border-slate-300 hover:bg-white">
                        I'm an Admin
                    </Link>
                </div>
            </div>

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
                        <p>Filter scholarships by eligibility, amount, and deadline to find the perfect match for your needs.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ color: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                            <FileCheck size={32} />
                        </div>
                        <h3>Easy Applications</h3>
                        <p>Apply to multiple grants with a unified profile and track your application status in real-time.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                            <Shield size={32} />
                        </div>
                        <h3>Verified Listings</h3>
                        <p>Access legitimate opportunities verified by our admin team, ensuring you apply with confidence.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
