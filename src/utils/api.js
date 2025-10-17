import axios from "axios";

export const API_BASE = "http://44.220.134.112/api";
// export const API_BASE = "http://127.0.0.1:8080";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;
