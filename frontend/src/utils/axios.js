import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://finverse-6juf.onrender.com",
  withCredentials: true,
});

export default API;
