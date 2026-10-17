export interface NeighbourhoodInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
}

export const LOCALITY_HEADER = {
  headline: 'Find Your Place Around Sarjapur Road.',
  supportingText: 'Explore property options around Halanayakanahalli and the surrounding Bengaluru neighbourhoods.'
};

export const NEIGHBOURHOODS: NeighbourhoodInfo[] = [
  {
    id: 'area-halanayakanahalli',
    name: 'Halanayakanahalli',
    category: 'Core Neighbourhood',
    description: 'A developing residential enclave situated off Sarjapur Road, featuring independent residences, apartment communities, and proximity to natural lake catchments.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'area-amrita-nagar',
    name: 'Amrita Nagar',
    category: 'Advisory Office Location',
    description: 'The location of Sri Balaji Real Estate (6, 5th Main Road), known for its calm residential streets and proximity to Amrita Vishwa Vidyapeetham.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'area-sarjapur-road',
    name: 'Sarjapur Road Main Corridor',
    category: 'Arterial Road',
    description: 'A major South-East Bengaluru thoroughfare connecting key commercial hubs, residential communities, and retail avenues.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'area-carmelaram',
    name: 'Carmelaram',
    category: 'Adjacent Neighbourhood',
    description: 'An adjacent residential pocket linking Sarjapur Road to Doddakannelli and outer corridors, with a mix of apartments and independent layouts.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop'
  }
];
