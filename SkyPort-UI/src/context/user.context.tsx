import {createContext, useContext, useState, ReactNode, useEffect } from "react";
import {getFromSecureStore} from "../utils/secureStore.util";
import {getUserByEmail, editUser as editUserApi} from '../api/user.api';

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

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    updateUser: (updates: { username: string }) => Promise<void>;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userDetails();
    }, []);

    const userDetails = async () => {
        try {
            setIsLoading(true);
            const email = await getFromSecureStore('userEmail');
            if (email) {
                const userData = await getUserByEmail(email);
                setUser(userData);
            }
            setIsLoading(false);
        } catch (error: any) {
            setError(error.message);
            setIsLoading(false);
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
        <UserContext.Provider value={{ user, isLoading, error, updateUser, refreshUser: userDetails }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}