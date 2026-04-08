import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, GraduationCap, BookOpen, Wallet,
    Phone, ChevronRight, ChevronLeft, ShieldCheck,
    Sparkles, CheckCircle2, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import '../styles/ProfileBuilder.css';

const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh",
    "Ladakh", "Jammu and Kashmir"
];
const CATEGORIES = ["General", "OBC", "SC", "ST", "EWS"];
const RELIGIONS = ["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Parsi", "Other"];
const YEAR_OF_STUDY = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "PG Year 1", "PG Year 2", "PhD"];
const TOTAL_STEPS = 4;

const STEPS = [
    { id: 1, label: "Personal",   icon: User,          color: "#10b981" },
    { id: 2, label: "Academic",   icon: GraduationCap, color: "#6366f1" },
    { id: 3, label: "Eligibility",icon: BookOpen,      color: "#10b981" },
    { id: 4, label: "Financial",  icon: Wallet,        color: "#6366f1" },
];

const emptyForm = {
    name: '', gender: '', whatsapp: '', religion: '',
    course: '', boardType: '', yearOfStudy: '', academicPercentage: '',
    state: '', category: '', disability: '',
    income: '', fatherOccupation: '', motherOccupation: '',
};

function validate(step, f) {
    if (step === 1) {
        if (!f.name.trim()) return 'Please enter your full name.';
        if (!f.gender) return 'Please select your gender.';
        if (!/^\d{10}$/.test(f.whatsapp.trim())) return 'Enter a valid 10-digit WhatsApp number.';
    }
    if (step === 2) {
        if (!f.course.trim()) return 'Please enter your current course.';
        if (!f.yearOfStudy) return 'Please select your year of study.';
        const p = parseFloat(f.academicPercentage);
        if (isNaN(p) || p <= 0 || p > 100) return 'Enter a valid percentage (1–100).';
    }
    if (step === 3) {
        if (!f.state) return 'Please select your domicile state.';
        if (!f.category) return 'Please select your category.';
    }
    if (step === 4) {
        const inc = parseFloat(f.income);
        if (f.income === '' || isNaN(inc) || inc < 0) return 'Enter a valid annual family income (0 if none).';
    }
    return null;
}

export default function ProfileBuilder() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [formData, setFormData] = useState(emptyForm);

    useEffect(() => {
        axios.get('/api/students/profile')
            .then(res => {
                if (res.data.success && res.data.data) {
                    const p = res.data.data;
                    setFormData({
                        name:               p.name || '',
                        gender:             p.gender || '',
                        whatsapp:           p.whatsapp || '',
                        religion:           p.religion || '',
                        course:             p.course || '',
                        boardType:          p.boardType || '',
                        yearOfStudy:        p.yearOfStudy || '',
                        academicPercentage: p.academicPercentage != null ? String(p.academicPercentage) : '',
                        state:              p.state || '',
                        category:           p.category || '',
                        disability:         p.disability || '',
                        income:             p.income != null ? String(p.income) : '',
                        fatherOccupation:   p.fatherOccupation || '',
                        motherOccupation:   p.motherOccupation || '',
                    });
                }
            })
            .catch(err => console.error("Failed to load profile", err))
            .finally(() => setLoadingProfile(false));
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveStep = async () => {
        const err = validate(step, formData);
        if (err) { toast.error(err, { icon: '⚠️' }); return false; }
        setSaving(true);
        try {
            await axios.put('/api/students/profile', formData);
            return true;
        } catch (e) {
            toast.error(e?.response?.data?.message || 'Save failed. Please try again.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleNext = async () => { if (await saveStep()) setStep(s => s + 1); };
    const handleBack = () => setStep(s => s - 1);
    const handleSubmit = async e => {
        e.preventDefault();
        if (await saveStep()) {
            toast.success('🚀 Profile completed! Unlocking Smart Matches...', { duration: 4000 });
            setTimeout(() => navigate('/dashboard'), 1500);
        }
    };

    if (loadingProfile) {
        return (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'60vh' }}>
                <Loader2 className="animate-spin" style={{ color:'var(--primary)', width:48, height:48 }} />
            </div>
        );
    }

    const progress = (step / TOTAL_STEPS) * 100;

    return (
        <div className="pb-canvas">

            {/* Header */}
            <motion.div style={{ textAlign:'center', marginBottom:'2.5rem' }}
                initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
                <div className="pb-badge"><Sparkles size={13}/> Intelligence Engine</div>
                <h1 className="pb-title">Personalize Your Journey</h1>
                <p className="pb-subtitle">Complete all {TOTAL_STEPS} steps to unlock verified Smart Matches</p>
            </motion.div>

            {/* Step Indicators */}
            <div className="pb-steps">
                {STEPS.map((s, i) => {
                    const Icon = s.icon;
                    const done = s.id < step;
                    const active = s.id === step;
                    return (
                        <div key={s.id} className="pb-step-item">
                            <div className={`pb-step-circle ${done ? 'pb-step-done' : active ? 'pb-step-active' : 'pb-step-idle'}`}>
                                {done ? <CheckCircle2 size={16}/> : <Icon size={16}/>}
                            </div>
                            <span className={`pb-step-label ${active ? 'pb-step-label-active' : ''}`}>{s.label}</span>
                            {i < STEPS.length - 1 && (
                                <div className={`pb-step-line ${done ? 'pb-step-line-done' : ''}`}/>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress Bar */}
            <div className="pb-progress-track">
                <motion.div className="pb-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
            <p className="pb-progress-label">Step {step} of {TOTAL_STEPS} — {Math.round(progress)}% complete</p>

            {/* Card */}
            <div className="pb-card">
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">

                        {/* STEP 1 */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.25 }}>
                                <StepHeader Icon={User} title="Personal Identity" sub="Basic details to personalize your experience." color="#10b981"/>

                                <div className="pb-field">
                                    <label className="pb-label">Full Name</label>
                                    <input className="pb-input" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full legal name"/>
                                </div>

                                <div className="pb-row">
                                    <div className="pb-field">
                                        <label className="pb-label">Gender</label>
                                        <select className="pb-input" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary / Other</option>
                                        </select>
                                    </div>
                                    <div className="pb-field">
                                        <label className="pb-label">Religion <span className="pb-optional">(optional)</span></label>
                                        <select className="pb-input" name="religion" value={formData.religion} onChange={handleChange}>
                                            <option value="">Select Religion</option>
                                            {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pb-field">
                                    <label className="pb-label">WhatsApp Number</label>
                                    <div style={{ position:'relative' }}>
                                        <Phone style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--text-secondary)', width:18, height:18 }}/>
                                        <input className="pb-input" style={{ paddingLeft:'3rem' }} type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="10-digit number" maxLength={10}/>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2 */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.25 }}>
                                <StepHeader Icon={GraduationCap} title="Academic Portfolio" sub="Your merit helps us find performance-based schemes." color="#6366f1"/>

                                <div className="pb-field">
                                    <label className="pb-label">Current Course / Programme</label>
                                    <input className="pb-input" type="text" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. B.Tech CS, BA English, M.Sc Physics"/>
                                </div>

                                <div className="pb-row">
                                    <div className="pb-field">
                                        <label className="pb-label">Year of Study</label>
                                        <select className="pb-input" name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange}>
                                            <option value="">Select Year</option>
                                            {YEAR_OF_STUDY.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                    <div className="pb-field">
                                        <label className="pb-label">Board / University <span className="pb-optional">(optional)</span></label>
                                        <select className="pb-input" name="boardType" value={formData.boardType} onChange={handleChange}>
                                            <option value="">Select Type</option>
                                            <option value="CBSE">CBSE</option>
                                            <option value="ICSE">ICSE</option>
                                            <option value="State Board">State Board</option>
                                            <option value="IB">IB (International)</option>
                                            <option value="University">University / College</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pb-field">
                                    <label className="pb-label">Last Academic Year Percentage (%)</label>
                                    <input className="pb-input" type="number" step="0.01" min="1" max="100" name="academicPercentage" value={formData.academicPercentage} onChange={handleChange} placeholder="e.g. 85.50"/>
                                    <p className="pb-hint">Enter your aggregate percentage/CGPA converted to %</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3 */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.25 }}>
                                <StepHeader Icon={BookOpen} title="Eligibility Profile" sub="Critical for caste, state and gender-based scheme matching." color="#10b981"/>

                                <div className="pb-row">
                                    <div className="pb-field">
                                        <label className="pb-label">Domicile State</label>
                                        <select className="pb-input" name="state" value={formData.state} onChange={handleChange}>
                                            <option value="">Select State</option>
                                            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="pb-field">
                                        <label className="pb-label">Caste / Category</label>
                                        <select className="pb-input" name="category" value={formData.category} onChange={handleChange}>
                                            <option value="">Select Category</option>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="pb-field">
                                    <label className="pb-label">Person with Disability (PwD)? <span className="pb-optional">(optional)</span></label>
                                    <select className="pb-input" name="disability" value={formData.disability} onChange={handleChange}>
                                        <option value="">No / Not Applicable</option>
                                        <option value="Yes - Visual">Yes — Visual Impairment</option>
                                        <option value="Yes - Hearing">Yes — Hearing Impairment</option>
                                        <option value="Yes - Locomotor">Yes — Locomotor Disability</option>
                                        <option value="Yes - Other">Yes — Other</option>
                                    </select>
                                    <p className="pb-hint">Several government schemes have exclusive PwD quotas</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4 */}
                        {step === 4 && (
                            <motion.div key="s4" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }} transition={{ duration:0.25 }}>
                                <StepHeader Icon={Wallet} title="Financial Background" sub="Determines income-based government scholarship eligibility." color="#6366f1"/>

                                <div className="pb-field">
                                    <label className="pb-label">Annual Family Income (₹)</label>
                                    <input className="pb-input" type="number" name="income" value={formData.income} onChange={handleChange} placeholder="e.g. 250000 (enter 0 if unemployed)" min="0"/>
                                    <p className="pb-hint">Most NSP schemes require annual income ≤ ₹2.5 Lakh</p>
                                </div>

                                <div className="pb-row">
                                    <div className="pb-field">
                                        <label className="pb-label">Father's Occupation <span className="pb-optional">(optional)</span></label>
                                        <input className="pb-input" type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="e.g. Farmer, Labour, Teacher"/>
                                    </div>
                                    <div className="pb-field">
                                        <label className="pb-label">Mother's Occupation <span className="pb-optional">(optional)</span></label>
                                        <input className="pb-input" type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="e.g. Homemaker, Nurse"/>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="pb-summary">
                                    <p className="pb-summary-title">📋 Profile Summary</p>
                                    <div className="pb-summary-grid">
                                        {[
                                            ['Name', formData.name],
                                            ['Gender', formData.gender],
                                            ['State', formData.state],
                                            ['Category', formData.category],
                                            ['Course', formData.course],
                                            ['Percentage', formData.academicPercentage ? `${formData.academicPercentage}%` : '—'],
                                        ].map(([k, v]) => (
                                            <div key={k} className="pb-summary-row">
                                                <span className="pb-summary-key">{k}</span>
                                                <span className="pb-summary-val">{v || '—'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Nav Buttons */}
                    <div className="pb-nav">
                        {step > 1 ? (
                            <button type="button" onClick={handleBack} className="pb-btn-back">
                                <ChevronLeft size={18}/> Back
                            </button>
                        ) : <div/>}

                        {step < TOTAL_STEPS ? (
                            <button type="button" onClick={handleNext} disabled={saving} className="pb-btn-next">
                                {saving
                                    ? <><Loader2 size={17} style={{ animation:'spin 1s linear infinite' }}/> Saving...</>
                                    : <><span>Save & Continue</span><ChevronRight size={18}/></>
                                }
                            </button>
                        ) : (
                            <button type="submit" disabled={saving} className="pb-btn-next pb-btn-complete">
                                {saving
                                    ? <><Loader2 size={17} style={{ animation:'spin 1s linear infinite' }}/> Saving...</>
                                    : <><span>Complete Profile</span><CheckCircle2 size={18}/></>
                                }
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <p className="pb-footer">
                <ShieldCheck size={16} style={{ color:'var(--primary)' }}/>
                Your data is encrypted and used only for scholarship matching
            </p>
        </div>
    );
}

function StepHeader({ Icon, title, sub, color }) {
    return (
        <div className="pb-step-header">
            <div className="pb-step-icon" style={{ background:`${color}20`, color, borderColor:`${color}33` }}>
                <Icon size={26}/>
            </div>
            <div>
                <h3 className="pb-step-title">{title}</h3>
                <p className="pb-step-sub">{sub}</p>
            </div>
        </div>
    );
}
