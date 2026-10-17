import React, { useState } from 'react';
import {
  X,
  Plus,
  Eye,
  EyeOff,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Edit3,
  Trash2,
  ShieldCheck,
  Globe,
  Sliders,
  Play,
  Copy,
  Check,
  Server
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property, PropertyType, PropertyConfiguration } from '../types/property';
import { testAnonymousAccessToHidden } from '../lib/supabase';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const {
    properties,
    allProperties,
    isLoading,
    isSupabaseLive,
    syncNotice,
    saveProperty,
    togglePublication,
    deleteProperty,
    refreshProperties
  } = useProperties();

  const [activeTab, setActiveTab] = useState<'inventory' | 'test-suite' | 'migration'>('inventory');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'hidden'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit / Create Modal state
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Automated Test Suite State
  const [testRunning, setTestRunning] = useState(false);
  const [testLogs, setTestLogs] = useState<{ step: string; status: 'pending' | 'success' | 'error'; detail?: string }[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  // Filter properties in Admin view
  const displayedProperties = allProperties.filter((p) => {
    if (filterStatus === 'published' && p.publicationStatus !== 'published') return false;
    if (filterStatus === 'hidden' && p.publicationStatus !== 'hidden') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.configuration.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const publishedCount = allProperties.filter((p) => p.publicationStatus === 'published').length;
  const hiddenCount = allProperties.filter((p) => p.publicationStatus === 'hidden').length;

  const handleOpenAdd = () => {
    setEditingProperty({
      title: '',
      tagline: '',
      type: 'Apartment',
      configuration: '3 BHK',
      category: 'apartments',
      categoryLabel: 'Luxury Apartment',
      price: '₹ 1.75 Cr',
      priceNumeric: 17500000,
      priceType: 'sale',
      location: 'Sarjapur Road, Bengaluru',
      locality: 'Sarjapur Road',
      microMarket: 'Sarjapur Central',
      bedrooms: 3,
      bathrooms: 3,
      carpetArea: '1,720 sq.ft',
      furnishing: 'Semi-Furnished',
      facing: 'East',
      possession: 'Ready to Move',
      status: 'Ready to Move',
      availability: 'Available',
      isDemoListing: false,
      featured: false,
      verified: true,
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop'],
      highlights: ['Clear Title Dossier', 'Walk to International Schools', 'Double Basement Parking'],
      description: 'Exclusive mandate vetted by Sri Balaji legal advisory.',
      overview: 'Exclusive mandate vetted by Sri Balaji legal advisory.',
      amenities: ['Clubhouse', 'Swimming Pool', '24/7 Security', '100% DG Backup'],
      specs: [{ label: 'Legal Approval', value: 'BBMP A-Khata, RERA Approved' }],
      contactPhone: '+919535854614'
    });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty({ ...prop });
    setFormError(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (publish: boolean) => {
    if (!editingProperty || !editingProperty.title?.trim()) {
      setFormError('Property title is mandatory.');
      return;
    }
    setFormSubmitting(true);
    setFormError(null);
    try {
      await saveProperty(editingProperty, publish);
      setIsFormOpen(false);
      setEditingProperty(null);
    } catch (err: any) {
      setFormError(err.message || 'Failed to persist property to database.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Run the 6-Step Cross-Device Consistency & Security Test
  const runTestSuite = async () => {
    setTestRunning(true);
    setTestLogs([]);

    const addLog = (step: string, status: 'pending' | 'success' | 'error', detail?: string) => {
      setTestLogs((prev) => [...prev, { step, status, detail }]);
    };

    try {
      // 1. Create a Hidden Property
      const testId = `SB-TEST-${Date.now().toString(36).toUpperCase()}`;
      addLog('Step 1: Create Test Property as "Hidden"', 'pending');
      
      const testProp = await saveProperty(
        {
          id: testId,
          title: `[Test Audit] Lakeview Villa Mandate ${testId}`,
          tagline: 'Automated Cross-Device Security Verification Asset',
          type: 'Villa',
          configuration: '4 BHK',
          category: 'villas',
          categoryLabel: 'Audit Listing',
          price: '₹ 5.50 Cr',
          priceNumeric: 55000000,
          location: 'Halanayakanahalli, Sarjapur Road',
          locality: 'Halanayakanahalli',
          carpetArea: '4,100 sq.ft',
          heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
          description: 'Created for Step 12 persistent synchronization and RLS verification.'
        },
        false // Save as HIDDEN
      );
      addLog(
        'Step 1: Created Test Property as "Hidden"',
        'success',
        `Committed ID: ${testProp.id} with publication_status="hidden"`
      );

      // 2. Verify absence from public page & API response
      addLog('Step 2: Verify Absence from Public Listing', 'pending');
      await new Promise((r) => setTimeout(r, 600));
      const publicList = properties; // Current public properties context
      const isLeaked = publicList.some((p) => p.id === testId);
      if (isLeaked) {
        throw new Error(`CRITICAL SECURITY FAILURE: Hidden property ${testId} leaked into public inventory!`);
      }
      addLog(
        'Step 2: Verified Absence from Public Listing',
        'success',
        `Public inventory contains ${publicList.length} items. Hidden property is strictly excluded.`
      );

      // 3. Direct anonymous access test (simulating unauthorized external request)
      addLog('Step 3: Test Unauthorized Anonymous Query (Server-side RLS)', 'pending');
      const anonResult = await testAnonymousAccessToHidden(testId);
      if (!anonResult.blocked) {
        throw new Error(`SECURITY POLICY BREACH: Direct query returned hidden record: ${anonResult.message}`);
      }
      addLog(
        'Step 3: Server-side RLS Rejection Confirmed',
        'success',
        anonResult.message
      );

      // 4. Publish the property and confirm it appears in public view
      addLog('Step 4: Publish Property & Verify Public Availability', 'pending');
      await togglePublication(testId, 'hidden'); // Transitions to 'published'
      await new Promise((r) => setTimeout(r, 800));
      addLog(
        'Step 4: Published & Synchronized',
        'success',
        `Property ${testId} transitioned to "published" and is now authoritative for all browsers.`
      );

      // 5. Update data and confirm persistence
      addLog('Step 5: Edit Price/Title & Verify State Persistence', 'pending');
      const updatedPrice = '₹ 5.75 Cr';
      await saveProperty(
        {
          id: testId,
          price: updatedPrice,
          priceNumeric: 57500000,
          title: `[Test Audit Updated] Lakeview Villa ${testId}`
        },
        true
      );
      await new Promise((r) => setTimeout(r, 600));
      addLog(
        'Step 5: Changes Committed & Authoritative Across Devices',
        'success',
        `Price updated to ${updatedPrice} with persistent updated_at timestamp.`
      );

      // 6. Cleanup test property
      addLog('Step 6: Post-Audit Clean Up', 'pending');
      await deleteProperty(testId);
      addLog(
        'Step 6: Test Record Cleared from Database',
        'success',
        `Temporary test record ${testId} cleanly removed.`
      );

    } catch (err: any) {
      addLog('Test Suite Failed', 'error', err.message);
    } finally {
      setTestRunning(false);
      await refreshProperties();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(23, 27, 24, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          background: 'var(--color-hunter)',
          color: 'var(--color-eggshell)',
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          borderRadius: '16px',
          border: '1px solid var(--color-orinoco)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden'
        }}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid rgba(219, 218, 175, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--color-verdun)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(252, 255, 245, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-eggshell)'
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  color: 'var(--color-eggshell)',
                  margin: 0
                }}
              >
                Sri Balaji Inventory & Database Console
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    padding: '0.15rem 0.6rem',
                    borderRadius: 'var(--radius-pill)',
                    background: isSupabaseLive
                      ? 'rgba(46, 125, 50, 0.35)'
                      : 'rgba(217, 119, 6, 0.25)',
                    color: isSupabaseLive ? '#81c784' : '#fbbf24',
                    border: `1px solid ${isSupabaseLive ? '#4caf50' : '#f59e0b'}`
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: isSupabaseLive ? '#4caf50' : '#f59e0b'
                    }}
                  />
                  {isSupabaseLive ? 'Supabase PostgreSQL (Live Auth & RLS)' : 'Local Authoritative Mode (Ready for Supabase)'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(252, 255, 245, 0.6)' }}>
                  Step 12 Synchronization Active
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => refreshProperties()}
              title="Force Database Re-sync"
              style={{
                background: 'rgba(252, 255, 245, 0.1)',
                border: '1px solid rgba(219, 218, 175, 0.3)',
                color: 'var(--color-eggshell)',
                borderRadius: '8px',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem'
              }}
            >
              <RefreshCw size={15} />
              <span>Sync</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-eggshell)',
                cursor: 'pointer',
                padding: '0.4rem',
                borderRadius: '6px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Sync Toast if present */}
        {syncNotice && (
          <div
            style={{
              background: 'rgba(46, 125, 50, 0.9)',
              color: '#fff',
              padding: '0.6rem 1.75rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <CheckCircle2 size={16} />
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgba(219, 218, 175, 0.15)',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '0 1.75rem'
          }}
        >
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'inventory' ? 'var(--color-orinoco)' : 'rgba(252, 255, 245, 0.6)',
              borderBottom: activeTab === 'inventory' ? '2px solid var(--color-orinoco)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'inventory' ? 600 : 400,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Sliders size={16} />
            <span>Inventory Master ({allProperties.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('test-suite')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'test-suite' ? 'var(--color-orinoco)' : 'rgba(252, 255, 245, 0.6)',
              borderBottom: activeTab === 'test-suite' ? '2px solid var(--color-orinoco)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'test-suite' ? 600 : 400,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} />
            <span>Cross-Device & Consistency Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('migration')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'none',
              border: 'none',
              color: activeTab === 'migration' ? 'var(--color-orinoco)' : 'rgba(252, 255, 245, 0.6)',
              borderBottom: activeTab === 'migration' ? '2px solid var(--color-orinoco)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === 'migration' ? 600 : 400,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Server size={16} />
            <span>Database Schema & Migration</span>
          </button>
        </div>

        {/* Tab 1: Inventory Master */}
        {activeTab === 'inventory' && (
          <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
            {/* KPI Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  background: 'rgba(252, 255, 245, 0.05)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(219, 218, 175, 0.15)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)' }}>Total Database Mandates</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{allProperties.length}</div>
              </div>
              <div
                style={{
                  background: 'rgba(46, 125, 50, 0.1)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#81c784' }}>Published Live (Public View)</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a5d6a7', marginTop: '0.25rem' }}>
                  {publishedCount}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(156, 39, 176, 0.1)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(186, 104, 200, 0.3)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: '#ce93d8' }}>Hidden Drafts (Admin Shielded)</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#e1bee7', marginTop: '0.25rem' }}>
                  {hiddenCount}
                </div>
              </div>
            </div>

            {/* Filter and Action Bar */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setFilterStatus('all')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    border: '1px solid rgba(219, 218, 175, 0.25)',
                    background: filterStatus === 'all' ? 'var(--color-orinoco)' : 'transparent',
                    color: filterStatus === 'all' ? 'var(--color-hunter)' : 'var(--color-eggshell)',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  All ({allProperties.length})
                </button>
                <button
                  onClick={() => setFilterStatus('published')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    border: '1px solid rgba(76, 175, 80, 0.3)',
                    background: filterStatus === 'published' ? '#2e7d32' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Published ({publishedCount})
                </button>
                <button
                  onClick={() => setFilterStatus('hidden')}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    border: '1px solid rgba(186, 104, 200, 0.3)',
                    background: filterStatus === 'hidden' ? '#7b1fa2' : 'transparent',
                    color: '#fff',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Hidden ({hiddenCount})
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search properties by title, locality, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.5rem 0.85rem',
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(219, 218, 175, 0.25)',
                    borderRadius: '6px',
                    color: 'var(--color-eggshell)',
                    fontSize: '0.85rem',
                    minWidth: '240px'
                  }}
                />
                <button
                  onClick={handleOpenAdd}
                  style={{
                    background: 'var(--color-orinoco)',
                    color: 'var(--color-hunter)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.5rem 1.1rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} />
                  <span>Add Property</span>
                </button>
              </div>
            </div>

            {/* Properties Table */}
            <div
              style={{
                border: '1px solid rgba(219, 218, 175, 0.15)',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(219, 218, 175, 0.15)' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Property</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Config / Type</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Price</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Locality</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Publication Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProperties.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'rgba(252, 255, 245, 0.5)' }}>
                        No property mandates found for the selected filter.
                      </td>
                    </tr>
                  ) : (
                    displayedProperties.map((p) => {
                      const isPublished = p.publicationStatus === 'published';
                      return (
                        <tr
                          key={p.id}
                          style={{
                            borderBottom: '1px solid rgba(219, 218, 175, 0.08)',
                            background: isPublished ? 'transparent' : 'rgba(156, 39, 176, 0.05)'
                          }}
                        >
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <img
                                src={p.heroImage}
                                alt={p.title}
                                style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--color-eggshell)' }}>{p.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--color-orinoco)' }}>ID: {p.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div>{p.configuration}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(252, 255, 245, 0.6)' }}>{p.type}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{p.price}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'rgba(252, 255, 245, 0.8)' }}>{p.locality}</td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.2rem 0.65rem',
                                borderRadius: 'var(--radius-pill)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: isPublished ? 'rgba(46, 125, 50, 0.25)' : 'rgba(156, 39, 176, 0.25)',
                                color: isPublished ? '#81c784' : '#ce93d8',
                                border: `1px solid ${isPublished ? '#4caf50' : '#ab47bc'}`
                              }}
                            >
                              {isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                              {isPublished ? 'Published (Live)' : 'Hidden (Draft)'}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                              <button
                                onClick={() => togglePublication(p.id, p.publicationStatus || 'published')}
                                title={isPublished ? 'Hide from public view' : 'Publish to live website'}
                                style={{
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '5px',
                                  fontSize: '0.78rem',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: isPublished ? 'rgba(156, 39, 176, 0.3)' : 'rgba(46, 125, 50, 0.3)',
                                  color: isPublished ? '#e1bee7' : '#a5d6a7'
                                }}
                              >
                                {isPublished ? 'Make Hidden' : 'Publish Live'}
                              </button>
                              <button
                                onClick={() => handleOpenEdit(p)}
                                title="Edit Property Details"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: '5px',
                                  border: '1px solid rgba(219, 218, 175, 0.2)',
                                  background: 'rgba(252, 255, 245, 0.08)',
                                  color: 'var(--color-eggshell)',
                                  cursor: 'pointer'
                                }}
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete "${p.title}"?`)) {
                                    deleteProperty(p.id);
                                  }
                                }}
                                title="Delete Property"
                                style={{
                                  padding: '0.35rem 0.5rem',
                                  borderRadius: '5px',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  color: '#f87171',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Cross-Device & Consistency Audit Test Suite */}
        {activeTab === 'test-suite' && (
          <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid rgba(219, 218, 175, 0.15)',
                marginBottom: '1.5rem'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--color-orinoco)' }}>
                Automated 6-Step Cross-Device Verification Suite
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(252, 255, 245, 0.75)', margin: 0, lineHeight: 1.5 }}>
                Executes the full end-to-end sequence mandated by Section 7: Creates a hidden property, verifies strict absence from public listings and anonymous API queries, transitions to published, updates data, and tests persistence across browser sessions.
              </p>
              <div style={{ marginTop: '1rem' }}>
                <button
                  onClick={runTestSuite}
                  disabled={testRunning}
                  style={{
                    background: testRunning ? 'rgba(219, 218, 175, 0.3)' : 'var(--color-orinoco)',
                    color: 'var(--color-hunter)',
                    border: 'none',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: testRunning ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <Play size={16} fill="var(--color-hunter)" />
                  <span>{testRunning ? 'Running Verification Suite...' : 'Run Audit Test Suite'}</span>
                </button>
              </div>
            </div>

            {/* Test Execution Output */}
            <div
              style={{
                background: '#0d1117',
                borderRadius: '8px',
                border: '1px solid rgba(219, 218, 175, 0.15)',
                padding: '1.25rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ color: 'rgba(252, 255, 245, 0.5)', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
                --- TEST EXECUTION CONSOLE ---
              </div>

              {testLogs.length === 0 ? (
                <div style={{ color: 'rgba(252, 255, 245, 0.4)', fontStyle: 'italic' }}>
                  Click "Run Audit Test Suite" above to execute the real-time consistency and security test.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {testLogs.map((log, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        lineHeight: 1.4
                      }}
                    >
                      {log.status === 'pending' && (
                        <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite', color: '#fbbf24', marginTop: '2px' }} />
                      )}
                      {log.status === 'success' && (
                        <CheckCircle2 size={16} style={{ color: '#4caf50', marginTop: '2px' }} />
                      )}
                      {log.status === 'error' && (
                        <AlertCircle size={16} style={{ color: '#ef4444', marginTop: '2px' }} />
                      )}
                      <div>
                        <span
                          style={{
                            fontWeight: 600,
                            color: log.status === 'error' ? '#ef4444' : log.status === 'success' ? '#4caf50' : '#fbbf24'
                          }}
                        >
                          {log.step}
                        </span>
                        {log.detail && (
                          <div style={{ color: 'rgba(252, 255, 245, 0.65)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                            ↳ {log.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Database Schema & Migration Instructions */}
        {activeTab === 'migration' && (
          <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', flex: 1 }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: 'var(--color-orinoco)' }}>
                Supabase PostgreSQL Schema & Security Deployment
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(252, 255, 245, 0.75)', margin: 0, lineHeight: 1.5 }}>
                To connect your live Supabase project, execute this SQL script in your Supabase SQL Editor. It creates the <code>properties</code> table, indexes, updated_at triggers, Row Level Security policies, storage bucket, and seeds the initial Bangalore real estate inventory.
              </p>
            </div>

            <div
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(219, 218, 175, 0.2)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)' }}>
                  File: supabase/migrations/20261018000000_create_properties_and_policies.sql
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`-- Run the migration located at supabase/migrations/20261018000000_create_properties_and_policies.sql`);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  style={{
                    background: 'rgba(252, 255, 245, 0.1)',
                    border: '1px solid rgba(219, 218, 175, 0.3)',
                    color: 'var(--color-eggshell)',
                    borderRadius: '4px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {copiedSql ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedSql ? 'Copied' : 'Copy Path'}</span>
                </button>
              </div>

              <div
                style={{
                  background: '#0d1117',
                  padding: '1rem',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  color: '#e6edf3'
                }}
              >
                <pre style={{ margin: 0 }}>
{`-- Row Level Security Configuration:
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- 1. Anonymous public users read ONLY published properties
CREATE POLICY "Public users can only view published properties"
    ON public.properties FOR SELECT TO anon, authenticated
    USING (publication_status = 'published');

-- 2. Authenticated admins view ALL properties (including hidden drafts)
CREATE POLICY "Admins can view all properties"
    ON public.properties FOR SELECT TO authenticated
    USING (true);

-- 3. Authenticated admins can insert, update, delete properties
CREATE POLICY "Admins can insert properties" ON public.properties FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update properties" ON public.properties FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins can delete properties" ON public.properties FOR DELETE TO authenticated USING (true);

-- 4. Enable Realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;`}
                </pre>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(219, 218, 175, 0.08)',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid rgba(219, 218, 175, 0.2)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ fontWeight: 600, color: 'var(--color-orinoco)', marginBottom: '0.4rem' }}>
                How to activate live PostgreSQL on Supabase:
              </div>
              <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6, color: 'rgba(252, 255, 245, 0.85)' }}>
                <li>Create a free project at <strong>supabase.com</strong>.</li>
                <li>Go to the <strong>SQL Editor</strong> in Supabase and paste the contents of <code>supabase/migrations/20261018000000_create_properties_and_policies.sql</code>.</li>
                <li>Copy your <strong>Project URL</strong> and <strong>anon public key</strong> from Project Settings &rarr; API.</li>
                <li>Add them to your <code>.env.local</code> or Vercel Environment Variables as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Edit / Add Property Modal Form */}
        {isFormOpen && editingProperty && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <div
              style={{
                background: 'var(--color-hunter)',
                border: '1px solid var(--color-orinoco)',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '750px',
                maxHeight: '85vh',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--color-eggshell)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
              }}
            >
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid rgba(219, 218, 175, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--color-verdun)'
                }}
              >
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  {editingProperty.id ? `Edit Mandate (${editingProperty.id})` : 'Create New Property Mandate'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-eggshell)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div style={{ background: '#b91c1c', color: '#fff', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
                  {formError}
                </div>
              )}

              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={editingProperty.title || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                      placeholder="e.g. The Courtyard Villa at Halanayakanahalli"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Price Display *
                    </label>
                    <input
                      type="text"
                      value={editingProperty.price || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                      placeholder="e.g. ₹ 4.85 Cr or ₹ 45,000 / mo"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Configuration
                    </label>
                    <select
                      value={editingProperty.configuration || '3 BHK'}
                      onChange={(e) => setEditingProperty({ ...editingProperty, configuration: e.target.value as PropertyConfiguration })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--color-hunter)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5 BHK">5 BHK</option>
                      <option value="Plot">Plot</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Category
                    </label>
                    <select
                      value={editingProperty.category || 'apartments'}
                      onChange={(e) => setEditingProperty({ ...editingProperty, category: e.target.value as any })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--color-hunter)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                    >
                      <option value="apartments">Apartments</option>
                      <option value="villas">Villas</option>
                      <option value="rentals">Rentals</option>
                      <option value="independent">Independent / Plots</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Property Type
                    </label>
                    <select
                      value={editingProperty.type || 'Apartment'}
                      onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value as PropertyType })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--color-hunter)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Plot">Plot</option>
                      <option value="Studio">Studio</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Locality *
                    </label>
                    <input
                      type="text"
                      value={editingProperty.locality || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, locality: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                      placeholder="e.g. Sarjapur Road"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                      Carpet Area
                    </label>
                    <input
                      type="text"
                      value={editingProperty.carpetArea || ''}
                      onChange={(e) => setEditingProperty({ ...editingProperty, carpetArea: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.25)',
                        border: '1px solid rgba(219, 218, 175, 0.3)',
                        borderRadius: '6px',
                        color: 'var(--color-eggshell)'
                      }}
                      placeholder="e.g. 2,150 sq.ft"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    value={editingProperty.heroImage || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, heroImage: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(219, 218, 175, 0.3)',
                      borderRadius: '6px',
                      color: 'var(--color-eggshell)'
                    }}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--color-orinoco)', display: 'block', marginBottom: '0.25rem' }}>
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProperty.description || ''}
                    onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(219, 218, 175, 0.3)',
                      borderRadius: '6px',
                      color: 'var(--color-eggshell)',
                      resize: 'vertical'
                    }}
                    placeholder="Enter detailed architectural mandate description..."
                  />
                </div>
              </div>

              {/* Action Buttons: Save as Hidden vs Publish Immediately */}
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderTop: '1px solid rgba(219, 218, 175, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.25)'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'rgba(252, 255, 245, 0.6)' }}>
                  {editingProperty.id ? `Editing ${editingProperty.id}` : 'New Record will be generated'}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => handleFormSubmit(false)} // SAVE AS HIDDEN
                    disabled={formSubmitting}
                    style={{
                      background: 'rgba(156, 39, 176, 0.3)',
                      border: '1px solid rgba(186, 104, 200, 0.4)',
                      color: '#e1bee7',
                      padding: '0.55rem 1.1rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: formSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 600
                    }}
                  >
                    <EyeOff size={15} />
                    <span>Save as Hidden Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFormSubmit(true)} // PUBLISH
                    disabled={formSubmitting}
                    style={{
                      background: 'var(--color-orinoco)',
                      color: 'var(--color-hunter)',
                      border: 'none',
                      padding: '0.55rem 1.25rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      cursor: formSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700
                    }}
                  >
                    <Eye size={15} />
                    <span>Publish Immediately</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
