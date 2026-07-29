import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Mantenemos el nombre estándar del contexto
const AuthContext = createContext();

// Mantenemos el nombre estándar del proveedor
export const AuthProvider = ({ children }) => {
  // Variables fáciles de entender
  const [sesionIniciada, setSesionIniciada] = useState(false);
  const [revisandoToken, setRevisandoToken] = useState(true);

  // Al abrir la app, revisamos si hay token
  useEffect(() => {
    const tokenGuardado = Cookies.get('token');
    
    if (tokenGuardado) {
      setSesionIniciada(true); 
    }
    
    setRevisandoToken(false); 
  }, []);

  // Función para hacer login
  const login = (nuevoToken) => {
    Cookies.set('token', nuevoToken, { expires: 1 }); // Guarda cookie por 1 día
    setSesionIniciada(true);
  };

  // Función para salir
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

// Hook con nombre estándar
export const useAuth = () => {
  return useContext(AuthContext);
};