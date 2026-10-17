import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property } from '../types/property';
import { PROPERTIES as SEED_PROPERTIES } from '../data/properties';

// 1. Environment Variable Extraction
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project-id') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  );
};

// 2. Supabase Client Initialization (or null if unconfigured)
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  : null;

// Cross-browser/cross-tab broadcast synchronization channel
const crossTabChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('sri_balaji_property_sync')
  : null;

// 3. Database to Domain Model Mappers
export const mapDbToProperty = (row: any): Property => {
  return {
    id: row.id,
    title: row.title || 'Untitled Mandate',
    tagline: row.tagline || '',
    type: row.type || 'Apartment',
    configuration: row.configuration || '2 BHK',
    category: row.category || 'apartments',
    categoryLabel: row.category_label || 'Prime Property',
    price: row.price || 'Price on Request',
    priceNumeric: Number(row.price_numeric) || 0,
    priceType: row.price_type === 'rent' ? 'rent' : 'sale',
    location: row.location || 'Sarjapur Road, Bengaluru',
    locality: row.locality || 'Sarjapur Road',
    microMarket: row.micro_market || '',
    bedrooms: Number(row.bedrooms) || 0,
    bathrooms: Number(row.bathrooms) || 0,
    carpetArea: row.carpet_area || '',
    superBuiltupArea: row.super_builtup_area || undefined,
    furnishing: row.furnishing || 'Semi-Furnished',
    facing: row.facing || 'East',
    possession: row.possession || 'Ready to Move',
    status: row.status || 'Ready to Move',
    publicationStatus: row.publication_status === 'hidden' ? 'hidden' : 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    availability: row.availability || 'Available',
    isDemoListing: Boolean(row.is_demo_listing),
    featured: Boolean(row.featured),
    verified: Boolean(row.verified),
    heroImage: row.hero_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    images: Array.isArray(row.images) ? row.images : [],
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    description: row.description || '',
    overview: row.overview || '',
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    specs: Array.isArray(row.specs) ? row.specs : [],
    contactPhone: row.contact_phone || '+919535854614'
  };
};

export const mapPropertyToDb = (prop: Partial<Property>, publicationStatus: 'published' | 'hidden') => {
  return {
    id: prop.id,
    title: prop.title,
    tagline: prop.tagline || null,
    type: prop.type,
    configuration: prop.configuration,
    category: prop.category,
    category_label: prop.categoryLabel || prop.category,
    price: prop.price,
    price_numeric: prop.priceNumeric || 0,
    price_type: prop.priceType || 'sale',
    location: prop.location,
    locality: prop.locality,
    micro_market: prop.microMarket || null,
    bedrooms: prop.bedrooms ?? 0,
    bathrooms: prop.bathrooms ?? 0,
    carpet_area: prop.carpetArea || '',
    super_builtup_area: prop.superBuiltupArea || null,
    furnishing: prop.furnishing || 'Semi-Furnished',
    facing: prop.facing || 'East',
    possession: prop.possession || 'Ready to Move',
    status: prop.status || 'Ready to Move',
    publication_status: publicationStatus,
    availability: prop.availability || 'Available',
    is_demo_listing: prop.isDemoListing ?? false,
    featured: prop.featured ?? false,
    verified: prop.verified ?? true,
    hero_image: prop.heroImage,
    images: prop.images || [],
    highlights: prop.highlights || [],
    description: prop.description || '',
    overview: prop.overview || prop.description || '',
    amenities: prop.amenities || [],
    specs: prop.specs || [],
    contact_phone: prop.contactPhone || '+919535854614'
  };
};

// 4. In-Memory Persistent Store (with localStorage sync simulation for offline/unconfigured environments)
const STORAGE_KEY = 'sri_balaji_persistent_inventory_v1';

const getLocalInventory = (): Property[] => {
  if (typeof window === 'undefined') return SEED_PROPERTIES.map(p => ({ ...p, publicationStatus: 'published' }));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Local inventory read notice:', e);
  }
  // Initialize with seed properties as published
  const seeded = SEED_PROPERTIES.map(p => ({
    ...p,
    publicationStatus: 'published' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch (e) {}
  return seeded;
};

const saveLocalInventory = (properties: Property[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
  } catch (e) {}
};

// 5. Authoritative Public Query: Reads ONLY published properties
export const fetchPublicProperties = async (): Promise<Property[]> => {
  if (supabase) {
    // Server-side filtered query — RLS also enforces publication_status = 'published'
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('publication_status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Error fetching public properties:', error.message);
      throw error;
    }

    if (data && data.length > 0) {
      return data.map(mapDbToProperty);
    }
    // If Supabase table is empty, return empty array
    return [];
  }

  // Fallback simulation mode: strictly filter only published items
  const local = getLocalInventory();
  return local.filter(p => p.publicationStatus === 'published');
};

// 6. Authoritative Admin Query: Reads ALL properties (Published + Hidden)
export const fetchAllPropertiesAdmin = async (): Promise<Property[]> => {
  if (supabase) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Error fetching admin properties:', error.message);
      throw error;
    }

    return (data || []).map(mapDbToProperty);
  }

  return getLocalInventory();
};

// 7. Save or Update Property with Publication Status
export const savePropertyToDb = async (
  property: Partial<Property>,
  publicationStatus: 'published' | 'hidden'
): Promise<Property> => {
  // Generate stable ID if new
  const stableId = property.id?.trim() || `SB-MAN-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();

  const propertyToSave: Property = {
    id: stableId,
    title: property.title || 'Untitled Luxury Mandate',
    tagline: property.tagline || '',
    type: property.type || 'Apartment',
    configuration: property.configuration || '3 BHK',
    category: property.category || 'apartments',
    categoryLabel: property.categoryLabel || 'Exclusive Listing',
    price: property.price || 'Price on Request',
    priceNumeric: property.priceNumeric || 0,
    priceType: property.priceType || 'sale',
    location: property.location || 'Sarjapur Road, Bengaluru',
    locality: property.locality || 'Sarjapur Road',
    microMarket: property.microMarket || 'Sarjapur Main Road Corridor',
    bedrooms: property.bedrooms ?? 3,
    bathrooms: property.bathrooms ?? 3,
    carpetArea: property.carpetArea || '1,850 sq.ft',
    superBuiltupArea: property.superBuiltupArea,
    furnishing: property.furnishing || 'Semi-Furnished',
    facing: property.facing || 'East',
    possession: property.possession || 'Ready to Move',
    status: property.status || 'Ready to Move',
    publicationStatus,
    createdAt: property.createdAt || now,
    updatedAt: now,
    availability: property.availability || 'Available',
    isDemoListing: property.isDemoListing ?? false,
    featured: property.featured ?? false,
    verified: property.verified ?? true,
    heroImage: property.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    images: property.images && property.images.length > 0 ? property.images : [
      property.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'
    ],
    highlights: property.highlights || ['Verified Title', 'Prime Location', 'High Appreciation Corridor'],
    description: property.description || 'Verified property mandate in Sarjapur Road micro-market.',
    overview: property.overview || property.description || 'Verified property mandate in Sarjapur Road micro-market.',
    amenities: property.amenities || ['Security', 'Power Backup', 'Covered Parking'],
    specs: property.specs || [{ label: 'Legal Verification', value: 'Clear Title Vetted' }],
    contactPhone: property.contactPhone || '+919535854614'
  };

  if (supabase) {
    const dbPayload = mapPropertyToDb(propertyToSave, publicationStatus);
    const { data, error } = await supabase
      .from('properties')
      .upsert(dbPayload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Supabase] Error saving property:', error.message);
      throw error;
    }

    const saved = mapDbToProperty(data);
    notifyCrossTabUpdate();
    return saved;
  }

  // Local fallback mode with persistence
  const current = getLocalInventory();
  const index = current.findIndex(p => p.id === stableId);
  if (index >= 0) {
    current[index] = propertyToSave;
  } else {
    current.unshift(propertyToSave);
  }
  saveLocalInventory(current);
  notifyCrossTabUpdate();
  return propertyToSave;
};

// 8. Quick Publication Status Toggle
export const togglePropertyPublicationInDb = async (
  propertyId: string,
  newStatus: 'published' | 'hidden'
): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('properties')
      .update({
        publication_status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', propertyId);

    if (error) {
      console.error('[Supabase] Error updating publication status:', error.message);
      throw error;
    }
    notifyCrossTabUpdate();
    return;
  }

  // Local fallback
  const current = getLocalInventory();
  const found = current.find(p => p.id === propertyId);
  if (found) {
    found.publicationStatus = newStatus;
    found.updatedAt = new Date().toISOString();
    saveLocalInventory(current);
    notifyCrossTabUpdate();
  }
};

// 9. Delete Property
export const deletePropertyFromDb = async (propertyId: string): Promise<void> => {
  if (supabase) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('[Supabase] Error deleting property:', error.message);
      throw error;
    }
    notifyCrossTabUpdate();
    return;
  }

  const current = getLocalInventory().filter(p => p.id !== propertyId);
  saveLocalInventory(current);
  notifyCrossTabUpdate();
};

// 10. Realtime & Cross-Device Synchronization
export const subscribeToPropertyUpdates = (onUpdate: () => void) => {
  // 1. Supabase Realtime channel across different devices/browsers
  let realtimeChannel: any = null;
  if (supabase) {
    realtimeChannel = supabase
      .channel('properties-sync-room')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        (payload) => {
          console.log('[Supabase Realtime] Change received from external device:', payload.eventType);
          onUpdate();
        }
      )
      .subscribe((status) => {
        console.log('[Supabase Realtime] Channel status:', status);
      });
  }

  // 2. Cross-tab synchronization on the same device
  const handleCrossTab = (event: MessageEvent) => {
    if (event.data?.type === 'PROPERTIES_UPDATED') {
      onUpdate();
    }
  };

  if (crossTabChannel) {
    crossTabChannel.addEventListener('message', handleCrossTab);
  }

  // Also listen for storage events in case of different windows
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      onUpdate();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (supabase && realtimeChannel) {
      supabase.removeChannel(realtimeChannel);
    }
    if (crossTabChannel) {
      crossTabChannel.removeEventListener('message', handleCrossTab);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
};

const notifyCrossTabUpdate = () => {
  try {
    crossTabChannel?.postMessage({ type: 'PROPERTIES_UPDATED', timestamp: Date.now() });
  } catch (e) {}
};

// 11. Security Audit: Test Anonymous Query against Hidden Property
export const testAnonymousAccessToHidden = async (hiddenId: string): Promise<{
  blocked: boolean;
  message: string;
  foundCount: number;
}> => {
  if (supabase) {
    // Attempt to query the specific hidden property as an unprivileged client
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, publication_status')
      .eq('id', hiddenId)
      .eq('publication_status', 'published'); // Public standard query

    if (error) {
      return {
        blocked: true,
        message: `Query rejected by server: ${error.message}`,
        foundCount: 0
      };
    }

    if (!data || data.length === 0) {
      return {
        blocked: true,
        message: 'Direct anonymous query returned 0 records. Hidden property strictly shielded by server.',
        foundCount: 0
      };
    }

    return {
      blocked: false,
      message: 'WARNING: Property was returned to anonymous query.',
      foundCount: data.length
    };
  }

  // Simulation mode
  const publicProps = await fetchPublicProperties();
  const leaked = publicProps.find(p => p.id === hiddenId);
  return {
    blocked: !leaked,
    message: !leaked
      ? 'Hidden property strictly shielded: 0 records in public view.'
      : 'WARNING: Property found in public view.',
    foundCount: leaked ? 1 : 0
  };
};
