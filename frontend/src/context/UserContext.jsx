import React, { useState, useEffect, createContext } from 'react';

export const AuthContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user){
            setUser(user);
        }
    }, []);

    useEffect(() => {
        if (user !== null){
            localStorage.setItem('user', user);
        } else {
            localStorage.removeItem('user');
        }

    }, [user]);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    );
}