import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Clock, CheckCircle, AlertCircle, Share2, Bookmark } from 'lucide-react';
import '../styles/Scholarships.css';
import '../styles/ScholarshipDetail.css';

export default function  ScholarshipDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data (simulating fetch logic)
    const scholarship = {
        id: id,
        title: 'Global Future Leaders Scholarship',
        provider: 'World Education Foundation',
        amount: '₹10,000',
        deadline: 'Feb 7, 2026',
        description: 'The Global Future Leaders Scholarship is designed to support outstanding students who demonstrate exceptional leadership potential and academic excellence. This prestigious award aims to foster the next generation of global changemakers.',
        eligibility: [
            'Must be enrolled in an accredited university',
            'Minimum GPA of 8.5/10',
            'Demonstrated leadership experience',
            'Strong letter of recommendation',
        ],
        benefits: [
            'Full tuition coverage up to ₹10,000',
            'Mentorship from industry leaders',
            'Networking opportunities at annual summit',
            'Internship placement assistance'
        ],
        documents: [
            'Academic Transcripts',
            'CV / Resume',
            'Personal Statement (500 words)',
            'Two Letters of Recommendation'
        ]
    };

    const handleApply = () => {
        // In a real app, this would open a modal or navigate to an application form
        alert('Application started! This feature is mocked.');
        navigate('/applications');
    };

    return (
        <div className="scholarship-detail-page">
            {/* Header */}
            <div className="detail-page-header">
                <Link to="/scholarships" className="back-link">
                    <ArrowLeft size={16} /> Back to Scholarships
                </Link>
                <h1 className="detail-title">{scholarship.title}</h1>
                <div className="detail-provider">
                    <Building2 size={18} />
                    {scholarship.provider}
                </div>
            </div>

            <div className="detail-grid">
                {/* Main Info */}
                <div className="detail-main">

                    <div className="detail-section">
                        <h3 className="section-title">About the Scholarship</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {scholarship.description}
                        </p>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Eligibility Criteria</h3>
                        <ul className="requirements-list">
                            {scholarship.eligibility.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Benefits</h3>
                        <div>
                            {scholarship.benefits.map((item, i) => (
                                <span key={i} className="benefit-tag">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Required Documents</h3>
                        <ul className="requirements-list">
                            {scholarship.documents.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="detail-sidebar">
                    <div className="sidebar-card">
                        <div className="deadline-box">
                            <Clock size={20} />
                            <div>
                                <div className="text-xs opacity-75">Deadline</div>
                                <div>{scholarship.deadline}</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-slate-500 mb-1">Scholarship Value</div>
                            <div className="text-3xl font-bold text-emerald-600">{scholarship.amount}</div>
                        </div>

                        <div className="action-buttons">
                            <button
                                onClick={handleApply}
                                className="btn btn-primary btn-large"
                            >
                                Apply Now
                            </button>

                            <button className="btn btn-large border border-slate-300 hover:bg-slate-50 text-slate-600">
                                <Bookmark size={18} className="mr-2" />
                                Save for Later
                            </button>

                            <button className="btn btn-large border border-slate-300 hover:bg-slate-50 text-slate-600">
                                <Share2 size={18} className="mr-2" />
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
