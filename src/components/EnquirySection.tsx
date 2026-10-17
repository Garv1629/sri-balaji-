import React, { useState, useRef, useEffect } from 'react';
import { Phone, MessageSquare, MapPin, ShieldCheck, ArrowRight, CheckCircle2, Copy, Check, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { EnquiryData, Property } from '../types/property';
import { loadEnquiryDraft, saveEnquiryDraft, clearEnquiryDraft } from '../lib/indexedDb';

interface EnquirySectionProps {
  initialProperty?: string;
  selectedPropertyObj?: Property | null;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({ 
  initialProperty = '',
  selectedPropertyObj = null 
}) => {
  const [formData, setFormData] = useState<EnquiryData>({
    fullName: '',
    phone: '',
    propertyType: selectedPropertyObj 
      ? (selectedPropertyObj.category === 'villas' ? 'villa' : 'apartment')
      : 'apartment',
    configuration: selectedPropertyObj
      ? (selectedPropertyObj.configuration === '1 BHK' ? '1 BHK' 
        : selectedPropertyObj.configuration === '2 BHK' ? '2 BHK' 
        : selectedPropertyObj.configuration === '3 BHK' ? '3 BHK+' 
        : 'flexible')
      : '2 BHK',
    preferredLocality: selectedPropertyObj?.locality || '',
    budget: selectedPropertyObj?.price || '',
    message: '',
    propertyId: selectedPropertyObj?.id,
    propertyTitle: selectedPropertyObj?.title || initialProperty,
    propertyLocation: selectedPropertyObj?.location,
    propertyConfiguration: selectedPropertyObj?.configuration
  });

  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');
  const [preparedMessageText, setPreparedMessageText] = useState('');
  const [copied, setCopied] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Step 13: Restore consultation draft from IndexedDB
  useEffect(() => {
    let isMounted = true;
    loadEnquiryDraft().then((saved) => {
      if (isMounted && saved) {
        setFormData(prev => ({
          ...prev,
          fullName: saved.fullName || prev.fullName,
          phone: saved.phone || prev.phone,
          preferredLocality: saved.preferredLocality || prev.preferredLocality,
          budget: saved.budget || prev.budget,
          message: saved.message || prev.message
        }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Step 13: Auto-persist form input drafts to IndexedDB safely
  useEffect(() => {
    if (formData.fullName || formData.phone || formData.message || formData.preferredLocality) {
      const timer = setTimeout(() => {
        saveEnquiryDraft(formData);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData]);

  // Sync if initialProperty or selectedPropertyObj changes
  useEffect(() => {
    if (selectedPropertyObj) {
      setFormData(prev => ({
        ...prev,
        propertyTitle: selectedPropertyObj.title,
        propertyId: selectedPropertyObj.id,
        propertyLocation: selectedPropertyObj.location,
        propertyConfiguration: selectedPropertyObj.configuration,
        preferredLocality: selectedPropertyObj.locality || prev.preferredLocality,
        budget: selectedPropertyObj.price || prev.budget,
        propertyType: selectedPropertyObj.category === 'villas' ? 'villa' : 'apartment'
      }));
    } else if (initialProperty) {
      setFormData(prev => ({
        ...prev,
        propertyTitle: initialProperty
      }));
    }
  }, [initialProperty, selectedPropertyObj]);

  const validatePhone = (phone: string): boolean => {
    // Strip non-digits except leading +
    const clean = phone.replace(/[\s()-]/g, '');
    // Support Indian 10-digit, 11-digit with leading 0, or international +91 / +...
    return /^(\+?\d{1,4})?\d{10}$/.test(clean) || /^\d{10,13}$/.test(clean);
  };

  const validate = (): boolean => {
    const errs: { fullName?: string; phone?: string } = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Please provide a contact phone number';
    } else if (!validatePhone(formData.phone)) {
      errs.phone = 'Please enter a valid phone number (e.g. +91 95358 54614 or 9876543210)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const buildWhatsAppMessage = (): string => {
    const propertyTypeLabel = 
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
      `Property Type: ${propertyTypeLabel}\n` +
      `Configuration: ${formData.configuration}\n` +
      `Preferred Locality: ${formData.preferredLocality?.trim() || 'Sarjapur Road / Surrounding Areas'}\n` +
      `Budget: ${formData.budget?.trim() || 'To be discussed'}\n` +
      (formData.message?.trim() ? `\nMessage: ${formData.message.trim()}\n` : '') +
      `\nPlease share suitable available options.`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/919535854614?text=${encoded}`;

    setPreparedMessageText(message);
    setGeneratedWhatsAppUrl(waUrl);

    // Simulate clean transition state without pretending a backend DB wrote the row
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      // Clear saved consultation draft from IndexedDB
      clearEnquiryDraft();
      // Automatically open WhatsApp in a new window/tab
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, 450);
  };

  const handleCopyMessage = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(preparedMessageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleClearSelectedProperty = () => {
    setFormData(prev => ({
      ...prev,
      propertyTitle: undefined,
      propertyId: undefined,
      propertyLocation: undefined,
      propertyConfiguration: undefined
    }));
  };

  return (
    <section 
      id="contact" 
      className="section-wrapper" 
      style={{
        backgroundColor: 'var(--color-eggshell)',
        color: 'var(--color-text)',
        position: 'relative',
        paddingTop: '6.5rem',
        paddingBottom: '6.5rem',
        borderTop: '1px solid var(--color-orinoco)'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: '4rem' }}>
          <div className="eyebrow reveal-fade-up">
            LET'S FIND YOUR NEXT SPACE
          </div>
          <h2 className="section-title-charcoal reveal-fade-up delay-100" style={{ fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>
            “Your Next Chapter Starts Here.”
          </h2>
          <p className="reveal-fade-up delay-150" style={{
            fontSize: '1.18rem',
            color: 'var(--color-text)',
            lineHeight: 1.75,
            fontWeight: 400,
            maxWidth: '680px',
            marginBottom: '2rem'
          }}>
            Tell us what you're looking for. Our team can help you explore suitable property options around Sarjapur Road and Halanayakanahalli.
          </p>

          {/* Action CTAs */}
          <div className="reveal-fade-up delay-200" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a 
              href="#enquiry-form" 
              className="btn-primary"
              style={{
                padding: '0.85rem 1.75rem',
                fontSize: '0.88rem'
              }}
              onClick={() => {
                nameInputRef.current?.focus();
              }}
            >
              <span>START A CONVERSATION</span>
              <span className="btn-arrow">
                <ArrowRight size={14} />
              </span>
            </a>

            <a 
              href="tel:+919535854614"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--color-verdun)',
                fontWeight: 600,
                fontSize: '0.92rem',
                padding: '0.85rem 1.6rem',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-orinoco)',
                background: '#FFFFFF',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Phone size={15} style={{ color: 'var(--color-green-smoke)' }} />
              <span>CALL OUR TEAM: +91 95358 54614</span>
            </a>
          </div>
        </div>

        {/* Two-Column Editorial Layout: Advisory Details & Functional Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(2rem, 5vw, 4.5rem)',
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Office Details & Understated Architectural Imagery */}
          <div className="reveal-fade-up">
            {/* Architectural Visual Framing */}
            <div 
              className="reveal-image-mask"
              style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(37, 40, 25, 0.08)',
              border: '1px solid var(--color-orinoco)',
              position: 'relative',
              backgroundColor: 'var(--color-orinoco)',
              marginBottom: '2rem'
            }}>
              <img 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" 
                alt="Contemporary residence exterior in Bengaluru"
                loading="lazy"
                style={{
                  width: '100%',
                  height: '320px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 50%, rgba(37, 40, 25, 0.85) 100%)'
              }} />

              <div style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                color: 'var(--color-eggshell)'
              }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-orinoco)', fontWeight: 600 }}>
                  Direct Local Guidance
                </div>
                <div style={{ fontSize: '1.15rem', fontFamily: 'var(--font-serif)', fontWeight: 600, marginTop: '2px' }}>
                  Sri Balaji Real Estate Advisory Desk
                </div>
              </div>
            </div>

            {/* Business Contact Cards — Translucent Glass Panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Office Location */}
              <div className="reveal-fade-up delay-100" style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(252, 255, 245, 0.58) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-md)',
                padding: '1.35rem 1.6rem',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 4px 16px rgba(37, 40, 25, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                  <MapPin size={18} style={{ color: 'var(--color-verdun)', marginTop: '3px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-verdun)', fontWeight: 600 }}>
                      Physical Address
                    </div>
                    <div style={{ fontSize: '0.95rem', color: 'var(--color-text)', fontWeight: 600, marginTop: '3px', lineHeight: 1.5 }}>
                      6, 5th Main Road, Sarjapur Road, Amrita Nagar, Halanayakanahalli, Bengaluru, Karnataka 560035
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Telephone */}
              <div className="reveal-fade-up delay-150" style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(252, 255, 245, 0.58) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-md)',
                padding: '1.35rem 1.6rem',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 4px 16px rgba(37, 40, 25, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <Phone size={18} style={{ color: 'var(--color-verdun)', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-verdun)', fontWeight: 600 }}>
                      Direct Phone
                    </div>
                    <a href="tel:+919535854614" style={{ fontSize: '1.15rem', color: 'var(--color-verdun)', fontWeight: 600, fontFamily: 'var(--font-serif)', marginTop: '2px', display: 'block' }}>
                      +91 95358 54614
                    </a>
                  </div>
                </div>
              </div>

              {/* Verified WhatsApp Destination */}
              <div className="reveal-fade-up delay-200" style={{
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.82) 0%, rgba(252, 255, 245, 0.58) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: 'var(--radius-md)',
                padding: '1.35rem 1.6rem',
                border: '1px solid rgba(219, 218, 175, 0.55)',
                boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), 0 4px 16px rgba(37, 40, 25, 0.04)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <MessageSquare size={18} style={{ color: '#25D366', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-verdun)', fontWeight: 600 }}>
                      WhatsApp Business Desk
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', fontWeight: 500, marginTop: '2px' }}>
                      +91 95358 54614 (Destination ID: 919535854614)
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Information */}
              <div className="reveal-fade-up delay-250" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                color: 'var(--color-muted)',
                fontSize: '0.82rem',
                marginTop: '0.5rem',
                paddingLeft: '0.5rem'
              }}>
                <ShieldCheck size={16} style={{ color: 'var(--color-green-smoke)', flexShrink: 0 }} />
                <span>We respect your privacy. Information is collected solely to respond to your property enquiry.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Functional Enquiry Form Card — Liquid Glass Panel */}
          <div 
            id="enquiry-form"
            className="reveal-fade-up delay-150"
            style={{
              background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.84) 0%, rgba(252, 255, 245, 0.62) 100%)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              border: '1px solid rgba(219, 218, 175, 0.6)',
              borderRadius: 'var(--radius-2xl)',
              padding: 'clamp(1.75rem, 4vw, 2.75rem)',
              boxShadow: 'inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.95), 0 20px 48px rgba(37, 40, 25, 0.08)',
              position: 'relative'
            }}
          >
            {showConfirmation ? (
              /* Honest Confirmation Step */
              <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-circle)',
                  background: 'rgba(72, 82, 28, 0.12)',
                  border: '1px solid var(--color-green-smoke)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-verdun)',
                  margin: '0 auto 1.25rem'
                }}>
                  <CheckCircle2 size={32} />
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--color-verdun)',
                  fontWeight: 600,
                  marginBottom: '0.5rem'
                }}>
                  Enquiry Draft Prepared
                </div>

                <h3 style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-serif)',
                  color: 'var(--color-verdun)',
                  marginBottom: '0.75rem'
                }}>
                  Ready to Connect, {formData.fullName}.
                </h3>

                <p style={{
                  fontSize: '0.92rem',
                  color: 'var(--color-muted)',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                  maxWidth: '480px',
                  margin: '0 auto 1.5rem'
                }}>
                  Your property search details have been formatted for our WhatsApp advisory desk. <strong>Please review and hit Send inside WhatsApp to deliver your message.</strong>
                </p>

                {/* Prepared Message Preview Box — Rounded */}
                <div style={{
                  background: 'var(--color-eggshell)',
                  border: '1px solid var(--color-orinoco)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  fontSize: '0.84rem',
                  color: 'var(--color-text)',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1.5rem',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  fontFamily: 'monospace'
                }}>
                  {preparedMessageText}
                </div>

                {/* Primary Action: Open WhatsApp */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <a
                    href={generatedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '1rem',
                      fontSize: '0.95rem',
                      borderRadius: 'var(--radius-pill)'
                    }}
                  >
                    <MessageSquare size={18} />
                    <span>Open in WhatsApp & Send Message</span>
                  </a>

                  {/* Secondary Action: Copy text fallback */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="btn-outline"
                      style={{
                        padding: '0.75rem',
                        fontSize: '0.82rem',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copied ? 'Copied' : 'Copy Message'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowConfirmation(false)}
                      className="btn-outline"
                      style={{
                        padding: '0.75rem',
                        fontSize: '0.82rem',
                        justifyContent: 'center',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      <span>Edit Preferences</span>
                    </button>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-muted)',
                  marginTop: '1.25rem',
                  lineHeight: 1.5
                }}>
                  Destination: +91 95358 54614 • Direct local advisory in Halanayakanahalli & Sarjapur Road.
                </div>
              </div>
            ) : (
              /* The Functional Form */
              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: '1.75rem' }}>
                  <h3 style={{
                    fontSize: '1.6rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-verdun)',
                    lineHeight: 1.25,
                    marginBottom: '0.35rem'
                  }}>
                    Property Enquiry Form
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.5, margin: 0 }}>
                    Fill in your details below to generate a tailored WhatsApp enquiry for our local team.
                  </p>
                </div>

                {/* Property Context Badge if Active — Pill Shaped */}
                {formData.propertyTitle && (
                  <div style={{
                    background: 'var(--color-eggshell)',
                    border: '1px solid var(--color-orinoco)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0.65rem 1.25rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    color: 'var(--color-verdun)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Building2 size={16} style={{ color: 'var(--color-green-smoke)' }} />
                      <span>
                        Enquiring about: <strong>{formData.propertyTitle}</strong>
                        {formData.propertyId ? ` (Ref: ${formData.propertyId})` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSelectedProperty}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-muted)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      General Enquiry
                    </button>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* 1. Full Name (Required) — Pill Shaped */}
                  <div>
                    <label 
                      htmlFor="enquiry-fullName"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--color-verdun)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.4rem',
                        fontWeight: 600
                      }}
                    >
                      Full Name <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      ref={nameInputRef}
                      id="enquiry-fullName"
                      type="text"
                      name="fullName"
                      autoComplete="name"
                      placeholder="e.g. Rahul Sharma"
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
                        padding: '0.85rem 1.4rem',
                        color: 'var(--color-text)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      aria-required="true"
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                    {errors.fullName && (
                      <span id="fullName-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block', paddingLeft: '1rem' }}>
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  {/* 2. Phone Number (Required) — Pill Shaped */}
                  <div>
                    <label 
                      htmlFor="enquiry-phone"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--color-verdun)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.4rem',
                        fontWeight: 600
                      }}
                    >
                      Phone Number <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
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
                        padding: '0.85rem 1.4rem',
                        color: 'var(--color-text)',
                        fontSize: '0.92rem',
                        outline: 'none',
                        fontFamily: 'inherit'
                      }}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <span id="phone-error" style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block', paddingLeft: '1rem' }}>
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* 3 & 4. Preferred Property Type & Configuration — Pill Shaped */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                    <div>
                      <label 
                        htmlFor="enquiry-propertyType"
                        style={{
                          display: 'block',
                          fontSize: '0.78rem',
                          color: 'var(--color-verdun)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                          fontWeight: 600
                        }}
                      >
                        Property Type
                      </label>
                      <select
                        id="enquiry-propertyType"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                        style={{
                          width: '100%',
                          background: 'var(--color-eggshell)',
                          border: '1px solid var(--color-orinoco)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.85rem 1.4rem',
                          color: 'var(--color-text)',
                          fontSize: '0.9rem',
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
                      <label 
                        htmlFor="enquiry-configuration"
                        style={{
                          display: 'block',
                          fontSize: '0.78rem',
                          color: 'var(--color-verdun)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                          fontWeight: 600
                        }}
                      >
                        Configuration
                      </label>
                      <select
                        id="enquiry-configuration"
                        name="configuration"
                        value={formData.configuration}
                        onChange={(e) => setFormData({ ...formData, configuration: e.target.value as any })}
                        style={{
                          width: '100%',
                          background: 'var(--color-eggshell)',
                          border: '1px solid var(--color-orinoco)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.85rem 1.4rem',
                          color: 'var(--color-text)',
                          fontSize: '0.9rem',
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

                  {/* 5 & 6. Preferred Locality & Budget (Optional) — Pill Shaped */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: '1rem' }}>
                    <div>
                      <label 
                        htmlFor="enquiry-locality"
                        style={{
                          display: 'block',
                          fontSize: '0.78rem',
                          color: 'var(--color-verdun)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                          fontWeight: 600
                        }}
                      >
                        Preferred Locality <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        id="enquiry-locality"
                        type="text"
                        name="preferredLocality"
                        placeholder="e.g. Halanayakanahalli, Sarjapur Rd"
                        value={formData.preferredLocality}
                        onChange={(e) => setFormData({ ...formData, preferredLocality: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'var(--color-eggshell)',
                          border: '1px solid var(--color-orinoco)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.85rem 1.4rem',
                          color: 'var(--color-text)',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label 
                        htmlFor="enquiry-budget"
                        style={{
                          display: 'block',
                          fontSize: '0.78rem',
                          color: 'var(--color-verdun)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '0.4rem',
                          fontWeight: 600
                        }}
                      >
                        Budget <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
                      </label>
                      <input
                        id="enquiry-budget"
                        type="text"
                        name="budget"
                        placeholder="e.g. ₹ 45 Lakhs or ₹ 25k/mo"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        style={{
                          width: '100%',
                          background: 'var(--color-eggshell)',
                          border: '1px solid var(--color-orinoco)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '0.85rem 1.4rem',
                          color: 'var(--color-text)',
                          fontSize: '0.9rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* 7. Message (Optional) — Rounded Box */}
                  <div>
                    <label 
                      htmlFor="enquiry-message"
                      style={{
                        display: 'block',
                        fontSize: '0.78rem',
                        color: 'var(--color-verdun)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        marginBottom: '0.4rem',
                        fontWeight: 600
                      }}
                    >
                      Message <span style={{ color: 'var(--color-muted)', fontWeight: 400 }}>(Optional)</span>
                    </label>
                    <textarea
                      id="enquiry-message"
                      name="message"
                      rows={3}
                      placeholder="Any specific preferences regarding move-in timeline, floor level, parking, or amenities..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        background: 'var(--color-eggshell)',
                        border: '1px solid var(--color-orinoco)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1rem 1.25rem',
                        color: 'var(--color-text)',
                        fontSize: '0.9rem',
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Submit CTA in Verdun Green — Fully Pill-Shaped */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '1.05rem',
                      fontSize: '0.92rem',
                      borderRadius: 'var(--radius-pill)',
                      justifyContent: 'center',
                      marginTop: '0.5rem',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <MessageSquare size={16} />
                    <span>{isSubmitting ? 'Formatting Enquiry...' : 'START A CONVERSATION VIA WHATSAPP'}</span>
                  </button>

                  {/* Transparent Workflow Notice */}
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-muted)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    marginTop: '0.25rem'
                  }}>
                    Submitting opens WhatsApp with your enquiry prefilled. Please review and tap send to connect directly with our advisory desk.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
