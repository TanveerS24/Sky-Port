import {createContext, useContext, useState, ReactNode, useEffect } from "react";
import {getFromSecureStore, saveToSecureStore} from "../utils/secureStore.util";
import { login as loginApi, register as registerApi, logout as logoutApi, getUserByEmail, refreshAccessToken, editUser as editUserApi } from "../api/auth.api";
import { router } from 'expo-router';

type User = {
    _id: string;
    username: string;
    email: string;
    emailHash: string;
    devices: any[];
    isActive: boolean;
    authUserId: string;
    createdAt: string;
    updatedAt: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: { username: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null); //eliminates the problem of prop drilling

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

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
                // Fetch user data if we have the email
                if (userEmail) {
                    try {
                        const userData = await getUserByEmail(userEmail);
                        setUser(userData);
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    }
                }
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
            
            // Fetch user data
            const userData = await getUserByEmail(email);
            setUser(userData);
            
            setIsAuthenticated(true);
            router.replace('/(app)/home');
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
            setUser(null);
            router.replace('/(auth)/login');
        }
    };

    const updateUser = async (updates: { username: string }) => {
        try {
            if (!user) {
                throw new Error('No user logged in');
            }
            setError(null);
            const updatedUser = await editUserApi(user._id, updates);
            setUser(updatedUser);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'An error occurred while updating user';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, error, user, login, register, logout, updateUser }}>
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