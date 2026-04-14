import { motion } from "framer-motion";
import { FolderOpen, UploadCloud, FileText, ChevronRight, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Vault() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await axios.get('/api/students/profile');
      if (res.data.success) {
        setDocs(res.data.data.documents || []);
      }
    } catch (e) {
      console.error("Failed to fetch documents", e);
    } finally {
      setLoading(false);
    }
  };

  const REQUIRED_DOCS = [
    { key: 'ID_Proof', label: 'Identity Proof (Aadhar/PAN)' },
    { key: 'Marksheet', label: 'Last Academic Marksheet' },
    { key: 'Income', label: 'Income Certificate' }
  ];

  const uploadedTypes = docs.map(d => d.type);
  const completionCount = REQUIRED_DOCS.filter(r => uploadedTypes.includes(r.key)).length;
  const isVaultComplete = completionCount === REQUIRED_DOCS.length;

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
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="text-primary" /> Document Vault
          </h2>
          <p className="text-text-muted mt-2">Store and manage your scholarship application documents securely.</p>
        </div>
        {isVaultComplete && (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <ShieldCheck size={16} /> Vault Verified
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          {/* Vault Status Card */}
          <motion.div 
            className="section-card mt-6" 
            variants={itemVariants} 
            style={{ 
              background: isVaultComplete ? 'rgba(16, 185, 129, 0.03)' : 'rgba(255, 193, 7, 0.03)',
              border: `1px solid ${isVaultComplete ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 193, 7, 0.15)'}`
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {isVaultComplete ? <CheckCircle2 className="text-primary" /> : <AlertCircle className="text-amber-500" />}
                  Vault Completion Status
                </h3>
                <span className="text-sm font-bold" style={{ color: isVaultComplete ? 'var(--primary)' : '#f59e0b' }}>
                  {completionCount} / {REQUIRED_DOCS.length} Key Documents
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {REQUIRED_DOCS.map(req => {
                  const isUploaded = uploadedTypes.includes(req.key);
                  return (
                    <div key={req.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className={`p-2 rounded-lg ${isUploaded ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-text-muted'}`}>
                        {isUploaded ? <CheckCircle2 size={16} /> : <FileText size={16} />}
                      </div>
                      <span className={`text-sm font-medium ${isUploaded ? 'text-text-main' : 'text-text-muted'}`}>{req.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

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
            <div className="stat-value">{docs.length}</div>
          </div>
        </motion.div>
      </div>

      <motion.div className="section-card mt-8" variants={itemVariants}>
        <div className="section-header">
          <h3>Your Files</h3>
        </div>
        <div className="scholarship-list">
          {docs.length === 0 ? (
            <p className="empty-msg text-center text-text-muted py-8">Your vault is empty. Upload your first document to get started.</p>
          ) : (
            docs.map(doc => (
              <div key={doc.id} className="scholarship-item p-4 flex items-center justify-between border-b border-white/5 bg-white/5 mb-2 rounded-xl">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                       <FileText size={20} />
                    </div>
                    <div>
                       <h4 className="font-bold text-text-main capitalize">{doc.type.replace('_', ' ')}</h4>
                       <p className="text-xs text-text-muted">Uploaded on {new Date(doc.createdAt).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <a href={doc.url} target="_blank" rel="noreferrer" className="mini-btn text-primary">View</a>
                    {doc.isVerified && <ShieldCheck size={16} className="text-primary" title="Verified" />}
                 </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
    )}
    </motion.div>
  );
}
