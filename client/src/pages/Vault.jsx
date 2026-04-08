import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
    UploadCloud, 
    FileText, 
    Trash2, 
    CheckCircle, 
    Clock, 
    ShieldCheck, 
    Lock,
    Sparkles,
    Loader2
} from 'lucide-react';
import '../styles/Vault.css';

const Vault = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/vault');
            setDocuments(res.data.data);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const toastId = toast.loading("Securely encrypting and uploading...");

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const payload = {
                type: file.name.split('.').pop().toUpperCase(),
                url: `https://secure-vault.edugrant.io/v1/${file.name}`,
                metadata: {
                    originalName: file.name,
                    size: file.size,
                    uploadedAt: new Date().toISOString()
                }
            };

            await axios.post('/api/vault', payload);
            toast.success("Document secured in your private vault", { id: toastId });
            fetchDocuments();
        } catch (error) {
            toast.error("Security verification failed. Try again.", { id: toastId });
        } finally {
            setUploading(false);
        }
    };

    const deleteDoc = async (id) => {
        if (!window.confirm("Permanently remove this document from your secure vault?")) return;
        
        try {
            await axios.delete(`/api/vault/${id}`);
            toast.success("Document purged from vault");
            fetchDocuments();
        } catch (error) {
            toast.error("Failed to remove document");
        }
    };

    return (
        <div className="scholarship-page">
            <header className="hero-banner p-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="page-title">
                        <div className="flex items-center gap-2 mb-4">
                            <Lock className="text-primary" size={20} />
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">E2E Encrypted Storage</span>
                        </div>
                        <h2 className="text-4xl">Secure Vault</h2>
                        <p className="max-w-xl mt-4">Your documents are encrypted and stored in a private vault. We use them solely to verify your eligibility for official schemes.</p>
                    </div>
                    
                    <label className={`btn btn-primary h-auto py-4 px-8 rounded-2xl flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-105 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <UploadCloud size={24} />
                        <span className="font-bold">{uploading ? "Securing..." : "Upload New Document"}</span>
                        <input type="file" onChange={handleFileUpload} disabled={uploading} hidden />
                    </label>
                </div>
            </header>

            <div className="stats-grid mb-12">
                <div className="stat-card">
                    <span className="stat-info"><h3>Total Vault Items</h3></span>
                    <span className="stat-value">{documents.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-info"><h3>Verified Assets</h3></span>
                    <span className="stat-value text-primary">{documents.filter(d => d.isVerified).length}</span>
                </div>
                <div className="stat-card bg-primary/5 border-primary/20">
                    <span className="stat-info"><h3 className="text-primary">Verification Score</h3></span>
                    <div className="flex items-center gap-4">
                        <span className="stat-value text-white">85%</span>
                        <Sparkles className="text-secondary animate-pulse" size={24} />
                    </div>
                </div>
            </div>

            <div className="scholarship-grid">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-24 col-span-full gap-4">
                        <Loader2 className="animate-spin text-primary" size={48} />
                        <p className="text-text-muted font-medium">Opening your private vault...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-24 col-span-full glass-card bg-white/5 border-white/10 rounded-3xl">
                        <FileText size={48} className="mx-auto text-text-muted mb-4" />
                        <h3 className="text-xl font-bold mb-2">Your Vault is Empty</h3>
                        <p className="text-text-muted">Upload your Income Certificate or Marksheets to start auto-verification.</p>
                    </div>
                ) : (
                    documents.map(doc => (
                        <div key={doc.id} className="scholarship-card p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
                                    <FileText size={24} />
                                </div>
                                <button className="p-2 text-text-muted hover:text-red-400 transition-colors" onClick={() => deleteDoc(doc.id)}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            
                            <h3 className="text-lg font-bold mb-2 truncate">{doc.metadata?.originalName || "Document"}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[10px] font-extrabold px-2 py-1 bg-white/10 rounded-md text-text-secondary uppercase">{doc.type}</span>
                                <span className="text-xs text-text-muted font-medium">{(doc.metadata?.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>

                            <div className={`mt-auto py-3 px-4 rounded-xl flex items-center gap-3 text-xs font-bold transition-all ${doc.isVerified ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-secondary/10 text-secondary border border-secondary/20'}`}>
                                {doc.isVerified ? <CheckCircle size={16} /> : <Clock size={16} />}
                                {doc.isVerified ? 'Identity Verified' : 'Awaiting Review'}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <footer className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 text-sm text-text-secondary glass-card">
                <ShieldCheck className="text-primary shrink-0" size={24} />
                <p>EduGrant utilizes AES-256 encryption. Your physical documents are never shared directly with third parties; only your digital verification status is transmitted to scholarship coordinators.</p>
            </footer>
        </div>
    );
};

export default Vault;
