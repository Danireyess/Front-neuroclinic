import Cookies from 'js-cookie';

const API_URL = import.meta.env?.VITE_API_URL || "";
const RUTA_CITAS = "/api/Appointment";

function obtenerCabeceras(cabecerasExtra = {}) {
  const token = Cookies.get('token'); 
  const headers = { ...cabecerasExtra };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

function Get(url, params = {}, headers = {}) {
  const queryString = new URLSearchParams(params).toString();
  const urlCompleta = queryString ? `${url}?${queryString}` : url;
  
  return fetch(urlCompleta, { 
    method: "GET", 
    headers: obtenerCabeceras(headers) 
  });
}

function Post(url, body = {}, headers = {}) {
  const cabecerasCompletas = obtenerCabeceras({ 
    "Content-Type": "application/json", 
    ...headers 
  });

  return fetch(url, {
    method: "POST",
    headers: cabecerasCompletas,
    body: JSON.stringify(body),
  });
}

export async function obtenerCitasPorFecha(fechaIso) {
  if (!API_URL) return [];
  const respuesta = await Get(`${API_URL}${RUTA_CITAS}`, { date: fechaIso });
  if (!respuesta.ok) throw new Error("No se pudieron cargar los horarios");
  const citas = await respuesta.json();
  if (!Array.isArray(citas)) return [];
  return citas.filter(
    (cita) => typeof cita?.start_date === "string" && cita.start_date.startsWith(fechaIso)
  );
}

export async function crearCita(datosCita) {
  if (!API_URL) return { ...datosCita, simulada: true };
  const respuesta = await Post(`${API_URL}${RUTA_CITAS}`, datosCita);
  if (!respuesta.ok) throw new Error("No se pudo agendar la cita");
  return respuesta.json();
}

export async function iniciarSesion(rol, email, password) {
  const ruta = rol === "paciente"
    ? "/api/Auth/patientlogin"
    : "/api/Auth/doctorlogin";

  const respuesta = await Post(`${API_URL}${ruta}`, { email, password });

  if (!respuesta.ok) throw new Error("Correo o contraseña incorrectos");

  return respuesta.json();
}
