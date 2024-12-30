import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Person } from '../types';
import api from '../config/api';

export const QUERY_KEYS = {
    PERSONS: ['persons'],
    SELECTED_PERSON: ['selectedPerson'],
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

export function useSelectedPerson() {
    const queryClient = useQueryClient();
    
    const { data: selectedPerson } = useQuery({
        queryKey: QUERY_KEYS.SELECTED_PERSON,
        queryFn: () => queryClient.getQueryData<Person>(QUERY_KEYS.SELECTED_PERSON),
        enabled: true
    });

    const setSelectedPerson = (person: Person | null) => {
        queryClient.setQueryData(QUERY_KEYS.SELECTED_PERSON, person);
    };

    return { selectedPerson, setSelectedPerson };
}