import { createContext, useContext, useEffect, useState } from "react";
import api from "../API/api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/v1/auth/refresh-token");

        const newToken = res.data?.newAccessToken;

        if (!res.data?.success || !newToken) {
          setUser(null);
          setToken(null);
          setIsLoggedin(false);
          return;
        }

        const userRes = await api.get("/api/v1/auth/profile", {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });

        const currentUser = userRes.data?.user;

        if (!currentUser) {
          setUser(null);
          setToken(null);
          setIsLoggedin(false);
          return;
        }

        setToken(newToken);
        setUser(currentUser);
        setIsLoggedin(true);
      } catch (error) {
        setUser(null);
        setToken(null);
        setIsLoggedin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setIsLoggedin(true);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedin(false);
  };

  const value = {
    user,
    token,
    isLoggedin,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthProvider;
