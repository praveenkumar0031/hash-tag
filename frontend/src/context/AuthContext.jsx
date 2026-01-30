import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUserApi } from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const data = await getUserApi();
        setUser(data);
      } catch (err) {
        console.error("Not authenticated");
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, currentUserId: user?._id }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);