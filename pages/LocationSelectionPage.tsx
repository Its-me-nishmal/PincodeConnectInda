import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LocationInfo } from '../types';

const LocationCard: React.FC<{ location: LocationInfo; onClick: () => void }> = ({ location, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
    >
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{location.officeName}</h3>
                <p className="text-gray-600 dark:text-gray-300">{location.districtName}, {location.stateName}</p>
            </div>
            <p className="font-mono text-lg text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">{location.pincode}</p>
        </div>
    </button>
);

const LocationSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const locations = location.state?.locations as LocationInfo[] || [];
    const searchTerm = location.state?.searchTerm || '';

    if (locations.length === 0) {
        return (
            <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold">No Locations Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    We couldn't find any locations matching your search for "{searchTerm}". Please try a different search term.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                    Back to Search
                </button>
            </div>
        );
    }
    
    const handleSelectLocation = (selectedLocation: LocationInfo) => {
        localStorage.setItem('lastLocation', JSON.stringify(selectedLocation));
        navigate(`/contacts/${selectedLocation.pincode}`);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Select a Location</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">We found multiple results for your search. Please choose the correct one below.</p>
            </div>
            <div className="space-y-4">
                {locations.map((loc, index) => (
                    <LocationCard key={`${loc.pincode}-${index}`} location={loc} onClick={() => handleSelectLocation(loc)} />
                ))}
            </div>
        </div>
    );
};

export default LocationSelectionPage;
