import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const BASE = "/api/vehicle-service/vehicle";

export const getAllVehicles = () => api.get(BASE).then((r) => r.data);
export const getVehicleById = (id) => api.get(`${BASE}/${id}`).then((r) => r.data);
export const getVehicleInfo = (id) => api.get(`${BASE}/${id}/info`).then((r) => r.data);
export const getVehicleOwner = (id) => api.get(`${BASE}/${id}/owner`).then((r) => r.data);
export const getVehicleRegistration = (id) => api.get(`${BASE}/${id}/registration`).then((r) => r.data);
export const getVehicleInsurance = (id) => api.get(`${BASE}/${id}/insurance`).then((r) => r.data);
export const createVehicle = (data) => api.post(BASE, data).then((r) => r.data);
export const updateVehicle = (id, data) => api.put(`${BASE}/${id}`, data).then((r) => r.data);
export const deleteVehicle = (id) => api.delete(`${BASE}/${id}`).then((r) => r.data);

export default api;
