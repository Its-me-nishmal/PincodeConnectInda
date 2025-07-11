

import React, { useEffect, useState, useMemo, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsersByPincode } from '../services/userService';
import { User, LocationInfo } from '../types';
import UserCard from '../components/UserCard';
import Spinner from '../components/Spinner';
import { FilterContext } from '../contexts/FilterContext';
import { AuthContext } from '../contexts/AuthContext';
import FilterModal from '../components/FilterModal';

const OfficePage: React.FC = () => {
  const { pincode } = useParams<{ pincode: string }>();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  
  const { 
    searchTerm, 
    selectedCategories, 
    showVerified,
    clearFilters
  } = useContext(FilterContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const item = localStorage.getItem('lastLocation');
    if (item) {
        const parsed = JSON.parse(item);
        // Ensure the stored location matches the current pincode in the URL
        if(String(parsed.pincode) === pincode) {
            setLocationInfo(parsed);
        }
    }
  }, [pincode]);

  const loadUsers = useCallback(() => {
    if (pincode) {
        setLoading(true);
        setError(null);
        fetchUsersByPincode(pincode)
            .then(setUsers)
            .catch(() => setError('Failed to load user data.'))
            .finally(() => setLoading(false));
    }
  }, [pincode]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    return () => {
        clearFilters();
    };
  }, [pincode, clearFilters]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTermLower) ||
        user.serviceType.toLowerCase().includes(searchTermLower) ||
        user.contact.includes(searchTermLower);
      const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(user.serviceType);
      const matchesVerified = showVerified === null || user.isVerified === showVerified;
      return matchesSearch && matchesCategory && matchesVerified;
    });
  }, [users, searchTerm, selectedCategories, showVerified]);

  return (
    <div>
      <FilterModal />

      <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {locationInfo ? (
            <div>
                <p className="text-base text-gray-500 dark:text-gray-400">{locationInfo.districtName}, {locationInfo.stateName}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white tracking-tight">{locationInfo.officeName}</h2>
                <p className="mt-1 text-2xl font-mono text-indigo-500 dark:text-indigo-400">{locationInfo.pincode}</p>
            </div>
        ) : (
            <div>
                <p className="text-base text-gray-500 dark:text-gray-400">Showing contacts for Pincode</p>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">{pincode}</h2>
            </div>
        )}
      </div>

      {loading && <Spinner />}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <div className="lg:col-span-2 text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">No Results Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  No services match your current filters. Try adjusting your search or be the first to add a contact!
                </p>
            </div>
          )}
        </div>
      )}

      {!currentUser && (
        <button
          onClick={() => navigate(`/register/${pincode}`)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-orange-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition-all transform hover:scale-110"
          aria-label="Add a new contact"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

    </div>
  );
};

export default OfficePage;