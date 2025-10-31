// src/utils/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api'; // Update to your backend URL

// Optionally create an Axios instance for cleaner config
const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // Set true if you want cookies sent with requests
  // You can add default headers if needed
});

// Hook to set Authorization token on each request (if using JWT auth)
export function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // remove auth header when token is falsy
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// --- Appointment API Calls ---
export function getAppointments() {
  return apiClient.get('/appointments');
}

export function createAppointment(data) {
  return apiClient.post('/appointments', data);
}

export function updateAppointment(id, data) {
  return apiClient.put(`/appointments/${id}`, data);
}

export function deleteAppointment(id) {
  return apiClient.delete(`/appointments/${id}`);
}

// --- Doctor API Calls ---
export function getDoctors() {
  return apiClient.get('/appointments/doctors');
}

// --- Auth API Calls ---
export function loginUser(data) {
  return apiClient.post('/auth/login', data);
}

export function registerUser(data) {
  return apiClient.post('/auth/register', data);
}

// ...add more functions as needed (patients, reports, etc.)
