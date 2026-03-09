import { create } from 'zustand';

// TypeScript Interfaces
export interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    status: 'planned' | 'in-progress' | 'completed';
    budget: number;
    completionPercentage: number;
    contractor: string;
    images: string[];
    createdAt: string;
}

export interface Scheme {
    id: string;
    name: string;
    description: string;
    eligibility: string;
    benefits: string;
    applicationLink: string;
    category: string;
    deadline: string;
    createdAt: string;
}

interface DataState {
    // Projects State
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    selectedProject: Project | null;
    setSelectedProject: (project: Project | null) => void;
    projectFilters: {
        status: string;
        budgetRange: [number, number]; // [min, max]
    };
    setProjectFilters: (filters: Partial<DataState['projectFilters']>) => void;

    // Schemes State
    schemes: Scheme[];
    setSchemes: (schemes: Scheme[]) => void;
    selectedScheme: Scheme | null;
    setSelectedScheme: (scheme: Scheme | null) => void;
    schemeFilters: {
        searchQuery: string;
        category: string;
    };
    setSchemeFilters: (filters: Partial<DataState['schemeFilters']>) => void;
}

export const useDataStore = create<DataState>((set) => ({
    // Projects Initial State
    projects: [],
    setProjects: (projects) => set({ projects }),
    selectedProject: null,
    setSelectedProject: (selectedProject) => set({ selectedProject }),
    projectFilters: {
        status: 'all',
        budgetRange: [0, 100000000000],
    },
    setProjectFilters: (filters) => set((state) => ({ projectFilters: { ...state.projectFilters, ...filters } })),

    // Schemes Initial State
    schemes: [],
    setSchemes: (schemes) => set({ schemes }),
    selectedScheme: null,
    setSelectedScheme: (selectedScheme) => set({ selectedScheme }),
    schemeFilters: {
        searchQuery: '',
        category: 'all',
    },
    setSchemeFilters: (filters) => set((state) => ({ schemeFilters: { ...state.schemeFilters, ...filters } })),
}));
