// services/teamMemberApi.js
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.manifest?.extra?.apiBaseUrl || 'https://equipe-glasgow-pdm.onrender.com';

console.log("FRONTEND DEBUG - [teamMemberApi] Módulo carregado. API_BASE_URL configurada:", API_BASE_URL);

const teamMemberApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const teamMemberApi = {
  getAll: async () => {
    try {
      const response = await teamMemberApiInstance.get('/team-members');
      return response.data;
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em getAll:", error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await teamMemberApiInstance.get(`/team-members/${id}`);
      return response.data;
    } catch (error) {
      console.error(`FRONTEND DEBUG - [teamMemberApi] ERRO em getById(${id}):`, error.message);
      throw error;
    }
  },

  create: async (memberData) => {
    try {
      const response = await teamMemberApiInstance.post('/team-members', memberData);
      return response.data;
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em create:", error.message);
      throw error;
    }
  },

  update: async (memberData) => {
    try {
      const response = await teamMemberApiInstance.put(`/team-members/${memberData.id}`, memberData);
      return response.data;
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em update:", error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await teamMemberApiInstance.delete(`/team-members/${id}`);
      return true;
    } catch (error) {
      console.error(`FRONTEND DEBUG - [teamMemberApi] ERRO em delete(${id}):`, error.message);
      throw error;
    }
  },
};
