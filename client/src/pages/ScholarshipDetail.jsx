import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { ArrowLeft, Building2, Clock, CheckCircle, AlertCircle, Share2, Bookmark, Loader2 } from 'lucide-react';
import '../styles/Scholarships.css';
import '../styles/ScholarshipDetail.css';

export default function ScholarshipDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken, isSignedIn } = useAuth();

    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [hasApplied, setHasApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Scholarship
                const res = await axios.get(`http://localhost:3000/api/scholarships/${id}`);
                setScholarship(res.data.data);

                // Check if already applied
                if (isSignedIn) {
                    const token = await getToken();
                    const appRes = await axios.get('http://localhost:3000/api/applications/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const applied = appRes.data.data.some(app => app.scholarship._id === id);
                    if (applied) setHasApplied(true);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load scholarship details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isSignedIn, getToken]);

    const handleApply = async () => {
        if (!isSignedIn) {
            navigate('/login');
            return;
        }

        setApplying(true);
        try {
            const token = await getToken();
            await axios.post('http://localhost:3000/api/applications', { scholarshipId: id }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHasApplied(true);
            alert('Application submitted successfully!');
        } catch (err) {
            if (err.response?.status === 400) {
                setHasApplied(true);
                alert('You have already applied!');
            } else {
                alert('Failed to submit application. Please try again later.');
            }
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    }

    if (error || !scholarship) {
        return <div className="text-center py-12 text-red-500">{error || 'Scholarship not found'}</div>;
    }

    // Fallbacks for UI fields that aren't in the schema yet
    const benefitsMock = ['Full tuition coverage', 'Mentorship from industry leaders', 'Internship placement assistance'];
    const documentsMock = ['Academic Transcripts', 'CV / Resume', 'Personal Statement'];

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
                        <p className="text-slate-600 leading-relaxed">
                            {scholarship.eligibility_criteria}
                        </p>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Benefits</h3>
                        <div>
                            {benefitsMock.map((item, i) => (
                                <span key={i} className="benefit-tag">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Required Documents</h3>
                        <ul className="requirements-list">
                            {documentsMock.map((item, i) => (
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
                                <div>{new Date(scholarship.deadline).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="text-sm text-slate-500 mb-1">Scholarship Value</div>
                            <div className="text-3xl font-bold text-emerald-600">₹{scholarship.amount?.toLocaleString()}</div>
                        </div>

                        <div className="action-buttons">
                            <button
                                onClick={handleApply}
                                disabled={hasApplied || applying}
                                className={`btn btn-large ${hasApplied ? 'bg-slate-200 text-slate-600 cursor-not-allowed border-none' : 'btn-primary'}`}
                                style={{ width: '100%', justifyContent: 'center' }}
                            >
                                {applying ? <Loader2 className="animate-spin mx-auto" size={20} /> : hasApplied ? 'Applied' : 'Apply Now'}
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
