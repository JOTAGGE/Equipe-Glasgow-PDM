// store/projectStore.js
import { create } from 'zustand';

const useProjectStore = create((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects: projects }),
}));

export default useProjectStore;