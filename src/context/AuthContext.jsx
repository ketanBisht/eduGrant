import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize from localStorage if available, or null
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('edugrant_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Mock Login Function
    const login = async (role = 'student') => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockUser = {
            id: '1',
            name: role === 'admin' ? 'Admin User' : 'John Doe',
            email: role === 'admin' ? 'admin@edugrant.com' : 'student@edugrant.com',
            role: role, // 'student' or 'admin'
            profileCompleted: role === 'student' ? false : true
        };

        setUser(mockUser);
        localStorage.setItem('edugrant_user', JSON.stringify(mockUser));
        setLoading(false);

        // Redirect based on role
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('edugrant_user');
        navigate('/login');
    };

    const register = async (data) => {
        // Simulate registration
        await login('student');
    };

    const value = {
        user,
        login,
        logout,
        register,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
