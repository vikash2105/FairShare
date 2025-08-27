import axios from "axios";

export const api = axios.create({
  // The deployed backend URL should be set via the VITE_API_BASE_URL environment variable.
  // We're removing the hardcoded fallback to prevent connecting to an old or incorrect instance.
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Set token in both localStorage + axios default headers
export function setToken(token) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
}

// Get token and reattach if page reloads
export function getToken() {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return token;
}
