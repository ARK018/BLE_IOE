import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Student API calls
export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  create: (student) => api.post('/students', student),
  update: (id, student) => api.put(`/students/${id}`, student),
  delete: (id) => api.delete(`/students/${id}`),
};

// Teacher API calls
export const teacherAPI = {
  getAll: () => api.get('/teachers'),
  getById: (id) => api.get(`/teachers/${id}`),
  create: (teacher) => api.post('/teachers', teacher),
  update: (id, teacher) => api.put(`/teachers/${id}`, teacher),
  delete: (id) => api.delete(`/teachers/${id}`),
};

// Attendance API calls
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  markAttendance: (devices) => api.post('/attendance', { devices }),
  startAttendance: (scanTime = 5) => api.post('/start-attendance', { scanTime }),
};

export default api;
