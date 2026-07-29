import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contextos/AuthContext";

import { COLORES, DISPONIBILIDAD_DEFAULT, ESTADO_CANCELADA } from "./constantes";
import Home from "./vistas/Home";
import Login from "./vistas/Login";
import SeleccionPerfil from "./vistas/SeleccionPerfil";
import PortalPaciente from "./vistas/PortalPaciente";
import PortalProfesional from "./vistas/PortalProfesional";

export default function App() {
  const navigate = useNavigate(); 
  const { login, logout } = useAuth();

  // TUS ESTADOS ORIGINALES
  const [profesionales, setProfesionales] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [sesion, setSesion] = useState(null); 

  // TUS FUNCIONES ORIGINALES (agregarPaciente, etc...)
  const agregarPaciente = (datosPaciente) => {
    const nuevoPaciente = { ...datosPaciente, id: Date.now() };
    setPacientes((listaAnterior) => [...listaAnterior, nuevoPaciente]);
    return nuevoPaciente;
  };

  const actualizarPaciente = (pacienteId, datosActualizados) =>
    setPacientes((listaAnterior) =>
      listaAnterior.map((paciente) =>
        paciente.id === pacienteId ? { ...paciente, ...datosActualizados } : paciente
      )
    );

  const agregarProfesional = (datosProfesional) => {
    const nuevoProfesional = {
      dias: [...DISPONIBILIDAD_DEFAULT.dias],
      horarios: [...DISPONIBILIDAD_DEFAULT.horarios],
      ...datosProfesional,
      id: Date.now(),
    };
    setProfesionales((listaAnterior) => [...listaAnterior, nuevoProfesional]);
    return nuevoProfesional;
  };

  const actualizarProfesional = (profesionalId, datosActualizados) =>
    setProfesionales((listaAnterior) =>
      listaAnterior.map((profesional) =>
        profesional.id === profesionalId ? { ...profesional, ...datosActualizados } : profesional
      )
    );

  const agregarCita = (datosCita) =>
    setCitas((listaAnterior) => [...listaAnterior, { ...datosCita, id: Date.now() }]);

  const cancelarCita = (citaId) =>
    setCitas((listaAnterior) =>
      listaAnterior.map((cita) =>
        cita.id === citaId ? { ...cita, appointmentStateId: ESTADO_CANCELADA } : cita
      )
    );

  const actualizarEstado = (citaId, nuevoEstadoId) =>
    setCitas((listaAnterior) =>
      listaAnterior.map((cita) =>
        cita.id === citaId ? { ...cita, appointmentStateId: nuevoEstadoId } : cita
      )
    );

  const usuarioActual =
    sesion?.id != null
      ? (sesion.rol === "paciente" ? pacientes : profesionales).find(
          (perfil) => perfil.id === sesion.id
        )
      : null;

  return (
    <div className="nc-root min-h-screen flex flex-col" style={{ background: COLORES.fondo }}>
      <Routes>
        
        {}
        <Route path="/" element={<Home onIrALogin={() => navigate('/login')} />} />
        
        <Route 
          path="/login" 
          element={
            <Login
              onIngresar={(rolElegido, tokenFalso = "token123") => {
                setSesion({ rol: rolElegido, id: null });
                login(tokenFalso);
                navigate('/seleccion-perfil');
              }}
              onVolverAlInicio={() => navigate('/')}
            />
          } 
        />

        {}
        <Route element={<ProtectedRoute />}>
          
          <Route 
            path="/seleccion-perfil" 
            element={
              <SeleccionPerfil
                rol={sesion?.rol}
                perfiles={sesion?.rol === "paciente" ? pacientes : profesionales}
                onSeleccionar={(perfilId) => {
                  setSesion({ ...sesion, id: perfilId });
                  navigate(sesion?.rol === "paciente" ? '/portal-paciente' : '/portal-profesional');
                }}
                onCrear={(datosPerfil) => {
                  const nuevoPerfil = sesion?.rol === "paciente" ? agregarPaciente(datosPerfil) : agregarProfesional(datosPerfil);
                  setSesion({ ...sesion, id: nuevoPerfil.id });
                  navigate(sesion?.rol === "paciente" ? '/portal-paciente' : '/portal-profesional');
                }}
                onVolver={() => {
                  setSesion(null);
                  logout(); 
                  navigate('/login');
                }}
              />
            } 
          />

          <Route 
            path="/portal-paciente" 
            element={
              <div className="flex-1 flex" style={{ height: "100vh" }}>
                <PortalPaciente
                  usuario={usuarioActual}
                  profesionales={profesionales}
                  citas={citas}
                  agregarCita={agregarCita}
                  cancelarCita={cancelarCita}
                  actualizarPaciente={actualizarPaciente}
                  onCerrarSesion={() => {
                    setSesion(null);
                    logout(); 
                    navigate('/login');
                  }}
                />
              </div>
            } 
          />

          <Route 
            path="/portal-profesional" 
            element={
              <div className="flex-1 flex" style={{ height: "100vh" }}>
                <PortalProfesional
                  usuario={usuarioActual}
                  pacientes={pacientes}
                  agregarPaciente={agregarPaciente}
                  actualizarProfesional={actualizarProfesional}
                  citas={citas}
                  agregarCita={agregarCita}
                  actualizarEstado={actualizarEstado}
                  onCerrarSesion={() => {
                    setSesion(null);
                    logout(); 
                    navigate('/login');
                  }}
                />
              </div>
            } 
          />
        </Route>

      </Routes>
    </div>
  );
}
