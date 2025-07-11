

export enum ServiceCategory {
  Electrician = "Electrician",
  Salon = "Salon",
  Plumber = "Plumber",
  Medical = "Medical",
  Shop = "Shop",
  Emergency = "Emergency",
  Carpenter = "Carpenter",
  Mechanic = "Mechanic",
  Tutor = "Tutor",
}

export interface User {
  id: number;
  name: string;
  serviceType: ServiceCategory;
  contact: string;
  isVerified: boolean;
  showContact: boolean;
  imageUrl?: string;
  bio?: string;
  whatsapp?: string;
  instagram?: string;
  website?: string;
  mapUrl?: string;
}

export interface LocationInfo {
  officeName: string;
  pincode: string;
  taluk: string;
  districtName: string;
  stateName: string;
}
