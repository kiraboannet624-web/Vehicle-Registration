import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const CREDENTIALS = { email: "test@gmail.com", password: "Password!234" };

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("auth")
  );

  const login = (email, password) => {
    if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
      localStorage.setItem("auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
