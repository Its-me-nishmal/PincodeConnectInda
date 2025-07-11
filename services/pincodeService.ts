import { LocationInfo } from '../types';

export const searchLocations = async (term: string): Promise<LocationInfo[]> => {
  console.log(`Searching for locations with term: ${term}`);

  try {
    const response = await fetch(`https://piin.vercel.app/${term}`);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.pincodeLookup || !Array.isArray(data.pincodeLookup)) {
      throw new Error('Invalid API response format');
    }

    // Convert pincodes to string if needed (matching the expected `LocationInfo` type)
    const results: LocationInfo[] = data.pincodeLookup.map((loc: { pincode: any; }) => ({
      ...loc,
      pincode: String(loc.pincode),
    }));

    return results;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
};
