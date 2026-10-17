export interface CustomerReview {
  id: string;
  theme: string;
  reviewerName: string;
  summary: string;
  rating: number;
  locality: string;
  badge: string;
}

export const GOOGLE_BUSINESS_REFERENCE = {
  businessName: 'Sri Balaji Real Estate',
  rating: 5.0,
  reviewCount: 68,
  address: '6, 5th Main Road, Sarjapur Road, Amrita Nagar, Halanayakanahalli, Bengaluru, Karnataka 560035',
  phone: '+91 95358 54614',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sri+Balaji+Real+Estate+6+5th+Main+Road+Sarjapur+Road+Amrita+Nagar+Halanayakanahalli+Bengaluru+Karnataka+560035',
  referenceNotice: 'Rating (5.0/5) and review count (68) provided as client reference information. Not a real-time live API widget.'
};

export const CUSTOMER_TESTIMONIALS: CustomerReview[] = [
  {
    id: 'rev-theme-1',
    theme: 'Helpful Assistance in Finding a 1 BHK',
    reviewerName: 'Verified Google Reviewer',
    summary: 'Received very helpful assistance when searching for a compact 1 BHK around Sarjapur Road. The team guided through suitable options quickly and made the rental move straightforward without unnecessary delays.',
    rating: 5,
    locality: 'Sarjapur Road / Carmelaram',
    badge: '1 BHK Rental Search'
  },
  {
    id: 'rev-theme-2',
    theme: 'Transparent Communication & Responsive Service',
    reviewerName: 'Verified Google Reviewer',
    summary: 'Appreciated the clear communication and quick responses. Every inquiry regarding property documentation and agreement terms was answered promptly with complete transparency.',
    rating: 5,
    locality: 'Amrita Nagar, Halanayakanahalli',
    badge: 'Property Advisory'
  },
  {
    id: 'rev-theme-3',
    theme: 'Assistance in Finding a Suitable Home Within Budget',
    reviewerName: 'Verified Google Reviewer',
    summary: 'Sri Balaji Real Estate took the time to understand our exact budget constraints and helped us locate a great residential apartment in the Halanayakanahalli area without any pressure.',
    rating: 5,
    locality: 'Halanayakanahalli',
    badge: 'Budget-Aligned Home Search'
  },
  {
    id: 'rev-theme-4',
    theme: 'Smooth Support During the Home-Finding Process',
    reviewerName: 'Verified Google Reviewer',
    summary: 'The entire property search process was smooth and well-managed from initial viewing to final paperwork. A genuine, patient, and reliable property assistance experience.',
    rating: 5,
    locality: 'Sarjapur Road Corridor',
    badge: 'Home Finding Process'
  }
];
