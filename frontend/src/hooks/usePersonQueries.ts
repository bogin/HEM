import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Person } from '../types';
import api from '../config/api';

export const MAX_SELECTED_PERSONS = 4;

export const QUERY_KEYS = {
    PERSONS: ['persons'],
    SELECTED_PERSONS: ['selectedPersons'],
} as const;

export function usePersons() {
    return useQuery({
        queryKey: QUERY_KEYS.PERSONS,
        queryFn: async () => {
            const { data } = await api.get<{ data: Person[] }>('/persons');
            return data.data;
        }
    });
}

export function useSelectedPersons() {
    const queryClient = useQueryClient();

    const { data: selectedPersons = [] } = useQuery({
        queryKey: QUERY_KEYS.SELECTED_PERSONS,
        queryFn: () => queryClient.getQueryData<Person[]>(QUERY_KEYS.SELECTED_PERSONS) ?? [],
        initialData: []
    });

    const togglePersonSelection = (person: Person) => {
        const currentSelected = [...selectedPersons];
        const index = currentSelected.findIndex(p => p.id === person.id);

        if (index === -1) {
            if (currentSelected.length >= MAX_SELECTED_PERSONS) {
                alert(`Maximum ${MAX_SELECTED_PERSONS} persons can be selected`);
                return;
            }
            currentSelected.push(person);
        } else {
            currentSelected.splice(index, 1);
        }

        queryClient.setQueryData(QUERY_KEYS.SELECTED_PERSONS, currentSelected);
    };

    const isSelected = (person: Person) => {
        return selectedPersons.some(p => p.id === person.id);
    };

    return {
        selectedPersons,
        togglePersonSelection,
        isSelected
    };
}