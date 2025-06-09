// store/teamStore.js
import { create } from 'zustand';

const useTeamStore = create((set) => ({
  teamMembers: [],
  setTeamMembers: (members) => set({ teamMembers: members }),
  addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, { ...member, id: Date.now().toString(), description: member.description || '' }] })),
  updateTeamMember: (updatedMember) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === updatedMember.id ? { ...member, ...updatedMember } : member
      ),
    })),
  deleteTeamMember: (id) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((member) => member.id !== id),
    })),
}));

export default useTeamStore;