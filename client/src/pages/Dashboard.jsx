import { FileText, CheckCircle, Bookmark, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // Mock Data
  const stats = [
    { label: "Applications", value: "12", icon: FileText },
    { label: "Approved", value: "2", icon: CheckCircle },
    { label: "Saved", value: "5", icon: Bookmark },
    { label: "Pending", value: "4", icon: Clock },
  ];

  const recommended = [
    { id: 1, title: "Global Excellence Scholarship", amount: "₹5,000", deadline: "2 days left" },
    { id: 2, title: "STEM Future Leaders", amount: "₹10,000", deadline: "5 days left" },
    { id: 3, title: "Merit Access Grant", amount: "₹2,500", deadline: "1 week left" },
  ];

  const upcomingDeadlines = [
    { id: 1, title: "Global Excellence", date: "Feb 7" },
    { id: 4, title: "Arts & Culture Fund", date: "Feb 10" },
    { id: 5, title: "Research Grant 2024", date: "Feb 12" },
  ];

  return (
    <div className="dashboard-page">
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Hello, {user?.firstName || "Student"}! 👋</h2>
        <p>Here's what's happening with your scholarship applications today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Recommended Scholarships */}
        <div className="section-card">
          <div className="section-header">
            <h3>Recommended for You</h3>
            <Link to="/scholarships" className="view-all">
              View All
            </Link>
          </div>

          <div className="scholarship-list">
            {recommended.map((item) => (
              <div key={item.id} className="scholarship-item">
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <div className="item-meta">
                    {item.amount} • {item.deadline}
                  </div>
                </div>
                <button className="btn btn-primary text-xs">Apply</button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="section-card">
          <div className="section-header">
            <h3>Upcoming Deadlines</h3>
          </div>

          <div className="scholarship-list">
            {upcomingDeadlines.map((item) => (
              <div key={item.id} className="scholarship-item">
                <div className="item-info">
                  <h4>{item.title}</h4>
                  <div className="item-meta text-red-500">Due {item.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="font-semibold text-sm mb-2">Complete your profile</h4>

            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "70%" }}></div>
            </div>

            <p className="text-xs text-slate-500">70% Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
