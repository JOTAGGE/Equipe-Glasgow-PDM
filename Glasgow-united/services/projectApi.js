// services/projectApi.js
import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.manifest?.extra?.apiBaseUrl || 'https://equipe-glasgow-pdm.onrender.com';

console.log("FRONTEND DEBUG - [projectApi] Módulo carregado. API_BASE_URL configurada:", API_BASE_URL);

const projectApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  getAll: async () => {
    try {
      console.log("FRONTEND DEBUG - [projectApi] Chamando GET para /projects. Axios BaseURL:", projectApiInstance.defaults.baseURL);
      const response = await projectApiInstance.get('/projects'); 
      console.log("FRONTEND DEBUG - [projectApi] Resposta de getAll() - Status:", response.status, "Dados recebidos:", response.data);
      return response.data; 
    } catch (error) {
      console.error("FRONTEND DEBUG - [projectApi] Erro em getAll:", error.message, "Status do erro (se houver):", error.response?.status, "Dados do erro (se houver):", error.response?.data, "Objeto de requisição:", error.request);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      console.log(`FRONTEND DEBUG - [projectApi] Chamando GET para /projects/${id}. Axios BaseURL:`, projectApiInstance.defaults.baseURL);
      const response = await projectApiInstance.get(`/projects/${id}`); 
      console.log(`FRONTEND DEBUG - [projectApi] Resposta de getById(${id}) - Status:`, response.status, "Dados recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`FRONTEND DEBUG - [projectApi] Erro em getById(${id}):`, error.message, "Status do erro (se houver):", error.response?.status, "Dados do erro (se houver):", error.response?.data, "Objeto de requisição:", error.request);
      throw error;
    }
  },
};
