import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    setIsLoggedin(true);
  }

  const value = {
    user,
    token,
    isLoggedin,
    login,
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
