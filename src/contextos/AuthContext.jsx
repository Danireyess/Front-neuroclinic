import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Variables fáciles de entender
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [revisandoToken, setRevisandoToken] = useState(true);

  useEffect(() => {
    const tokenGuardado = Cookies.get('token');
    
    if (tokenGuardado) {
      setSesionIniciada(true); 
    }
    
    setRevisandoToken(false); 
  }, []);

  const login = (nuevoToken) => {
    Cookies.set('token', nuevoToken, { expires: 1 }); 
    setSesionIniciada(true);
  };

  const logout = () => {
    Cookies.remove('token'); 
    setSesionIniciada(false);
  };

  return (
    <AuthContext.Provider value={{ sesionIniciada, login, logout, revisandoToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
