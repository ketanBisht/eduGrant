import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    GraduationCap,
    FileText,
    Settings,
    LogOut,
    Shield
} from 'lucide-react';
import '../styles/Layout.css';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand">
                    <GraduationCap size={28} />
                    EduGrant
                </div>
            </div>

            <nav className="sidebar-nav">
                {isAdmin ? (
                    /* Admin Links */
                    <>
                        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Shield size={20} />
                            Admin Panel
                        </NavLink>
                        <NavLink to="/scholarships" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <FileText size={20} />
                            Manage Scholarships
                        </NavLink>
                    </>
                ) : (
                    /* Student Links */
                    <>
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>
                        <NavLink to="/scholarships" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <GraduationCap size={20} />
                            Scholarships
                        </NavLink>
                        <NavLink to="/applications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <FileText size={20} />
                            My Applications
                        </NavLink>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button onClick={logout} className="nav-item w-full text-red-500 hover:text-red-600">
                    <LogOut size={20} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
