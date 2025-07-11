

import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OfficePage from './pages/OfficePage';
import RegisterPage from './pages/RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './contexts/AuthContext';
import { FilterProvider } from './contexts/FilterContext';
import LocationSelectionPage from './pages/LocationSelectionPage';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <HashRouter>
      <AuthProvider>
        <FilterProvider>
          <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/select-location" element={<LocationSelectionPage />} />
                <Route path="/contacts/:pincode" element={<OfficePage />} />
                <Route path="/register/:pincode" element={<RegisterPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </FilterProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;