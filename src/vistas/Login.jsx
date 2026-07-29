import { useState } from "react";
import axios from "axios";

export default function Login({ onIngresar, onVolverAlInicio }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("paciente");
  const [mensajeError, setMensajeError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarInicioSesion = async (evento) => {
    evento.preventDefault();
    setMensajeError("");

    if (!correo.trim() || !contrasena.trim()) {
      setMensajeError("Por favor completa todos los campos.");
      return;
    }

    setCargando(true);

    try {
      const endpoint =
        rolSeleccionado === "paciente"
          ? "/api/Auth/patientlogin"
          : "/api/Auth/doctorlogin";

      const respuesta = await axios.post(`http://localhost:5175${endpoint}`, {
        email: correo,
        password: contrasena,
      });

      const tokenRecibido = respuesta.data.token || respuesta.data.accessToken;

      onIngresar(rolSeleccionado, tokenRecibido);

    } catch (error) {
      if (error.response && error.response.data) {
        setMensajeError(
          error.response.data.mensaje ||
            error.response.data.message ||
            "Correo o contraseña incorrectos."
        );
      } else {
        setMensajeError("No se pudo conectar con el servidor. Revisa que tu backend esté corriendo.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        
        {onVolverAlInicio && (
          <button
            onClick={onVolverAlInicio}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1"
          >
            ← Volver al inicio
          </button>
        )}

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setRolSeleccionado("paciente")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              rolSeleccionado === "paciente"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Paciente
          </button>
          <button
            type="button"
            onClick={() => setRolSeleccionado("profesional")}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
              rolSeleccionado === "profesional"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Médico / Profesional
          </button>
        </div>

        {/* Mensaje de Error */}
        {mensajeError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200 text-center">
            {mensajeError}
          </div>
        )}

        {}
        <form onSubmit={manejarInicioSesion} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@correo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {cargando ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

      </div>
    </div>
  );
}