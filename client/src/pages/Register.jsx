import { SignUp } from "@clerk/clerk-react";

export default function Register() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <SignUp
        path="/register"
        routing="path"
        signInUrl="/login"
        fallbackRedirectUrl="/"
      />
    </div>
  );
}


// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
// import '../styles/Auth.css';

// export default function Register() {
//     const { register, loading } = useAuth();
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await register({ name, email, password });
//     };

//     return (
//         <div className="auth-page">
//             <div className="auth-card">
//                 <div className="auth-header">
//                     <h2>Create Account</h2>
//                     <p>Join EduGrant today</p>
//                 </div>

//                 <div className="auth-body">
//                     <form onSubmit={handleSubmit}>
//                         <div className="form-group">
//                             <label className="form-label">Full Name</label>
//                             <div className="input-wrapper">
//                                 <User className="input-icon" size={18} />
//                                 <input
//                                     type="text"
//                                     required
//                                     value={name}
//                                     onChange={(e) => setName(e.target.value)}
//                                     className="form-input"
//                                     placeholder="John Doe"
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Email Address</label>
//                             <div className="input-wrapper">
//                                 <Mail className="input-icon" size={18} />
//                                 <input
//                                     type="email"
//                                     required
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     className="form-input"
//                                     placeholder="you@example.com"
//                                 />
//                             </div>
//                         </div>

//                         <div className="form-group">
//                             <label className="form-label">Password</label>
//                             <div className="input-wrapper">
//                                 <Lock className="input-icon" size={18} />
//                                 <input
//                                     type="password"
//                                     required
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="form-input"
//                                     placeholder="••••••••"
//                                 />
//                             </div>
//                         </div>

//                         <button type="submit" disabled={loading} className="btn btn-primary submit-btn">
//                             {loading ? (
//                                 <>
//                                     <Loader2 size={20} className="animate-spin" />
//                                     Creating Account...
//                                 </>
//                             ) : (
//                                 <>
//                                     Sign Up <ArrowRight size={18} />
//                                 </>
//                             )}
//                         </button>
//                     </form>

//                     <div className="auth-footer">
//                         Already have an account?{' '}
//                         <Link to="/login" className="auth-link">
//                             Sign In
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
