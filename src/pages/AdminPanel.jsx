import { Plus, Search, Edit2, Trash2, Users, FileText, CheckCircle } from 'lucide-react';
import '../styles/Admin.css';

export default function AdminPanel() {
    const scholarships = [
        { id: 1, title: 'Global Future Leaders', applicants: 142, amount: '$10,000', status: 'active', deadline: 'Oct 30' },
        { id: 2, title: 'Women in STEM Grant', applicants: 89, amount: '$5,000', status: 'active', deadline: 'Nov 15' },
        { id: 3, title: 'Community Service Award', applicants: 34, amount: '$2,500', status: 'draft', deadline: 'Dec 01' },
        { id: 4, title: 'Arts & Design Fellowship', applicants: 56, amount: '$7,500', status: 'active', deadline: 'Nov 05' },
    ];

    const handleDelete = (id) => {
        alert(`Mock deletion of scholarship ID: ${id}`);
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div className="admin-title">
                    <h2>Scholarship Management</h2>
                    <p>Manage listings and view applicant statistics.</p>
                </div>
                <div className="admin-actions">
                    <button className="btn btn-primary">
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
                        <div className="admin-stat-value">24</div>
                        <div className="admin-stat-label">Active Listings</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ color: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
                        <Users size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">1,204</div>
                        <div className="admin-stat-label">Total Applicants</div>
                    </div>
                </div>
                <div className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <CheckCircle size={20} />
                    </div>
                    <div>
                        <div className="admin-stat-value">18</div>
                        <div className="admin-stat-label">Pending Reviews</div>
                    </div>
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Scholarship Title</th>
                            <th>Amount</th>
                            <th>Applicants</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scholarships.map(item => (
                            <tr key={item.id}>
                                <td>{item.title}</td>
                                <td>{item.amount}</td>
                                <td>{item.applicants}</td>
                                <td>{item.deadline}</td>
                                <td>
                                    <span className={`status-cell ${item.status}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <button className="icon-btn" title="Edit">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="icon-btn delete" title="Delete" onClick={() => handleDelete(item.id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
