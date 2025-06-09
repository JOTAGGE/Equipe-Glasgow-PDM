// services/teamMemberApi.js
import axios from 'axios';

const mockTeamMembers = [
  { id: '1', name: 'Alice Smith', role: 'Desenvolvedora Frontend', email: 'alice.s@example.com', description: 'Responsável por desenvolver interfaces de usuário web e móveis, garantindo responsividade e usabilidade.' },
  { id: '2', name: 'Bob Johnson', role: 'Desenvolvedor Backend', email: 'bob.j@example.com', description: 'Cria e mantém a lógica de servidor, APIs e bancos de dados para sustentar as aplicações.' },
  { id: '3', name: 'Charlie Brown', role: 'Designer UX/UI', email: 'charlie.b@example.com', description: 'Foca na experiência do usuário e na criação de interfaces visuais intuitivas e esteticamente agradáveis.' },
];

const teamMemberApi = {
  getAll: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [...mockTeamMembers] });
      }, 500);
    });
  },
  getById: async (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const member = mockTeamMembers.find((m) => m.id === id);
        resolve({ data: member ? { ...member } : null });
      }, 300);
    });
  },
  create: async (member) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMember = { ...member, id: Date.now().toString() };
        mockTeamMembers.push(newMember);
        resolve({ data: newMember });
      }, 700);
    });
  },
  update: async (updatedMember) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTeamMembers.findIndex((m) => m.id === updatedMember.id);
        if (index !== -1) {
          mockTeamMembers[index] = { ...updatedMember };
          resolve({ data: updatedMember });
        } else {
          reject({ response: { data: 'Membro da equipe não encontrado.' } });
        }
      }, 600);
    });
  },
  delete: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = mockTeamMembers.length;
        const filtered = mockTeamMembers.filter((m) => m.id !== id);
        if (filtered.length < initialLength) {
          mockTeamMembers.splice(0, mockTeamMembers.length, ...filtered);
          resolve({ data: { success: true } });
        } else {
          reject({ response: { data: 'Membro da equipe não encontrado.' } });
        }
      }, 400);
    });
  },
};

export { teamMemberApi };