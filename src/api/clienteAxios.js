import axios from "axios";
import Cookies from "js-cookie";

const clienteAxios = axios.create({
  baseURL: "http://localhost:5175", 
});

clienteAxios.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default clienteAxios;
