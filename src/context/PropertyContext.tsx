import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Property } from '../types/property';
import {
  fetchPublicProperties,
  fetchAllPropertiesAdmin,
  savePropertyToDb,
  togglePropertyPublicationInDb,
  deletePropertyFromDb,
  subscribeToPropertyUpdates,
  isSupabaseConfigured
} from '../lib/supabase';

interface PropertyContextType {
  properties: Property[]; // Only published properties (public authoritative view)
  allProperties: Property[]; // Both published and hidden (admin authoritative view)
  isLoading: boolean;
  error: string | null;
  isSupabaseLive: boolean;
  adminMode: boolean;
  setAdminMode: (active: boolean) => void;
  syncNotice: string | null;
  saveProperty: (prop: Partial<Property>, isPublishing: boolean) => Promise<Property>;
  togglePublication: (id: string, currentStatus: 'published' | 'hidden') => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminMode, setAdminMode] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const isSupabaseLive = isSupabaseConfigured();

  // Load properties from authoritative source
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setError(null);
    try {
      // 1. Always load public properties
      const publicData = await fetchPublicProperties();
      setProperties(publicData);

      // 2. Always load full admin list so admin view is instantly ready
      const fullData = await fetchAllPropertiesAdmin();
      setAllProperties(fullData);
    } catch (err: any) {
      console.error('[PropertyContext] Failed to load authoritative inventory:', err);
      setError(err?.message || 'Failed to synchronize with property database.');
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  // Initial load + Realtime & cross-device subscription
  useEffect(() => {
    loadData(true);

    // Setup listener for remote database changes from other devices or browsers
    const unsubscribe = subscribeToPropertyUpdates(() => {
      setSyncNotice('Cross-device update detected. Inventory synchronized.');
      loadData(false);
      setTimeout(() => setSyncNotice(null), 3500);
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Save property (Create or Edit)
  const handleSaveProperty = async (
    prop: Partial<Property>,
    isPublishing: boolean
  ): Promise<Property> => {
    setError(null);
    try {
      const saved = await savePropertyToDb(prop, isPublishing ? 'published' : 'hidden');
      await loadData(false);
      setSyncNotice(
        isPublishing
          ? `Property "${saved.title}" published successfully.`
          : `Property "${saved.title}" saved as Hidden draft.`
      );
      setTimeout(() => setSyncNotice(null), 4000);
      return saved;
    } catch (err: any) {
      setError(err?.message || 'Database write failed. Changes were not committed.');
      throw err;
    }
  };

  // Toggle Publication Status (Publish <-> Hide)
  const handleTogglePublication = async (
    id: string,
    currentStatus: 'published' | 'hidden'
  ): Promise<void> => {
    const nextStatus = currentStatus === 'published' ? 'hidden' : 'published';
    setError(null);
    try {
      await togglePropertyPublicationInDb(id, nextStatus);
      await loadData(false);
      setSyncNotice(
        nextStatus === 'published'
          ? 'Mandate published. Now visible in public listings.'
          : 'Mandate hidden. Removed from public view across all devices.'
      );
      setTimeout(() => setSyncNotice(null), 4000);
    } catch (err: any) {
      setError(err?.message || 'Failed to update publication status.');
      throw err;
    }
  };

  // Delete Property
  const handleDeleteProperty = async (id: string): Promise<void> => {
    setError(null);
    try {
      await deletePropertyFromDb(id);
      await loadData(false);
      setSyncNotice('Mandate removed from database.');
      setTimeout(() => setSyncNotice(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete property.');
      throw err;
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        allProperties,
        isLoading,
        error,
        isSupabaseLive,
        adminMode,
        setAdminMode,
        syncNotice,
        saveProperty: handleSaveProperty,
        togglePublication: handleTogglePublication,
        deleteProperty: handleDeleteProperty,
        refreshProperties: () => loadData(false)
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = (): PropertyContextType => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
