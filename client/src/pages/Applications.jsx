import { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, Clock, XCircle, ChevronRight, Loader2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Applications.css';

export default function Applications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const res = await api.get('/applications/my-applications');
                setApplications(res.data.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchApplications();
    }, []);

    const getStatusClass = (status) => {
        if (!status) return 'pending';
        switch (status.toUpperCase()) {
            case 'ACCEPTED': return 'approved';
            case 'REJECTED': return 'rejected';
            default: return 'pending';
        }
    };

    const getStatusIcon = (status) => {
        if (!status) return <Clock size={14} />;
        switch (status.toUpperCase()) {
            case 'ACCEPTED': return <CheckCircle size={14} />;
            case 'REJECTED': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2>Application Tracker</h2>
                <p>Monitor your progress across authenticated government and CSR schemes.</p>
            </div>

            <div className="app-list">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : error ? (
                    <div className="text-center p-12 text-red-500">{error}</div>
                ) : applications.map(app => (
                    <div key={app.id} className="app-card">
                        <div className="app-details">
                            <div className="app-title-row">
                                <h3 className="app-title">{app.scholarship?.title || 'Unknown Scholarship'}</h3>
                                <span className={`status-badge ${getStatusClass(app.status)}`} style={{ textTransform: 'capitalize' }}>
                                    {getStatusIcon(app.status)}
                                    {app.status}
                                </span>
                            </div>
                            <p className="app-meta">
                                {app.scholarship?.provider} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-primary uppercase tracking-wider">
                                <ShieldCheck size={12} /> Verified via EduGrant Vault
                            </div>
                        </div>

                        <div className="app-amount-box">
                            <div className="app-amount">
                                ₹{app.scholarship?.amount?.toLocaleString() || 0}
                            </div>
                            <div className="app-label">Benefit</div>
                        </div>

                        <Link to={`/scholarships/${app.scholarshipId}`} className="app-link">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                ))}
            </div>

            {!loading && !error && applications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>You haven't applied to any scholarships yet.</p>
                    <Link to="/scholarships" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: '0.5rem', display: 'inline-block' }}>
                        Browse Hub
                    </Link>
                </div>
            )}
        </div>
    );
}
