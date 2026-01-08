import { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../utils/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email, password) => {
        try {
            setError('');
            const result = await createUserWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (err) {
            let errorMessage = 'Failed to create account';

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use';
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (err.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters';
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const login = async (email, password) => {
        try {
            setError('');
            const result = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: result.user };
        } catch (err) {
            let errorMessage = 'Failed to log in';

            if (err.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password';
            } else if (err.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (err.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            }

            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            setError('');
            await signOut(auth);
            return { success: true };
        } catch (err) {
            const errorMessage = 'Failed to log out';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const value = {
        user,
        loading,
        error,
        signup,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
