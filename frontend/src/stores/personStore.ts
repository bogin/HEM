import { create } from 'zustand';
import { Person } from '../types';

interface PersonState {
    persons: Person[];
    selectedPerson: Person | null;
    loading: boolean;
    error: string | null;
    fetchPersons: () => Promise<void>;
    selectPerson: (person: Person | null) => void;
}

export const usePersonStore = create<PersonState>((set) => ({
    persons: [],
    selectedPerson: null,
    loading: false,
    error: null,
    fetchPersons: async () => {
        try {
            set({ loading: true, error: null });
            const response = await fetch(`${process.env.REACT_APP_API_URL}/persons`);
            const data = await response.json();
            set({ persons: data.data, loading: false });
        } catch (error) {
            set({ 
                error: error instanceof Error ? error.message : 'An error occurred', 
                loading: false 
            });
        }
    },
    selectPerson: (person: Person | null) => set({ selectedPerson: person })
}));