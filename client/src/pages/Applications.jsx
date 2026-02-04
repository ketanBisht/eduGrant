import { CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Applications.css';

export default function Applications() {
    const applications = [
        {
            id: 1,
            scholarship: 'Global Excellence Scholarship',
            provider: 'World Education Foundation',
            date: 'Feb 7, 2026',
            status: 'Pending',
            amount: '₹10,000'
        },
        {
            id: 2,
            scholarship: 'STEM Future Leaders',
            provider: 'Tech Innovations Corp',
            date: 'Feb 10, 2026',
            status: 'Approved',
            amount: '₹5,000'
        },
        {
            id: 3,
            scholarship: 'Local Arts Grant',
            provider: 'City Council',
            date: 'Feb 12, 2026',
            status: 'Rejected',
            amount: '₹1,000'
        }
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'approved';
            case 'Rejected': return 'rejected';
            default: return 'pending';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={14} />;
            case 'Rejected': return <XCircle size={14} />;
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
                {applications.map(app => (
                    <div key={app.id} className="app-card">
                        <div className="app-details">
                            <div className="app-title-row">
                                <h3 className="app-title">{app.scholarship}</h3>
                                <span className={`status-badge ${getStatusClass(app.status)}`}>
                                    {getStatusIcon(app.status)}
                                    {app.status}
                                </span>
                            </div>
                            <p className="app-meta">{app.provider} • Applied on {app.date}</p>
                        </div>

                        <div className="app-amount-box">
                            <div className="app-amount">{app.amount}</div>
                            <div className="app-label">Amount</div>
                        </div>

                        <Link to={`/scholarships/${app.id}`} className="app-link">
                            <ChevronRight size={20} />
                        </Link>
                    </div>
                ))}
            </div>

            {applications.length === 0 && (
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
