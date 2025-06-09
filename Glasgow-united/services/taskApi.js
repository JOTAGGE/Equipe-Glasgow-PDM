// services/taskApi.js
import axios from 'axios';

const mockTasks = [
  { id: 't1', name: 'Configurar Expo Router', description: 'Configurar o roteamento inicial do aplicativo.', projectId: 'p1' },
  { id: 't2', name: 'Desenvolver Componente de Input', description: 'Criar um componente reutilizável para inputs.', projectId: 'p1' },
  { id: 't3', name: 'Criar protótipos de baixa fidelidade', description: 'Esboçar telas para o redesign.', projectId: 'p2' },
];

const taskApi = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockTasks });
      }, 350);
    });
  },
};

export { taskApi };