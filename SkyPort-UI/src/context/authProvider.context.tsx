import {createContext, useContext, useState, ReactNode, useEffect } from "react";
import {getFromSecureStore, saveToSecureStore} from "../utils/secureStore.util";
import { login as loginApi, 
    register as registerApi, 
    logout as logoutApi, 
    isVerified, 
    refreshAccessToken,
    sendVerificationOTP,
    verifyEmail
 } from "../api/auth.api";
import { router } from 'expo-router';



type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    verifiedStatus: (email: string) => Promise<boolean>;
    sendOTP?: (email: string) => Promise<void>;
    verifyEmailOTP?: (email: string, otp: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null); //eliminates the problem of prop drilling

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            let token = await getFromSecureStore('accessToken');
            const refreshToken = await getFromSecureStore('refreshToken');
            const userEmail = await getFromSecureStore('userEmail');
            
            // If no accessToken but have refreshToken, try to get new accessToken
            if (!token && refreshToken) {
                try {
                    console.log('No access token, attempting to refresh...');
                    token = await refreshAccessToken();
                    console.log('Access token refreshed successfully');
                } catch (error) {
                    console.error('Failed to refresh access token:', error);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }
            }
            
            if (token) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            await loginApi(email, password);
            
            // Store email for future user data fetching
            await saveToSecureStore('userEmail', email);
            
            setIsAuthenticated(true);
            // Navigation will be handled by the layout based on usertype from UserProvider
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred during login';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            await registerApi(username, email, password);
            router.replace('/(auth)/login');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred during registration';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setError(null);
            await logoutApi();
        } catch (err: any) {
            console.log('Logout error, but continuing with local logout');
        } finally {
            // Always update state and navigate, regardless of API success
            setIsAuthenticated(false);
            router.replace('/(auth)/login');
        }
    };

    const verifiedStatus = async (email: string) => {
        try {
            setError(null);
            const verified = await isVerified(email);
            return verified;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred while checking verification status';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const sendOTP = async (email: string) => {
        try {
            setError(null);
            await sendVerificationOTP(email);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred while sending OTP';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const verifyEmailOTP = async (email: string, otp: string) => {
        try {
            setError(null);
            await verifyEmail(email, otp);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred while verifying email';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, error, login, register, logout, verifiedStatus, sendOTP, verifyEmailOTP }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}