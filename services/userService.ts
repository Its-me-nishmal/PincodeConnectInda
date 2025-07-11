
import { User, ServiceCategory } from '../types';

let mockUsers: User[] = [
  { id: 1, name: 'Mohammed Azhar', serviceType: ServiceCategory.Electrician, contact: '+91 98765 43210', isVerified: true, showContact: true, imageUrl: 'https://i.pravatar.cc/150?u=1', bio: 'Certified electrician with 10+ years of experience.', whatsapp: '+919876543210' },
  { id: 2, name: 'Ammu’s Beauty Spot', serviceType: ServiceCategory.Salon, contact: '+91 98451 23789', isVerified: false, showContact: false, imageUrl: 'https://i.pravatar.cc/150?u=2', bio: 'Unisex salon for hair, skin, and nails.', instagram: 'ammusbeautyspot', mapUrl: 'https://maps.app.goo.gl/example' },
  { id: 3, name: 'QuickFix Plumbers', serviceType: ServiceCategory.Plumber, contact: '+91 80500 11223', isVerified: true, showContact: true, bio: '24/7 emergency plumbing services.'},
  { id: 4, name: 'City Medicals', serviceType: ServiceCategory.Medical, contact: '+91 80234 56789', isVerified: true, showContact: true, imageUrl: 'https://i.pravatar.cc/150?u=4', bio: 'Pharmacy open 24 hours. We deliver.', website: 'https://citymedicals.example.com' },
  { id: 5, name: 'Daily Needs Store', serviceType: ServiceCategory.Shop, contact: '+91 99001 88776', isVerified: false, showContact: true, imageUrl: 'https://i.pravatar.cc/150?u=5', bio: 'All household groceries and items available.' },
  { id: 6, name: 'Rajesh Kumar', serviceType: ServiceCategory.Carpenter, contact: '+91 98860 12345', isVerified: true, showContact: false, imageUrl: 'https://i.pravatar.cc/150?u=6', website: 'https://rajeshcarpentry.example.com'},
  { id: 7, name: '24/7 Ambulance', serviceType: ServiceCategory.Emergency, contact: '102', isVerified: true, showContact: true, bio: 'Fast and reliable ambulance service.' },
  { id: 8, name: 'Speedy Auto Garage', serviceType: ServiceCategory.Mechanic, contact: '+91 77600 99887', isVerified: false, showContact: true, imageUrl: 'https://i.pravatar.cc/150?u=8' },
  { id: 9, name: 'Priya Tuition Center', serviceType: ServiceCategory.Tutor, contact: '+91 98440 55667', isVerified: true, showContact: false, imageUrl: 'https://i.pravatar.cc/150?u=9', bio: 'Maths and Science tutoring for grades 6-12.', whatsapp: '+919844055667', mapUrl: 'https://maps.app.goo.gl/example2' },
];

let nextId = mockUsers.length + 1;

// The pincode parameter is included to match a real API but is unused in this mock.
export const fetchUsersByPincode = (pincode: string): Promise<User[]> => {
  console.log(`Fetching users for pincode: ${pincode}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockUsers]);
    }, 500);
  });
};

export const findUserByContact = (contact: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        const user = mockUsers.find(u => u.contact === contact);
        resolve(user || null);
    }, 300);
  });
};

export const addUser = (user: Omit<User, 'id' | 'isVerified'>): Promise<User> => {
  console.log('Adding new user:', user);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser: User = {
        ...user,
        id: nextId++,
        isVerified: true, // New users are verified after simulated OTP
      };
      mockUsers.unshift(newUser);
      resolve(newUser);
    }, 300);
  });
};

export const updateUser = (updatedUser: User): Promise<User> => {
  console.log('Updating user:', updatedUser);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            mockUsers[index] = updatedUser;
            resolve(updatedUser);
        } else {
            reject(new Error("User not found"));
        }
    }, 300);
  });
}
