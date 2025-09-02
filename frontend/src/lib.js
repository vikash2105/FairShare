import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api",
});

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

export function getToken() {
  const t = localStorage.getItem("token");
  if (t) api.defaults.headers.common["Authorization"] = "Bearer " + t;
  return t;
}

api.interceptors.response.use(r=>r, err=>{
  if (err?.response?.status === 401) {
    setToken(null);
    window.location.href = "/signin";
  }
  return Promise.reject(err);
});
