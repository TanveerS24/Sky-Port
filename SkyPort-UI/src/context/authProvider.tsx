import {createContext, useContext, useState, ReactNode, useEffect } from "react";
import {getFromSecureStore} from "../utils/secureStore.util";
import { login as loginApi, register as registerApi, logout as logoutApi } from "../api/auth.api";
import { router } from 'expo-router';

type AuthContextType = {
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
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
            const token = await getFromSecureStore('accessToken');
            setIsAuthenticated(!!token);
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
            router.replace('/(auth)/login');
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, error, login, register, logout }}>
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