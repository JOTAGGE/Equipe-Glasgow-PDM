import axios from 'axios';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.manifest?.extra?.apiBaseUrl || 'https://equipe-glasgow-pdm.onrender.com';

console.log("FRONTEND DEBUG - [taskApi] Módulo carregado. API_BASE_URL configurada:", API_BASE_URL);

const taskApiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskApi = {
  getAll: async () => {
    try {
      console.log("FRONTEND DEBUG - [taskApi] Chamando GET para /tasks. Axios BaseURL:", taskApiInstance.defaults.baseURL);
      const response = await taskApiInstance.get('/tasks'); 
      console.log("FRONTEND DEBUG - [taskApi] Resposta de getAll() - Status:", response.status, "Dados recebidos:", response.data);
      return response.data; 
    } catch (error) {
      console.error("FRONTEND DEBUG - [taskApi] Erro em getAll:", error.message, "Status do erro (se houver):", error.response?.status, "Dados do erro (se houver):", error.response?.data, "Objeto de requisição:", error.request);
      throw error;
    }
  },
  getById: async (id) => {
    try {
      console.log(`FRONTEND DEBUG - [taskApi] Chamando GET para /tasks/${id}. Axios BaseURL:`, taskApiInstance.defaults.baseURL);
      const response = await taskApiInstance.get(`/tasks/${id}`); 
      console.log(`FRONTEND DEBUG - [taskApi] Resposta de getById(${id}) - Status:`, response.status, "Dados recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error(`FRONTEND DEBUG - [taskApi] Erro em getById(${id}):`, error.message, "Status do erro (se houver):", error.response?.status, "Dados do erro (se houver):", error.response?.data, "Objeto de requisição:", error.request);
      throw error;
    }
  },
};
 