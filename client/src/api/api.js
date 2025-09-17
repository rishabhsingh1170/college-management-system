import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getRequest = (url, config = {}) => api.get(url, config);

export const postRequest = (url, data, config = {}) =>
  api.post(url, data, config);

export const putRequest = (url, data, config = {}) =>
  api.put(url, data, config);

export const deleteRequest = (url, config = {}) => api.delete(url, config);

export default api;
