import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { CheckCircle, Clock, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Applications.css';

export default function Applications() {
    const { getToken } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = await getToken();
                const res = await axios.get('http://localhost:3000/api/applications/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(res.data.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load applications.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchApplications();
    }, [getToken]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'approved': return 'approved';
            case 'rejected': return 'rejected';
            default: return 'pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <CheckCircle size={14} />;
            case 'rejected': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    return (
        <div className="app-container">
            <div className="app-header">
                <h2>My Applications</h2>
                <p>Track the status of your scholarship applications.</p>
            </div>

            <div className="app-list">
                {loading ? (
                    <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : error ? (
                    <div className="text-center p-12 text-red-500">{error}</div>
                ) : applications.map(app => (
                    <div key={app._id} className="app-card">
                        <div className="app-details">
                            <div className="app-title-row">
                                <h3 className="app-title">{app.scholarship?.title || 'Unknown Scholarship'}</h3>
                                <span className={`status-badge ${getStatusClass(app.application_status)}`} style={{ textTransform: 'capitalize' }}>
                                    {getStatusIcon(app.application_status)}
                                    {app.application_status}
                                </span>
                            </div>
                            <p className="app-meta">{app.scholarship?.provider} • Applied on {new Date(app.applied_date).toLocaleDateString()}</p>
                        </div>

                        <div className="app-amount-box">
                            <div className="app-amount">₹{app.scholarship?.amount?.toLocaleString() || 0}</div>
                            <div className="app-label">Amount</div>
                        </div>

                        <Link to={`/scholarships/${app.scholarship?._id}`} className="app-link">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                ))}
            </div>

            {!loading && !error && applications.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>You haven't applied to any scholarships yet.</p>
                    <Link to="/scholarships" style={{ color: 'var(--primary)', fontWeight: 500, marginTop: '0.5rem', display: 'inline-block' }}>
                        Browse Scholarships
                    </Link>
                </div>
            )}
        </div>
    );
}
