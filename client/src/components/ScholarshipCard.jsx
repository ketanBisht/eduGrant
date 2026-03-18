import { Link } from 'react-router-dom';
import { Clock, Bookmark, Building2, ChevronRight, ExternalLink } from 'lucide-react';
import '../styles/Scholarships.css';

export default function ScholarshipCard({ scholarship }) {
    // Check if it's the old schema or new scraped schema
    const title = scholarship.title || 'Untitled';
    const provider = scholarship.provider || scholarship.source || 'Unknown Provider';
    const amountOrDesc = scholarship.amount || scholarship.description || '';
    const deadline = scholarship.deadline || 'Varies';
    const categories = scholarship.categories || (scholarship.eligibility ? [scholarship.eligibility] : []);
    const isNew = scholarship.isNew || false;
    
    // For Buddy4Study links, they might be relative. Make them absolute.
    const externalLink = scholarship.link ? (scholarship.link.startsWith('http') ? scholarship.link : `https://www.buddy4study.com${scholarship.link.startsWith('/') ? '' : '/'}${scholarship.link}`) : null;

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
                    {categories.slice(0, 2).map((cat, index) => (
                        <span key={index} className="tag" title={cat}>
                            {cat.length > 50 ? cat.substring(0, 50) + '...' : cat}
                        </span>
                    ))}
                </div>

                <div className="card-details">
                    <span className="amount">
                        {amountOrDesc.length > 60 ? amountOrDesc.substring(0, 60) + '...' : amountOrDesc}
                    </span>
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
                {externalLink ? (
                    <a href={externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary apply-btn">
                        Apply Now <ExternalLink size={16} />
                    </a>
                ) : (
                    <Link to={`/scholarships/${scholarship._id}`} className="btn btn-primary apply-btn">
                        View Details <ChevronRight size={16} />
                    </Link>
                )}
            </div>
        </div>
    );
}
