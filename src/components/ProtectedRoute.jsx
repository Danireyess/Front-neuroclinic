import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext'; 

// Mantenemos el nombre del componente
const ProtectedRoute = ({ rutaDeRegreso = '/login', children }) => {
  // Usamos nuestras variables fáciles de entender
  const { sesionIniciada, revisandoToken } = useAuth();

  if (revisandoToken) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Revisando permisos...</div>; 
  }

  // Si no hay sesión, lo regresamos
  if (!sesionIniciada) {
    return <Navigate to={rutaDeRegreso} replace />;
  }

  // Si tiene sesión, pasa
  return children ? children : <Outlet />;
};

export default ProtectedRoute;