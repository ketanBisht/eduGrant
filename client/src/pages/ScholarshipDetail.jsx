import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
    Clock, Building2, ExternalLink, ChevronLeft, ShieldCheck,
    CheckCircle2, AlertCircle, Loader2, Briefcase,
    GraduationCap, Wallet, MapPin, Users, Calendar,
    AlertTriangle, ArrowUpRight
} from 'lucide-react';
import '../styles/Scholarships.css';

function getDeadlineInfo(deadline) {
    if (!deadline) return null;
    const now = new Date();
    const end = new Date(deadline);
    const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (daysLeft < 0)  return { label: 'Deadline Passed', color: '#ef4444', pct: 100, urgent: true, expired: true };
    if (daysLeft <= 7)  return { label: `Only ${daysLeft} day${daysLeft === 1 ? '' : 's'} left!`, color: '#ef4444', pct: 90, urgent: true };
    if (daysLeft <= 21) return { label: `${daysLeft} days remaining`, color: '#f59e0b', pct: 60, urgent: true };
    if (daysLeft <= 60) return { label: `${daysLeft} days remaining`, color: '#10b981', pct: 30, urgent: false };
    return { label: `${daysLeft} days remaining`, color: '#10b981', pct: 10, urgent: false };
}

export default function ScholarshipDetail() {
    const { id } = useParams();
    const [scholarship, setScholarship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get(`/api/scholarships/${id}`)
            .then(res => setScholarship(res.data.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Loader2 className="animate-spin" style={{ color: 'var(--primary)', width: 48, height: 48 }}/>
        </div>
    );

    if (error || !scholarship) return (
        <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <p style={{ color: '#f87171', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                Scholarship not found or failed to load.
            </p>
            <Link to="/scholarships" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                ← Back to Discovery Hub
            </Link>
        </div>
    );

    const dl = getDeadlineInfo(scholarship.deadline);
    const formattedDeadline = scholarship.deadline
        ? new Date(scholarship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Open / No deadline';

    return (
        <div className="scholarship-page" style={{ maxWidth: 1100 }}>
            {/* Back */}
            <Link to="/scholarships" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '2rem', fontSize: '0.9rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-main)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
                <ChevronLeft size={18}/> Back to Discovery Hub
            </Link>

            {/* Deadline Urgency Banner */}
            {dl && (dl.urgent || dl.expired) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        background: `${dl.color}15`, border: `1px solid ${dl.color}40`,
                        borderRadius: 14, padding: '0.875rem 1.5rem', marginBottom: '1.5rem'
                    }}
                >
                    <AlertTriangle size={20} style={{ color: dl.color, flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                        <p style={{ color: dl.color, fontWeight: 800, margin: 0, fontSize: '0.9rem' }}>
                            ⚡ {dl.label}
                        </p>
                        <div style={{ marginTop: 6, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                            <motion.div
                                style={{ height: '100%', background: dl.color, borderRadius: 100 }}
                                initial={{ width: 0 }} animate={{ width: `${dl.pct}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                    {scholarship.officialLink && !dl.expired && (
                        <a href={scholarship.officialLink} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: dl.color, color: '#fff', fontWeight: 800, fontSize: '0.8rem', padding: '6px 14px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                            Apply Now <ArrowUpRight size={14}/>
                        </a>
                    )}
                </motion.div>
            )}

            {/* Hero */}
            <div className="hero-banner" style={{ marginBottom: '2rem' }}>
                <span className={`source-tag ${scholarship.source?.toLowerCase()}`} style={{ marginBottom: '1rem', display: 'inline-block' }}>
                    {scholarship.source?.replace('_', ' ')}
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)', margin: '0 0 1rem', lineHeight: 1.2 }}>
                    {scholarship.title}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '1rem' }}>
                        <Building2 size={18}/> {scholarship.provider}
                    </span>
                    {scholarship.source === 'GOVERNMENT' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700 }}>
                            <ShieldCheck size={16}/> Official Government Scheme
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

                {/* Left column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Description */}
                    {scholarship.description && (
                        <section className="section-card">
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                                <AlertCircle size={18} style={{ color: 'var(--secondary)' }}/> About this Scheme
                            </h3>
                            <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                {scholarship.description}
                            </div>
                        </section>
                    )}

                    {/* Eligibility */}
                    <section className="section-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem' }}>
                            <ShieldCheck size={18} style={{ color: 'var(--primary)' }}/> Eligibility Criteria
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <EligRow icon={<GraduationCap size={20} style={{ color: 'var(--primary)' }}/>}
                                label="Min. Percentage"
                                value={scholarship.minPercentage ? `${scholarship.minPercentage}%+` : 'Any'} />
                            <EligRow icon={<Wallet size={20} style={{ color: 'var(--primary)' }}/>}
                                label="Max. Family Income"
                                value={scholarship.maxIncome ? `₹${scholarship.maxIncome.toLocaleString()}` : 'No limit'} />
                            <EligRow icon={<MapPin size={20} style={{ color: 'var(--primary)' }}/>}
                                label="State / Domicile"
                                value={scholarship.state || 'All India'} />
                            <EligRow icon={<Users size={20} style={{ color: 'var(--primary)' }}/>}
                                label="Gender"
                                value={scholarship.gender || 'All'} />
                        </div>

                        {scholarship.categoryEligible?.length > 0 && (
                            <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                    <Briefcase size={12} style={{ display: 'inline', marginRight: 6 }}/>Eligible Categories
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {scholarship.categoryEligible.map(cat => (
                                        <span key={cat} style={{ padding: '4px 12px', background: 'rgba(16,185,129,0.15)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, borderRadius: 8, border: '1px solid rgba(16,185,129,0.25)', textTransform: 'uppercase' }}>
                                            {typeof cat === 'string' ? cat : 'ALL'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Documents */}
                    <section className="section-card">
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
                            <AlertCircle size={18} style={{ color: 'var(--secondary)' }}/> Documents Required
                        </h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {(['Income Certificate', 'Caste / Category Certificate', 'Last Year Marksheet', 'Aadhar Card', 'Bank Account Details', 'Passport Size Photo']).map((doc, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0 }}/> {doc}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                {/* Right sticky column */}
                <div style={{ position: 'sticky', top: 100 }}>
                    <div className="section-card" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>

                        {/* Award Amount */}
                        <div style={{ textAlign: 'center', padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-secondary)', margin: '0 0 0.5rem' }}>Total Benefit</p>
                            <p style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                                {scholarship.amount ? `₹${scholarship.amount.toLocaleString()}` : 'Variable'}
                            </p>
                        </div>

                        {/* Deadline */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.875rem', borderRadius: 12, background: dl?.urgent ? `${dl.color}10` : 'rgba(255,255,255,0.04)', border: `1px solid ${dl?.urgent ? dl.color + '30' : 'rgba(255,255,255,0.08)'}`, marginBottom: '1.25rem' }}>
                            <Calendar size={20} style={{ color: dl?.urgent ? dl.color : 'var(--primary)', flexShrink: 0 }}/>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', margin: '0 0 2px' }}>Last Date</p>
                                <p style={{ fontWeight: 800, color: dl?.urgent ? dl.color : 'var(--text-main)', margin: 0, fontSize: '0.95rem' }}>{formattedDeadline}</p>
                            </div>
                            {dl && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: dl.color, textAlign: 'right', flexShrink: 0 }}>{dl.label}</span>}
                        </div>

                        {/* Deadline progress */}
                        {dl && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>Deadline Urgency</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                                    <motion.div
                                        style={{ height: '100%', background: dl.color, borderRadius: 100 }}
                                        initial={{ width: 0 }} animate={{ width: `${dl.pct}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* CTA — official gov link */}
                        {scholarship.officialLink ? (
                            <a
                                href={scholarship.officialLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    background: 'linear-gradient(135deg, #10b981, #059669)',
                                    color: '#fff', fontWeight: 800, fontSize: '1rem',
                                    padding: '1rem', borderRadius: 14, textDecoration: 'none',
                                    boxShadow: '0 10px 25px -8px rgba(16,185,129,0.5)',
                                    transition: 'all 0.25s', marginBottom: '1rem'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 30px -8px rgba(16,185,129,0.65)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px -8px rgba(16,185,129,0.5)'; }}
                            >
                                Apply on Official Portal <ArrowUpRight size={18}/>
                            </a>
                        ) : (
                            <div style={{ padding: '1rem', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                No direct link available. Search on NSP or state portal.
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 600, justifyContent: 'center' }}>
                            <ShieldCheck size={14} style={{ color: 'var(--primary)' }}/>
                            Verified Official Source
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EligRow({ icon, label, value }) {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '0.875rem', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            <div>
                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.9rem' }}>{value}</span>
            </div>
        </div>
    );
}
