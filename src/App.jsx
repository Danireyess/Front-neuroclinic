import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { COLORES, DISPONIBILIDAD_DEFAULT, ESTADO_CANCELADA } from "./constantes";
import Home from "./vistas/Home";
import Login from "./vistas/Login";
import SeleccionPerfil from "./vistas/SeleccionPerfil";
import PortalPaciente from "./vistas/PortalPaciente";
import PortalProfesional from "./vistas/PortalProfesional";

export default function App() {
  const [profesionales, setProfesionales] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [sesion, setSesion] = useState(null);
  const [mostrandoLogin, setMostrandoLogin] = useState(false);

  useEffect(() => {
  const tokenGuardado = Cookies.get("token");
  const rolGuardado = Cookies.get("rol");
  const usuarioGuardado = Cookies.get("usuario");
  if (tokenGuardado && rolGuardado && usuarioGuardado) {
    const usuario = JSON.parse(usuarioGuardado);
    if (rolGuardado === "paciente") {
      setPacientes([usuario]);
    } else {
      setProfesionales([usuario]);
    }
    setSesion({ token: tokenGuardado, rol: rolGuardado, id: usuario.id });
  }
}, []);

  const manejarCerrarSesion = () => {
    Cookies.remove("token");
    Cookies.remove("rol");
    setSesion(null);
    setMostrandoLogin(false);
  };

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
      {sesion === null && !mostrandoLogin ? (
        <Home onIrALogin={() => setMostrandoLogin(true)} />
      ) : sesion === null ? (
      
      <Login
      onIngresar={(rolElegido, usuario) => {
        if (rolElegido === "paciente") {
          setPacientes([usuario]);
        } else {
          setProfesionales([usuario]);
        }
        setSesion({ rol: rolElegido, id: usuario.id });
        setMostrandoLogin(false);
      }}
      onVolverAlInicio={() => setMostrandoLogin(false)}
      
      />
      ) : usuarioActual == null ? (
        <SeleccionPerfil
          rol={sesion.rol}
          perfiles={sesion.rol === "paciente" ? pacientes : profesionales}
          onSeleccionar={(perfilId) => setSesion({ ...sesion, id: perfilId })}
          onCrear={(datosPerfil) => {
            const nuevoPerfil =
              sesion.rol === "paciente" ? agregarPaciente(datosPerfil) : agregarProfesional(datosPerfil);
            setSesion({ ...sesion, id: nuevoPerfil.id });
          }}
          onVolver={manejarCerrarSesion}
        />
      ) : (
        <div className="flex-1 flex" style={{ height: "100vh" }}>
          {sesion.rol === "paciente" ? (
            <PortalPaciente
              usuario={usuarioActual}
              profesionales={profesionales}
              citas={citas}
              agregarCita={agregarCita}
              cancelarCita={cancelarCita}
              actualizarPaciente={actualizarPaciente}
              onCerrarSesion={manejarCerrarSesion}
            />
          ) : (
            <PortalProfesional
              usuario={usuarioActual}
              pacientes={pacientes}
              agregarPaciente={agregarPaciente}
              actualizarProfesional={actualizarProfesional}
              citas={citas}
              agregarCita={agregarCita}
              actualizarEstado={actualizarEstado}
              onCerrarSesion={manejarCerrarSesion}
            />
          )}
        </div>
      )}
    </div>
  );
}
