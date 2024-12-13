import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Replace with your backend URL

export const getClasses = (page = 1, limit = 10, filter = '', sortBy = '') => {
  const params = new URLSearchParams({ page, limit, filter, sortBy });
  return axios.get(`${API_BASE_URL}/classes?${params.toString()}`);
};

export const addClass = (classData) => {
  return axios.post(`${API_BASE_URL}/classes`, classData);
};

export const getClass = (classId) => {
  return axios.get(`${API_BASE_URL}/classes/${classId}`);
};

export const updateClass = (classId, classData) => {
  return axios.put(`${API_BASE_URL}/classes/${classId}`, classData);
};

export const deleteClass = (classId) => {
  return axios.delete(`${API_BASE_URL}/classes/${classId}`);
};

export const getTeachers = (page = 1, limit = 10, filter = '', sortBy = '') => {
  const params = new URLSearchParams({ page, limit, filter, sortBy });
  return axios.get(`${API_BASE_URL}/teachers?${params.toString()}`);
};

export const addTeacher = (teacherData) => {
  return axios.post(`${API_BASE_URL}/teachers`, teacherData); // Corrected URL
};

export const getTeacher = (teacherId) => {
  return axios.get(`${API_BASE_URL}/teachers/${teacherId}`);
};

export const updateTeacher = (teacherId, teacherData) => {
  return axios.put(`${API_BASE_URL}/teachers/${teacherId}`, teacherData);
};

export const deleteTeacher = (teacherId) => {
  return axios.delete(`${API_BASE_URL}/teachers/${teacherId}`);
};

export const getStudents = (page = 1, limit = 10, filter = '', sortBy = '') => {
  const params = new URLSearchParams({ page, limit, filter, sortBy, includeClass: true });
  return axios.get(`${API_BASE_URL}/students?${params.toString()}`);
};

export const addStudent = (studentData) => {
  return axios.post(`${API_BASE_URL}/students`, studentData);
};

export const getStudent = (studentId) => {
  return axios.get(`${API_BASE_URL}/students/${studentId}`);
};

export const updateStudent = (studentId, studentData) => {
  return axios.put(`${API_BASE_URL}/students/${studentId}`, studentData);
};

export const deleteStudent = (studentId) => {
  return axios.delete(`${API_BASE_URL}/students/${studentId}`);
};

export const assignStudentToClass = (studentId, classId) => {
  return axios.post(
    `${API_BASE_URL}/students/${studentId}/assign-class`,
    { classId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const unassignStudentFromClass = (studentId) => {
  return axios.post(
    `${API_BASE_URL}/students/${studentId}/unassign-class`,
    {}, // Send empty body with POST request
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};

export const getClassAnalytics = (classId) => {
  return axios.get(`${API_BASE_URL}/analytics/class/${classId}`);
};

export const getFinancialAnalytics = (type, year, month) => {
  const params = new URLSearchParams({ type, year, month });
  return axios.get(`${API_BASE_URL}/analytics/financials?${params.toString()}`);
};
