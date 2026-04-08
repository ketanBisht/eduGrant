import { useState, useEffect } from 'react';
import { 
    Plus, Edit2, Trash2, Users, FileText, CheckCircle, 
    XCircle, Loader2, X, Building, Check, ExternalLink,
    Zap, TrendingUp, ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../styles/Admin.css';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState(null);
    const [scholarships, setScholarships] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Form State for adding/editing scholarships
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '', provider: '', description: '', amount: '', 
        deadline: '', officialLink: '', state: 'All', gender: 'All'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'stats') {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data.data);
            } else if (activeTab === 'scholarships') {
                const res = await axios.get('/api/scholarships');
                setScholarships(res.data.data);
            } else if (activeTab === 'users') {
                const res = await axios.get('/api/admin/users');
                setUsers(res.data.data);
            }
        } catch (error) {
            console.error('Admin sync error:', error);
            toast.error('Failed to sync admin data. Check permissions.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Remove this user and all their applications?')) return;
        try {
            await axios.delete(`/api/admin/users/${id}`);
            toast.success('User removed');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    const handleDeleteScholarship = async (id) => {
        if (!window.confirm('Delete this listing permanently?')) return;
        try {
            await axios.delete(`/api/scholarships/${id}`);
            toast.success('Deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const handleAddScholarship = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await axios.post('/api/scholarships', formData);
            toast.success('New scholarship listed!');
            setIsModalOpen(false);
            setFormData({ title: '', provider: '', description: '', amount: '', deadline: '', officialLink: '', state: 'All', gender: 'All' });
            fetchData();
        } catch (error) {
            toast.error('Failed to add scholarship');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !stats && !scholarships.length && !users.length) {
        return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-title">
                    <h2>EduGrant Mission Control</h2>
                    <p>Global platform oversight, user management, and system analytics.</p>
                </div>
                {activeTab === 'scholarships' && (
                    <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> New Listing
                    </button>
                )}
            </div>

            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
                    <TrendingUp size={18} /> Platform Stats
                </button>
                <button className={`tab-btn ${activeTab === 'scholarships' ? 'active' : ''}`} onClick={() => setActiveTab('scholarships')}>
                    <FileText size={18} /> Scholarship Registry
                </button>
                <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    <Users size={18} /> User Management
                </button>
            </div>

            <div className="data-table-container">
                {activeTab === 'stats' && stats && (
                    <div className="stats-grid">
                        <StatCard icon={Users} label="Total Students" value={stats.users} color="#6366f1" />
                        <StatCard icon={FileText} label="Active Listings" value={stats.scholarships} color="#10b981" />
                        <StatCard icon={Zap} label="Applications" value={stats.applications} color="#f59e0b" />
                        <StatCard icon={ShieldCheck} label="Potential Benefit" value={`₹${stats.potentialBenefit.toLocaleString()}`} color="#ec4899" />
                    </div>
                )}

                {activeTab === 'scholarships' && (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Listing</th>
                                <th>Provider</th>
                                <th>Benefit</th>
                                <th>Deadline</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scholarships.map(item => (
                                <tr key={item.id}>
                                    <td><div className="font-bold">{item.title}</div></td>
                                    <td>{item.provider}</td>
                                    <td className="text-emerald-500 font-bold">₹{item.amount?.toLocaleString()}</td>
                                    <td>{new Date(item.deadline).toLocaleDateString()}</td>
                                    <td>
                                        <button className="icon-btn delete" onClick={() => handleDeleteScholarship(item.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'users' && (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td><div className="font-bold">{u.name}</div></td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`status-badge ${u.profileStatus === 'COMPLETE' ? 'verified' : 'pending'}`}>
                                            {u.profileStatus}
                                        </span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="icon-btn delete" onClick={() => handleDeleteUser(u.id)}><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add Scholarship Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>List New scholarship</h3>
                            <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddScholarship} className="modal-form">
                            <input required placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <input required placeholder="Provider" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} />
                            <textarea required placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <div className="form-row">
                                <input required type="number" placeholder="Amount (₹)" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} />
                                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                            </div>
                            <input required placeholder="Official Link" value={formData.officialLink} onChange={e => setFormData({...formData, officialLink: e.target.value})} />
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? <Loader2 className="animate-spin" /> : 'Create listing'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
                <Icon size={24} />
            </div>
            <div className="stat-info">
                <h4>{value}</h4>
                <p>{label}</p>
            </div>
        </div>
    );
}
