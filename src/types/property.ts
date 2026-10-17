export type PropertyFilterTab = 
  | 'all'
  | 'apartments'
  | '1bhk'
  | '2bhk'
  | '3bhk-plus'
  | 'villas'
  | 'rentals';

export type PropertyCategory = PropertyFilterTab | 'independent' | 'plots';

export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Penthouse' | 'Studio';

export type PropertyConfiguration = '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | 'Plot';

export interface Property {
  id: string;
  title: string;
  tagline: string;
  type: PropertyType;
  configuration: PropertyConfiguration;
  category: 'villas' | 'apartments' | 'independent' | 'plots' | 'rentals';
  categoryLabel: string;
  price: string;
  priceNumeric: number; // in INR
  priceType: 'sale' | 'rent';
  location: string;
  locality: string;
  microMarket: string;
  bedrooms: number;
  bathrooms: number;
  carpetArea: string; // e.g. "4,250 sq.ft"
  superBuiltupArea?: string;
  furnishing: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  facing: 'East' | 'North' | 'North-East' | 'West';
  possession: string; // e.g. "Ready to Move" or "Dec 2025"
  status: 'Ready to Move' | 'Under Construction' | 'Immediate Lease' | 'Under Offer';
  availability: 'Available' | 'Sample Representation' | 'Verified Office Mandate';
  isDemoListing: boolean; // clearly distinguishes demo showcase from production verified inventory
  featured: boolean;
  verified: boolean;
  heroImage: string;
  images: string[];
  highlights: string[];
  description: string;
  overview: string;
  amenities: string[];
  specs: {
    label: string;
    value: string;
  }[];
  contactPhone: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  propertyType: string;
  locality: string;
  rating: number;
  date: string;
  content: string;
  avatarText: string;
  verifiedPurchase: boolean;
}

export interface LocalityPoint {
  id: string;
  name: string;
  category: 'Tech Corridor' | 'Education' | 'Hospitality & Retail' | 'Connectivity';
  distance: string;
  driveTime: string;
  description: string;
}

export interface EnquiryData {
  fullName: string;
  phone: string;
  propertyType: 'apartment' | 'villa' | 'independent house' | 'other';
  configuration: '1 BHK' | '2 BHK' | '3 BHK+' | 'flexible';
  preferredLocality?: string;
  budget?: string;
  message?: string;
  propertyId?: string;
  propertyTitle?: string;
  propertyLocation?: string;
  propertyConfiguration?: string;
}
