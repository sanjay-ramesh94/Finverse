import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://finverse-6juf.onrender.com",
  withCredentials: true,
});

export default API;
