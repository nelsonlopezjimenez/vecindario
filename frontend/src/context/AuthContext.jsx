import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,  setUser]  = useState(() => JSON.parse(localStorage.getItem('v_user')  || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('v_token') || null);

  const login = (userData, tok) => {
    setUser(userData); setToken(tok);
    localStorage.setItem('v_user',  JSON.stringify(userData));
    localStorage.setItem('v_token', tok);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('v_user');
    localStorage.removeItem('v_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);