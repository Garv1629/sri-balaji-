import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Filter, AlertCircle, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Property, PropertyFilterTab } from '../types/property';
import { useProperties } from '../context/PropertyContext';
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
  const { properties, isLoading, isSupabaseLive } = useProperties();
  const [activeTab, setActiveTab] = useState<PropertyFilterTab>(
    (selectedCategory as PropertyFilterTab) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Handle external category change if passed
  React.useEffect(() => {
    if (selectedCategory && selectedCategory !== activeTab) {
      setActiveTab(selectedCategory as PropertyFilterTab);
    }
  }, [selectedCategory]);

  const handleTabChange = (tab: PropertyFilterTab) => {
    setActiveTab(tab);
    if (onSelectCategory) {
      onSelectCategory(tab);
    }
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

  // Combined Search & Filter Logic from Authoritative Database
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
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

      // 2. Real-time Search Filter (titles, configurations, localities)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocality = property.locality.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        const matchesConfig = property.configuration.toLowerCase().includes(query);
        const matchesType = property.type.toLowerCase().includes(query);
        const matchesTag = property.tagline.toLowerCase().includes(query);

        if (!matchesTitle && !matchesLocality && !matchesLocation && !matchesConfig && !matchesType && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceNumeric - b.priceNumeric;
      if (sortBy === 'price-desc') return b.priceNumeric - a.priceNumeric;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [activeTab, searchQuery, sortBy]);

  const hasActiveFilters = activeTab !== 'all' || searchQuery.trim() !== '' || sortBy !== 'featured';

  const resetFilters = () => {
    setActiveTab('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <section 
      id="properties" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-eggshell)',
        color: 'var(--color-text)',
        paddingTop: '6.5rem',
        paddingBottom: '7rem',
        borderTop: '1px solid var(--color-orinoco)',
        borderBottom: '1px solid var(--color-orinoco)'
      }}
    >
      <div className="container">
        {/* 1. Editorial Section Header */}
        <div style={{
          maxWidth: '780px',
          marginBottom: '3.5rem'
        }}>
          {/* Eyebrow */}
          <div className="eyebrow reveal-fade-up">
            CURATED SPACES
          </div>

          {/* Heading */}
          <h2 className="section-title-charcoal reveal-fade-up delay-100">
            Find Your Next Place.
          </h2>

          {/* Supporting Text */}
          <p className="section-desc-charcoal reveal-fade-up delay-150">
            Explore available homes and properties with assistance from Sri Balaji Real Estate. Whether seeking an architectural villa, high-rise residence, or turnkey executive rental, each listing is represented with complete clarity.
          </p>

          {/* Sample Dataset Notice */}
          <div className="reveal-fade-up delay-200" style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            background: 'rgba(219, 218, 175, 0.3)',
            border: '1px solid var(--color-orinoco)',
            borderRadius: 'var(--radius-md)',
            padding: '0.65rem 1.15rem',
            marginTop: '1.25rem',
            fontSize: '0.78rem',
            color: 'var(--color-verdun)',
            maxWidth: '100%',
            lineHeight: 1.5
          }}>
            <AlertCircle size={15} style={{ color: 'var(--color-verdun)', flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Showcase Portfolio:</strong> Listings below are architectural models for evaluation. For active off-market inventory on Sarjapur Road, connect with our desk directly.
            </span>
          </div>
        </div>

        {/* 2. Interactive Filter Bar & Search Field */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          marginBottom: '2.75rem'
        }}>
          {/* Horizontally Scrollable Categories Tab on Mobile, Flex on Desktop */}
          <div className="filter-tabs-scroll reveal-fade-up delay-200" role="tablist" aria-label="Property Category Filters">
            {filterTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleTabChange(tab.key)}
                  style={{
                    padding: '0.65rem 1.4rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive ? 'var(--color-verdun)' : 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    color: isActive ? 'var(--color-eggshell)' : 'var(--color-text)',
                    border: isActive ? '1px solid var(--color-verdun)' : '1px solid rgba(219, 218, 175, 0.6)',
                    boxShadow: isActive 
                      ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), 0 4px 14px rgba(72, 82, 28, 0.25)' 
                      : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.7), 0 2px 6px rgba(37, 40, 25, 0.04)'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector Row — Translucent Glass Container */}
          <div className="reveal-fade-up delay-250" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(252, 255, 245, 0.55) 100%)',
            backdropFilter: 'blur(20px) saturate(160%)',
            WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(219, 218, 175, 0.55)',
            borderRadius: 'var(--radius-xl)',
            padding: '0.9rem 1.4rem',
            boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.85), 0 12px 32px rgba(37, 40, 25, 0.06)'
          }}>
            {/* Real Search Field — Translucent Glass Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flex: '1 1 min(100%, 280px)',
              minWidth: 0,
              background: 'rgba(252, 255, 245, 0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              padding: '0.6rem 1.25rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid rgba(219, 218, 175, 0.55)',
              boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)'
            }}>
              <Search size={16} style={{ color: 'var(--color-muted)', flexShrink: 0 }} />
              <input 
                type="text"
                placeholder="Search by title, configuration (e.g. 2 BHK, Villa), or locality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.86rem',
                  width: '100%',
                  minWidth: 0,
                  fontFamily: 'var(--font-sans)'
                }}
                aria-label="Search properties by title, configuration or locality"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ color: 'var(--color-muted)', padding: '2px', display: 'flex', alignItems: 'center' }}
                  title="Clear search"
                  aria-label="Clear search input"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort Dropdown — Translucent Glass Pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', fontWeight: 500 }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  background: 'rgba(252, 255, 245, 0.6)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: 'var(--color-text)',
                  border: '1px solid rgba(219, 218, 175, 0.55)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.8rem',
                  outline: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                  boxShadow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.7)'
                }}
                aria-label="Sort properties"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
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
                cursor: 'pointer'
              }}
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* 4. Loading State or Property Grid or Clean Empty State */}
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-orinoco)'
          }}>
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-verdun)', margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-verdun)', marginBottom: '0.5rem' }}>
              Synchronizing Verified Residences...
            </h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              Connecting to authoritative PostgreSQL property database across devices.
            </p>
          </div>
        ) : filteredProperties.length > 0 ? (
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
              No Matching Properties Found
            </h3>
            <p style={{ color: 'var(--color-muted)', maxWidth: '480px', margin: '0 auto 1.75rem', lineHeight: 1.6, fontSize: '0.92rem' }}>
              We could not find any properties matching "{searchQuery || activeTab}". Sri Balaji Real Estate handles unlisted private mandates and pre-market villas along Sarjapur Road.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={resetFilters}
                className="btn-outline"
              >
                Clear Search & Filters
              </button>
              <button 
                onClick={() => onEnquire('Off-Market Mandate Search')}
                className="btn-primary"
              >
                <span>Request Off-Market Mandate</span>
                <span className="btn-arrow">
                  <ArrowRight size={15} />
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
