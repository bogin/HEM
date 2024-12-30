import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PersonsView } from './views/PersonsView';
import { DashboardView } from './views/DashboardView';
import { PersonProvider } from './context/PersonContext';

function App() {
    return (
        <PersonProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<PersonsView />} />
                        <Route path="dashboard" element={<DashboardView />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </PersonProvider>
    );
}

export default App;