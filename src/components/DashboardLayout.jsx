import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import '../styles/Layout.css';

export default function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main className="page-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
