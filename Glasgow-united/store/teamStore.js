import { create } from 'zustand';

const useTeamStore = create((set) => ({
  teamMembers: [], 
  addTeamMember: (member) => set((state) => ({ teamMembers: [...state.teamMembers, member] })),
  setTeamMembers: (members) =>
    set({
      teamMembers: Array.isArray(members)
        ? members.filter(
            (member) =>
              typeof member === 'object' &&
              member !== null &&
              member.id !== undefined &&
              member.id !== null
          )
        : [],
    }),
  updateTeamMember: (updatedMember) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      ),
    })),
  deleteTeamMember: (memberId) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((member) => member.id !== memberId),
    })),
}));

export default useTeamStore;
