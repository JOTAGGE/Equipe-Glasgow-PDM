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
      console.log("FRONTEND DEBUG - [teamMemberApi] GET /team-members - BaseURL do Axios durante a chamada:", teamMemberApiInstance.defaults.baseURL); 
      const response = await teamMemberApiInstance.get('/team-members');
      console.log("FRONTEND DEBUG - [teamMemberApi] GET /team-members - STATUS da resposta:", response.status, "DADOS BRUTOS recebidos:", JSON.stringify(response.data, null, 2));
      return response.data; 
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em getAll:", error.message);
      if (error.response) {
          console.error("  Status do erro (se houver):", error.response.status);
          console.error("  Dados do erro (se houver):", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("  Objeto de requisição (não houve resposta do servidor):", error.request);
          console.error("  Possível causa: Backend não está rodando ou URL incorreta/inacessível.");
      } else {
          console.error("  Erro de configuração do Axios/JS:", error.message);
      }
      throw error; 
    }
  },

  getById: async (id) => {
    try {
      console.log(`FRONTEND DEBUG - [teamMemberApi] GET /team-members/${id} - BaseURL do Axios durante a chamada:`, teamMemberApiInstance.defaults.baseURL);
      const response = await teamMemberApiInstance.get(`/team-members/${id}`);
      console.log(`FRONTEND DEBUG - [teamMemberApi] GET /team-members/${id} - STATUS da resposta:`, response.status, "DADOS BRUTOS recebidos:", JSON.stringify(response.data, null, 2));
      return response.data; 
    } catch (error) {
      console.error(`FRONTEND DEBUG - [teamMemberApi] ERRO em getById(${id}):`, error.message);
      if (error.response) {
          console.error("  Status do erro (se houver):", error.response.status);
          console.error("  Dados do erro (se houver):", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("  Objeto de requisição (não houve resposta do servidor):", error.request);
          console.error("  Possível causa: Backend não está rodando ou URL incorreta/inacessível.");
      } else {
          console.error("  Erro de configuração do Axios/JS:", error.message);
      }
      throw error;
    }
  },

  create: async (memberData) => {
    try {
      console.log("FRONTEND DEBUG - [teamMemberApi] POST /team-members - BaseURL do Axios durante a chamada:", teamMemberApiInstance.defaults.baseURL, "Dados enviados:", JSON.stringify(memberData, null, 2));
      const response = await teamMemberApiInstance.post('/team-members', memberData);
      console.log("FRONTEND DEBUG - [teamMemberApi] POST /team-members - STATUS da resposta:", response.status, "DADOS BRUTOS recebidos:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em create:", error.message);
      if (error.response) {
          console.error("  Status do erro (se houver):", error.response.status);
          console.error("  Dados do erro (se houver):", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("  Objeto de requisição (não houve resposta do servidor):", error.request);
          console.error("  Possível causa: Backend não está rodando ou URL incorreta/inacessível.");
      } else {
          console.error("  Erro de configuração do Axios/JS:", error.message);
      }
      throw error;
    }
  },

  update: async (memberData) => {
    try {
      console.log(`FRONTEND DEBUG - [teamMemberApi] PUT /team-members/${memberData.id} - BaseURL do Axios durante a chamada:`, teamMemberApiInstance.defaults.baseURL, "Dados enviados:", JSON.stringify(memberData, null, 2));
      const response = await teamMemberApiInstance.put(`/team-members/${memberData.id}`, memberData);
      console.log("FRONTEND DEBUG - [teamMemberApi] PUT /team-members - STATUS da resposta:", response.status, "DADOS BRUTOS recebidos:", JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("FRONTEND DEBUG - [teamMemberApi] ERRO em update:", error.message);
      if (error.response) {
          console.error("  Status do erro (se houver):", error.response.status);
          console.error("  Dados do erro (se houver):", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("  Objeto de requisição (não houve resposta do servidor):", error.request);
          console.error("  Possível causa: Backend não está rodando ou URL incorreta/inacessível.");
      } else {
          console.error("  Erro de configuração do Axios/JS:", error.message);
      }
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`FRONTEND DEBUG - [teamMemberApi] INICIANDO DELETE para /team-members/${id}. Usando BaseURL do Axios:`, teamMemberApiInstance.defaults.baseURL);
      const response = await teamMemberApiInstance.delete(`/team-members/${id}`);
      console.log(`FRONTEND DEBUG - [teamMemberApi] DELETE para ${id} SUCESSO. Status da resposta:`, response.status);
      return true;
    } catch (error) {
      console.error(`FRONTEND DEBUG - [teamMemberApi] ERRO ao deletar membro ${id}:`, error.message);
      if (error.response) {
          console.error("  Status do erro (se houver):", error.response.status);
          console.error("  Dados do erro (se houver):", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
          console.error("  Objeto de requisição (não houve resposta do servidor):", error.request);
          console.error("  Possível causa: Backend não está rodando ou URL incorreta/inacessível.");
      } else {
          console.error("  Erro de configuração do Axios/JS:", error.message);
      }
      throw error;
    }
  },
};
