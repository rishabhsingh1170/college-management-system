import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically adds the JWT to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Globally handles errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the response is a 401 (Unauthorized), redirect to the login page
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Force a redirect
    }
    return Promise.reject(error);
  }
);

export const getRequest = (url, config = {}) => api.get(url, config);

export const postRequest = (url, data, config = {}) =>
  api.post(url, data, config);

export const putRequest = (url, data, config = {}) =>
  api.put(url, data, config);

export const deleteRequest = (url, config = {}) => api.delete(url, config);

export default api;
