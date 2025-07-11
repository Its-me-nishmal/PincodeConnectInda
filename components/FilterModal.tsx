
import React, { useContext } from 'react';
import { FilterContext } from '../contexts/FilterContext';
import { ServiceCategory } from '../types';
import { SERVICE_CATEGORY_DETAILS } from '../constants';

const FilterModal: React.FC = () => {
  const { 
    isFilterModalOpen, 
    setIsFilterModalOpen, 
    showVerified, 
    setShowVerified, 
    selectedCategories, 
    setSelectedCategories, 
    clearFilters 
  } = useContext(FilterContext);

  if (!isFilterModalOpen) return null;

  const handleCategoryToggle = (category: ServiceCategory) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={() => setIsFilterModalOpen(false)}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filter Contacts</h2>
          <button onClick={() => setIsFilterModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl">&times;</button>
        </div>
        
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Verification Status</label>
                <div className="flex space-x-2 mt-2">
                    <button onClick={() => setShowVerified(null)} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${showVerified === null ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>All</button>
                    <button onClick={() => setShowVerified(true)} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${showVerified === true ? 'bg-green-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>Verified</button>
                    <button onClick={() => setShowVerified(false)} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${showVerified === false ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300'}`}>Unverified</button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2">
                    {Object.values(ServiceCategory).map(category => (
                        <button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${selectedCategories.has(category) ? `${SERVICE_CATEGORY_DETAILS[category].color} text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800 ring-current` : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                        >
                            {SERVICE_CATEGORY_DETAILS[category].icon}
                            {category}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
            <button onClick={() => { clearFilters(); setIsFilterModalOpen(false); }} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Clear all filters</button>
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(false)}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Done
            </button>
          </div>
      </div>
    </div>
  );
};

export default FilterModal;
