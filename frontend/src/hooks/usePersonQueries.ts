import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Person } from '@/types';
import api from '@/config/api';
import { QUERY_KEYS, MAX_SELECTED_PERSONS } from '@/config/constants';


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
    const navigate = useNavigate();

    const { data: selectedPersons = [] } = useQuery({
        queryKey: QUERY_KEYS.SELECTED_PERSONS,
        queryFn: () => queryClient.getQueryData<Person[]>(QUERY_KEYS.SELECTED_PERSONS) ?? [],
        initialData: []
    });

    const togglePersonSelection = async (person: Person) => {
        if (!person?.id) {
            console.error('Invalid person object');
            return;
        }

        const currentSelected = [...selectedPersons];
        const index = currentSelected.findIndex(p => p.id === person.id);
        let success = true;

        try {
            if (index === -1) {
                addPerson(currentSelected, person);
            } else {
                success = await removePerson(person, success, currentSelected, index, navigate);
            }

            await queryClient.setQueryData(QUERY_KEYS.SELECTED_PERSONS, currentSelected);

            if (!success) {
                console.warn('Person was unselected but WebSocket connection may still be active');
            }

        } catch (error) {
            console.error('Error in togglePersonSelection:', error);
            alert('There was an error updating the selection. Please try again.');

            queryClient.setQueryData(QUERY_KEYS.SELECTED_PERSONS, selectedPersons);
        }
    };

    const isSelected = (person: Person): boolean => {
        return selectedPersons.some(p => p.id === person.id);
    };

    return {
        selectedPersons,
        togglePersonSelection,
        isSelected
    };
}

const addPerson = (currentSelected: Person[], person: Person) => {
    if (currentSelected.length >= MAX_SELECTED_PERSONS) {
        alert(`Maximum ${MAX_SELECTED_PERSONS} persons can be selected`);
        return;
    }
    currentSelected.push(person);
}

const removePerson = async (person: Person, success: boolean, currentSelected: Person[], index: number, navigate: NavigateFunction) => {
    try {
        await api.post(`/ws/stop/${person.id}`);
        console.log(`Successfully stopped WebSocket for person ${person.id}`);
    } catch (error) {
        console.error('Failed to stop WebSocket connection:', error);
        success = false;
    }

    currentSelected.splice(index, 1);

    const currentPath = window.location.pathname;
    if (currentPath.includes(`/dashboard/${person.id}`)) {
        navigate('/');
    }
    return success;
}
