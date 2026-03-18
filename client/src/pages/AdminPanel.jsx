import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Users, FileText, CheckCircle, Loader2, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import '../styles/Admin.css';

export default function AdminPanel() {
    const { getToken } = useAuth();
    const [scholarships, setScholarships] = useState([]);
    const [stats, setStats] = useState({ active: 0, applicants: 0, pendingReviews: 0 });
    const [loading, setLoading] = useState(true);
    
    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        provider: '',
        eligibility_criteria: '',
        amount: '',
        deadline: ''
    });

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            
            // Fetch Scholarships
            const res = await axios.get('http://localhost:3000/api/scholarships');
            const data = res.data.data;
            setScholarships(data);
            
            // Try fetching applications for stats if admin
            try {
                const appRes = await axios.get('http://localhost:3000/api/applications/admin', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const apps = appRes.data.data;
                const pendingCount = apps.filter(a => a.application_status === 'pending').length;
                setStats({ active: data.length, applicants: apps.length, pendingReviews: pendingCount });
            } catch (err) {
                // Ignore if not admin or failed, just set basic stats
                setStats({ active: data.length, applicants: 0, pendingReviews: 0 });
            }
        } catch (error) {
            toast.error('Failed to load scholarships');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [getToken]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ title: '', provider: '', eligibility_criteria: '', amount: '', deadline: '' });
        setEditingId(null);
        setIsModalOpen(false);
    };

    const handleEdit = (scholarship) => {
        setFormData({
            title: scholarship.title,
            provider: scholarship.provider,
            eligibility_criteria: scholarship.eligibility_criteria,
            amount: scholarship.amount,
            deadline: new Date(scholarship.deadline).toISOString().split('T')[0] // Format for date input
        });
        setEditingId(scholarship._id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
        
        try {
            const token = await getToken();
            await axios.delete(`http://localhost:3000/api/scholarships/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Scholarship deleted successfully');
            fetchDashboardData();
        } catch (error) {
            toast.error('Failed to delete scholarship');
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = await getToken();
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            if (editingId) {
                await axios.put(`http://localhost:3000/api/scholarships/${editingId}`, formData, config);
                toast.success('Scholarship updated successfully');
            } else {
                await axios.post('http://localhost:3000/api/scholarships', formData, config);
                toast.success('Scholarship added successfully');
            }
            
            resetForm();
            fetchDashboardData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save scholarship');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="animate-spin text-primary" size={40} /></div>;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-title">
                    <h2>Scholarship Management</h2>
                    <p>Manage active listings and review comprehensive statistics.</p>
                </div>
                <div className="admin-actions">
                    <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} className="mr-2" />
                        Add New Scholarship
                    </button>
                </div>
            </div>

            <div className="stats-overview">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <FileText size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">{stats.active}</div>
                        <div className="admin-stat-label">Active Listings</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ color: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">{stats.applicants}</div>
                        <div className="admin-stat-label">Total Applications</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">{stats.pendingReviews}</div>
                        <div className="admin-stat-label">Pending Reviews</div>
                    </div>
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Scholarship Title</th>
                            <th>Provider</th>
                            <th>Amount</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scholarships.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-slate-500">No scholarships found. Add one above!</td>
                            </tr>
                        ) : (
                            scholarships.map(item => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="font-medium text-slate-800">{item.title}</div>
                                    </td>
                                    <td>{item.provider}</td>
                                    <td className="font-semibold text-emerald-600">₹{item.amount?.toLocaleString()}</td>
                                    <td>{new Date(item.deadline).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-cell ${new Date(item.deadline) < new Date() ? 'rejected' : 'active'}`}>
                                            {new Date(item.deadline) < new Date() ? 'Expired' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="action-cell">
                                        <button className="icon-btn" title="Edit" onClick={() => handleEdit(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Edit */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                        <button onClick={resetForm} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
                                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                            </div>
                            
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Provider</label>
                                <input required type="text" name="provider" value={formData.provider} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Eligibility Criteria</label>
                                <textarea required name="eligibility_criteria" value={formData.eligibility_criteria} onChange={handleInputChange} rows="3" className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Amount (₹)</label>
                                    <input required type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Deadline</label>
                                    <input required type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="form-input" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
                                </div>
                            </div>

                            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', padding: '0.875rem', marginTop: '1rem', justifyContent: 'center' }}>
                                {submitting ? <Loader2 size={20} className="animate-spin" /> : editingId ? 'Update Scholarship' : 'Create Scholarship'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
