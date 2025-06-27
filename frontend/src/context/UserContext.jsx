// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ⏳ Prevent flicker before checking token

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingUser(false);
      return;
    }

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("❌ Auto-login failed:", err.message);
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};
