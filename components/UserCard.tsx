
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import VerifiedBadge from './VerifiedBadge';
import { SERVICE_CATEGORY_DETAILS } from '../constants';
import { AuthContext } from '../contexts/AuthContext';

interface UserCardProps {
  user: User;
}

const SocialLink: React.FC<{ href: string, children: React.ReactNode, 'aria-label': string }> = ({ href, children, ...props }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-500 transition-colors" {...props}>
    {children}
  </a>
);

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const categoryDetails = SERVICE_CATEGORY_DETAILS[user.serviceType];
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const isOwner = currentUser && currentUser.id === user.id;

  const handleEdit = () => {
    navigate(`/register/000000?edit=true`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-start space-x-4">
            <img 
                src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                 <div className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full text-white ${categoryDetails.color}`}>
                  {categoryDetails.icon}
                  {user.serviceType}
                </div>
                <VerifiedBadge isVerified={user.isVerified} />
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">{user.name}</h3>
              
              {user.bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.bio}</p>}
            </div>
        </div>
      </div>
      
      <div className="p-5 mt-auto bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                {user.showContact && (
                  <SocialLink href={`tel:${user.contact}`} aria-label={`Call ${user.name}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                  </SocialLink>
                )}
                {user.whatsapp && (
                  <SocialLink href={`https://wa.me/${user.whatsapp.replace(/\D/g, '')}`} aria-label="WhatsApp">
                    <svg className="w-6 h-6" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.916-.816-.52-.05-.52-.05c-.247 0-.47.025-.67.025-.247 0-.546.124-.67.372-.124.247-.42.816-.42 1.562 0 .746.42 1.812.47 1.937.05.124.817 1.344 2.227 1.937.362.15.64.248.86.323.273.075.52.05.67-.025.198-.124.768-.837.917-.966.148-.13.297-.124.47-.05.172.074 1.05.497 1.248.597.198.099.347.148.396.099s.05-.247-.025-.396zM12.072 2.05C6.59 2.05 2.125 6.514 2.125 12s4.465 9.95 9.947 9.95S22 17.486 22 12 17.553 2.05 12.072 2.05zm0 18.273c-4.595 0-8.327-3.732-8.327-8.323s3.732-8.323 8.327-8.323 8.327 3.732 8.327 8.323-3.732 8.323-8.327 8.323z"/></svg>
                  </SocialLink>
                )}
                {user.instagram && (
                  <SocialLink href={`https://instagram.com/${user.instagram}`} aria-label="Instagram">
                    <svg className="w-6 h-6" role="img" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><title>Instagram</title><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.297-1.459.717-2.125 1.384S.927 3.356.63 4.14C.333 4.905.13 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.297.783.717 1.459 1.384 2.125s1.343.927 2.125 1.225c.765.298 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.913-.558.783-.297 1.459-.717 2.125-1.384s.927-1.343 1.225-2.125c.298-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.26-2.148-.558-2.913-.3-.784-.718-1.459-1.384-2.125S20.644.927 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.056 1.17-.249 1.805-.413 2.227-.217.562-.477.96-.896 1.382-.42.419-.82.679-1.38.896-.422.164-1.057.36-2.227.413-1.266.057-1.646.07-4.85.07s-3.585-.015-4.85-.07c-1.17-.056-1.805-.249-2.227-.413-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.82-.896-1.38-.164-.422-.36-1.057-.413-2.227-.057-1.266-.07-1.646-.07-4.85s.015-3.585.07-4.85c.055-1.17.249-1.805.413-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.164 1.057-.36 2.227-.413 1.266-.057 1.646-.07 4.85-.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/></svg>
                  </SocialLink>
                )}
                {user.website && (
                  <SocialLink href={user.website} aria-label="Website">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.536a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </SocialLink>
                )}
                {user.mapUrl && (
                  <SocialLink href={user.mapUrl} aria-label="Location on map">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  </SocialLink>
                )}
            </div>
            {isOwner && (
                <button 
                  onClick={handleEdit}
                  className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="Edit Profile"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
