

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLocations } from '../services/pincodeService';
import { LocationInfo } from '../types';

const Feature = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white mx-auto">
            {icon}
        </div>
        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-base text-gray-600 dark:text-gray-300">{children}</p>
    </div>
);

const FeaturesSection = () => (
    <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A Directory for Everything Local
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            From emergency services to your favorite local shop, find what you need right in your neighborhood.
        </p>
        <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            <Feature title="Hyper-Local Search" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}>
                Enter a pincode or place name to get a targeted list of contacts for that specific area.
            </Feature>
            <Feature title="Community-Sourced" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}>
                The directory grows with you. Add trusted contacts to help your neighbors.
            </Feature>
            <Feature title="Free & Simple" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}>
                No sign-ups, no fees. Just a simple, effective way to connect with your community.
            </Feature>
        </div>
    </div>
);

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [storedLocation, setStoredLocation] = useState<LocationInfo | null>(() => {
    const item = localStorage.getItem('lastLocation');
    return item ? JSON.parse(item) : null;
  });
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim().length < 3) {
      setError('Please enter at least 3 characters to search.');
      return;
    }
    setError(null);
    setIsSearching(true);
    try {
        const results = await searchLocations(searchTerm);
        if (results.length === 1) {
            localStorage.setItem('lastLocation', JSON.stringify(results[0]));
            navigate(`/contacts/${results[0].pincode}`);
        } else {
            navigate('/select-location', { state: { locations: results, searchTerm } });
        }
    } catch (err) {
        setError('An error occurred during search. Please try again.');
    } finally {
        setIsSearching(false);
    }
  };

  const handleChangeLocation = () => {
    localStorage.removeItem('lastLocation');
    setStoredLocation(null);
  };
  
  const heroContent = storedLocation ? (
    <div className="relative z-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Welcome Back!
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
            You were exploring:
        </p>
        <p className="mt-4 text-3xl font-bold text-white tracking-wider">{storedLocation.officeName}</p>
        <p className="mt-2 text-lg text-orange-400 font-semibold tracking-wider">{storedLocation.pincode}</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => navigate(`/contacts/${storedLocation.pincode}`)}
              className="w-full sm:w-auto px-10 py-4 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition-transform transform hover:scale-105 shadow-lg text-lg">
              View Directory
            </button>
            <button
              onClick={handleChangeLocation}
              className="w-full sm:w-auto px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition-colors text-base">
              Change Location
            </button>
        </div>
    </div>
  ) : (
    <div className="relative z-10">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
        Find Local Connections. <span className="text-orange-400">Instantly.</span>
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-200">
        Your community directory for local services, shops, and contacts. All powered by you.
      </p>
      <form onSubmit={handleSearch} className="mt-8 max-w-md mx-auto flex rounded-full shadow-2xl">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Enter Pincode or Place Name"
          className="w-full px-6 py-4 text-lg border-2 border-transparent rounded-l-full focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 outline-none bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white placeholder-gray-500"
          aria-label="Search Input"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-8 py-4 bg-orange-500 text-white font-bold rounded-r-full hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 transition-colors disabled:bg-orange-400"
          aria-label="Find Contacts"
        >
          {isSearching ? '...' : 'Find'}
        </button>
      </form>
      {error && <p className="mt-4 text-yellow-300 font-semibold">{error}</p>}
    </div>
  );


  return (
    <div className="space-y-20 sm:space-y-32">
      {/* Hero Section */}
      <div className="relative text-center py-20 px-4 sm:py-32 rounded-3xl overflow-hidden bg-gray-700">
        <img 
            src="https://t3.ftcdn.net/jpg/03/36/99/32/360_F_336993248_XxdDfurQl1gKqH3ddNAYU7kLfbgMdpG1.jpg" 
            alt="Vibrant Indian street"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {heroContent}
      </div>
      
      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
};

export default HomePage;