import React from 'react';
import { MapPin, Bed, Bath, Maximize2, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
  onSelect: (prop: Property) => void;
  onEnquire: (propertyTitle: string) => void;
  staggerIndex?: number;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, onEnquire, staggerIndex = 0 }) => {
  const whatsappMessage = `Hello Sri Balaji Real Estate, I would like to enquire about ${property.title}. Please share the available details.`;
  const whatsappUrl = `https://wa.me/919535854614?text=${encodeURIComponent(whatsappMessage)}`;

  // Calculate stagger delay (capped between 0 and 500ms)
  const delayMs = (staggerIndex % 6) * 100;

  return (
    <article 
      className="property-card-editorial reveal-fade-up"
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transitionDelay: `${delayMs}ms`
      }}
      aria-label={`Property: ${property.title}`}
    >
      {/* 1. Top Image Section with Hover Zoom & Badges */}
      <div 
        style={{
          position: 'relative',
          height: '260px',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: 'var(--color-orinoco)',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)'
        }}
        onClick={() => onSelect(property)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(property);
          }
        }}
        aria-label={`View dossier for ${property.title}`}
      >
        <img 
          src={property.heroImage} 
          alt={property.title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        />

        {/* Top Badges — Fully Pill-Shaped */}
        <div style={{
          position: 'absolute',
          top: '0.85rem',
          left: '0.85rem',
          right: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none'
        }}>
          {/* Configuration & Type Badge */}
          <span style={{
            background: 'var(--color-verdun)',
            color: 'var(--color-eggshell)',
            fontSize: '0.72rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid rgba(219, 218, 175, 0.4)',
            boxShadow: '0 2px 8px rgba(37, 40, 25, 0.25)'
          }}>
            {property.configuration} • {property.type}
          </span>

          {/* Development Sample / Verified Indicator */}
          {property.isDemoListing ? (
            <span style={{
              background: 'var(--color-orinoco)',
              color: 'var(--color-verdun)',
              fontSize: '0.68rem',
              fontWeight: 600,
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--color-green-smoke)',
              boxShadow: '0 2px 8px rgba(37, 40, 25, 0.1)'
            }}>
              Development Sample
            </span>
          ) : (
            <span style={{
              background: 'rgba(72, 82, 28, 0.92)',
              color: 'var(--color-eggshell)',
              fontSize: '0.7rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-pill)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              border: '1px solid var(--color-orinoco)'
            }}>
              <ShieldCheck size={13} style={{ color: 'var(--color-orinoco)' }} />
              <span>Verified Title</span>
            </span>
          )}
        </div>

        {/* Bottom Image Gradient Bar: Availability Status & Facing */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '0.6rem 0.95rem',
          background: 'linear-gradient(180deg, transparent, rgba(37, 40, 25, 0.92))',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-eggshell)',
          fontWeight: 500
        }}>
          <span>{property.status}</span>
          <span>{property.facing} Facing</span>
        </div>
      </div>

      {/* 2. Content Details (Verdun Green Headings & Translucent Dividers) */}
      <div style={{
        padding: '1.4rem',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: 'transparent'
      }}>
        <div>
          {/* Locality & Micro-Market */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: 'var(--color-muted)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.45rem'
          }}>
            <MapPin size={13} style={{ color: 'var(--color-green-smoke)' }} />
            <span>{property.locality} • Sarjapur Corridor</span>
          </div>

          {/* Title in Verdun Green */}
          <h3 
            onClick={() => onSelect(property)}
            style={{
              fontSize: '1.35rem',
              fontFamily: 'var(--font-serif)',
              color: 'var(--color-verdun)',
              lineHeight: 1.25,
              marginBottom: '0.4rem',
              cursor: 'pointer',
              transition: 'color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-verdun)'}
          >
            {property.title}
          </h3>

          {/* Tagline / Architectural Summary */}
          <p style={{
            fontSize: '0.86rem',
            color: 'var(--color-muted)',
            lineHeight: 1.55,
            marginBottom: '1.1rem'
          }}>
            {property.tagline}
          </p>

          {/* Configuration Specs Row with Orinoco Dividers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.4rem',
            padding: '0.7rem 0',
            borderTop: '1px solid var(--color-orinoco)',
            borderBottom: '1px solid var(--color-orinoco)',
            marginBottom: '1.25rem'
          }}>
            {property.bedrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                <Bed size={14} style={{ color: 'var(--color-verdun)' }} />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-text)' }}>
                <Bath size={14} style={{ color: 'var(--color-verdun)' }} />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--color-text)' }}>
              <Maximize2 size={13} style={{ color: 'var(--color-verdun)' }} />
              <span>{property.carpetArea}</span>
            </div>
          </div>
        </div>

        {/* 3. Pricing & Actions */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1rem'
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-muted)' }}>
                {property.priceType === 'rent' ? 'Monthly Lease' : 'Valuation / Price'}
              </span>
              <div style={{
                fontSize: '1.55rem',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                color: 'var(--color-verdun)',
                lineHeight: 1.1
              }}>
                {property.price}
              </div>
            </div>
            
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--color-muted)',
              borderBottom: '1px dotted var(--color-orinoco)',
              paddingBottom: '2px'
            }}>
              Ref: {property.id}
            </span>
          </div>

          {/* Action Buttons: View Details & Enquire Now */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.65rem'
          }}>
            <button 
              onClick={() => onSelect(property)}
              className="btn-outline"
              style={{
                padding: '0.65rem 0.75rem',
                fontSize: '0.82rem',
                justifyContent: 'center',
                width: '100%',
                minHeight: '44px'
              }}
            >
              <span>View Details</span>
              <span className="btn-arrow">
                <ArrowRight size={13} />
              </span>
            </button>

            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{
                padding: '0.65rem 0.75rem',
                fontSize: '0.82rem',
                justifyContent: 'center',
                width: '100%',
                minHeight: '44px'
              }}
              title="Enquire on WhatsApp with property title"
              aria-label={`Enquire about ${property.title} on WhatsApp`}
            >
              <MessageSquare size={14} />
              <span>Enquire Now</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
