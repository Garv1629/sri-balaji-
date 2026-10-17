-- ==============================================================================
-- SRI BALAJI REAL ESTATE — SUPABASE POSTGRESQL MIGRATION
-- Migration: 20261018000000_create_properties_and_policies.sql
-- Step 12: Persistent Database, Cross-Device Synchronization & Data Consistency
-- ==============================================================================

-- 1. Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    type TEXT NOT NULL,
    configuration TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    price TEXT NOT NULL,
    price_numeric BIGINT NOT NULL,
    price_type TEXT NOT NULL DEFAULT 'sale' CHECK (price_type IN ('sale', 'rent')),
    location TEXT NOT NULL,
    locality TEXT NOT NULL,
    micro_market TEXT,
    bedrooms INTEGER NOT NULL DEFAULT 0,
    bathrooms INTEGER NOT NULL DEFAULT 0,
    carpet_area TEXT NOT NULL,
    super_builtup_area TEXT,
    furnishing TEXT NOT NULL DEFAULT 'Semi-Furnished',
    facing TEXT NOT NULL DEFAULT 'East',
    possession TEXT NOT NULL DEFAULT 'Ready to Move',
    status TEXT NOT NULL DEFAULT 'Ready to Move',
    publication_status TEXT NOT NULL DEFAULT 'published' CHECK (publication_status IN ('published', 'hidden')),
    availability TEXT NOT NULL DEFAULT 'Available',
    is_demo_listing BOOLEAN NOT NULL DEFAULT false,
    featured BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT true,
    hero_image TEXT NOT NULL,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    overview TEXT NOT NULL DEFAULT '',
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
    specs JSONB NOT NULL DEFAULT '[]'::jsonb,
    contact_phone TEXT NOT NULL DEFAULT '+919535854614',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes for search, filtering, and cross-device querying
CREATE INDEX IF NOT EXISTS idx_properties_publication_status ON public.properties (publication_status);
CREATE INDEX IF NOT EXISTS idx_properties_category ON public.properties (category);
CREATE INDEX IF NOT EXISTS idx_properties_configuration ON public.properties (configuration);
CREATE INDEX IF NOT EXISTS idx_properties_price_numeric ON public.properties (price_numeric);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON public.properties (locality);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);

-- 3. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_properties_updated_at ON public.properties;
CREATE TRIGGER trigger_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Row Level Security (RLS) Configuration
-- CRITICAL SECURITY: Never let anonymous public users read hidden properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous & Public users can read ONLY published properties
DROP POLICY IF EXISTS "Public users can only view published properties" ON public.properties;
CREATE POLICY "Public users can only view published properties"
    ON public.properties
    FOR SELECT
    TO anon, authenticated
    USING (publication_status = 'published');

-- Policy 2: Authenticated admins can view ALL properties (including hidden drafts)
DROP POLICY IF EXISTS "Admins can view all properties" ON public.properties;
CREATE POLICY "Admins can view all properties"
    ON public.properties
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy 3: Authenticated admins can insert new properties
DROP POLICY IF EXISTS "Admins can insert properties" ON public.properties;
CREATE POLICY "Admins can insert properties"
    ON public.properties
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy 4: Authenticated admins can update properties
DROP POLICY IF EXISTS "Admins can update properties" ON public.properties;
CREATE POLICY "Admins can update properties"
    ON public.properties
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy 5: Authenticated admins can delete properties
DROP POLICY IF EXISTS "Admins can delete properties" ON public.properties;
CREATE POLICY "Admins can delete properties"
    ON public.properties
    FOR DELETE
    TO authenticated
    USING (true);

-- 5. Enable Supabase Realtime for Cross-Device Synchronization
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- 6. Setup Supabase Storage bucket for property images and brochures
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view property images
DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
CREATE POLICY "Public can view property images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'property-images');

-- Storage Policy: Authenticated users can upload property images
DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'property-images');

-- 7. Seed Initial Curated Inventory (All marked as 'published' with stable IDs)
INSERT INTO public.properties (
    id, title, tagline, type, configuration, category, category_label,
    price, price_numeric, price_type, location, locality, micro_market,
    bedrooms, bathrooms, carpet_area, super_builtup_area, furnishing,
    facing, possession, status, publication_status, availability, is_demo_listing,
    featured, verified, hero_image, images, highlights, description,
    overview, amenities, specs, contact_phone
) VALUES
(
    'SB-VIL-101',
    'The Courtyard Villa at Halanayakanahalli',
    'Sculptural Modernist Triplex with Central Zen Courtyard & Plunge Pool',
    'Villa',
    '4 BHK',
    'villas',
    'Luxury Villa',
    '₹ 4.85 Cr',
    48500000,
    'sale',
    'Halanayakanahalli, Off Sarjapur Road, Bengaluru',
    'Halanayakanahalli',
    'Halanayakanahalli / Sarjapur Outer',
    4,
    5,
    '4,650 sq.ft',
    '5,200 sq.ft',
    'Semi-Furnished',
    'North-East',
    'Ready to Move',
    'Ready to Move',
    'published',
    'Sample Representation',
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop", "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    '["Private 400 sq.ft internal open-to-sky Zen courtyard", "Double-height Italian Statuario marble entertaining salon (24ft ceiling)", "Terrace observatory pavilion with sunset greenery views", "Vetted A-Khata legal dossier, zero encumbrance"]'::jsonb,
    'An architectural statement designed for discerning homeowners. Set within a tranquil residential enclave in Halanayakanahalli, just 4 minutes from Sarjapur Main Road, this triplex villa blends natural stone, teak louvers, and thermal-break double glazing.',
    'An architectural statement designed for discerning homeowners. Set within a boutique gated enclave in Halanayakanahalli, just 4 minutes from Sarjapur Main Road, this triplex villa blends natural stone, teak louvers, and floor-to-ceiling double-glazed thermal windows.',
    '["Private Swimming Plunge Pool", "Internal Hydraulic Glass Elevator", "3-Car Covered Parking Bay", "Solar Heated Water Grid (5kW)", "24/7 Multi-Tier Biometric Security", "100% DG Power Backup"]'::jsonb,
    '[{"label": "Plot Dimension", "value": "40 x 60 ft (2,400 sq.ft)"}, {"label": "Total Built-up Area", "value": "5,200 sq.ft"}, {"label": "Water Source", "value": "Cauvery Line + Dedicated Borewell"}, {"label": "Legal Status", "value": "BBMP A-Khata, Vetted Clear Title"}]'::jsonb,
    '+919535854614'
),
(
    'SB-APT-102',
    'The Sky Penthouse on Sarjapur Main Road',
    'Wraparound Panoramic Sky Deck Overlooking Doddakannelli Lake',
    'Penthouse',
    '3 BHK',
    'apartments',
    'Sky Residence',
    '₹ 2.95 Cr',
    29500000,
    'sale',
    'Sarjapur Main Road, near Wipro Corporate Campus, Bengaluru',
    'Sarjapur Main Road',
    'Wipro SEZ Corridor',
    3,
    4,
    '2,880 sq.ft',
    '3,420 sq.ft',
    'Semi-Furnished',
    'East',
    'Ready to Move',
    'Ready to Move',
    'published',
    'Sample Representation',
    true,
    true,
    true,
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    '["Top-floor corner penthouse with 270-degree unhindered skyline vistas", "Imported Statuario marble flooring across entertaining hall", "Designer German Poggenpohl modular dry & wet kitchen", "Zero dead-space layout with private foyer entry"]'::jsonb,
    'Positioned on the 19th floor of a landmark residential tower directly facing the serene Doddakannelli green belt, this penthouse delivers refined quietude moments from Bengaluru’s primary tech corridor.',
    'Positioned on the 19th floor of a landmark residential tower directly facing the serene Doddakannelli green belt, this penthouse delivers refined quietude moments from Bengaluru’s primary tech corridor.',
    '["Sky Lounge & Private Jacuzzi", "Direct High-Speed Elevator Access", "Clubhouse with Olympic Heated Pool", "Squash & Tennis Courts", "EV Charging Bay in Basement", "Piped Natural Gas (Adani Total)"]'::jsonb,
    '[{"label": "Floor Level", "value": "19th Floor (Top Level)"}, {"label": "Undivided Share (UDS)", "value": "890 sq.ft"}, {"label": "Parking", "value": "2 Side-by-Side Basement Bays"}, {"label": "RERA Registration", "value": "PRM/KA/RERA/1251/310/PR/171015/000412"}]'::jsonb,
    '+919535854614'
),
(
    'SB-APT-103',
    'The Lake-View Horizon Apartment',
    'Lakefront Sanctuary with Extended Sun Terrace in Kaikondrahalli',
    'Apartment',
    '3 BHK',
    'apartments',
    'Premium High-Rise',
    '₹ 1.85 Cr',
    18500000,
    'sale',
    'Kaikondrahalli, Sarjapur Main Road, Bengaluru',
    'Kaikondrahalli',
    'Kaikondrahalli Lake Belt',
    3,
    3,
    '1,980 sq.ft',
    '2,350 sq.ft',
    'Fully Furnished',
    'North',
    'Ready to Move',
    'Ready to Move',
    'published',
    'Sample Representation',
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    '["Direct unhindered visual connection to Kaikondrahalli Lake sanctuary", "Fully bespoke interior woodwork by master Bangalore craftsmen", "3 grand balconies with cantilevered planter boxes", "Walking distance to Greenwood High and pre-schools"]'::jsonb,
    'Overlooking the bird sanctuaries and lush tree canopy of Kaikondrahalli Lake, this high-floor residence offers an extraordinary urban retreat with instant walking access to grocery hubs and artisanal cafes.',
    'Overlooking the bird sanctuaries and lush tree canopy of Kaikondrahalli Lake, this high-floor residence offers an extraordinary urban retreat with instant walking access to grocery hubs and artisanal cafes.',
    '["Lakeside Jogging Track", "Full Olympic-Length Swimming Pool", "Children’s Sensory Play Meadow", "Co-Working & Executive Meeting Pods", "Indoor Badminton & Billiards", "24/7 RO Purified Water System"]'::jsonb,
    '[{"label": "Floor Level", "value": "11th Floor (Lake Facing)"}, {"label": "Balconies", "value": "3 Large Covered Balconies"}, {"label": "Parking", "value": "1 Covered Basement Parking"}, {"label": "Furnishing Level", "value": "Custom Architectural Woodwork"}]'::jsonb,
    '+919535854614'
),
(
    'SB-APT-104',
    'The Urban Minimalist Sanctuary',
    'High-Yield Smart 2 BHK in Prime Carmelaram Hub',
    'Apartment',
    '2 BHK',
    'apartments',
    'Smart Urban Flat',
    '₹ 98 Lakh',
    9800000,
    'sale',
    'Carmelaram, Sarjapur Road Corridor, Bengaluru',
    'Carmelaram',
    'Carmelaram Railway / ORR Link',
    2,
    2,
    '1,240 sq.ft',
    '1,480 sq.ft',
    'Semi-Furnished',
    'East',
    'Ready to Move',
    'Ready to Move',
    'published',
    'Sample Representation',
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"]'::jsonb,
    '["7 minutes drive to Bellandur eco-system and RMZ Ecospace", "Exceptional rental yield of 5.8% annually", "Corner flat design with 3 side ventilation", "Bank vetted and pre-approved by HDFC, SBI, and ICICI"]'::jsonb,
    'Tailored for working tech executives seeking minimal commute times and maximum spatial efficiency. Clean lines, recessed LED lighting, and large east-facing bedroom windows bathe the home in morning sun.',
    'Tailored for working tech executives seeking minimal commute times and maximum spatial efficiency. Clean lines, recessed LED lighting, and large east-facing bedroom windows bathe the home in morning sun.',
    '["Rooftop Infinity Splash Pool", "Equipped Technogym Fitness Suite", "Keyless Smart Digital Door Locks", "Electric Vehicle Fast Charger", "High-Speed Fiber Optic Backbone", "Community Terrace Barbeque Lawn"]'::jsonb,
    '[{"label": "Floor Level", "value": "5th Floor (Open East View)"}, {"label": "Expected Rent", "value": "₹ 48,000 / month"}, {"label": "Maintenance", "value": "₹ 3.8 / sq.ft"}, {"label": "Property Tax", "value": "Paid up to date (BBMP)"}]'::jsonb,
    '+919535854614'
),
(
    'SB-RNT-105',
    'The Executive Tech Suite',
    'Turnkey Luxury 1 BHK for Tech Founders & Professionals',
    'Apartment',
    '1 BHK',
    'rentals',
    'Furnished Rental',
    '₹ 38,000 / mo',
    38000,
    'rent',
    'Amrita Nagar, Doddakannelli, Sarjapur Road, Bengaluru',
    'Amrita Nagar',
    'Doddakannelli Junction',
    1,
    1,
    '680 sq.ft',
    '810 sq.ft',
    'Fully Furnished',
    'North',
    'Ready to Move',
    'Immediate Lease',
    'published',
    'Sample Representation',
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop"]'::jsonb,
    '["Turnkey walk-in condition with Herman Miller desk setup", "High-speed 300 Mbps mesh Wi-Fi included", "Dedicated covered bike & compact car bay", "Zero brokerage advisory directly through office"]'::jsonb,
    'An impeccably appointed 1 BHK suite designed for frictionless corporate living. Situated right behind Sri Balaji Real Estate office on Amrita Nagar, 600m from Sarjapur Main Road.',
    'An impeccably appointed 1 BHK suite designed for frictionless corporate living. Situated right behind Sri Balaji Real Estate office on Amrita Nagar, 600m from Sarjapur Main Road.',
    '["Ergonomic Workstation Setup", "Bosch Washer & Dryer", "Smart TV & Soundbar", "24/7 Security & CCTV", "Water Softener Plant", "Quiet Residential Street"]'::jsonb,
    '[{"label": "Security Deposit", "value": "₹ 1.5 Lakhs (Fair Lease Standard)"}, {"label": "Notice Period", "value": "1 Month"}, {"label": "Lock-in Period", "value": "6 Months"}, {"label": "Utilities", "value": "Individual BESCOM Meter"}]'::jsonb,
    '+919535854614'
),
(
    'SB-PLT-106',
    'The Emerald Grove Villa Plot',
    'Bespoke Gated Community Plot with Mature Teak & Mahogany Trees',
    'Plot',
    'Plot',
    'independent',
    'Villa Plot',
    '₹ 1.62 Cr',
    16200000,
    'sale',
    'Gattahalli, Off Sarjapur Road, Bengaluru',
    'Gattahalli',
    'Gattahalli Lake Enclave',
    0,
    0,
    '2,400 sq.ft',
    '2,400 sq.ft',
    'Unfurnished',
    'East',
    'Ready to Move',
    'Ready to Move',
    'published',
    'Sample Representation',
    true,
    false,
    true,
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop"]'::jsonb,
    '["40 x 60 ft exact East-facing rectangular parcel", "BMRDA & RERA approved plotted community with asphalted 40ft roads", "Underground cabling, sewage treatment, and Cauvery pipeline lines ready", "Legal dossier scrutinized and verified clear title"]'::jsonb,
    'For those desiring to construct an architecturally custom estate. This 2,400 sq.ft premium parcel is situated within a serene gated development featuring only 42 private villa sites surrounded by tranquil greenery in Gattahalli.',
    'For those desiring to construct an architecturally custom estate. This 2,400 sq.ft premium parcel is situated within a serene gated development featuring only 42 private villa sites surrounded by tranquil greenery in Gattahalli.',
    '["Grand Gated Entrance Archway", "Underground Electricity & Fiber Cabling", "Internal 40ft & 30ft Paved Avenues", "Rainwater Harvesting Network", "Boutique Clubhouse & Children Park", "Overhead Water Reservoir"]'::jsonb,
    '[{"label": "Plot Dimensions", "value": "40 ft frontage x 60 ft depth"}, {"label": "Approved Ground Coverage", "value": "Up to G+3 Floors"}, {"label": "Approval Authority", "value": "BMRDA / Local Panchayat Khata"}, {"label": "Encumbrance Status", "value": "30-Year Nil-Encumbrance Certificate"}]'::jsonb,
    '+919535854614'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    price = EXCLUDED.price,
    price_numeric = EXCLUDED.price_numeric,
    publication_status = EXCLUDED.publication_status,
    updated_at = timezone('utc'::text, now());
