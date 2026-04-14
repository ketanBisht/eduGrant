import { motion } from "framer-motion";
import { FolderOpen, UploadCloud, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Vault() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
      style={{ padding: '2rem' }}
    >
      <div className="section-header">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen className="text-primary" /> Document Vault
        </h2>
        <p className="text-text-muted mt-2">Store and manage your scholarship application documents securely.</p>
      </div>

      <div className="stats-grid mt-6">
        <motion.div className="stat-card" variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', borderStyle: 'dashed', cursor: 'pointer' }}>
          <UploadCloud size={48} className="text-primary mb-4" />
          <h3 className="font-bold text-lg">Upload Document</h3>
          <p className="text-sm text-text-muted text-center mt-2">Support for PDF, JPG, PNG up to 5MB</p>
        </motion.div>

        <motion.div className="stat-card" variants={itemVariants}>
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
            <FileText size={24} />
          </div>
          <div className="stat-info">
            <h3>Documents Stored</h3>
            <div className="stat-value">0</div>
          </div>
        </motion.div>
      </div>

      <motion.div className="section-card mt-8" variants={itemVariants}>
        <div className="section-header">
          <h3>Your Files</h3>
        </div>
        <div className="scholarship-list">
          <p className="empty-msg text-center text-text-muted py-8">Your vault is empty. Upload your first document to get started.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
