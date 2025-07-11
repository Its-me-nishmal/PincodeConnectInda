

import React, { useContext, useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { Link, useMatch, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FilterContext } from '../contexts/FilterContext';
import { LocationInfo } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const match = useMatch('/contacts/:pincode');
  const pincode = match?.params.pincode;
  const navigate = useNavigate();

  const { currentUser, logout } = useContext(AuthContext);
  const { searchTerm, setSearchTerm, setIsFilterModalOpen } = useContext(FilterContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useEffect(() => {
    if (pincode) {
        const item = localStorage.getItem('lastLocation');
        if (item) {
            const parsed = JSON.parse(item);
            if (String(parsed.pincode) === pincode) {
                setLocationInfo(parsed);
            }
        }
    } else {
        setLocationInfo(null);
    }
  }, [pincode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEditProfile = () => {
    setIsProfileOpen(false);
    navigate(`/register/${pincode || '000000'}?edit=true`);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    navigate('/');
  }

  const handleNewSearch = () => {
    localStorage.removeItem('lastLocation');
    navigate('/');
  }

  return (
    <header className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center gap-2">
        <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
          <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white hidden sm:block">
            Pincode<span className="text-orange-500">Connect</span>
          </h1>
        </Link>
        
        {pincode && (
           <div className="flex-grow flex justify-center items-center gap-2 min-w-0">
               <div className="relative w-full max-w-lg">
                   <svg aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 left-3 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                   <input
                     id="search-users"
                     type="text"
                     placeholder="Search by name, category, or contact..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                   />
               </div>
                <button onClick={() => setIsFilterModalOpen(true)} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                </button>
           </div>
        )}

        <div className="flex items-center space-x-2">
            {locationInfo && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                        <span className="font-semibold truncate" title={locationInfo.officeName}>{locationInfo.officeName}</span>
                        <span className="font-mono text-gray-500">{locationInfo.pincode}</span>
                    </div>
                    <button onClick={handleNewSearch} className="ml-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0">Change</button>
                </div>
            )}
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
           {currentUser && (
              <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileOpen(prev => !prev)} className="w-9 h-9 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <img 
                          src={currentUser.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random&color=fff`} 
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                      />
                  </button>
                  {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                          <button onClick={handleEditProfile} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Edit Profile</button>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Logout</button>
                      </div>
                  )}
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;