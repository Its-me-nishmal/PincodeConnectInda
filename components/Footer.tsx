import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto py-6 text-center text-gray-600 dark:text-gray-400">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} PincodeConnect India. Built for the community.
        </p>
        <p className="text-xs mt-2">
          Connecting neighborhoods, one pincode at a time.
        </p>
      </div>
    </footer>
  );
};

export default Footer;