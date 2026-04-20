import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Bookmark, Building2, ChevronRight, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import '../styles/Scholarships.css';

function getDeadlineUrgency(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) return { label: 'Expired', color: '#ef4444', pct: 100, urgent: true };
    if (daysLeft <= 7)  return { label: `${daysLeft}d left`, color: '#ef4444', pct: 90, urgent: true };
    if (daysLeft <= 21) return { label: `${daysLeft}d left`, color: '#f59e0b', pct: 60, urgent: false };
    if (daysLeft <= 60) return { label: `${daysLeft}d left`, color: '#10b981', pct: 30, urgent: false };
    return { label: `${daysLeft}d left`, color: '#10b981', pct: 10, urgent: false };
}

export default function ScholarshipCard({ scholarship, isInitiallySaved = false }) {
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [saving, setSaving] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const title    = scholarship.title    || 'Untitled Scheme';
    const provider = scholarship.provider || 'Verified Provider';
    const amount   = scholarship.amount   ? `₹${scholarship.amount.toLocaleString()}` : 'Variable';
    const deadline = scholarship.deadline
        ? new Date(scholarship.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Always Open';
    const source   = scholarship.source   || 'GOVERNMENT';
    const urgency  = getDeadlineUrgency(scholarship.deadline);
    const matchReasons = scholarship.matchReasons || [];

    const getTagClass = (reason) => {
        const r = reason.toLowerCase();
        if (r.includes('state')) return 'state';
        if (r.includes('match') && (r.includes('obc') || r.includes('sc') || r.includes('st') || r.includes('general') || r.includes('ews'))) return 'caste';
        if (r.includes('gender')) return 'gender';
        if (r.includes('merit')) return 'merit';
        if (r.includes('financial')) return 'financial';
        if (r.includes('closing')) return 'urgency';
        return 'default';
    };

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (saving) return;

        try {
            setSaving(true);
            if (isSaved) {
                await api.delete(`/saved/${scholarship.id}`);
                setIsSaved(false);
                toast.success('Scholarship Unsaved');
            } else {
                await api.post('/saved', { scholarshipId: scholarship.id });
                setIsSaved(true);
                toast.success('Scholarship Saved');
            }
        } catch (err) {
            console.error('Error toggling save:', err);
            toast.error(err.response?.data?.message || 'Failed to update bookmark');
        } finally {
            setSaving(false);
        }
    };

    const toggleExpand = () => setIsHovered(!isHovered);

    return (
        <motion.div
            className={`scholarship-card list-style ${isHovered ? 'expanded' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleExpand}
            transition={{ duration: 0.4 }}
            style={{ 
                height: isHovered ? 'auto' : '100px',
                padding: isHovered ? '2rem' : '1.5rem 2rem',
                cursor: 'pointer'
            }}
        >
            {/* Deadline urgency bar at top */}
            {urgency && (
                <div className="list-deadline-bar">
                    <motion.div
                        className="list-deadline-fill"
                        style={{ background: urgency.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${urgency.pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            )}

            <div className="card-content-main">
                {/* Left Section: Identity */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <h3 className="card-title" style={{ fontSize: '1.2rem', marginBottom: 0 }}>{title}</h3>
                        <span className={`source-tag ${source.toLowerCase()}`} style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                            {source.replace('_', ' ')}
                        </span>
                    </div>
                    <div className="provider-info" style={{ fontSize: '0.8rem' }}>
                        <Building2 size={12} className="text-primary"/>
                        <span>{provider}</span>
                    </div>

                    {scholarship.matchScore > 0 && (
                        <div className="match-tags-container" style={{ marginBottom: '8px' }}>
                            <span className="match-tag" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--primary)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                                <Zap size={8} fill="currentColor" /> {scholarship.matchScore}% Match
                            </span>
                            {matchReasons.length > 0 && matchReasons.map((reason, idx) => (
                                <span key={idx} className={`match-tag ${getTagClass(reason)}`}>
                                    {reason}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Section: Metrics */}
                <div className="card-metrics" style={{ borderTop: 'none', paddingTop: 0, paddingRight: '1rem', width: 'auto', gap: '3rem' }}>
                    <div className="metric">
                        <span className="metric-label" style={{ marginBottom: '2px' }}>Benefit</span>
                        <span className="metric-value" style={{ fontSize: '1.25rem' }}>{amount}</span>
                    </div>
                    <div className="metric">
                        <span className="metric-label" style={{ marginBottom: '2px' }}>Closes</span>
                        <span className="metric-value" style={{ fontSize: '0.85rem', color: urgency?.urgent ? '#f87171' : 'var(--text-main)' }}>
                            <Clock size={12} style={{ color: urgency?.urgent ? '#f87171' : 'var(--secondary)' }}/> {deadline}
                        </span>
                    </div>
                </div>

                {/* Action Reveal */}
                <motion.div 
                    className="card-footer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                    style={{ margin: 0, pointerEvents: isHovered ? 'auto' : 'none' }}
                >
                    <button 
                        className={`icon-btn hover:bg-black/5 dark:hover:bg-white/5 ${isSaved ? 'text-primary' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); handleSave(e); }}
                        disabled={saving}
                        style={{ width: '40px', height: '40px' }}
                    >
                        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                    <Link 
                        to={scholarship.id ? `/scholarships/${scholarship.id}` : '#'} 
                        className="apply-btn" 
                        onClick={(e) => e.stopPropagation()}
                        style={{ height: '40px', padding: '0 1.25rem', fontSize: '0.9rem' }}
                    >
                        <span>View</span>
                        <ChevronRight size={14}/>
                    </Link>
                </motion.div>
            </div>
        </motion.div>
    );
}
