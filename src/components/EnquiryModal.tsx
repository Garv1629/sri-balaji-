import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Phone, ShieldCheck, CheckCircle2, Copy, Check, Building2 } from 'lucide-react';
import { EnquiryData } from '../types/property';
import { loadEnquiryDraft, clearEnquiryDraft } from '../lib/indexedDb';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProperty?: string;
  prefilledPropertyId?: string;
  prefilledLocation?: string;
  prefilledConfiguration?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  prefilledProperty = '',
  prefilledPropertyId = '',
  prefilledLocation = '',
  prefilledConfiguration = ''
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<EnquiryData>({
    fullName: '',
    phone: '',
    propertyType: 'apartment',
    configuration: '2 BHK',
    preferredLocality: prefilledLocation || '',
    budget: '',
    message: '',
    propertyId: prefilledPropertyId,
    propertyTitle: prefilledProperty,
    propertyLocation: prefilledLocation,
    propertyConfiguration: prefilledConfiguration
  });

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [preparedText, setPreparedText] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Step 13: Restore saved name/phone from IndexedDB draft if available
  useEffect(() => {
    let isMounted = true;
    loadEnquiryDraft().then((saved) => {
      if (isMounted && saved) {
        setFormData(prev => ({
          ...prev,
          fullName: prev.fullName || saved.fullName || '',
          phone: prev.phone || saved.phone || ''
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard navigation & body scroll locking for accessibility
  useEffect(() => {
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

  useEffect(() => {
    if (prefilledProperty) {
      setFormData(prev => ({
        ...prev,
        propertyTitle: prefilledProperty,
        propertyId: prefilledPropertyId,
        propertyLocation: prefilledLocation,
        propertyConfiguration: prefilledConfiguration
      }));
    }
  }, [prefilledProperty, prefilledPropertyId, prefilledLocation, prefilledConfiguration]);

  const validatePhone = (phone: string): boolean => {
    const clean = phone.replace(/[\s()-]/g, '');
    return /^(\+?\d{1,4})?\d{10}$/.test(clean) || /^\d{10,13}$/.test(clean);
  };

  const validate = (): boolean => {
    const errs: { fullName?: string; phone?: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errs.phone = 'Please enter a valid phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildWhatsAppMessage = (): string => {
    const typeLabel = 
      formData.propertyType === 'apartment' ? 'Apartment' :
      formData.propertyType === 'villa' ? 'Villa' :
      formData.propertyType === 'independent house' ? 'Independent House' : 'Other';

    if (formData.propertyTitle) {
      return (
        `Hello Sri Balaji Real Estate,\n\n` +
        `I would like to enquire about the following listing:\n` +
        `Property: ${formData.propertyTitle}${formData.propertyId ? ` (ID: ${formData.propertyId})` : ''}\n` +
        (formData.propertyConfiguration ? `Configuration: ${formData.propertyConfiguration}\n` : '') +
        (formData.propertyLocation ? `Location: ${formData.propertyLocation}\n` : '') +
        `\n` +
        `Name: ${formData.fullName.trim()}\n` +
        `Phone: ${formData.phone.trim()}\n` +
        (formData.preferredLocality?.trim() ? `Preferred Locality: ${formData.preferredLocality.trim()}\n` : '') +
        (formData.budget?.trim() ? `Budget: ${formData.budget.trim()}\n` : '') +
        (formData.message?.trim() ? `\nMessage: ${formData.message.trim()}\n` : '') +
        `\nPlease share the available details and visit availability.`
      );
    }

    return (
      `Hello Sri Balaji Real Estate,\n\n` +
      `I am interested in finding a property.\n\n` +
      `Name: ${formData.fullName.trim()}\n` +
      `Property Type: ${typeLabel}\n` +
      `Configuration: ${formData.configuration}\n` +
      `Preferred Locality: ${formData.preferredLocality?.trim() || 'Sarjapur Road / Bengaluru'}\n` +
      `Budget: ${formData.budget?.trim() || 'To be discussed'}\n` +
      (formData.message?.trim() ? `\nMessage: ${formData.message.trim()}\n` : '') +
      `\nPlease share suitable available options.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/919535854614?text=${encodeURIComponent(msg)}`;

    setPreparedText(msg);
    setWhatsappUrl(url);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      clearEnquiryDraft();
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(preparedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
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
      aria-labelledby="enquiry-modal-heading"
    >
      <div 
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.94) 0%, rgba(252, 255, 245, 0.85) 100%)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(252, 255, 245, 0.8)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '560px',
          width: '100%',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          position: 'relative',
          boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 25px 60px rgba(37, 40, 25, 0.28)',
          color: 'var(--color-text)',
          maxHeight: '90vh',
          overflowY: 'auto',
          overscrollBehavior: 'contain'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'var(--color-eggshell)',
            border: '1px solid var(--color-orinoco)',
            color: 'var(--color-verdun)',
            borderRadius: 'var(--radius-circle)',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 10px rgba(37, 40, 25, 0.1)'
          }}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {showConfirmation ? (
          <div style={{ textAlign: 'center', padding: '1.25rem 0.5rem' }}>
            <div style={{
              width: '58px',
              height: '58px',
              borderRadius: 'var(--radius-circle)',
              background: 'rgba(219, 218, 175, 0.35)',
              border: '1px solid var(--color-green-smoke)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-verdun)',
              margin: '0 auto 1.25rem'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <div style={{ fontSize: '0.75rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-verdun)', fontWeight: 700 }}>
              Enquiry Prepared
            </div>

            <h3 id="enquiry-modal-heading" style={{ fontSize: '1.65rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', margin: '0.5rem 0' }}>
              Connect with Sri Balaji Real Estate
            </h3>

            <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your enquiry has been formatted for our WhatsApp advisory desk. <strong>Please review and tap Send inside WhatsApp to deliver your message.</strong>
            </p>

            <div style={{
              background: 'var(--color-eggshell)',
              border: '1px solid var(--color-orinoco)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: 'var(--color-text)',
              whiteSpace: 'pre-wrap',
              marginBottom: '1.5rem',
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              {preparedText}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
              >
                <MessageSquare size={16} />
                <span>Open in WhatsApp & Send</span>
              </a>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <button 
                  onClick={handleCopy}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                <button 
                  onClick={onClose}
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Close Window
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--color-verdun)', fontWeight: 700 }}>
                Sri Balaji Real Estate
              </div>
              <h3 id="enquiry-modal-heading" style={{ fontSize: '1.65rem', fontFamily: 'var(--font-serif)', color: 'var(--color-verdun)', margin: '0.35rem 0' }}>
                Start a Property Conversation
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', margin: 0 }}>
                Tell us what you're looking for to receive curated options across Sarjapur Road.
              </p>
            </div>

            {formData.propertyTitle && (
              <div style={{
                background: 'rgba(219, 218, 175, 0.25)',
                border: '1px solid var(--color-orinoco)',
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.82rem',
                color: 'var(--color-verdun)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <Building2 size={15} style={{ color: 'var(--color-green-smoke)' }} />
                <span>Selected: <strong>{formData.propertyTitle}</strong></span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label htmlFor="modal-name" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Full Name *
                </label>
                <input 
                  id="modal-name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--color-eggshell)',
                    border: errors.fullName ? '1px solid #DC2626' : '1px solid var(--color-orinoco)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.75rem 1.25rem',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {errors.fullName && <span style={{ color: '#DC2626', fontSize: '0.75rem', paddingLeft: '0.5rem' }}>{errors.fullName}</span>}
              </div>

              <div>
                <label htmlFor="modal-phone" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Mobile Phone *
                </label>
                <input 
                  id="modal-phone"
                  type="tel"
                  placeholder="+91 95358 54614"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  style={{
                    width: '100%',
                    background: 'var(--color-eggshell)',
                    border: errors.phone ? '1px solid #DC2626' : '1px solid var(--color-orinoco)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.75rem 1.25rem',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                {errors.phone && <span style={{ color: '#DC2626', fontSize: '0.75rem', paddingLeft: '0.5rem' }}>{errors.phone}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label htmlFor="modal-type" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Property Type
                  </label>
                  <select 
                    id="modal-type"
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: 'var(--color-eggshell)',
                      border: '1px solid var(--color-orinoco)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.75rem 1rem',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="independent house">Independent House</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="modal-config" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Configuration
                  </label>
                  <select 
                    id="modal-config"
                    value={formData.configuration}
                    onChange={(e) => setFormData({ ...formData, configuration: e.target.value as any })}
                    style={{
                      width: '100%',
                      background: 'var(--color-eggshell)',
                      border: '1px solid var(--color-orinoco)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.75rem 1rem',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK+">3 BHK+</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label htmlFor="modal-locality" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Locality (Optional)
                  </label>
                  <input 
                    id="modal-locality"
                    type="text"
                    placeholder="e.g. Halanayakanahalli"
                    value={formData.preferredLocality}
                    onChange={(e) => setFormData({ ...formData, preferredLocality: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--color-eggshell)',
                      border: '1px solid var(--color-orinoco)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.75rem 1.15rem',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="modal-budget" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                    Budget (Optional)
                  </label>
                  <input 
                    id="modal-budget"
                    type="text"
                    placeholder="e.g. ₹ 45 L or ₹ 25k/mo"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'var(--color-eggshell)',
                      border: '1px solid var(--color-orinoco)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0.75rem 1.15rem',
                      color: 'var(--color-text)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="modal-message" style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-verdun)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Message (Optional)
                </label>
                <textarea 
                  id="modal-message"
                  rows={2}
                  placeholder="Preferences on timing, floor, or questions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'var(--color-eggshell)',
                    border: '1px solid var(--color-orinoco)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1.15rem',
                    color: 'var(--color-text)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ width: '100%', padding: '1rem', fontSize: '0.9rem', marginTop: '0.5rem', justifyContent: 'center' }}
              >
                <MessageSquare size={16} />
                <span>{isSubmitting ? 'Formatting...' : 'Start a Conversation in WhatsApp'}</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-verdun)' }} />
                <span>Direct advisory phone: +91 95358 54614</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
