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
    { label: "Matches Found", value: "0", icon: Zap, path: "/scholarships?view=matches", isClickable: true },
    { label: "Saved", value: "0", icon: Bookmark, path: "/scholarships?view=saved", isClickable: true },
    { label: "Closing Soon", value: "0", icon: Clock, path: "/scholarships?view=urgent", isClickable: true },
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
            recommendationsList = recs.slice(0, 4);
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
            { label: "Matches Found", value: totalMatches, icon: Zap, path: "/scholarships?view=matches", isClickable: true },
            { label: "Saved", value: savedList.length.toString(), icon: Bookmark, path: "/scholarships?view=saved", isClickable: true },
            { label: "Closing Soon", value: urgentCount, icon: Clock, path: "/scholarships?view=urgent", isClickable: true },
        ]);

    } catch (e) {
        console.error("Dashboard data fetch error:", e);
    } finally {
        setLoading(false);
    }
  };

  const handleUnsave = async (e, scholarshipId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
        await axios.delete(`/api/saved/${scholarshipId}`);
        // Optimistically remove from state
        setSavedScholarships(prev => {
            const updated = prev.filter(s => s.id !== scholarshipId);
            // Update stats
            setStats(currStats => {
                const newStats = [...currStats];
                newStats[1].value = updated.length.toString();
                newStats[2].value = updated.filter(s => s.isUrgent).length.toString();
                return newStats;
            });
            return updated;
        });
    } catch (e) {
        console.error("Failed to unsave scholarship:", e);
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
            <h2>My Dashboard</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    color: 'var(--primary)', 
                    padding: '4px 10px', 
                    borderRadius: '100px', 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                }}>
                    Official Verified Profile
                </span>
            </div>
            <p style={{ maxWidth: '600px', opacity: 0.9 }}>
                {completionRate < 100 
                    ? `Your profile is ${completionRate}% complete. Fill in your details to unlock personalized scholarship matches tailored to you.`
                    : "Your profile is fully verified and our smart engine is finding the best matches for you."}
            </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const isMatchCard = stat.label === "Matches Found";
          const hasMatches = parseInt(stat.value) > 0;
          
          const content = (
            <motion.div 
              className={`stat-card ${stat.isClickable ? 'clickable' : ''} ${isMatchCard && hasMatches ? 'match-active' : ''}`}
              variants={itemVariants}
              whileHover={stat.isClickable ? { y: -8 } : {}}
            >
              <div className="stat-icon" style={isMatchCard && hasMatches ? { background: 'rgba(16, 185, 129, 0.2)' } : {}}>
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.label}</h3>
                <div className="stat-value" style={isMatchCard && hasMatches ? { color: 'var(--primary)' } : {}}>{stat.value}</div>
              </div>
              {stat.isClickable && (
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem' }}>
                    <ChevronRight size={16} className="text-text-muted opacity-50" />
                </div>
              )}
            </motion.div>
          );

          return stat.path ? (
            <Link key={index} to={stat.path} style={{ textDecoration: 'none' }}>
              {content}
            </Link>
          ) : (
            <div key={index}>{content}</div>
          );
        })}
      </div>

      {/* Dashboard Content Grid */}
      <div className="dashboard-grid">
        {/* Recommended Scholarships */}
        <motion.div className="section-card" variants={itemVariants}>
          <div className="section-header">
            <h3><Zap size={18} className="text-emerald-500" /> Smart Recommendations</h3>
            <Link to="/scholarships?view=matches" className="view-all">
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
            <Link to="/scholarships?view=saved" className="view-all">
              View All
            </Link>
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
                        <div className="item-info" style={{ minWidth: 0, paddingRight: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                <h4 style={{ margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {item.title}
                                </h4>
                                {item.isUrgent && <span className="urgent-badge shrink-0" style={{ whiteSpace: 'nowrap' }}>Closing Soon</span>}
                            </div>
                            <div className="item-meta">
                                {item.urgencyStr} • ₹{item.amount?.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button 
                                onClick={(e) => handleUnsave(e, item.id)}
                                className="mini-btn hover:text-red-500 hover:bg-red-500/10"
                                title="Remove from saved"
                            >
                                <Bookmark size={16} fill="currentColor" className="text-primary hover:text-red-500 transition-colors" />
                            </button>
                            <Link to={`/scholarships/${item.id}`} className="mini-btn">
                                <ChevronRight size={16} />
                            </Link>
                        </div>
                    </motion.div>
                ))
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
