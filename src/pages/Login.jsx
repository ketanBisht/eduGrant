import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Shield, ArrowRight, Loader2 } from 'lucide-react';
import '../styles/Auth.css';

export default function Login() {
    const { login, loading } = useAuth();
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(role);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Sign in to EduGrant portal</p>
                </div>

                <div className="auth-body">
                    <div className="role-toggle">
                        <button
                            type="button"
                            onClick={() => setRole('student')}
                            className={`role-btn ${role === 'student' ? 'active' : ''}`}
                        >
                            <User size={18} />
                            Student
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                        >
                            <Shield size={18} />
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
