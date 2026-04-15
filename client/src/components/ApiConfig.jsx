import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupApiInterceptors } from '../api';

/**
 * ApiConfig Component
 * 
 * This component acts as a bridge between Clerk's authentication state
 * and our global Axios instance. It must be rendered inside <ClerkProvider>.
 */
export default function ApiConfig({ children }) {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const initialized = useRef(false);

    useEffect(() => {
        // We only want to set up the interceptors once.
        // Even if the user is not signed in, the interceptor will just see no token.
        // But typically we do this when the app starts.
        if (isLoaded && !initialized.current) {
            setupApiInterceptors(getToken);
            initialized.current = true;
            console.log("EduGrant API Interceptors Initialized 🚀");
        }
    }, [isLoaded, getToken]);

    return children;
}
