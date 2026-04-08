import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Bookmark, Building2, ChevronRight, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';
import axios from 'axios';
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

    const title    = scholarship.title    || 'Untitled Scheme';
    const provider = scholarship.provider || 'Verified Provider';
    const amount   = scholarship.amount   ? `₹${scholarship.amount.toLocaleString()}` : 'Variable';
    const deadline = scholarship.deadline
        ? new Date(scholarship.deadline).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'Always Open';
    const source   = scholarship.source   || 'GOVERNMENT';
    const urgency  = getDeadlineUrgency(scholarship.deadline);

    const isMatch = scholarship.amount > 15000 || source === 'GOVERNMENT';

    const handleSave = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (saving) return;

        try {
            setSaving(true);
            if (isSaved) {
                await axios.delete(`/api/saved/${scholarship.id}`);
                setIsSaved(false);
                toast.success('Removed from bookmarks');
            } else {
                await axios.post('/api/saved', { scholarshipId: scholarship.id });
                setIsSaved(true);
                toast.success('Saved to bookmarks');
            }
        } catch (err) {
            console.error('Error toggling save:', err);
            toast.error(err.response?.data?.message || 'Failed to update bookmark');
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            className="scholarship-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', height: 'auto', minHeight: 400 }}
        >
            {/* Deadline urgency bar at top */}
            {urgency && (
                <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: '16px 16px 0 0', overflow: 'hidden', marginBottom: 0, marginTop: -1 }}>
                    <motion.div
                        style={{ height: '100%', background: urgency.color, borderRadius: 4 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${urgency.pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            )}

            <div className="card-header-tags">
                <span className={`source-tag ${source.toLowerCase()}`}>
                    {source.replace('_', ' ')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {urgency?.urgent && (
                        <span style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            background: 'rgba(239,68,68,0.15)', color: '#f87171',
                            padding: '3px 8px', borderRadius: 6,
                            fontSize: '0.65rem', fontWeight: 800, border: '1px solid rgba(239,68,68,0.3)'
                        }}>
                            <AlertTriangle size={10}/> {urgency.label}
                        </span>
                    )}
                    {isMatch && (
                        <div className="match-tag">
                            <Zap size={10} fill="currentColor"/> Smart Match
                        </div>
                    )}
                </div>
            </div>

            <div className="card-body" style={{ flex: 1 }}>
                <h3 className="card-title line-clamp-3">{title}</h3>
                <div className="provider-info">
                    <Building2 size={14} className="text-primary"/>
                    <span>{provider}</span>
                    {source === 'GOVERNMENT' && (
                        <ShieldCheck size={14} className="text-primary" style={{ marginLeft: 'auto' }} title="Official Registry"/>
                    )}
                </div>

                <div className="card-metrics">
                    <div className="metric">
                        <span className="metric-label">Benefit</span>
                        <span className="metric-value" style={{ fontSize: '1.4rem' }}>{amount}</span>
                    </div>
                    <div className="metric text-right">
                        <span className="metric-label">Closes</span>
                        <span className="metric-value" style={{ fontSize: '0.9rem', justifyContent: 'flex-end', color: urgency?.urgent ? '#f87171' : 'white' }}>
                            <Clock size={12} style={{ color: urgency?.urgent ? '#f87171' : 'var(--secondary)' }}/> {deadline}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card-footer">
                <button 
                    className={`icon-btn hover:bg-white/5 ${isSaved ? 'text-primary' : ''}`} 
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"}/>
                </button>
                <Link to={scholarship.id ? `/scholarships/${scholarship.id}` : '#'} className="apply-btn">
                    <span>View Details</span>
                    <ChevronRight size={16}/>
                </Link>
            </div>
        </motion.div>
    );
}
