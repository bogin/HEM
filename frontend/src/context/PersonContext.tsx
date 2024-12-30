import React, { createContext, useContext, useState } from 'react';
import { Person } from '../types';

interface PersonContextType {
    selectedPerson: Person | null;
    setSelectedPerson: (person: Person | null) => void;
}

const PersonContext = createContext<PersonContextType | undefined>(undefined);

export function PersonProvider({ children }: { children: React.ReactNode }) {
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

    return (
        <PersonContext.Provider value={{ selectedPerson, setSelectedPerson }}>
            {children}
        </PersonContext.Provider>
    );
}

export function usePersonContext() {
    const context = useContext(PersonContext);
    if (context === undefined) {
        throw new Error('usePersonContext must be used within a PersonProvider');
    }
    return context;
}