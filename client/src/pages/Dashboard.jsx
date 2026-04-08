import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, CheckCircle, Bookmark, Clock, Zap, TrendingUp, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState([
    { label: "Matches Found", value: "0", icon: Zap },
    { label: "Saved", value: "0", icon: Bookmark },
    { label: "Closing Soon", value: "0", icon: Clock },
  ]);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [savedScholarships, setSavedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
        fetchDashboardData();
    }
  }, [isLoaded, user]);

  const fetchDashboardData = async () => {
    try {
        setLoading(true);

        const [profileRes, recsRes, savedRes] = await Promise.allSettled([
            axios.get('/api/students/profile'),
            axios.get('/api/scholarships/recommended'),
            axios.get('/api/saved')
        ]);

        if (profileRes.status === 'fulfilled') {
            setProfile(profileRes.value.data.data);
        }

        let totalMatches = "0";
        let recommendationsList = [];
        if (recsRes.status === 'fulfilled') {
            const recs = recsRes.value.data.data || [];
            recommendationsList = recs.slice(0, 3);
            setRecommendations(recommendationsList);
            totalMatches = recsRes.value.data.totalMatches?.toString() || recs.length.toString();
        }

        let savedList = [];
        let urgentCount = "0";
        if (savedRes.status === 'fulfilled') {
            const saved = savedRes.value.data.data || [];
            savedList = saved;
            setSavedScholarships(saved);
            urgentCount = saved.filter(s => s.isUrgent).length.toString();
        }

        setStats([
            { label: "Matches Found", value: totalMatches, icon: Zap },
            { label: "Saved", value: savedList.length.toString(), icon: Bookmark },
            { label: "Closing Soon", value: urgentCount, icon: Clock },
        ]);

    } catch (e) {
        console.error("Dashboard data fetch error:", e);
    } finally {
        setLoading(false);
    }
  };

  if (!isLoaded) return null;

  // Completion: use profileStatus as source of truth so we never show 0% after completing
  const profileFields = [
    'name', 'gender', 'whatsapp',
    'course', 'yearOfStudy', 'academicPercentage',
    'state', 'category',
    'income'
  ];
  let completionRate = 0;
  if (profile) {
    if (profile.profileStatus === 'COMPLETE') {
      completionRate = 100;
    } else {
      const filled = profileFields.filter(f => {
        const val = profile[f];
        if (val === null || val === undefined || val === '') return false;
        if (f === 'academicPercentage' && typeof val === 'number' && val <= 0) return false;
        if (f === 'income' && typeof val === 'number' && val < 0) return false;
        return true;
      }).length;
      completionRate = Math.round((filled / profileFields.length) * 100);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
        className="dashboard-page"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      {/* Welcome Section */}
      <motion.div className="welcome-section" variants={itemVariants}>
        <div className="welcome-text">
            <h2>Hello, {user?.firstName || profile?.name || "Student"}! 👋</h2>
            <p>
                {completionRate < 100 
                    ? `Your profile is ${completionRate}% complete. Complete it to unlock all matches.`
                    : "Your profile is fully verified and helping us find the best official matches."}
            </p>
        </div>
        <Link to={completionRate < 100 ? "/profile-builder" : "/scholarships"} className="vault-cta">
            <Zap size={16} /> {completionRate < 100 ? "Complete Profile" : "View Matches"}
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <motion.div 
            key={index} 
            className="stat-card"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Recommended Scholarships */}
        <motion.div className="section-card" variants={itemVariants}>
          <div className="section-header">
            <h3><Zap size={18} className="text-emerald-500" /> Smart Recommendations</h3>
            <Link to="/scholarships" className="view-all">
              View All
            </Link>
          </div>

          <div className="scholarship-list">
            {loading ? (
                <p>Finding matches...</p>
            ) : recommendations.length === 0 ? (
                <p className="empty-msg">Complete your profile to get matches.</p>
            ) : (
                recommendations.map((item) => (
                    <motion.div 
                        key={item.id} 
                        className="scholarship-item"
                        whileHover={{ x: 5 }}
                    >
                        <div className="item-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <h4>{item.title}</h4>
                                {item.matchScore && (
                                    <div className={`match-badge ${item.matchScore >= 80 ? 'high-match' : ''}`}>
                                        <Zap size={10} fill="currentColor" /> {item.matchScore}% Match
                                    </div>
                                )}
                            </div>
                            <div className="item-meta">
                                ₹{item.amount?.toLocaleString()} • {item.source?.replace('_', ' ')}
                            </div>
                        </div>
                        <Link to={`/scholarships/${item.id}`} className="mini-btn">
                            <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                ))
            )}
          </div>
        </motion.div>

        {/* Saved Scholarships & Reminders */}
        <motion.div className="section-card" variants={itemVariants}>
          <div className="section-header">
            <h3><Bookmark size={18} className="text-primary" /> Saved & Reminders</h3>
          </div>

          <div className="scholarship-list">
            {loading ? (
                <p>Loading saved items...</p>
            ) : savedScholarships.length === 0 ? (
                <p className="empty-msg">No scholarships saved yet.</p>
            ) : (
                savedScholarships.map((item) => (
                    <motion.div 
                        key={item.id} 
                        className={`scholarship-item ${item.isUrgent ? 'urgent-border' : ''}`}
                        whileHover={{ x: 5 }}
                    >
                        <div className="item-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <h4>{item.title}</h4>
                                {item.isUrgent && <span className="urgent-badge">Closing Soon</span>}
                            </div>
                            <div className="item-meta">
                                {item.urgencyStr} • ₹{item.amount?.toLocaleString()}
                            </div>
                        </div>
                        <Link to={`/scholarships/${item.id}`} className="mini-btn">
                            <ChevronRight size={16} />
                        </Link>
                    </motion.div>
                ))
            )}
          </div>
        </motion.div>

        {/* Action Center */}
        <motion.div className="section-card" variants={itemVariants}>
          <div className="section-header">
            <h3><TrendingUp size={18} /> Eligibility Insights</h3>
          </div>

          <div className="insight-card">
            <h4 className="font-semibold text-sm mb-2">Profile Integrity</h4>

            <div className="w-full rounded-full h-2 mb-2 bg-white/5 overflow-hidden">
              <motion.div 
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              ></motion.div>
            </div>

            <p className="text-xs text-text-muted">
                {completionRate}% Profile Match Readiness
            </p>
          </div>
          
          <div className="mt-6 flex flex-col gap-3">
              <Link to="/profile-builder" className="btn btn-secondary w-full text-sm text-center">Refine Eligibility Profile</Link>
              <Link to="/vault" className="btn btn-primary w-full text-sm text-center">Open Document Vault</Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
