import axios from "axios";
import Cookies from "js-cookie";

// 1. Instancia base con la URL de tu Backend
const clienteAxios = axios.create({
  baseURL: "http://localhost:5175", // Cambia por tu puerto real de Swagger
});

// 2. Interceptor: Antes de que salga CUALQUIER petición, le pega el token
clienteAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Lee la cookie que guardaste
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default clienteAxios;