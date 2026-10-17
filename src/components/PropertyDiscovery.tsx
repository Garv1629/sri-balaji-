import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Sparkles, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { Property, PropertyFilterTab } from '../types/property';
import { PROPERTIES } from '../data/properties';
import { loadUserPreferences, saveUserPreferences } from '../lib/indexedDb';
import { PropertyCard } from './PropertyCard';

interface PropertyDiscoveryProps {
  selectedCategory?: string;
  onSelectCategory?: (cat: any) => void;
  onSelectProperty: (prop: Property) => void;
  onEnquire: (propertyTitle: string) => void;
}

export const PropertyDiscovery: React.FC<PropertyDiscoveryProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectProperty,
  onEnquire
}) => {
  const [activeTab, setActiveTab] = useState<PropertyFilterTab>(
    (selectedCategory as PropertyFilterTab) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Step 13: Restore client preference from IndexedDB asynchronously
  useEffect(() => {
    let isMounted = true;
    loadUserPreferences().then((prefs) => {
      if (isMounted && prefs) {
        if (prefs.activeTab && !selectedCategory) {
          setActiveTab(prefs.activeTab);
        }
        if (prefs.sortBy) {
          setSortBy(prefs.sortBy);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  // Handle external category change if passed
  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeTab) {
      setActiveTab(selectedCategory as PropertyFilterTab);
    }
  }, [selectedCategory, activeTab]);

  const handleTabChange = (tab: PropertyFilterTab) => {
    setActiveTab(tab);
    // Persist user filter preference to IndexedDB
    saveUserPreferences({ activeTab: tab, sortBy });
    if (onSelectCategory) {
      onSelectCategory(tab);
    }
  };

  const handleSortChange = (newSort: 'featured' | 'price-asc' | 'price-desc') => {
    setSortBy(newSort);
    // Persist user sort preference to IndexedDB
    saveUserPreferences({ activeTab, sortBy: newSort });
  };

  // Filter definitions exactly as requested
  const filterTabs: { key: PropertyFilterTab; label: string }[] = [
    { key: 'all', label: 'All Properties' },
    { key: 'apartments', label: 'Apartments' },
    { key: '1bhk', label: '1 BHK' },
    { key: '2bhk', label: '2 BHK' },
    { key: '3bhk-plus', label: '3 BHK+' },
    { key: 'villas', label: 'Villas' },
    { key: 'rentals', label: 'Rental Properties' },
  ];

  // Combined Search & Filter Logic
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(property => {
      // 1. Category Tab Filter
      if (activeTab === 'apartments') {
        if (property.category !== 'apartments' && property.type !== 'Apartment' && property.type !== 'Penthouse' && property.type !== 'Studio') {
          return false;
        }
      } else if (activeTab === '1bhk') {
        if (property.configuration !== '1 BHK') return false;
      } else if (activeTab === '2bhk') {
        if (property.configuration !== '2 BHK') return false;
      } else if (activeTab === '3bhk-plus') {
        if (property.configuration !== '3 BHK' && property.configuration !== '4 BHK' && property.configuration !== '5 BHK') {
          return false;
        }
      } else if (activeTab === 'villas') {
        if (property.category !== 'villas' && property.type !== 'Villa') return false;
      } else if (activeTab === 'rentals') {
        if (property.priceType !== 'rent') return false;
      }

      // 2. Global Text Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocality = property.locality.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        const matchesConfig = property.configuration.toLowerCase().includes(query);
        const matchesDesc = property.description.toLowerCase().includes(query);
        const matchesHighlights = property.highlights.some(h => h.toLowerCase().includes(query));

        if (!matchesTitle && !matchesLocality && !matchesLocation && !matchesType && !matchesConfig && !matchesDesc && !matchesHighlights) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.priceNumeric - b.priceNumeric;
      }
      if (sortBy === 'price-desc') {
        return b.priceNumeric - a.priceNumeric;
      }
      // 'featured'
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }, [activeTab, searchQuery, sortBy]);

  const hasActiveFilters = activeTab !== 'all' || searchQuery.trim().length > 0;

  const resetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSortBy('featured');
    saveUserPreferences({ activeTab: 'all', sortBy: 'featured' });
    if (onSelectCategory) {
      onSelectCategory('all');
    }
  };

  return (
    <section 
      id="properties" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text)',
        position: 'relative',
        paddingTop: '6rem',
        paddingBottom: '6rem'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ maxWidth: '840px', marginBottom: '3.5rem' }}>
          <div className="eyebrow reveal-fade-up">
            PORTFOLIO DISCOVERY
          </div>
          <h2 className="section-title-charcoal reveal-fade-up delay-100" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            “Every Home Holds a Story.”
          </h2>
          <p className="lead-editorial reveal-fade-up delay-200" style={{ fontSize: '1.1rem', color: 'var(--color-muted)', lineHeight: 1.65 }}>
            Explore hand-picked, legally clear residential mandates situated within the thriving Sarjapur Road micro-market. From private garden villas to transit-linked tech apartments.
          </p>
        </div>

        {/* 1. Category Filter Navigation — Liquid-Glass Pill Track */}
        <div className="reveal-fade-up delay-200" style={{ marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(252, 255, 245, 0.45)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              padding: '0.4rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(219, 218, 175, 0.6)',
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), 0 4px 16px rgba(37, 40, 25, 0.04)'
            }}
            role="tablist"
            aria-label="Property categories"
          >
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.key}`}
                  id={`tab-${tab.key}`}
                  onClick={() => handleTabChange(tab.key)}
                  style={{
                    position: 'relative',
                    padding: '0.6rem 1.35rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.01em',
                    color: isActive ? 'var(--color-eggshell)' : 'var(--color-verdun)',
                    background: isActive ? 'var(--color-verdun)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 14px rgba(72, 82, 28, 0.28)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Search & Sorter Controls Bar — Translucent Glass */}
        <div className="reveal-fade-up delay-250" style={{
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid var(--color-orinoco)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(37, 40, 25, 0.03)'
        }}>
          {/* Search Input Box */}
          <div style={{ flex: '1 1 300px', position: 'relative', minWidth: '260px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-muted)', display: 'flex', alignItems: 'center' }}>
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by locality, configuration (e.g. Kaikondrahalli, 3 BHK, Villa)..."
              style={{
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 2.85rem',
                fontSize: '0.9rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(219, 218, 175, 0.7)',
                background: 'rgba(252, 255, 245, 0.6)',
                color: 'var(--color-text)',
                outline: 'none',
                transition: 'all var(--transition-fast)'
              }}
              aria-label="Search properties"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ 
                  position: 'absolute', 
                  right: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--color-muted)', 
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sorter Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 500 }}>
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(219, 218, 175, 0.7)',
                background: 'rgba(252, 255, 245, 0.7)',
                color: 'var(--color-text)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-label="Sort properties"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* 3. Results Counter & Active Filter Reset */}
        <div className="reveal-fade-up delay-300" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          fontSize: '0.85rem',
          color: 'var(--color-muted)'
        }}>
          <div>
            Showing <strong style={{ color: 'var(--color-verdun)' }}>{filteredProperties.length}</strong> available residences
            {activeTab !== 'all' && <span> in <em>{filterTabs.find(t => t.key === activeTab)?.label}</em></span>}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                color: 'var(--color-verdun)',
                fontWeight: 600,
                textDecoration: 'underline',
                fontSize: '0.82rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none'
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* 4. Property Grid or Clean Empty State */}
        {filteredProperties.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '2rem'
          }}>
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onEnquire={onEnquire}
                staggerIndex={index}
              />
            ))}
          </div>
        ) : (
          /* Polished Empty State — Generously Rounded */
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-orinoco)',
            boxShadow: '0 4px 20px rgba(37, 40, 25, 0.04)'
          }}>
            <Sparkles size={36} style={{ color: 'var(--color-green-smoke)', margin: '0 auto 1.25rem' }} />
            <h3 style={{
              fontSize: '1.65rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-verdun)',
              marginBottom: '0.5rem'
            }}>
              No Matching Residences Found
            </h3>
            <p style={{
              color: 'var(--color-muted)',
              maxWidth: '480px',
              margin: '0 auto 1.5rem',
              fontSize: '0.95rem',
              lineHeight: 1.6
            }}>
              We couldn't find an exact match for your search criteria. Our off-market inventory on Sarjapur Road frequently has unlisted mandates.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary"
              style={{ padding: '0.75rem 1.75rem' }}
            >
              View All Properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
