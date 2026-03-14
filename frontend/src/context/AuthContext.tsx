'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (details: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await fetchAPI('/auth/profile');
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to fetch profile', err);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials: any) => {
        const data = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        localStorage.setItem('token', data.access_token);
        // data usually contains user info too, but we can fetch profile for safety
        const userData = await fetchAPI('/auth/profile');
        setUser(userData);
        
        // Match legacy localStorage for compatibility if needed
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userAvatar', userData.avatar || '🦇');
    };

    const register = async (details: any) => {
        const data = await fetchAPI('/auth/register', {
            method: 'POST',
            body: JSON.stringify(details),
        });
        // Auto login after register if backend supports it or just redirect to login
        // Assuming backend returns token or we just login them manually
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            const userData = await fetchAPI('/auth/profile');
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userAvatar');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
