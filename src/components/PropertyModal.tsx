import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize2, ShieldCheck, Check, MessageSquare, Phone, AlertCircle, Calendar } from 'lucide-react';
import { Property } from '../types/property';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onEnquire: (propertyTitle: string) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose, onEnquire }) => {
  if (!property) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Keyboard navigation & body scroll locking for accessibility
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // Contextual WhatsApp enquiry message according to Section 7:
  const whatsappMessage = `Hello Sri Balaji Real Estate, I would like to enquire about ${property.title}. Please share the available details.`;
  const whatsappUrl = `https://wa.me/919535854614?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(37, 40, 25, 0.72)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-property-title"
    >
      <div 
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(252, 255, 245, 0.82) 100%)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(252, 255, 245, 0.75)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          position: 'relative',
          boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 25px 60px rgba(37, 40, 25, 0.3)',
          color: 'var(--color-text)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 10,
            background: 'var(--color-eggshell)',
            border: '1px solid var(--color-orinoco)',
            color: 'var(--color-verdun)',
            borderRadius: 'var(--radius-circle)',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 40, 25, 0.15)'
          }}
          aria-label="Close property details"
        >
          <X size={20} />
        </button>

        {/* Gallery Section */}
        <div style={{ position: 'relative' }}>
          <div style={{ height: '380px', overflow: 'hidden', backgroundColor: 'var(--color-eggshell)' }}>
            <img 
              src={property.images[activeImageIdx] || property.heroImage} 
              alt={property.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Thumbnail Strip */}
          {property.images.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.6rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--color-eggshell)',
              borderBottom: '1px solid var(--color-orinoco)',
              overflowX: 'auto'
            }}>
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  style={{
                    width: '64px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: activeImageIdx === idx ? '2px solid var(--color-verdun)' : '1px solid var(--color-orinoco)',
                    opacity: activeImageIdx === idx ? 1 : 0.6,
                    flexShrink: 0,
                    padding: 0,
                    cursor: 'pointer'
                  }}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img src={img} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'clamp(1.25rem, 3.5vw, 2rem)' }}>
          {/* Header Row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            borderBottom: '1px solid var(--color-orinoco)',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--color-verdun)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '0.35rem'
              }}>
                <MapPin size={14} style={{ color: 'var(--color-green-smoke)' }} />
                <span>{property.location}</span>
              </div>

              <h2 id="modal-property-title" style={{
                fontSize: '2rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-verdun)',
                lineHeight: 1.15
              }}>
                {property.title}
              </h2>

              <p style={{ color: 'var(--color-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                {property.tagline}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--color-muted)', letterSpacing: '0.12em', fontWeight: 600 }}>
                {property.priceType === 'rent' ? 'Monthly Lease' : 'Valuation / Price'}
              </span>
              <div style={{
                fontSize: '2.2rem',
                fontFamily: 'var(--font-serif)',
                color: 'var(--color-verdun)',
                fontWeight: 600,
                lineHeight: 1
              }}>
                {property.price}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '0.5rem',
                marginTop: '0.35rem'
              }}>
                <span style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: 600,
                  color: 'var(--color-verdun)',
                  background: 'rgba(219, 218, 175, 0.35)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)'
                }}>
                  {property.status}
                </span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.72rem' }}>• Ref: {property.id}</span>
              </div>
            </div>
          </div>

          {/* Development Sample Clarification */}
          {property.isDemoListing && (
            <div style={{
              background: 'rgba(219, 218, 175, 0.25)',
              border: '1px solid var(--color-orinoco)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: 'var(--color-text)'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-verdun)' }} />
              <div>
                <strong style={{ color: 'var(--color-verdun)' }}>Development Showcase Notice:</strong> This listing is an architectural prototype representing configurations available along Sarjapur Road. Contact Sri Balaji Real Estate at +91 95358 54614 for live deed verification and current site visits.
              </div>
            </div>
          )}

          {/* Quick Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            background: 'var(--color-eggshell)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-orinoco)',
            marginBottom: '2rem'
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Configuration</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-verdun)' }}>{property.configuration}</div>
            </div>
            {property.bathrooms > 0 && (
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bathrooms</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-verdun)' }}>{property.bathrooms} Baths</div>
              </div>
            )}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Carpet Area</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-verdun)' }}>{property.carpetArea}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Facing</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-verdun)' }}>{property.facing}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Availability</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-verdun)' }}>{property.status}</div>
            </div>
          </div>

          {/* Detailed Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', marginBottom: '0.75rem' }}>
              Architectural Overview
            </h4>
            <p style={{ color: 'var(--color-text)', lineHeight: 1.8, fontSize: '0.98rem' }}>
              {property.description || property.overview}
            </p>
          </div>

          {/* Key Highlights */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', marginBottom: '0.75rem' }}>
              Key Property Highlights
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '0.75rem' }}>
              {property.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  <Check size={16} style={{ color: 'var(--color-verdun)', flexShrink: 0, marginTop: '3px' }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Amenities - Fully Rounded Pills */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', marginBottom: '0.75rem' }}>
              Verified Amenities
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {property.amenities.map((amenity, idx) => (
                <div key={idx} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.85rem',
                  color: 'var(--color-text)',
                  background: 'var(--color-eggshell)',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--color-orinoco)'
                }}>
                  <ShieldCheck size={15} style={{ color: 'var(--color-verdun)' }} />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Specifications - Rounded Cards */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', marginBottom: '0.75rem' }}>
              Technical Specifications
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
              gap: '0.85rem'
            }}>
              {property.specs.map((s, idx) => (
                <div key={idx} style={{
                  background: 'var(--color-eggshell)',
                  border: '1px solid var(--color-orinoco)',
                  padding: '0.85rem 1.15rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--color-verdun)', fontWeight: 600, marginTop: '2px' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Action Footer */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderTop: '1px solid var(--color-orinoco)',
            paddingTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--color-muted)' }}>
              <span>Office Desk:</span>
              <a href="tel:+919535854614" style={{ color: 'var(--color-verdun)', fontWeight: 600, textDecoration: 'underline' }}>
                +91 95358 54614
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Enquiry</span>
              </a>

              <button 
                onClick={() => {
                  onClose();
                  onEnquire(property.title);
                }}
                className="btn-primary"
              >
                <Calendar size={15} />
                <span>Schedule Showing</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
