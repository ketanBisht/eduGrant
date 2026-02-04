import { Link } from 'react-router-dom';
import { Clock, Bookmark, Building2, ChevronRight } from 'lucide-react';
import '../styles/Scholarships.css';

export default function ScholarshipCard({ scholarship }) {
    const { id, title, provider, amount, deadline, categories, isNew } = scholarship;

    return (
        <div className="scholarship-card">
            {isNew && <span className="card-badge">New</span>}

            <div className="card-content">
                <div className="provider-name">
                    <Building2 size={14} />
                    {provider}
                </div>
                <h3 className="card-title">{title}</h3>

                <div className="card-tags">
                    {categories.map((cat, index) => (
                        <span key={index} className="tag">{cat}</span>
                    ))}
                </div>

                <div className="card-details">
                    <span className="amount">{amount}</span>
                    <span className="deadline">
                        <Clock size={14} />
                        {deadline}
                    </span>
                </div>
            </div>

            <div className="card-footer">
                <button className="save-btn" title="Save Scholarship">
                    <Bookmark size={18} />
                </button>
                <Link to={`/scholarships/${id}`} className="btn btn-primary apply-btn">
                    View Details <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
}
