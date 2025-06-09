// services/projectApi.js
import axios from 'axios';

const mockProjects = [
  { id: 'p1', name: 'App de Gerenciamento', description: 'Desenvolvimento de um aplicativo de gerenciamento de tarefas e equipe.', assignedTeamMembers: ['1', '2'] },
  { id: 'p2', name: 'Redesign do Site', description: 'Reestruturação completa da interface do usuário do site principal.', assignedTeamMembers: ['3'] },
];

const projectApi = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockProjects });
      }, 400);
    });
  },
};

export { projectApi };