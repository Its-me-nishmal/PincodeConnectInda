

import React, { useState, useContext, useEffect } from 'react';
import { User, ServiceCategory, LocationInfo } from '../types';
import { addUser, updateUser, findUserByContact } from '../services/userService';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const MOCK_OTP = "123456";

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & {label: string}> = ({label, id, ...props}) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input
            id={id}
            {...props}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700"
        />
    </div>
);

const RegisterPage: React.FC = () => {
    const { login, currentUser, updateCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pincode } = useParams<{ pincode: string }>();
    const [searchParams] = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';
    
    const [step, setStep] = useState(isEditMode ? 3 : 1); // 1: Phone, 2: OTP, 3: Details
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

    const [formData, setFormData] = useState<Omit<User, 'id'|'isVerified'>>({
        name: '',
        contact: '',
        serviceType: ServiceCategory.Shop,
        showContact: true,
        bio: '',
        imageUrl: '',
        whatsapp: '',
        instagram: '',
        website: '',
        mapUrl: ''
    });

    useEffect(() => {
        if (!isEditMode) {
            const item = localStorage.getItem('lastLocation');
            if (item) {
                const parsed = JSON.parse(item);
                if (String(parsed.pincode) === pincode) {
                    setLocationInfo(parsed);
                }
            }
        }
    }, [isEditMode, pincode]);

    useEffect(() => {
        if (isEditMode && currentUser) {
            setFormData({
                name: currentUser.name,
                contact: currentUser.contact,
                serviceType: currentUser.serviceType,
                showContact: currentUser.showContact,
                bio: currentUser.bio || '',
                imageUrl: currentUser.imageUrl || '',
                whatsapp: currentUser.whatsapp || '',
                instagram: currentUser.instagram || '',
                website: currentUser.website || '',
                mapUrl: currentUser.mapUrl || '',
            });
            setStep(3);
        }
    }, [isEditMode, currentUser]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData({ 
            ...formData, 
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value 
        });
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^\+?\d{10,15}$/.test(phone)) {
            setError('Please enter a valid phone number.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        const existingUser = await findUserByContact(phone);
        if (existingUser) {
            login(existingUser);
            navigate(`/contacts/${pincode}`);
            return;
        }
        
        // Simulate sending OTP
        setTimeout(() => {
            setFormData(prev => ({ ...prev, contact: phone }));
            setStep(2);
            setIsSubmitting(false);
        }, 500);
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === MOCK_OTP) {
            setError('');
            setStep(3);
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) {
            setError('Name and Service Name are required.');
            return;
        }
        if (!formData.showContact && !formData.mapUrl && !formData.instagram && !formData.website) {
            setError('If you hide your contact number, you must provide a Map URL, Instagram, or Website.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            if (isEditMode && currentUser) {
                const updatedUserData = { ...currentUser, ...formData };
                const result = await updateUser(updatedUserData);
                updateCurrentUser(result);
            } else {
                const newUser = await addUser(formData);
                login(newUser);
            }
            navigate(`/contacts/${pincode}`);
        } catch (err) {
            setError(`Failed to ${isEditMode ? 'update' : 'add'} contact. Please try again.`);
            setIsSubmitting(false);
        }
    }

    const renderContent = () => {
        switch (step) {
            case 1: // Phone Number Input
                return (
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">Enter your phone number to begin. We'll check if you already have an account.</p>
                        <InputField label="Contact Number" id="phone" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" required />
                        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
                        <div className="mt-6 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                                {isSubmitting ? 'Checking...' : 'Continue'}
                            </button>
                        </div>
                    </form>
                );
            case 2: // OTP Verification
                return (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-300">An OTP has been sent to <span className="font-semibold">{formData.contact}</span>. Please enter it below to verify.</p>
                        <InputField label="One-Time Password (OTP)" id="otp" name="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} required />
                        <p className="text-xs text-gray-400">For this demo, the OTP is <span className="font-mono">{MOCK_OTP}</span>.</p>
                        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
                        <div className="mt-6 flex justify-between items-center">
                            <button type="button" onClick={() => { setStep(1); setError(''); }} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Back</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Verify & Continue
                            </button>
                        </div>
                    </form>
                );
            case 3: // Full Details Form
                 return (
                    <form onSubmit={handleFinalSubmit} className="space-y-4">
                        <InputField label="Name / Service Name" id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g., Daily Needs Store" required />
                        <div>
                            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                            <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700">
                                {Object.values(ServiceCategory).map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio / Description</label>
                            <textarea id="bio" name="bio" value={formData.bio || ''} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700" placeholder="A short description of the service offered."></textarea>
                        </div>

                         <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-4">
                           <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Contact & Privacy</h3>
                           <div className="relative flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="showContact" name="showContact" type="checkbox" checked={formData.showContact} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="showContact" className="font-medium text-gray-700 dark:text-gray-300">Show contact number publicly</label>
                                    <p className="text-gray-500 dark:text-gray-400">If unchecked, you must provide at least one alternative contact method below.</p>
                                </div>
                            </div>
                           <InputField label="Profile Image URL" id="imageUrl" name="imageUrl" type="text" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.png" />
                           <InputField label="WhatsApp Number (Optional)" id="whatsapp" name="whatsapp" type="text" value={formData.whatsapp || ''} onChange={handleChange} placeholder="+919876543210" />
                           <InputField label="Instagram Handle (Optional)" id="instagram" name="instagram" type="text" value={formData.instagram || ''} onChange={handleChange} placeholder="my_handle (without @)" />
                           <InputField label="Website URL (Optional)" id="website" name="website" type="text" value={formData.website || ''} onChange={handleChange} placeholder="https://example.com" />
                           <InputField label="Google Maps URL (Optional)" id="mapUrl" name="mapUrl" type="text" value={formData.mapUrl || ''} onChange={handleChange} placeholder="https://maps.app.goo.gl/..." />
                        </div>
                        
                        {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-600 dark:text-gray-200 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                                {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Contact')}
                            </button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    }


    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{isEditMode ? 'Edit Profile' : 'Join the Directory'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {isEditMode 
                ? 'Update your public information.' 
                : locationInfo 
                ? `Adding to ${locationInfo.officeName} (${pincode})`
                : `For pincode ${pincode}`
              }
            </p>
            {renderContent()}
        </div>
    );
};

export default RegisterPage;