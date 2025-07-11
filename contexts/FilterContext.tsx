
import React, { createContext, useState, ReactNode, useCallback } from 'react';
import { ServiceCategory } from '../types';

interface FilterContextType {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategories: Set<ServiceCategory>;
    setSelectedCategories: React.Dispatch<React.SetStateAction<Set<ServiceCategory>>>;
    showVerified: boolean | null;
    setShowVerified: (status: boolean | null) => void;
    isFilterModalOpen: boolean;
    setIsFilterModalOpen: (isOpen: boolean) => void;
    clearFilters: () => void;
}

export const FilterContext = createContext<FilterContextType>({
    searchTerm: '',
    setSearchTerm: () => {},
    selectedCategories: new Set(),
    setSelectedCategories: () => {},
    showVerified: null,
    setShowVerified: () => {},
    isFilterModalOpen: false,
    setIsFilterModalOpen: () => {},
    clearFilters: () => {},
});

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<Set<ServiceCategory>>(new Set());
    const [showVerified, setShowVerified] = useState<boolean | null>(null);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    
    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedCategories(new Set());
        setShowVerified(null);
    }, []);

    const value = {
        searchTerm,
        setSearchTerm,
        selectedCategories,
        setSelectedCategories,
        showVerified,
        setShowVerified,
        isFilterModalOpen,
        setIsFilterModalOpen,
        clearFilters,
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
};
