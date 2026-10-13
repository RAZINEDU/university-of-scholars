-- =================================================================
-- IUS CSE CLASS ROUTINE & SCHEDULE PORTAL - SUPABASE DATABASE SETUP
-- Generated for: https://ngmxgqablklfmvxtbqso.supabase.co
-- Includes Tables, Indexes, RLS Policies, and Complete Data Seed
-- =================================================================

-- 1. CREATE EXTENSION FOR UUID GENERATION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CREATE TABLE: routine_items (Live Published Routine)
CREATE TABLE IF NOT EXISTS public.routine_items (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    day TEXT NOT NULL,
    day_short TEXT,
    col_index INTEGER DEFAULT 0,
    time_slot TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    course_code TEXT,
    course_title TEXT,
    faculty TEXT,
    room TEXT,
    raw_text TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.1 CREATE TABLE: routine_drafts (Staging / Draft Routine for Admin)
CREATE TABLE IF NOT EXISTS public.routine_drafts (
    id TEXT PRIMARY KEY,
    section TEXT NOT NULL,
    day TEXT NOT NULL,
    day_short TEXT,
    col_index INTEGER DEFAULT 0,
    time_slot TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT,
    course_code TEXT,
    course_title TEXT,
    faculty TEXT,
    room TEXT,
    raw_text TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE TABLE: faculty_members
CREATE TABLE IF NOT EXISTS public.faculty_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    serial INTEGER,
    code TEXT UNIQUE,
    name TEXT NOT NULL,
    designation TEXT,
    department TEXT DEFAULT 'Department of Computer Science and Engineering',
    slug TEXT UNIQUE,
    clean_slug TEXT,
    phone TEXT,
    email TEXT,
    profile_url TEXT,
    image_url TEXT,
    office_address TEXT,
    bio TEXT,
    research_interests JSONB DEFAULT '[]'::jsonb,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    publications JSONB DEFAULT '[]'::jsonb,
    room TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE TABLE: app_settings
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_routine_section ON public.routine_items(section);
CREATE INDEX IF NOT EXISTS idx_routine_day ON public.routine_items(day);
CREATE INDEX IF NOT EXISTS idx_routine_faculty ON public.routine_items(faculty);
CREATE INDEX IF NOT EXISTS idx_routine_room ON public.routine_items(room);
CREATE INDEX IF NOT EXISTS idx_routine_course_code ON public.routine_items(course_code);
CREATE INDEX IF NOT EXISTS idx_draft_section ON public.routine_drafts(section);
CREATE INDEX IF NOT EXISTS idx_draft_day ON public.routine_drafts(day);
CREATE INDEX IF NOT EXISTS idx_draft_faculty ON public.routine_drafts(faculty);
CREATE INDEX IF NOT EXISTS idx_draft_room ON public.routine_drafts(room);
CREATE INDEX IF NOT EXISTS idx_faculty_code ON public.faculty_members(code);
CREATE INDEX IF NOT EXISTS idx_faculty_slug ON public.faculty_members(slug);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.routine_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if any
DROP POLICY IF EXISTS "Allow public read routine" ON public.routine_items;
DROP POLICY IF EXISTS "Allow admin modify routine" ON public.routine_items;
DROP POLICY IF EXISTS "Allow public read drafts" ON public.routine_drafts;
DROP POLICY IF EXISTS "Allow admin modify drafts" ON public.routine_drafts;
DROP POLICY IF EXISTS "Allow public read faculty" ON public.faculty_members;
DROP POLICY IF EXISTS "Allow admin modify faculty" ON public.faculty_members;
DROP POLICY IF EXISTS "Allow public read settings" ON public.app_settings;
DROP POLICY IF EXISTS "Allow admin modify settings" ON public.app_settings;

-- Read Policies (Public read for all)
CREATE POLICY "Allow public read routine" ON public.routine_items FOR SELECT USING (true);
CREATE POLICY "Allow public read drafts" ON public.routine_drafts FOR SELECT USING (true);
CREATE POLICY "Allow public read faculty" ON public.faculty_members FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.app_settings FOR SELECT USING (true);

-- Write Policies (Full CRUD access for admin operations)
CREATE POLICY "Allow admin modify routine" ON public.routine_items FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin modify drafts" ON public.routine_drafts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin modify faculty" ON public.faculty_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin modify settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);

-- 6.1 ATOMIC PUBLISH & REVERT FUNCTIONS
CREATE OR REPLACE FUNCTION public.publish_routine_draft()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM public.routine_items;
    INSERT INTO public.routine_items SELECT * FROM public.routine_drafts;
    GET DIAGNOSTICS v_count = ROW_COUNT;

    INSERT INTO public.app_settings (key, value)
    VALUES (
        'routine_publish_status',
        json_build_object(
            'last_published_at', timezone('utc'::text, now()),
            'published_count', v_count,
            'has_unpublished_changes', false
        )::jsonb
    )
    ON CONFLICT (key) DO UPDATE SET 
        value = EXCLUDED.value, 
        updated_at = timezone('utc'::text, now());

    RETURN json_build_object('success', true, 'published_count', v_count);
END;
$$;

CREATE OR REPLACE FUNCTION public.revert_routine_draft()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM public.routine_drafts;
    INSERT INTO public.routine_drafts SELECT * FROM public.routine_items;
    GET DIAGNOSTICS v_count = ROW_COUNT;

    INSERT INTO public.app_settings (key, value)
    VALUES (
        'routine_publish_status',
        json_build_object(
            'last_published_at', timezone('utc'::text, now()),
            'published_count', v_count,
            'has_unpublished_changes', false
        )::jsonb
    )
    ON CONFLICT (key) DO UPDATE SET 
        value = EXCLUDED.value, 
        updated_at = timezone('utc'::text, now());

    RETURN json_build_object('success', true, 'reverted_count', v_count);
END;
$$;

-- 7. SEED APP SETTINGS
INSERT INTO public.app_settings (key, value)
VALUES 
    ('semester_info', '{"name": "Fall 2026", "active": true, "announcement": "Welcome to IUS CSE Class Routine & Schedule Portal!"}'::jsonb),
    ('admin_config', '{"allow_public_comments": false, "maintenance_mode": false}'::jsonb),
    ('batch_groups', '[{"batch": "13", "label": "Batch 13", "sections": ["Section 13"]}, {"batch": "14", "label": "Batch 14", "sections": ["Section 14A", "Section 14B"]}, {"batch": "15", "label": "Batch 15", "sections": ["Section 15A", "Section 15B"]}, {"batch": "16", "label": "Batch 16", "sections": ["Section 16"]}, {"batch": "17", "label": "Batch 17", "sections": ["Section 17A", "Section 17B"]}, {"batch": "18", "label": "Batch 18", "sections": ["Section 18A", "Section 18B"]}, {"batch": "19", "label": "Batch 19", "sections": ["Section 19A", "Section 19B", "Section 19C", "Section 19D"]}, {"batch": "20", "label": "Batch 20", "sections": ["Section 20A", "Section 20B", "Section 20C", "Section 20D", "Section 20E"]}]'::jsonb),
    ('routine_time_slots', '{"satThuSlots": [{"colIndex": 1, "label": "9:30 AM - 11:00 AM", "slotString": "09:30-11:00"}, {"colIndex": 2, "label": "11:00 AM - 12:30 PM", "slotString": "11:00-12:30"}, {"colIndex": 3, "label": "12:30 PM - 1:30 PM", "slotString": "12:30 PM - 1:30 PM", "isBreak": true}, {"colIndex": 4, "label": "1:30 PM - 3:00 PM", "slotString": "01:30-03:00"}, {"colIndex": 5, "label": "3:00 PM - 4:30 PM", "slotString": "03:00-04:30"}], "fridaySlots": [{"colIndex": 1, "label": "9:30 AM - 11:00 AM", "slotString": "09:30-11:00"}, {"colIndex": 2, "label": "11:00 AM - 12:30 PM", "slotString": "11:00-12:30"}, {"colIndex": 3, "label": "12:30 PM - 1:00 PM", "slotString": "12:30-01:00"}, {"colIndex": 4, "label": "1:00 PM - 2:30 PM", "slotString": "01:00-02:30", "isBreak": true}, {"colIndex": 5, "label": "2:30 PM - 3:30 PM", "slotString": "02:30-03:30"}, {"colIndex": 6, "label": "3:30 PM - 4:00 PM", "slotString": "03:30-04:00"}, {"colIndex": 7, "label": "4:00 PM - 5:00 PM", "slotString": "04:00-05:00"}]}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

-- 8. SEED FACULTY MEMBERS (34 records)
INSERT INTO public.faculty_members (serial, code, name, designation, department, slug, clean_slug, phone, email, profile_url, image_url, office_address, bio, research_interests, education, experience, publications, room)
VALUES
(
    1,
    'MAA',
    'Engr. Md. Ahsan Arif',
    'Associate Professor & Head of the Department',
    'Department of Computer Science and Engineering',
    'engr.-md.-ahsan-arif',
    'engr-md-ahsan-arif',
    '01711-787147',
    'ahsan@ius.edu.bd',
    'https://ius.edu.bd/profile/engr.-md.-ahsan-arif',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628522/ius_faculty/eylkudgmeithba6u79ql.png',
    'Level 13, Dept. of CSE, University of Scholars, 40, Bulu Ocean Tower, Kemal Ataturk Avenue, Banani, Dhaka',
    '',
    '["Machine Learning", "Data Science", "the Internet of Things", "Artificial Intelligence", "Natural Language Processing"]'::jsonb,
    '[]'::jsonb,
    '[{"role": "Associate Professor &amp; HEAD", "company": "University of Scholars", "duration": "October 2021- till date"}, {"role": "Associate Professor &amp; HEAD", "company": "AUB", "duration": "2019- OCT 2021"}, {"role": "Associate Professor", "company": "AUB", "duration": "2017-2019"}, {"role": "Assistant Professor &amp; Director IT-cum-Advisor, Digital Marketing", "company": "AUB", "duration": "2016-2017"}, {"role": "Assistant Professor &amp; Director IT", "company": "AUB", "duration": "2015-2016"}, {"role": "Assistant Professor", "company": "AUB", "duration": "2010-2015"}, {"role": "Senior Lecturer", "company": "AUB", "duration": "2008-2010"}, {"role": "Lecturer &amp; DBA", "company": "AUB", "duration": "2005-2008"}, {"role": "Adjunct Faculty", "company": "ASAUB", "duration": "--"}, {"role": "Adjunct Faculty", "company": "SU", "duration": "--"}, {"role": "Adjunct Faculty", "company": "PU", "duration": "--"}]'::jsonb,
    '[{"title": "An Improved Prediction System of Students'' Performance Using Classification model and Feature Selection Algorithm.", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:roLk4NBRz8UC"}, {"title": "An Empirical Analysis of C#, PHP, JAVA, JSP and ASP.Net regarding performance analysis based on CPU utilization", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:Tyk-4Ss8FVUC"}, {"title": "Problems and Prospects: Universal Networking Language on Bangla Sentence Structure Perspective", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:u5HHmVD_uO8C"}, {"title": "An operational design of indoor tracking system in the environment of GSM structure", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:2osOgNQ5qMEC"}, {"title": "Mining structured objects (data records) based on maximum region detection by text content comparison from website", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:d1gkVwhDpl0C"}, {"title": "A Machine Learning technique to analyze and detect Corona Virus", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:0EnyYjriUFMC"}, {"title": "A Brief Analysis of Bengali Natural Language Processing: Universal Networking Language Perspective", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:_FxGoFyzp5QC"}, {"title": "Pervasive, Embedded Models for E-Business", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:Y0pCki6q_DkC"}, {"title": "An Algorithmic Approach to Develop Auto Translation System-Bengali to English", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:u-x6o8ySG0sC"}, {"title": "Integration Between Artificial Intelligence and Bengali Language Processing", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:zYLM7Y9cAGgC"}, {"title": "Algorithm for Natural Language Processing: Bengali Language Perspective", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:IjCSPb-OGe4C"}, {"title": "A Survey on Delay of Voice End User in Micro Macro Cellular System", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:9yKSN-GCB0IC"}, {"title": "Quality of Service (QOS) in Wireless Network", "url": "https://scholar.google.com/citations?view_op=view_citation&amp;hl=en&amp;user=BXH0EuwAAAAJ&amp;citation_for_view=BXH0EuwAAAAJ:UeHWp8X0CEIC"}]'::jsonb,
    ''
),
(
    2,
    'MAR',
    'Mamoon Al Rasheed',
    'Associate Professor & Director IQAC',
    'Department of Computer Science and Engineering',
    'mamoon-al-rasheed',
    'mamoon-al-rasheed',
    '',
    '',
    'https://ius.edu.bd/profile/mamoon-al-rasheed',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628524/ius_faculty/q2qac8smq02cyq6qvpok.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    3,
    'DRA',
    'Dr. Rowsanara Akhter',
    'Associate Professor',
    'Department of Computer Science and Engineering',
    'dr.-rowsanara-akhter',
    'dr-rowsanara-akhter',
    '01716-895607',
    'dr.rowsanara@ius.edu.bd',
    'https://ius.edu.bd/profile/dr.-rowsanara-akhter',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628528/ius_faculty/rlaipriombiydzc36tes.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "Ph. D", "institute": "Jahangirnagar University", "year": "2014"}, {"degree": "M. Phil", "institute": "Bangladesh University of Engineering and Technology", "year": "2009"}, {"degree": "M. Sc.", "institute": "Jahangirnagar University", "year": "2000"}, {"degree": "B. Sc.", "institute": "Jahangirnagar University", "year": "1999"}, {"degree": "HSC", "institute": "Gazipur Mohila College", "year": "1996"}, {"degree": "SSC", "institute": "Joydebpur Govt. Girls High School", "year": "1994"}]'::jsonb,
    '[{"role": "The International University of Scholars", "company": "Associate Professor", "duration": "October 1st, 2022, to till now"}, {"role": "The International University of Scholars", "company": "Assistant Professor", "duration": "March 01, 2019, to September 30, 2022"}, {"role": "The International University of Scholars", "company": "Lecturer", "duration": "February 1, 2017, to February 28, 2019"}]'::jsonb,
    '[{"title": "Rowsanara Akhter, Mohammad Mokaddes Ali, and Md Abdul Alim, Data analysis of thermal performance and irreversibility of convective flow in porous-wavy channel having triangular obstacle under magnetic field effect, Heliyon, 10, e34580 , 2024 (Q1, IF- 3.4, Elsevier, Scopus Indexed). https://doi.org/10.1016/j.heliyon.2024.e34580", "url": "https://doi.org/10.1016/j.heliyon.2024.e34580"}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, and Md Abdul Alim. Magnetic field impact on double diffusive mixed convective hybrid-nanofluid flow and irreversibility in porous cavity with vertical wavy walls and rotating solid cylinder. Results in Engineering, 19, 101292, (16 July 2023) https://doi.org/10.1016/j.rineng.2023.101292 (Q2, Elsevier). IF: 5.0, ESCI and Scopus Indexed.", "url": "https://doi.org/10.1016/j.rineng.2023.101292"}, {"title": "Rowsanara Akhter, Mohammad Mokaddes Ali, Md. Motawakkel Billah, Md. Nasir Uddin, Hybrid-nanaofluid mixed convection in square cavity subjected to oriented magnetic field and multiple rotating rough cylinders, Results in Engineering, 18(101100) 2023. https://doi.org/10.1016/j.rineng.2023.101100 (Q1, Elsevier). IF: 5.0, ESCI and Scopus Indexed.", "url": "https://doi.org/10.1016/j.rineng.2023.101100(Q1,"}, {"title": "Rowsanara Akhter, Mohammad Mokaddes Ali, and Md Abdul Alim. Entropy generation due to hydromagnetic buoyancy-driven hybrid-nanofluid flow in partially heated porous cavity containing heat conductive obstacle.Alexandria Engineering Journal, 62, 17-45, 2023 (Online 4 Aug 2022). (Q1, Elsevier). IF:6.8, SCIE Indexed.", "url": "https://www.sciencedirect.com/topics/engineering/natural-convection"}, {"title": "M. M. Ali, Rowsanara Akhter, M M Alim, M. M Miah, Magnetic- Mixed Convection in nanofluid-filled cavity containing baffles and rotating hollow-cylinders with roughness components. Mathematical Problems in Engineering, 2022. (14 December 2022). http://doi.org/10.1155/2022/3044930 (Q2). CS: 2.1, Scopus Indexed.", "url": "http://doi.org/10.1155/2022/3044930"}, {"title": "M. M. Ali, Rowsanara Akhter, M. M. Miah, Hydromagnetic mixed convective flow in a horizontal channel equipped with Cu-water nanofluid and alternated baffles. International Journal of Thermofluids, 12, 100118, November 2021. (Q4).", "url": "https://www.sciencedirect.com/topics/engineering/convective-flow"}, {"title": "Mohammad Mokaddes Ali, S. Rushd, Rowsanara Akhter, M.A. Alim, Magneto-hydrodynamic mixed convective heat transfer in a nanofluid filled wavy conduit having rotating cylinders. Scientia Iranica, 29(2), 486-501, 2022 (online 5 October 2021). 10.24200/SCI.2021.56422.4717 (Q2). IF: 1.416, SCIE and Scopus Indexed.", "url": ""}, {"title": "M. Ali, Rowsanara Akhter , M. M. Miah, Hydromagnetic mixed convective flow in a horizontal channel equipped with Cu-water nanofluid and alternated baffles. Int. Journal of Thermofluids, 12, 100118, Nov 2021. 10.1016/j.ijft.2021.100118 (Q1, Elsevier). CS: 9.2, Scopus Indexed.", "url": "https://doi.org/10.1016/j.ijft.2021.100118"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Hydromagnetic mixed convection in a triangular shed filled by nanofluid and equipped with rectangular heater and rotating cylinders. International Journal of Thermofluids, 100105, August, 2021. https://doi.org/10.1016/j.ijft.2021.100105 (Q1, Elsevier). CS: 9.2, Scopus Indexed.", "url": "https://doi.org/10.1016/j.ijft.2021.100105"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Hydromagnetic natural convection in a wavy-walled enclosure equipped with hybrid nanofluid and heat generating cylinder. Alexandria Engineering Journal, 60(6), 5245-5264, 2021. https://doi.org/10.1016/j.aej.2021.04.059 (Q1, Elsevier). IF:6.8, SCIE Indexed.", "url": "https://doi.org/10.1016/j.aej.2021.04.059"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim, Magneto-mixed convection in a lid driven partially heated cavity equipped with nanofluid and rotating flat plate. Alexandria Engineering Journal, 61(1), 257-278, 2022 (online 6 June 2021). https://doi.org/10.1016/j.aej.2021.05.003 (Q1, Elsevier). IF:6.8, SCIE Indexed.", "url": "https://doi.org/10.1016/j.aej.2021.05.003"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter and Md Abdul Alim. &ldquo;Performance of flow and heat transfer analysis of mixed convection in Casson fluid filled lid driven cavity including solid obstacle with magnetic impact.&rdquo; SN Applied Sciences, 3 (2),1-15, 2021. https://doi.org/10.1007/s42452-021-04243-x (Q2, Springer). IF:2.6, ESCI and Scopus Indexed.", "url": "https://doi.org/10.1007/s42452-021-04243-x"}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md Abdul Alim, M. A. Maleque, M .M Ali, Magnetohydrodynamic mixed convection in a nanofluid filled tubular enclosure, Fluid Mechanics Research International Journal, Vol.4, Issue 1, 2020 . DOI: 10.15406/fmrij.2020.04.00058", "url": "https://doi.org/10.15406/fmrij.2020.04.00058"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter, and Md Abdul Alim. \"MHD natural convection and entropy generation in a grooved enclosure filled with nanofluid using two-component non-homogeneous model.\" SN Applied Sciences, Vol. 2, no. 4 (2020): 1-25. https://doi.org/10.1007/s42452-020-2319-x (Q2, Springer). IF:2.6, ESCI and Scopus Indexed.", "url": "https://doi.org/10.1007/s42452-020-2319-x"}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, and Md Abdul Alim. \"Hydromagnetic Natural Convection Heat Transfer in a Partially Heated Enclosure Filled with Porous Medium Saturated by Nanofluid.\" International Journal of Applied and Computational Mathematics, Vol 5, no. 3 ( 2019 ): 52. https://doi.org/10.1007/s40819-019-0638-7 (Q3, Springer). Scopus Indexed.", "url": "https://doi.org/10.1007/s40819-019-0638-7"}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md. Babul Hossain, Md. Musa Miah, MHD Free Convection Boundary Layer Flow over an Inclined Heated Flat Plate with Thermal Radiation Effect, American Journal of Fluid Dynamics, Vol.7(2), pp.4-48, 2017 . doi:10.5923/j.ajfd.20170702.01", "url": ""}, {"title": "Mohammad Mokaddes Ali1, Md. Abdul Alim, Rowsanara Akhter , Syed Sabbir Ahmed, MHD Natural Convection Flow of CuO/Water Nanofluid in a Differentially Heated Hexagonal Enclosure with a Tilted Square Block, International Journal of Applied and Computational Mathematics, Vol.3, pp.1047-1069, 2017. https://doi.org/10.1007/s40819-017-0400-y (Q3, Springer). and Scopus Indexed.", "url": "https://doi.org/10.1007/s40819-017-0400-y"}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, M. Sharif Uddin, A. R. Khan, Heat Generation Effect on Convective Heat Transfer for Cylinder with Radiative Heat Transfer, Journal of Science and Technology (ISSN 2079-472X),Vol.5(1),pp.75-84, 2015 .(Printed copy: Mawlana Bhashani Science and Tech. Uni. Tangail, Journal)", "url": ""}, {"title": "Rowsanara Akhter , Mohammad Mokaddes Ali, Md. Babul Hossain, M. Sharif Uddin, Conjugate Effect of Radiation and Thermal Conductivity Variation on MHD Free Convection Flow for a Vertical Plate, American Journal of Computational Mathematics, Vol.3, pp.252-259, 2013 . 4236/ajcm.2013.33035", "url": "http://dx.doi.org/10.4236/ajcm.2013.33035"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM A Azim, M. A. Maleque, Effects of radiation and viscous dissipation conjugate free convection flow along a vertical flat plate, Journal of Science and Technology (ISSN 2079-472X), Vol.1(1), pp.11-21,2011. (Printed copy: Mawlana Bhashani Science and Tech. Uni. Tangail, Journal)", "url": ""}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM. A. Azim, M. A. Maleque, The Effects of Radiation and Heat Generation on MHD Natural Convection Flow Along a Vertical Flat Plate in Presence of Viscous Dissipation, Daffodil International University Journal of Science and Technology, Vol.6, Issue 01, January 2011. https://doi.org/10.3329/diujst.v6i1.9330", "url": ""}, {"title": "M. Ali, R. Akhter , N.H.M.A. Azim, M.I. Abdullah, The Effects of Radiation and Viscous Dissipation on MHD Natural Convection Flow along a Vertical Flat Plate in Presence of Joule Heating, Journal of Applied Science and Technology, (ISSN 2218-841X)Vol.7, No.2, pp 9-16,2010. (Printed copy: Islamic Uni. Kushtia, Journal)", "url": ""}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter , Combined effects of radiation and heat generation on MHD natural convection flow along a vertical flat plate in presence of heat conduction, BRAC University Journal Vol. VI, No.2, pp.11-20, 2009. http://hdl.handle.net/10361/459", "url": "http://hdl.handle.net/10361/459"}, {"title": "Mohammad Mokaddes Ali, Rowsanara Akhter , NHM. A. Azim, The effects of radiation and joule heating on MHD natural convection flow along a vertical flat plate in presence of heat conduction, Southeast University Journal of Science and Engineering, Vol.4, No. 4, December 2009. (Printed copy: Southeast University Journal)", "url": ""}, {"title": "Rowsanara Akhter, Mohammad Mokaddes Ali, M. A. Maleque and A. A. Mamun, The effect of combined radiation and conduction on MHD natural convection flow along a vertical flat plate, 16TH Math. conf. of Bangladesh Mathematical Society, December, 2009.", "url": ""}, {"title": "Rowsanara Akhter, M. M Ali and M. A. Maleque, The effects radiation and viscous dissipation on MHD natural convection flow along a vertical flat plate in presence of heat conduction, 16TH Math. conf. of Bangladesh Mathematical Society, December, 2009.", "url": ""}, {"title": "Combined effect of radiation and conduction on MHD natural convection flow along a vertical flat plate", "url": ""}, {"title": "Effects of Thermal Radiation and Pressure Work on Viscous Joule Heating MHDConjugate Heat Transfer with Variable Viscosity and Thermal Conductivity in Presence of Heat Generation.", "url": ""}]'::jsonb,
    ''
),
(
    4,
    'RBS',
    'Reduanul Bari Shovon',
    'Assistant Professor',
    'Department of Computer Science and Engineering',
    'reduanul-bari-shovon',
    'reduanul-bari-shovon',
    '01680-359782',
    'reduanul.bari@ius.edu.bd',
    'https://ius.edu.bd/profile/reduanul-bari-shovon',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628530/ius_faculty/hjstqpe1ji7fkcat04w4.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "MSc", "institute": "Jahangirnagar University", "year": "2020"}, {"degree": "BSc", "institute": "North South University", "year": "2018"}, {"degree": "HSC", "institute": "Savar Cantonment Public School and College", "year": "2012"}, {"degree": "SSC", "institute": "Savar Cantonment Public School and College", "year": "2010"}]'::jsonb,
    '[{"role": "Senior Lecturer", "company": "University of Scholars (IUS)", "duration": "01/06/2024 - Present"}, {"role": "Lecturer", "company": "University of Scholars (IUS)", "duration": "5/04/2021 - 31/05/2024"}, {"role": "Lecturer", "company": "University of Global Village (UGV)", "duration": "01/02/2020 - 30/11/2021"}, {"role": "Executive", "company": "Service Engine Limited", "duration": "1/11/2019 - 30/11/2019"}]'::jsonb,
    '[{"title": "Iot Based Real Time Environment Monitoring and Forecasting System incorporation with Air Pollution Detector based on Na&iuml;ve Bayes Algorithm.", "url": ""}, {"title": "Real Time Face Detection, Recognition and Verification Technology By Thesis Enhancing the Security of ATM Booth Using Raspberry Pi, Webcam Module and Image Processing with OpenCV Library.", "url": ""}, {"title": "Training on Foundations of User Experience (UX) Design from Coursera", "url": ""}, {"title": "Training on Mobile Application Development (Topics are covered on Object Oriented Programming Java, ID Application, Intent, Vector Asset, Fragment, Customization, Widget, Backend As a Service) from Udemy, 3 months in 2021", "url": ""}, {"title": "Training on Practical Web Development from Udemy", "url": ""}, {"title": "Served as Library Editor at Prothom Alo Bandhushova for 2010/2012", "url": ""}, {"title": "Organized Departmental Annual Picnic of 2022", "url": ""}, {"title": "Participated as a member Bangladesh National Cadet Corporation", "url": ""}, {"title": "Served as a member of NSU Earth Club.", "url": ""}]'::jsonb,
    ''
),
(
    5,
    'MMI',
    'A K M Monzurul Islam',
    'Assistant Professor',
    'Department of Computer Science and Engineering',
    'a-k-m-monzurul-islam',
    'a-k-m-monzurul-islam',
    '01717-558760',
    'mislam@ius.edu.bd',
    'https://ius.edu.bd/profile/a-k-m-monzurul-islam',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628532/ius_faculty/ysqgjkuhxorydsubgtv3.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "MBA in MIS", "institute": "World University of Bangladesh", "year": "2009"}, {"degree": "M.Sc in CSE", "institute": "Bangalore University", "year": "2002"}, {"degree": "B.Sc in CSE", "institute": "Bangalore University", "year": "2000"}, {"degree": "HSC", "institute": "Khulna Public College", "year": "1995"}, {"degree": "SSC", "institute": "Khulna Public College", "year": "1993"}]'::jsonb,
    '[{"role": "Assistant Professor and Head of Department (Natural Science)", "company": "University of Scholars (IUS)", "duration": "September 2020 to Date"}, {"role": "Adjunct Faculty (CSE Department)", "company": "Independent University Bangladesh (IUB)", "duration": "September 2016 to Date"}, {"role": "Manager", "company": "Europa Group", "duration": "January 2015 to August 2017."}, {"role": "Senior IT Executive", "company": "MGH Group", "duration": "January 2010 to December 2014."}, {"role": "Lecturer", "company": "Atish Dipankar University of Science &amp; Technology", "duration": "September 2005 to December 2009"}, {"role": "Lecturer", "company": "World University of Bangladesh", "duration": "April 2004 to August 2005"}, {"role": "Instructor", "company": "Gateway Education", "duration": "February 2003 to March 2004"}]'::jsonb,
    '[{"title": "A.K.M. Monzurul Islam &amp; Mustafa Nizamul Aziz (2020). An example of developing a knowledge-based system. International Journal of Science and Business, 4(7), 52-56. DOI:", "url": "https://zenodo.org/record/3908998#.YyFxknZByUk"}, {"title": "Mustafa Nizamul Aziz &amp; A.K.M. Monzurul Islam (2020). Reviewing Data Mining as an enabling technology for BI. International Journal of Science and Business, 4(7), 46-51. DOI:", "url": "https://doi.org/10.5281/zenodo.3908987"}, {"title": "Completed 40+ Online certificates with good scores from renowned foreign Universities like the University of California San Diego, the University of Michigan, Macquarie University, Johns Hopkins University, the University of Colorado Boulder, and more.", "url": ""}, {"title": "Completed Diploma certificate course on \"Hardware Technology\" from Bangalore Institute of Information Technology (BIIT).", "url": ""}, {"title": "Completed Training for Professional Development on Quality Assurance and Accreditation in Higher Education from Bangladesh Accreditation Council (BAC)", "url": ""}]'::jsonb,
    ''
),
(
    6,
    'SI',
    'Dr. Md Shaiful Islam',
    'Assistant Professor',
    'Department of Computer Science and Engineering',
    'dr.-md-shaiful-islam',
    'dr-md-shaiful-islam',
    '',
    '',
    'https://ius.edu.bd/profile/dr.-md-shaiful-islam',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798723/ius_faculty/dr_md_shaiful_islam.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "Post-Doctoral Fellow- Department of Mechatronics", "institute": "International Islamic University Malaysia (IIUM), Malaysia", "year": "International Islamic University Malaysia (IIUM), Malaysia"}, {"degree": "PhD in Tun Razak Graduate School of Business", "institute": "Universiti Tun Abdul Razak (UNIRAZAK), Malaysia", "year": "2024"}, {"degree": "Master of Science in Computer Science", "institute": "American International University, Bangladesh", "year": "2012"}, {"degree": "Bachelor of Science in Computer Science", "institute": "University of Madras, India", "year": "2004"}, {"degree": "Higher Secondary Certificate (H.S.C) in Science", "institute": "Islamic University Technical College, Dhaka, Bangladesh", "year": "1999"}, {"degree": "Secondary School Certificate (S.S.C) in Science", "institute": "Bindubashini Government Boys School, Dhaka, Bangladesh", "year": "1997"}]'::jsonb,
    '[{"role": "Assistant Professor", "company": "University of Scholars", "duration": "September 2025 - Present"}, {"role": "Founder &amp; CEO", "company": "4beats Limited &ndash; Dhaka", "duration": "May 2016 &ndash; Present"}, {"role": "Founder &amp; CEO", "company": "Online News Portal 24 &ndash; Dhaka", "duration": "Mar 2020 &ndash; Present"}, {"role": "Senior Project Manager", "company": "Nexgen Technologies Sdn Bhd-Kuala Lumpur", "duration": "Mar 2024 &ndash; Feb 2025"}, {"role": "Chief Executive Officer (Remote)", "company": "QUPS (Quality Up Services) &ndash; Dhaka", "duration": "Feb 2024 &ndash; Jan 2025"}, {"role": "Founder &amp; CEO", "company": "Gramen Ponno &ndash; Dhaka", "duration": "June 2018 &ndash; June 2024"}, {"role": "QA Manager / Test Manager", "company": "Tasawr Interactive &ndash; Dhaka", "duration": "Mar 2009 &ndash; Nov 2010"}, {"role": "Assistant Manager / Test Leader", "company": "Bangladesh Internet Press Ltd. (BIPL) &ndash; Dhaka", "duration": "Mar 2007 &ndash; Feb 2009"}, {"role": "Test Engineer", "company": "UNIQA BDC. - Dhaka", "duration": "Dec 2005 &ndash; Sept 2006"}, {"role": "SQA Engineer / Test Engineer", "company": "DataSoft Systems Bangladesh Ltd. - Dhaka", "duration": "Jan 2005 &ndash; Nov 2005"}]'::jsonb,
    '[{"title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;Software Test Estimation Tool: Comparable with COCOMOII Model&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 4-7 December 2016, Indonesia", "url": ""}, {"title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;A Novel Tool for Reducing Time and Cost at Software Test Estimation: An Use Cases and Functions Based Approach&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 9-12 December 2014, Malaysia", "url": ""}, {"title": "Shaiful Islam; Bishwajit B. Pathik; Manzur H. Khan; Mamun Habib, &ldquo;Software Test Estimation Tools using Use Cases and Functions&rdquo;, The IEEE International Conference on Industrial Engineering and Engineering Management, 10-13 December 2013 Bangkok, Thailand", "url": ""}, {"title": "Shaiful Islam, &ldquo;Preparing Bangladeshi Computer Science Students for the Industry: Bridging Academia and Real-World Demands&rdquo;, East West University, 23 August 2025", "url": ""}, {"title": "Shaiful Islam, &ldquo;Bridging the Academy&ndash;Industry Gap in Bangladesh&rsquo;s Software Industry&rdquo;, CSE FEST, Daffodil International University, University Auditorium, 8 December 2021", "url": ""}, {"title": "Shaiful Islam, &ldquo;SLC Process for Software Development &amp; Quality Control&rdquo;, Day-Long Workshop, Key Speaker, Mawlana Bhashani Science and Technology University, 2012", "url": ""}, {"title": "Shaiful Islam, &ldquo;Software Quality Assurance &amp; Testing&rdquo;, Day-Long Seminar, Day-Long Workshop, Speaker, Daffodil International University, 2019", "url": ""}, {"title": "Shaiful Islam, &ldquo;Automated Software Testing&rdquo;, Day-Long Workshop, Trainer, DataSoft Systems Bangladesh Ltd., 2012", "url": ""}, {"title": "Shaiful Islam, &ldquo;Software Testing, Quality Control &amp; Assurance&rdquo;, Day-Long Seminar, Key Speaker, United International University (UIU), 2005", "url": ""}, {"title": "Well-versed with the following Tools: o Data Analysis Tools: IBM SPSS, IBM AMOS, Smart PLS o Test Automation Tools: Java Selenium, Watir, UFP o CI/CD and DevOps Integration: Jenkins X o Performance Testing Tools: JMeter, LoadRunner o Test Management Tools: JIRA, TestTrack Pro, Workbench, Mantis, Test Director o Mobile Testing Tools: Appium", "url": ""}, {"title": "Domain Area: o Mobile, Wearable, TV, IoT, RB5 Robotics, FHUB, RPi4 o Hospital ERP, Accounting, MIS, Finance System", "url": ""}, {"title": "PMI Membership: 5559741", "url": ""}, {"title": "IEEE Membership: 97404656", "url": ""}, {"title": "Google Scholar: https://scholar.google.com/citations?user=CcUrYAEAAAAJ&amp;hl", "url": ""}, {"title": "ResearchGate: https://www.researchgate.net/profile/Md_Islam1292", "url": ""}, {"title": "ORCID: https://orcid.org/0000-0002-2705-7328", "url": "https://orcid.org/0000-0002-2705-7328"}, {"title": "Academia: https://independent.academia. edu/MDSHAIFULISLAMD20302023", "url": "https://independent.academia.edu/MDSHAIFULISLAMD20302023"}, {"title": "https://shaiful.info/", "url": ""}, {"title": "https://www.linkedin.com/in/shaiful", "url": "https://www.linkedin.com/in/shaiful"}, {"title": "Advanced AutoCAD AI Chatbot Development for Intelligent Design Role: Principal Investigator", "url": ""}, {"title": "Current Status: Submitted for Fund", "url": ""}, {"title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)", "url": ""}, {"title": "Experimental Investigation of CNC Milling Parameters for Wooden Furniture Production with an Indigenous Machine Prototype Role: Project Manager", "url": ""}, {"title": "Current Status: Submitted for Fund", "url": ""}, {"title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)", "url": ""}, {"title": "Mechanics and Performance Analysis of Micro-Tunnel Boring in Varied Geotechnical Conditions Available in Bangladesh Role: Project Manager", "url": ""}, {"title": "Current Status: Submitted for Fund", "url": ""}, {"title": "Fund Provider: Ministry Of Education (BANBEIS) (GARE)", "url": ""}]'::jsonb,
    ''
),
(
    7,
    'MMFR',
    'M.M. Fazle Rabbi',
    'Assistant Professor',
    'Department of Computer Science and Engineering',
    'm.m.-fazle-rabbi',
    'mm-fazle-rabbi',
    '',
    '',
    'https://ius.edu.bd/profile/m.m.-fazle-rabbi',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798727/ius_faculty/mm_fazle_rabbi.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "MSc in Computer Science", "institute": "University of Bedfordshire, Luton, Beds, UK", "year": "2010-2011"}, {"degree": "Bachelor of Science (Honors) in Computer Information Systems (CIS)", "institute": "University of Windsor, Windsor, Ontario, Canada", "year": "2000-2004"}, {"degree": "HSC", "institute": "Dhaka Board", "year": "1997"}, {"degree": "SSC", "institute": "Dhaka Board", "year": "1995"}]'::jsonb,
    '[{"role": "Assistant Professor", "company": "University of Scholars (IUS)", "duration": "October 2024&ndash;Present"}, {"role": "Assistant Professor", "company": "Bangladesh University of Business &amp; Technology (BUBT)", "duration": "Oct 2018&ndash; Present"}, {"role": "Lecturer", "company": "Bangladesh University of Business &amp; Technology (BUBT)", "duration": "July 2013&ndash;Oct 2018"}, {"role": "Consultant", "company": "Harvest International School, Dhaka", "duration": "Jun 2024-Jun 2025"}]'::jsonb,
    '[{"title": "ITEE FE Trainer, Information Technology Engineers Examination, JICA -BCC ITEE Project", "url": ""}, {"title": "Title: Intensive Training Program on Applied Research Methodology (ITPARM) BUBT Research Centre, Mirpur, Dhaka", "url": ""}, {"title": "Title: Personal Effectiveness Material: 7 Habits of Highly Effective People, FranklinCovey Training Institute: Pinnacle, Dhaka, Bangladesh", "url": ""}]'::jsonb,
    ''
),
(
    8,
    'AMJ',
    'Md. Ashif Mahmud Joy',
    'Assistant Professor',
    'Department of Computer Science and Engineering',
    'md.-ashif-mahmud-joy',
    'md-ashif-mahmud-joy',
    '01795-772575',
    'ashif.joy@ius.edu.bd',
    'https://ius.edu.bd/profile/md.-ashif-mahmud-joy',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628538/ius_faculty/q2zmlxjnbjsslgazpxri.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "BSc", "institute": "United International University", "year": "2022"}, {"degree": "HSC", "institute": "Dhaka College", "year": "2016"}, {"degree": "SSC", "institute": "Engineering University School and College", "year": "2014"}]'::jsonb,
    '[{"role": "Senior Lecturer", "company": "International University of Scholars", "duration": "June 2024 - Present"}, {"role": "Lecturer", "company": "International University of Scholars", "duration": "May 2022 - May 2024"}, {"role": "Reactjs Developer", "company": "Shuffle BV(Amsterdam)", "duration": "2022 (2 Months)"}, {"role": "Social Media Manager", "company": "Adios BD", "duration": "2021 (5 Months)"}]'::jsonb,
    '[{"title": "Python for everybody - from Udemy", "url": ""}, {"title": "Development with Django - from Udemy", "url": ""}, {"title": "Javascript 20 projects - from Udemy", "url": ""}, {"title": "Reactjs for beginners - from Udemy", "url": ""}, {"title": "Graphics designing advanced - from Udemy", "url": ""}, {"title": "Full stack web development - from Programming Hero", "url": ""}, {"title": "Machine Learning with CNN - from Udemy", "url": ""}, {"title": "SQA Management - from Lynda", "url": ""}]'::jsonb,
    ''
),
(
    9,
    'MNI',
    'Md. Nurul Islam',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'md.-nurul-islam',
    'md-nurul-islam',
    '01521-470560',
    'nisakib@ius.edu.bd',
    'https://ius.edu.bd/profile/md.-nurul-islam',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628535/ius_faculty/k1aqgkd9gtelsvajrvgk.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    10,
    'SMM',
    'SM Moniruzzaman',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'sm-moniruzzaman',
    'sm-moniruzzaman',
    '01717-604625',
    'moniruzzaman70@gmail.com',
    'https://ius.edu.bd/profile/sm-moniruzzaman',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628541/ius_faculty/tj26ymsn1xcvgbeap7ze.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    11,
    'ASMS',
    'Abu Sufian Md. Shahed',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'abu-sufian-md.-shahed',
    'abu-sufian-md-shahed',
    '01817-077953',
    'enggshahedsir@gmail.com',
    'https://ius.edu.bd/profile/abu-sufian-md.-shahed',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628543/ius_faculty/a85c562ulfmccojuyoyz.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    12,
    'AR',
    'Arpita Roy',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'arpita-roy',
    'arpita-roy',
    '01957-9738598',
    'arpitaroy@ius.edu.bd',
    'https://ius.edu.bd/profile/arpita-roy',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628545/ius_faculty/b4i33ppnq2odnsdq5azb.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    13,
    'MII',
    'Md. Israfil Islam',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'md.-israfil-islam',
    'md-israfil-islam',
    '',
    '',
    'https://ius.edu.bd/profile/md.-israfil-islam',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798731/ius_faculty/md_israfil_islam.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    14,
    'MES',
    'Mahbub-E-Sobhani',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'mahbub-e-sobhani',
    'mahbub-e-sobhani',
    '01521-333309',
    'mahbub@ius.edu.bd',
    'https://ius.edu.bd/profile/mahbub-e-sobhani',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628547/ius_faculty/rx7cjgzsdcberca6nyha.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "M.Sc", "institute": "United International University", "year": "Ongoing"}, {"degree": "B.Sc", "institute": "United International University", "year": "2021"}, {"degree": "HSC", "institute": "Dhaka Residential Model College", "year": "2015"}, {"degree": "SSC", "institute": "Monipur High School", "year": "2013"}]'::jsonb,
    '[{"role": "1", "company": "State University of Bangladesh", "duration": "Research Assistant (Part Time)"}, {"role": "2", "company": "Orange Solutions Limited, United Group", "duration": "Junior Software Engineer"}, {"role": "3", "company": "Bangladesh-Japan ICT Engineers'' Training Program", "duration": "Trainee"}, {"role": "4", "company": "SoftBD Limited", "duration": "Software Engineer Intern"}, {"role": "5", "company": "Fronture Technologies Limited", "duration": "Software Engineer Intern"}]'::jsonb,
    '[{"title": "Advancing Bangla Punctuation Restoration by a Monolingual Transformer-Based Method and a Large-Scale Corpus. Details: https://aclanthology.org/2023.banglalp-1.3/", "url": "https://aclanthology.org/2023.banglalp-1.3/"}, {"title": "Bangla Social Media Cyberbullying Detection Using Deep Learning. Details: https://link.springer.com/chapter/10.1007/978-981-99-7649-2_13", "url": "https://link.springer.com/chapter/10.1007/978-981-99-7649-2_13"}, {"title": "An Enhanced Text Compression Approach Using Transformer-based Language Models.", "url": ""}, {"title": "Imbalanced Intrusion Classification using Ensemble Learning with Informative Instances", "url": ""}, {"title": "Advancing Medication Safety Through Aspect Extraction and ADR Detection.", "url": ""}]'::jsonb,
    ''
),
(
    15,
    'IJ',
    'Israt Jahan',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'israt-jahan',
    'israt-jahan',
    '',
    '',
    'https://ius.edu.bd/profile/israt-jahan',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798736/ius_faculty/israt_jahan.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    16,
    'SNN',
    'Sadia Nur Nazifa',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'sadia-nur-nazifa',
    'sadia-nur-nazifa',
    '01632-321368',
    'sadianurnazifa@ius.edu.bd',
    'https://ius.edu.bd/profile/sadia-nur-nazifa',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628550/ius_faculty/ewcse925m507voiku0yc.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "H.S.C.", "institute": "Holy Cross College", "year": "2019"}, {"degree": "S.S.C.", "institute": "Mohammadpur Preparatory School and College", "year": "2017"}]'::jsonb,
    '[{"role": "1", "company": "University of Scholars", "duration": "Lecturer (Dept of CSE)"}, {"role": "2", "company": "BrainStation 23", "duration": "Intern"}]'::jsonb,
    '[{"title": "PPDHero: Requirements Elicitation and Development of a System to Empower New Mothers on Postpartum Depression. Link: https://doi.org/10.1007/978-3-031-64850-2_37", "url": "https://doi.org/10.1007/978-3-031-64850-2_37"}, {"title": "MBLDP-R: A Multiple Biomolecules Based Rapid Life Detection Protocol Embedded in a Rover Scientific Subsystem for Soil Sample Analysis Link: https://dx.doi.org/10.21203/rs.3.rs-1263964/v1", "url": "https://dx.doi.org/10.21203/rs.3.rs-1263964/v1"}, {"title": "Workshop on AutoML organized by IDARE", "url": ""}, {"title": "Workshop on Fundamental IT Engineer Examination of Information Technology Engineers Examination (ITEE) conducted by BD-ITEC &amp; BCC at MIST", "url": ""}, {"title": "Led the Science Subteam, ensuring the seamless integration of science modules into robotics projects.", "url": ""}, {"title": "Provided technical guidance to team members and conducted qualitative and quantitative research on biomolecules using AI and ML.", "url": ""}, {"title": "Collaborated with the Mechanical Subteam to align science modules with project requirements and mentored team members in science-related aspects.", "url": ""}, {"title": "Organized NCPC (National Collegiate Programming Contest) 2020 at MIST", "url": ""}, {"title": "Artificial Intelligence", "url": ""}, {"title": "Machine Learning", "url": ""}, {"title": "Data Science", "url": ""}, {"title": "Digital Image Processing", "url": ""}, {"title": "Computer Vision", "url": ""}, {"title": "Human-Computer Interaction", "url": ""}, {"title": "CyberSecurity", "url": ""}, {"title": "Internet of Things", "url": ""}]'::jsonb,
    ''
),
(
    17,
    'SNZ',
    'Sabikun Nahar Zerin',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'sabikun-nahar-zerin',
    'sabikun-nahar-zerin',
    '',
    '',
    'https://ius.edu.bd/profile/sabikun-nahar-zerin',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628552/ius_faculty/xiokcjf3z0macoggxbwz.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    18,
    'ST',
    'Syada Tasfia Rahman',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'syada-tasfia-rahman',
    'syada-tasfia-rahman',
    '',
    '',
    'https://ius.edu.bd/profile/syada-tasfia-rahman',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798741/ius_faculty/syada_tasfia_rahman.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    19,
    'AMF',
    'Asib Mostakim Fony',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'asib-mostakim-fony',
    'asib-mostakim-fony',
    '01521-487370',
    'asibmostakim@ius.edu.bd',
    'https://ius.edu.bd/profile/asib-mostakim-fony',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628555/ius_faculty/hsolicbdz0dvioytude4.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "M.S.", "institute": "University of Chittagong", "year": "2019"}, {"degree": "B.Sc.", "institute": "University of Chittagong", "year": "2018"}, {"degree": "HSC", "institute": "Govt. Hazi Muhammad Mohsin College", "year": "2013"}, {"degree": "SSC", "institute": "Govt. Muslim High School", "year": "2011"}]'::jsonb,
    '[{"role": "Lecturer", "company": "University of Scholars", "duration": "2023- present"}, {"role": "Jr. Software Engineer", "company": "General Software Solutions", "duration": "March, 2023- May, 2023"}]'::jsonb,
    '[{"title": "Hasan, S., Fony, A.M. and Uddin, M.M., 2019, February. Reduced model based feedback stabilization of large-scale sparse power system model. In 2019 International Conference on Electrical, Computer and Communication Engineering (ECCE) (pp. 1-6). IEEE.", "url": ""}, {"title": "Du, X., Iqbal, K.I.B., Uddin, M.M., Fony, A.M., Hossain, M.T., Ahmad, M.I. and Hossain, M.S., 2021. Computational techniques for H2 optimal frequency-limited model order reduction of large-scale sparse linear systems. Journal of Computational Science , 55 , p.101473.", "url": "https://www.sciencedirect.com/topics/computer-science/matrix-equation"}, {"title": "Du, X., Uddiny, M.M., Fonyz, A.M., Hossainx, M.T. and Shuzan, M.N.I., 2021. Iterative Rational Krylov Algorithms for model reduction of a class of constrained structural dynamic system with Engineering applications. arXiv preprint arXiv:2101.03053 .", "url": ""}, {"title": "Training on Enterprise System Analysis and Design using C-Sharp conducted lsdb-BISEW scholarship program for 1 year.", "url": ""}]'::jsonb,
    ''
),
(
    20,
    'HMK',
    'H M Ikram Kays',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'h-m-ikram-kays',
    'h-m-ikram-kays',
    '',
    '',
    'https://ius.edu.bd/profile/h-m-ikram-kays',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798745/ius_faculty/h_m_ikram_kays.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    21,
    'TH',
    'Tuhin Hossain',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'tuhin-hossain',
    'tuhin-hossain',
    '01567-942861',
    'tuhin@ius.edu.bd',
    'https://ius.edu.bd/profile/tuhin-hossain',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791628557/ius_faculty/cnmpo1bwnyjms69yysrp.jpg',
    '',
    '',
    '[]'::jsonb,
    '[{"degree": "MSc", "institute": "Jahangirnagar University", "year": "2022"}, {"degree": "BSc", "institute": "Daffodil International University", "year": "2021"}, {"degree": "HSC", "institute": "Hajigonj Model Govt. College", "year": "2015"}, {"degree": "SSC", "institute": "Firojpur J. K High School", "year": "2013"}]'::jsonb,
    '[{"role": "Lecturer", "company": "University of Scholars (IUS)", "duration": "18/05/2023 - Present"}, {"role": "Network Engineer", "company": "Icon Infotech Limited", "duration": "08/06/2021 - 31/12/2021"}, {"role": "Teaching Assistant", "company": "Daffodil International University", "duration": "1/10/2020 - 30/04/2021"}]'::jsonb,
    '[{"title": "Hossain, T., Kabir, A. A. N., Ratul, M. A. H., &amp; Sattar, A. (2022, March). Sentence Level Sentiment Classification Using Machine Learning Approach in the Bengali Language. In 2022 International Conference on Decision Aid Sciences and Applications (DASA) (pp. 1286-1289). IEEE.", "url": ""}, {"title": "Cisco Certified Network Associate (CCNA) from Bangladesh University of Engineering and Technology (BUET)", "url": ""}, {"title": "Web Design &amp; Development from Dusra Soft Ltd", "url": ""}, {"title": "Online conference award certificate : Decision Aid Sciences and Application (DASA), International Conference ,", "url": ""}, {"title": "Procedure of Preparing &amp; Presenting a Research Paper,", "url": ""}, {"title": "Improving Writing Skills with Better Impact,", "url": ""}]'::jsonb,
    ''
),
(
    22,
    'MRIB',
    'Md. Rahad Islam Bhuiyan',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'md.-rahad-islam-bhuiyan',
    'md-rahad-islam-bhuiyan',
    '',
    '',
    'https://ius.edu.bd/profile/md.-rahad-islam-bhuiyan',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798749/ius_faculty/md_rahad_islam_bhuiyan.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    23,
    'TA',
    'Tahmid Ahmod',
    'Lecturer',
    'Department of Computer Science and Engineering',
    'tahmid-ahmod',
    'tahmid-ahmod',
    '',
    '',
    'https://ius.edu.bd/profile/tahmid-ahmod',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798755/ius_faculty/tahmid_ahmod.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    24,
    'WK',
    'Wasimul Karim',
    'Research Assistant',
    'Department of Computer Science and Engineering',
    'wasimul-karim',
    'wasimul-karim',
    '',
    '',
    'https://ius.edu.bd/profile/wasimul-karim',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798372/ius_faculty/wasimul_karim.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    25,
    'SSR',
    'Shah Samiur Rahman',
    'Research Intern',
    'Department of Computer Science and Engineering',
    'shah-samiur-rahman',
    'shah-samiur-rahman',
    '',
    '',
    'https://ius.edu.bd/profile/shah-samiur-rahman',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798759/ius_faculty/shah_samiur_rahman.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    26,
    'RAR',
    'Robiul Alam Romjan',
    'Teaching Assistant',
    'Department of Computer Science and Engineering',
    'robiul-alam-romjan',
    'robiul-alam-romjan',
    '',
    '',
    'https://ius.edu.bd/profile/robiul-alam-romjan',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798763/ius_faculty/robiul_alam_romjan.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    27,
    'MRS',
    'Mamunur Rashid Shihab',
    'Lab Assistant',
    'Department of Computer Science and Engineering',
    'mamunur-rashid-shihab',
    'mamunur-rashid-shihab',
    '',
    '',
    'https://ius.edu.bd/profile/mamunur-rashid-shihab',
    'https://res.cloudinary.com/wmxwx0oi/image/upload/v1791798768/ius_faculty/mamunur_rashid_shihab.jpg',
    'Level 13, Dept. of CSE, University of Scholars, Banani, Dhaka',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    28,
    'SSH',
    'Shaila Sharmin',
    'Lecturer',
    'Department of CSE',
    'ssh',
    'ssh',
    '01331-401708',
    'shaila.s@ius.edu.bd',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    29,
    'SR',
    'Sadman Rafi',
    'Lecturer',
    'Department of CSE',
    'sr',
    'sr',
    '01572-907774',
    'sadman@ius.edu.bd',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    30,
    'SS',
    'Samia Sabah',
    'Lecturer',
    'Department of CSE',
    'ss',
    'ss',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    31,
    'DHS',
    'Dr. Hasan Sarwar',
    'Professor',
    'Department of CSE',
    'dhs',
    'dhs',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    32,
    'AA',
    'Arafat Azom',
    'Lecturer',
    'Department of CSE',
    'aa',
    'aa',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    33,
    'EEE-F1',
    'EEE Faculty 1',
    'Guest Faculty',
    'Department of EEE',
    'eee-f1',
    'eee-f1',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
),
(
    34,
    'EEE-F2',
    'EEE Faculty 2',
    'Guest Faculty',
    'Department of EEE',
    'eee-f2',
    'eee-f2',
    '',
    '',
    '',
    '',
    '',
    '',
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    '[]'::jsonb,
    ''
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    designation = EXCLUDED.designation,
    department = EXCLUDED.department,
    slug = EXCLUDED.slug,
    clean_slug = EXCLUDED.clean_slug,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    profile_url = EXCLUDED.profile_url,
    image_url = EXCLUDED.image_url,
    office_address = EXCLUDED.office_address,
    bio = EXCLUDED.bio,
    research_interests = EXCLUDED.research_interests,
    education = EXCLUDED.education,
    experience = EXCLUDED.experience,
    publications = EXCLUDED.publications,
    room = EXCLUDED.room,
    updated_at = now();


-- 9. SEED ROUTINE ITEMS (323 records)
INSERT INTO public.routine_items (id, section, day, day_short, col_index, time_slot, type, title, course_code, course_title, faculty, room, raw_text)
VALUES
(
    'section13-sat-2',
    'Section 13',
    'Saturday',
    'Sat',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4149',
    'Data Science & Big Data Analytics',
    'MES',
    '1502',
    'CSE 4149
Data Science & Big Data
Analytics
11:00-12:30
MES | 1502'
),
(
    'section13-sat-3',
    'Section 13',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-sat-4',
    'Section 13',
    'Saturday',
    'Sat',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 4230',
    'Artificial Intelligence Lab',
    'RBS',
    '1503',
    'CSE 4230
Artificial Intelligence Lab
1:30-4:30
RBS | 1503'
),
(
    'section13-sun-2',
    'Section 13',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4229',
    'Artificial Intelligence',
    'RBS',
    '2004',
    'CSE 4229
Artificial Intelligence
11:00-12:30
RBS | 2004'
),
(
    'section13-sun-3',
    'Section 13',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-sun-5',
    'Section 13',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4277',
    'Network & Server Administration',
    'MMI',
    '1903',
    'CSE 4277
Network & Server
Administration
3:00-4:30
MMI | 1903'
),
(
    'section13-mon-1',
    'Section 13',
    'Monday',
    'Mon',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 4278',
    'Network & Server Administration Lab',
    'MMI',
    '1503',
    'CSE 4278
Network & Server Administration Lab
9:30-12:30
MMI | 1503'
),
(
    'section13-mon-3',
    'Section 13',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-mon-4',
    'Section 13',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 4277',
    'Network & Server Administration',
    'MMI',
    '1701',
    'CSE 4277
Network & Server
Administration
1:30-3:00
MMI | 1701'
),
(
    'section13-mon-5',
    'Section 13',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4149',
    'Data Science & Big Data Analytics',
    'MES',
    '1903',
    'CSE 4149
Data Science & Big Data
Analytics
3:00-4:30
MES | 1903'
),
(
    'section13-tue-3',
    'Section 13',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-wed-1',
    'Section 13',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-thu-1',
    'Section 13',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section13-fri-4',
    'Section 13',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-sat-2',
    'Section 14A',
    'Saturday',
    'Sat',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4135',
    'Cyber Security & Law',
    'ST',
    '804',
    'CSE 4135
Cyber Security & Law
11:00-12:30
ST | 804'
),
(
    'section14a-sat-3',
    'Section 14A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-sat-4',
    'Section 14A',
    'Saturday',
    'Sat',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 4148',
    'Mobile Application Development',
    'ST',
    '1502',
    'CSE 4148
Mobile Application
Development
1:30-3:00
ST | 1502'
),
(
    'section14a-sat-5',
    'Section 14A',
    'Saturday',
    'Sat',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4201',
    'Data Mining & Machine Learning',
    'AMJ',
    '1701',
    'CSE 4201
Data Mining & Machine
Learning
3:00-4:30
AMJ | 1701'
),
(
    'section14a-sun-1',
    'Section 14A',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 4137',
    'Operating System',
    'SNZ',
    '1901',
    'CSE 4137
Operating System
9:30-11:00
SNZ | 1901'
),
(
    'section14a-sun-2',
    'Section 14A',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4148',
    'Mobile Application Development',
    'ST',
    '2003',
    'CSE 4148
Mobile Application
Development
11:00-12:30
ST | 2003'
),
(
    'section14a-sun-3',
    'Section 14A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-sun-4',
    'Section 14A',
    'Sunday',
    'Sun',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 4138',
    'Operating System Lab',
    'SNZ',
    '1503',
    'CSE 4138
Operating System Lab
1:30-4:30
SNZ | 1503'
),
(
    'section14a-mon-2',
    'Section 14A',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'AA',
    '1901',
    'CSE 4125
Software Engineering
11:00-12:30
AA | 1901'
),
(
    'section14a-mon-3',
    'Section 14A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-mon-4',
    'Section 14A',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 4135',
    'Cyber Security & Law',
    'ST',
    '1901',
    'CSE 4135
Cyber Security & Law
1:30-3:00
ST | 1901'
),
(
    'section14a-mon-5',
    'Section 14A',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4201',
    'Data Mining & Machine Learning',
    'AMJ',
    '1702',
    'CSE 4201
Data Mining & Machine
Learning
3:00-4:30
AMJ | 1702'
),
(
    'section14a-tue-3',
    'Section 14A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-wed-1',
    'Section 14A',
    'Wednesday',
    'Wed',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 4126',
    'Software Engineering Lab',
    'AA',
    '1703',
    'CSE 4126
Software Engineering Lab
9:30-12:30
AA | 1703'
),
(
    'section14a-wed-3',
    'Section 14A',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-wed-5',
    'Section 14A',
    'Wednesday',
    'Wed',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'AA',
    '803',
    'CSE 4125
Software Engineering
3:00-4:30
AA | 803'
),
(
    'section14a-thu-1',
    'Section 14A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14a-fri-4',
    'Section 14A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-sat-3',
    'Section 14B',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-sun-1',
    'Section 14B',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 4135',
    'Cyber Security & Law',
    'ST',
    '1903',
    'CSE 4135
Cyber Security & Law
9:30-11:00
ST | 1903'
),
(
    'section14b-sun-2',
    'Section 14B',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4201',
    'Data Mining & Machine Learning',
    'MES',
    '2001',
    'CSE 4201
Data Mining & Machine
Learning
11:00-12:30
MES | 2001'
),
(
    'section14b-sun-3',
    'Section 14B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-sun-4',
    'Section 14B',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'SI',
    '1903',
    'CSE 4125
Software Engineering
1:30-3:00
SI | 1903'
),
(
    'section14b-sun-5',
    'Section 14B',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4137',
    'Operating System',
    'TBA',
    '1901',
    'CSE 4137
Operating System
3:00-4:30
TBA | 1901'
),
(
    'section14b-mon-1',
    'Section 14B',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'SI',
    '2001',
    'CSE 4125
Software Engineering
9:30-11:00
SI | 2001'
),
(
    'section14b-mon-2',
    'Section 14B',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 4201',
    'Data Mining & Machine Learning',
    'MES',
    '1704',
    'CSE 4201
Data Mining & Machine
Learning
11:00-12:30
MES | 1704'
),
(
    'section14b-mon-3',
    'Section 14B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-mon-5',
    'Section 14B',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4135',
    'Cyber Security & Law',
    'ST',
    '1701',
    'CSE 4135
Cyber Security & Law
3:00-4:30
ST | 1701'
),
(
    'section14b-tue-3',
    'Section 14B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-wed-1',
    'Section 14B',
    'Wednesday',
    'Wed',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 4137',
    'Operating System',
    'TBA',
    '1502',
    'CSE 4137
Operating System
9:30-11:00
TBA | 1502'
),
(
    'section14b-wed-3',
    'Section 14B',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-wed-4',
    'Section 14B',
    'Wednesday',
    'Wed',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 4138',
    'Operating System Lab',
    'TBA',
    '1503',
    'CSE 4138
Operating System Lab
1:30-4:30
TBA | 1503'
),
(
    'section14b-thu-1',
    'Section 14B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-fri-1',
    'Section 14B',
    'Friday',
    'Fri',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 4126',
    'Software Engineering Lab',
    'SNZ',
    '1503',
    'CSE 4126
Software Engineering Lab
9:30-12:30
SNZ | 1503'
),
(
    'section14b-fri-4',
    'Section 14B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section14b-fri-5',
    'Section 14B',
    'Friday',
    'Fri',
    5,
    '3:30-5:00',
    'Theory',
    NULL,
    'CSE 4148',
    'Mobile Application Development',
    'RBS',
    '1101',
    'CSE 4148
Mobile Application Development
3:30-5:00
RBS | 1101'
),
(
    'section15a-sat-2',
    'Section 15A',
    'Saturday',
    'Sat',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3131',
    'Data Communication & Networking',
    'TH',
    '803',
    'CSE 3131
Data Communication &
Networking
11:00-12:30
TH | 803'
),
(
    'section15a-sat-3',
    'Section 15A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-sat-4',
    'Section 15A',
    'Saturday',
    'Sat',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'EEE 2114',
    'Electronics Devices & Circuits Lab',
    'EEE-F1',
    'EEE Lab (EEE Dept)',
    'EEE 2114
Electronics Devices & Circuits Lab
1:30-4:30
EEE-F1 | EEE Lab (EEE Dept)'
),
(
    'section15a-sun-1',
    'Section 15A',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 3108 (+17A,17B,15B)',
    'Integrated Design Project I floor)',
    NULL,
    NULL,
    'CSE 3108 (+17A,17B,15B)
Integrated Design Project
I
9:30-11:00
IJ | Auditorium (13th
floor)'
),
(
    'section15a-sun-2',
    'Section 15A',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1901',
    'HUM 3103
Principles of Management
11:00-12:30
SS | 1901'
),
(
    'section15a-sun-3',
    'Section 15A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-mon-1',
    'Section 15A',
    'Monday',
    'Mon',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 3132',
    'Data Communication & Networking Lab',
    'TH',
    '1703',
    'CSE 3132
Data Communication & Networking Lab
9:30-12:30
TH | 1703'
),
(
    'section15a-mon-3',
    'Section 15A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-mon-4',
    'Section 15A',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'MNI',
    '2001',
    'CSE 4125
Software Engineering
1:30-3:00
MNI | 2001'
),
(
    'section15a-mon-5',
    'Section 15A',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1501',
    'HUM 3103
Principles of Management
3:00-4:30
SS | 1501'
),
(
    'section15a-tue-1',
    'Section 15A',
    'Tuesday',
    'Tue',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 4126',
    'Software Engineering Lab',
    'MNI',
    '1703',
    'CSE 4126
Software Engineering Lab
9:30-12:30
MNI | 1703'
),
(
    'section15a-tue-3',
    'Section 15A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-tue-4',
    'Section 15A',
    'Tuesday',
    'Tue',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 3220',
    'NLP Lab using Python',
    'RBS',
    '1503',
    'CSE 3220
NLP Lab using Python
1:30-4:30
RBS | 1503'
),
(
    'section15a-wed-1',
    'Section 15A',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-thu-1',
    'Section 15A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-fri-1',
    'Section 15A',
    'Friday',
    'Fri',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'EEE 2113',
    'Electronics Devices & Circuits',
    'EEE-F1',
    '804',
    'EEE 2113
Electronics Devices &
Circuits
9:30-11:00
EEE-F1 | 804'
),
(
    'section15a-fri-2',
    'Section 15A',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3219',
    'Compiler Construction',
    'RBS',
    '804',
    'CSE 3219
Compiler Construction
11:00-12:30
RBS | 804'
),
(
    'section15a-fri-4',
    'Section 15A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15a-fri-6',
    'Section 15A',
    'Friday',
    'Fri',
    6,
    '3:30-5:00',
    'Theory',
    NULL,
    'CSE 3131',
    'Data Communication & Networking',
    'TH',
    '804',
    'CSE 3131
Data Communication & Networking
3:30-5:00
TH | 804'
),
(
    'section15b-sat-3',
    'Section 15B',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-sun-1',
    'Section 15B',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 3108 (+17A,17B,15A)',
    'Integrated Design Project I floor)',
    NULL,
    NULL,
    'CSE 3108 (+17A,17B,15A)
Integrated Design Project
I
9:30-11:00
IJ | Auditorium (13th
floor)'
),
(
    'section15b-sun-2',
    'Section 15B',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3131',
    'Data Communication & Networking',
    'HMK',
    '1903',
    'CSE 3131
Data Communication &
Networking
11:00-12:30
HMK | 1903'
),
(
    'section15b-sun-3',
    'Section 15B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-sun-4',
    'Section 15B',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 3219',
    'Compiler Construction',
    'AR',
    '1704',
    'CSE 3219
Compiler Construction
1:30-3:00
AR | 1704'
),
(
    'section15b-sun-5',
    'Section 15B',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'TH',
    '1702',
    'CSE 4125
Software Engineering
3:00-4:30
TH | 1702'
),
(
    'section15b-mon-2',
    'Section 15B',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1702',
    'HUM 3103
Principles of Management
11:00-12:30
SS | 1702'
),
(
    'section15b-mon-3',
    'Section 15B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-mon-4',
    'Section 15B',
    'Monday',
    'Mon',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 3220',
    'NLP Lab using Python',
    'AR',
    '1503',
    'CSE 3220
NLP Lab using Python
1:30-4:30
AR | 1503'
),
(
    'section15b-tue-1',
    'Section 15B',
    'Tuesday',
    'Tue',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 4126',
    'Software Engineering Lab',
    'TH',
    '1503',
    'CSE 4126
Software Engineering Lab
9:30-12:30
TH | 1503'
),
(
    'section15b-tue-3',
    'Section 15B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-tue-4',
    'Section 15B',
    'Tuesday',
    'Tue',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'EEE 2113',
    'Electronics Devices & Circuits',
    'EEE-F2',
    '1701',
    'EEE 2113
Electronics Devices &
Circuits
1:30-3:00
EEE-F2 | 1701'
),
(
    'section15b-tue-5',
    'Section 15B',
    'Tuesday',
    'Tue',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 4125',
    'Software Engineering',
    'TH',
    '804',
    'CSE 4125
Software Engineering
3:00-4:30
TH | 804'
),
(
    'section15b-wed-2',
    'Section 15B',
    'Wednesday',
    'Wed',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '803',
    'HUM 3103
Principles of Management
11:00-12:30
SS | 803'
),
(
    'section15b-wed-3',
    'Section 15B',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-wed-4',
    'Section 15B',
    'Wednesday',
    'Wed',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'EEE 2114',
    'Electronics Devices & Circuits Lab',
    'EEE-F2',
    'EEE Lab (EEE Dept)',
    'EEE 2114
Electronics Devices & Circuits Lab
1:30-4:30
EEE-F2 | EEE Lab (EEE Dept)'
),
(
    'section15b-thu-1',
    'Section 15B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-fri-1',
    'Section 15B',
    'Friday',
    'Fri',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 3132',
    'Data Communication & Networking Lab',
    'HMK',
    '902',
    'CSE 3132
Data Communication & Networking Lab
9:30-12:30
HMK | 902'
),
(
    'section15b-fri-4',
    'Section 15B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section15b-fri-6',
    'Section 15B',
    'Friday',
    'Fri',
    6,
    '3:30-5:00',
    'Theory',
    NULL,
    'CSE 3131',
    'Data Communication & Networking',
    'HMK',
    '803',
    'CSE 3131
Data Communication & Networking
3:30-5:00
HMK | 803'
),
(
    'section16-sat-3',
    'Section 16',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-sun-1',
    'Section 16',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'EEE 1211',
    'Electrical Circuit Analysis',
    'MES',
    '1704',
    'EEE 1211
Electrical Circuit Analysis
9:30-11:00
MES | 1704'
),
(
    'section16-sun-2',
    'Section 16',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1704',
    'CSE 1111
Theory of Computing
11:00-12:30
MAR | 1704'
),
(
    'section16-sun-3',
    'Section 16',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-sun-4',
    'Section 16',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1702',
    'HUM 3103
Principles of Management
1:30-3:00
SS | 1702'
),
(
    'section16-mon-1',
    'Section 16',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1701',
    'CSE 1111
Theory of Computing
9:30-11:00
MAR | 1701'
),
(
    'section16-mon-2',
    'Section 16',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3151',
    'Digital Logic Design',
    'RBS',
    '1701',
    'CSE 3151
Digital Logic Design
11:00-12:30
RBS | 1701'
),
(
    'section16-mon-3',
    'Section 16',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-mon-4',
    'Section 16',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'EEE 1211',
    'Electrical Circuit Analysis',
    'MES',
    '1704',
    'EEE 1211
Electrical Circuit Analysis
1:30-3:00
MES | 1704'
),
(
    'section16-mon-5',
    'Section 16',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 3253',
    'Microprocessor & Assembly Language',
    'MNI',
    '1103',
    'CSE 3253
Microprocessor &
Assembly Language
3:00-4:30
MNI | 1103'
),
(
    'section16-tue-1',
    'Section 16',
    'Tuesday',
    'Tue',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 3152',
    'Digital Logic Design Lab',
    'RBS',
    '802',
    'CSE 3152
Digital Logic Design Lab
9:30-12:30
RBS | 802'
),
(
    'section16-tue-3',
    'Section 16',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-tue-4',
    'Section 16',
    'Tuesday',
    'Tue',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'EEE 1212',
    'Electrical Circuit Analysis Lab',
    'MES',
    'EEE Lab (EEE Dept)',
    'EEE 1212
Electrical Circuit Analysis Lab
1:30-4:30
MES | EEE Lab (EEE Dept)'
),
(
    'section16-wed-1',
    'Section 16',
    'Wednesday',
    'Wed',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '803',
    'HUM 3103
Principles of Management
9:30-11:00
SS | 803'
),
(
    'section16-wed-2',
    'Section 16',
    'Wednesday',
    'Wed',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3253',
    'Microprocessor & Assembly Language',
    'MNI',
    '801',
    'CSE 3253
Microprocessor &
Assembly Language
11:00-12:30
MNI | 801'
),
(
    'section16-wed-3',
    'Section 16',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-thu-1',
    'Section 16',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-fri-4',
    'Section 16',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section16-fri-5',
    'Section 16',
    'Friday',
    'Fri',
    5,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 3254',
    'Microprocessor & Assembly Language Lab',
    'MNI',
    '802',
    'CSE 3254
Microprocessor & Assembly Language Lab
1:30-4:30
MNI | 802'
),
(
    'section17a-sat-1',
    'Section 17A',
    'Saturday',
    'Sat',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2222',
    'System Analysis & Design Lab',
    'MAA',
    '1503',
    'CSE 2222
System Analysis & Design Lab
9:30-12:30
MAA | 1503'
),
(
    'section17a-sat-3',
    'Section 17A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-sat-4',
    'Section 17A',
    'Saturday',
    'Sat',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 2217',
    'Math-IV (Probability & Statistics)',
    'AMJ',
    '801',
    'MATH 2217
Math-IV (Probability &
Statistics)
1:30-3:00
AMJ | 801'
),
(
    'section17a-sun-1',
    'Section 17A',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 3108 (+17B,15A,15B)',
    'Integrated Design Project I floor)',
    NULL,
    NULL,
    'CSE 3108 (+17B,15A,15B)
Integrated Design Project
I
9:30-11:00
IJ | Auditorium (13th
floor)'
),
(
    'section17a-sun-2',
    'Section 17A',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 2215',
    'Data Structures & Algorithms',
    'SNZ',
    '1702',
    'CSE 2215
Data Structures &
Algorithms
11:00-12:30
SNZ | 1702'
),
(
    'section17a-sun-3',
    'Section 17A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-sun-4',
    'Section 17A',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1701',
    'CSE 1111
Theory of Computing
1:30-3:00
MAR | 1701'
),
(
    'section17a-sun-5',
    'Section 17A',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 2221',
    'System Analysis & Design',
    'MAA',
    '1501',
    'CSE 2221
System Analysis & Design
3:00-4:30
MAA | 1501'
),
(
    'section17a-mon-1',
    'Section 17A',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 2217',
    'Math-IV (Probability & Statistics)',
    'AMJ',
    '1504',
    'MATH 2217
Math-IV (Probability &
Statistics)
9:30-11:00
AMJ | 1504'
),
(
    'section17a-mon-2',
    'Section 17A',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1504',
    'CSE 1111
Theory of Computing
11:00-12:30
MAR | 1504'
),
(
    'section17a-mon-3',
    'Section 17A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-mon-4',
    'Section 17A',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '2003',
    'HUM 3103
Principles of Management
1:30-3:00
SS | 2003'
),
(
    'section17a-tue-1',
    'Section 17A',
    'Tuesday',
    'Tue',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1701',
    'HUM 3103
Principles of Management
9:30-11:00
SS | 1701'
),
(
    'section17a-tue-2',
    'Section 17A',
    'Tuesday',
    'Tue',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3108',
    'Integrated Design Project I floor)',
    NULL,
    NULL,
    'CSE 3108
Integrated Design Project
I
11:00-12:30
MAA | Auditorium (13th
floor)'
),
(
    'section17a-tue-3',
    'Section 17A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-tue-4',
    'Section 17A',
    'Tuesday',
    'Tue',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2216',
    'Data Structures & Algorithms Lab',
    'SNZ',
    '802',
    'CSE 2216
Data Structures & Algorithms Lab
1:30-4:30
SNZ | 802'
),
(
    'section17a-wed-1',
    'Section 17A',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-thu-1',
    'Section 17A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17a-fri-4',
    'Section 17A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-sat-1',
    'Section 17B',
    'Saturday',
    'Sat',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2216',
    'Data Structures & Algorithms Lab',
    'SNZ',
    '1703',
    'CSE 2216
Data Structures & Algorithms Lab
9:30-12:30
SNZ | 1703'
),
(
    'section17b-sat-3',
    'Section 17B',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-sat-4',
    'Section 17B',
    'Saturday',
    'Sat',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 2215',
    'Data Structures & Algorithms',
    'SNZ',
    '803',
    'CSE 2215
Data Structures &
Algorithms
1:30-3:00
SNZ | 803'
),
(
    'section17b-sat-5',
    'Section 17B',
    'Saturday',
    'Sat',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 3108',
    'Integrated Design Project I floor)',
    NULL,
    NULL,
    'CSE 3108
Integrated Design Project
I
3:00-4:30
MAA | Auditorium (13th
floor)'
),
(
    'section17b-sun-1',
    'Section 17B',
    'Sunday',
    'Sun',
    1,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1701',
    'CSE 1111
Theory of Computing
11:00-12:30
MAR | 1701'
),
(
    'section17b-sun-2',
    'Section 17B',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 2221',
    'System Analysis & Design',
    'MAA',
    '1701',
    'CSE 2221
System Analysis & Design
11:00-12:30
MAA | 1701'
),
(
    'section17b-sun-3',
    'Section 17B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-sun-4',
    'Section 17B',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 2217',
    'Math-IV (Probability & Statistics)',
    'IJ',
    '1504',
    'MATH 2217
Math-IV (Probability &
Statistics)
1:30-3:00
IJ | 1504'
),
(
    'section17b-sun-5',
    'Section 17B',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'HUM 3103',
    'Principles of Management',
    'SS',
    '1504',
    'HUM 3103
Principles of Management
3:00-4:30
SS | 1504'
),
(
    'section17b-mon-3',
    'Section 17B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-mon-4',
    'Section 17B',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 2217',
    'Math-IV (Probability & Statistics)',
    'IJ',
    '1702',
    'MATH 2217
Math-IV (Probability &
Statistics)
1:30-3:00
IJ | 1702'
),
(
    'section17b-mon-5',
    'Section 17B',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 1111',
    'Theory of Computing',
    'MAR',
    '1101',
    'CSE 1111
Theory of Computing
3:00-4:30
MAR | 1101'
),
(
    'section17b-tue-3',
    'Section 17B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-wed-3',
    'Section 17B',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-thu-1',
    'Section 17B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section17b-fri-1',
    'Section 17B',
    'Friday',
    'Fri',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2222 (+SP)',
    'System Analysis & Design Lab (with SP)',
    'MAA',
    '802',
    'CSE 2222 (+SP)
System Analysis & Design Lab (with SP)
9:30-12:30
MAA | 802'
),
(
    'section17b-fri-4',
    'Section 17B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-sat-1',
    'Section 18A',
    'Saturday',
    'Sat',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 3224',
    'Database Management System Lab',
    'HMK',
    '802',
    'CSE 3224
Database Management System Lab
9:30-12:30
HMK | 802'
),
(
    'section18a-sat-3',
    'Section 18A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-sat-4',
    'Section 18A',
    'Saturday',
    'Sat',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 2234',
    'Numerical Analysis with MATLAB',
    'TH',
    '804',
    'CSE 2234
Numerical Analysis with
MATLAB
1:30-3:00
TH | 804'
),
(
    'section18a-sun-1',
    'Section 18A',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1111',
    'Organizational Behaviors',
    'MMI',
    '1702',
    'HUM 1111
Organizational Behaviors
9:30-11:00
MMI | 1702'
),
(
    'section18a-sun-2',
    'Section 18A',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 2234',
    'Numerical Analysis with MATLAB',
    'TH',
    '1501',
    'CSE 2234
Numerical Analysis with
MATLAB
11:00-12:30
TH | 1501'
),
(
    'section18a-sun-3',
    'Section 18A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-sun-4',
    'Section 18A',
    'Sunday',
    'Sun',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2205',
    'Competitive Programming-II',
    'MES',
    '802',
    'CSE 2205
Competitive Programming-II
1:30-4:30
MES | 802'
),
(
    'section18a-mon-1',
    'Section 18A',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'BBA 2211',
    'Business Communication',
    'SS',
    '1501',
    'BBA 2211
Business Communication
9:30-11:00
SS | 1501'
),
(
    'section18a-mon-2',
    'Section 18A',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 2115',
    'Mathematics-III',
    'AMF',
    '1103',
    'MATH 2115
Mathematics-III
11:00-12:30
AMF | 1103'
),
(
    'section18a-mon-3',
    'Section 18A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-mon-4',
    'Section 18A',
    'Monday',
    'Mon',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2144',
    'Engineering Drawing',
    'SNZ',
    '2004',
    'CSE 2144
Engineering Drawing
1:30-4:30
SNZ | 2004'
),
(
    'section18a-tue-1',
    'Section 18A',
    'Tuesday',
    'Tue',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 2115',
    'Mathematics-III',
    'AMF',
    '803',
    'MATH 2115
Mathematics-III
9:30-11:00
AMF | 803'
),
(
    'section18a-tue-3',
    'Section 18A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-tue-4',
    'Section 18A',
    'Tuesday',
    'Tue',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 3223',
    'Database Management System',
    'HMK',
    '804',
    'CSE 3223
Database Management
System
1:30-3:00
HMK | 804'
),
(
    'section18a-tue-5',
    'Section 18A',
    'Tuesday',
    'Tue',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'BBA 2211',
    'Business Communication',
    'SS',
    '803',
    'BBA 2211
Business Communication
3:00-4:30
SS | 803'
),
(
    'section18a-wed-1',
    'Section 18A',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-thu-1',
    'Section 18A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18a-fri-4',
    'Section 18A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-sat-1',
    'Section 18B',
    'Saturday',
    'Sat',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 2115',
    'Mathematics-III',
    'DRA',
    '801',
    'MATH 2115
Mathematics-III
9:30-11:00
DRA | 801'
),
(
    'section18b-sat-3',
    'Section 18B',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-sat-4',
    'Section 18B',
    'Saturday',
    'Sat',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 3224',
    'Database Management System Lab',
    'AR',
    '802',
    'CSE 3224
Database Management System Lab
1:30-4:30
AR | 802'
),
(
    'section18b-sun-1',
    'Section 18B',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'BBA 2211',
    'Business Communication',
    'SS',
    '1701',
    'BBA 2211
Business Communication
9:30-11:00
SS | 1701'
),
(
    'section18b-sun-2',
    'Section 18B',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 3223',
    'Database Management System',
    'AR',
    '1504',
    'CSE 3223
Database Management
System
11:00-12:30
AR | 1504'
),
(
    'section18b-sun-3',
    'Section 18B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-sun-4',
    'Section 18B',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'HUM 1111',
    'Organizational Behaviors',
    'MMI',
    '1501',
    'HUM 1111
Organizational Behaviors
1:30-3:00
MMI | 1501'
),
(
    'section18b-sun-5',
    'Section 18B',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 2234',
    'Numerical Analysis with MATLAB',
    'ST',
    '1103',
    'CSE 2234
Numerical Analysis with
MATLAB
3:00-4:30
ST | 1103'
),
(
    'section18b-mon-1',
    'Section 18B',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 2234',
    'Numerical Analysis with MATLAB',
    'ST',
    '1103',
    'CSE 2234
Numerical Analysis with
MATLAB
9:30-11:00
ST | 1103'
),
(
    'section18b-mon-2',
    'Section 18B',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 2115',
    'Mathematics-III',
    'DRA',
    '1101',
    'MATH 2115
Mathematics-III
11:00-12:30
DRA | 1101'
),
(
    'section18b-mon-3',
    'Section 18B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-mon-4',
    'Section 18B',
    'Monday',
    'Mon',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2144',
    'Engineering Drawing',
    'TH',
    '1504',
    'CSE 2144
Engineering Drawing
1:30-4:30
TH | 1504'
),
(
    'section18b-tue-3',
    'Section 18B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-wed-1',
    'Section 18B',
    'Wednesday',
    'Wed',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2205',
    'Competitive Programming-II',
    'SNN',
    '1503',
    'CSE 2205
Competitive Programming-II
9:30-12:30
SNN | 1503'
),
(
    'section18b-wed-3',
    'Section 18B',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-wed-5',
    'Section 18B',
    'Wednesday',
    'Wed',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'BBA 2211',
    'Business Communication',
    'SS',
    '801',
    'BBA 2211
Business Communication
3:00-4:30
SS | 801'
),
(
    'section18b-thu-1',
    'Section 18B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section18b-fri-4',
    'Section 18B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-sat-3',
    'Section 19A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-sun-3',
    'Section 19A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-sun-4',
    'Section 19A',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'AMF',
    '1103',
    'MATH 1213
Mathematics-II
1:30-3:00
AMF | 1103'
),
(
    'section19a-sun-5',
    'Section 19A',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'ENG 1213 (+19B)',
    'Communicative English',
    'HMK',
    '1402',
    'ENG 1213 (+19B)
Communicative English
3:00-4:30
HMK | 1402'
),
(
    'section19a-mon-3',
    'Section 19A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-mon-4',
    'Section 19A',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'AMF',
    '1501',
    'MATH 1213
Mathematics-II
1:30-3:00
AMF | 1501'
),
(
    'section19a-mon-5',
    'Section 19A',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'HUM 1111 (+19B)',
    'Organizational Behaviors',
    'MMI',
    '1502',
    'HUM 1111 (+19B)
Organizational Behaviors
3:00-4:30
MMI | 1502'
),
(
    'section19a-tue-3',
    'Section 19A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-tue-4',
    'Section 19A',
    'Tuesday',
    'Tue',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2142',
    'Object Oriented Programming Lab',
    'AMJ',
    '1703',
    'CSE 2142
Object Oriented Programming Lab
1:30-4:30
AMJ | 1703'
),
(
    'section19a-wed-3',
    'Section 19A',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-thu-1',
    'Section 19A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-fri-1',
    'Section 19A',
    'Friday',
    'Fri',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2105',
    'Competitive Programming-I',
    'MES',
    '1703',
    'CSE 2105
Competitive Programming-I
9:30-12:30
MES | 1703'
),
(
    'section19a-fri-4',
    'Section 19A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19a-fri-6',
    'Section 19A',
    'Friday',
    'Fri',
    6,
    '3:30-5:00',
    'Theory',
    NULL,
    'CSE 2141',
    'Object Oriented Programming',
    'AMJ',
    '801',
    'CSE 2141
Object Oriented Programming
3:30-5:00
AMJ | 801'
),
(
    'section19b-sat-1',
    'Section 19B',
    'Saturday',
    'Sat',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2142',
    'Object Oriented Programming Lab',
    'AMJ',
    '902',
    'CSE 2142
Object Oriented Programming Lab
9:30-12:30
AMJ | 902'
),
(
    'section19b-sat-3',
    'Section 19B',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-sat-4',
    'Section 19B',
    'Saturday',
    'Sat',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2105',
    'Competitive Programming-I',
    'MES',
    '1703',
    'CSE 2105
Competitive Programming-I
1:30-4:30
MES | 1703'
),
(
    'section19b-sun-2',
    'Section 19B',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'AMF',
    '1101',
    'MATH 1213
Mathematics-II
11:00-12:30
AMF | 1101'
),
(
    'section19b-sun-3',
    'Section 19B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-sun-5',
    'Section 19B',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'ENG 1213 (+19A)',
    'Communicative English',
    'HMK',
    '1402',
    'ENG 1213 (+19A)
Communicative English
3:00-4:30
HMK | 1402'
),
(
    'section19b-mon-1',
    'Section 19B',
    'Monday',
    'Mon',
    1,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'AMF',
    '1704',
    'MATH 1213
Mathematics-II
1:30-3:00
AMF | 1704'
),
(
    'section19b-mon-3',
    'Section 19B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-mon-4',
    'Section 19B',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 2141',
    'Object Oriented Programming',
    'AMJ',
    '1103',
    'CSE 2141
Object Oriented
Programming
1:30-3:00
AMJ | 1103'
),
(
    'section19b-mon-5',
    'Section 19B',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'HUM 1111 (+19A)',
    'Organizational Behaviors',
    'MMI',
    '1502',
    'HUM 1111 (+19A)
Organizational Behaviors
3:00-4:30
MMI | 1502'
),
(
    'section19b-tue-3',
    'Section 19B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-wed-3',
    'Section 19B',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-thu-1',
    'Section 19B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19b-fri-4',
    'Section 19B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-sat-3',
    'Section 19C',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-sun-2',
    'Section 19C',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 2141',
    'Object Oriented Programming',
    'MNI',
    '804',
    'CSE 2141
Object Oriented
Programming
11:00-12:30
MNI | 804'
),
(
    'section19c-sun-3',
    'Section 19C',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-sun-4',
    'Section 19C',
    'Sunday',
    'Sun',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2105',
    'Competitive Programming-I',
    'SNN',
    '1703',
    'CSE 2105
Competitive Programming-I
1:30-4:30
SNN | 1703'
),
(
    'section19c-mon-1',
    'Section 19C',
    'Monday',
    'Mon',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2142',
    'Object Oriented Programming Lab',
    'MNI',
    '902',
    'CSE 2142
Object Oriented Programming Lab
9:30-12:30
MNI | 902'
),
(
    'section19c-mon-3',
    'Section 19C',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-mon-4',
    'Section 19C',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'DHS',
    '1101',
    'MATH 1213
Mathematics-II
1:30-3:00
DHS | 1101'
),
(
    'section19c-mon-5',
    'Section 19C',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'ENG 1213 (+19D)',
    'Communicative English',
    'HMK',
    '1402',
    'ENG 1213 (+19D)
Communicative English
3:00-4:30
HMK | 1402'
),
(
    'section19c-tue-2',
    'Section 19C',
    'Tuesday',
    'Tue',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'DHS',
    '804',
    'MATH 1213
Mathematics-II
11:00-12:30
DHS | 804'
),
(
    'section19c-tue-3',
    'Section 19C',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-tue-4',
    'Section 19C',
    'Tuesday',
    'Tue',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'HUM 1111 (+19D)',
    'Organizational Behaviors',
    'MMI',
    '1502',
    'HUM 1111 (+19D)
Organizational Behaviors
1:30-3:00
MMI | 1502'
),
(
    'section19c-wed-3',
    'Section 19C',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-thu-1',
    'Section 19C',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19c-fri-4',
    'Section 19C',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-sat-3',
    'Section 19D',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-sun-3',
    'Section 19D',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-sun-4',
    'Section 19D',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 2141',
    'Object Oriented Programming',
    'HMK',
    '804',
    'CSE 2141
Object Oriented
Programming
1:30-3:00
HMK | 804'
),
(
    'section19d-sun-5',
    'Section 19D',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'DHS',
    '1101',
    'MATH 1213
Mathematics-II
3:00-4:30
DHS | 1101'
),
(
    'section19d-mon-2',
    'Section 19D',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 1213',
    'Mathematics-II',
    'DHS',
    '804',
    'MATH 1213
Mathematics-II
11:00-12:30
DHS | 804'
),
(
    'section19d-mon-3',
    'Section 19D',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-mon-5',
    'Section 19D',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'ENG 1213 (+19C)',
    'Communicative English',
    'HMK',
    '1402',
    'ENG 1213 (+19C)
Communicative English
3:00-4:30
HMK | 1402'
),
(
    'section19d-tue-1',
    'Section 19D',
    'Tuesday',
    'Tue',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'CSE 2142',
    'Object Oriented Programming Lab',
    'HMK',
    '902',
    'CSE 2142
Object Oriented Programming Lab
9:30-12:30
HMK | 902'
),
(
    'section19d-tue-3',
    'Section 19D',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-tue-4',
    'Section 19D',
    'Tuesday',
    'Tue',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'HUM 1111 (+19C)',
    'Organizational Behaviors',
    'MMI',
    '1502',
    'HUM 1111 (+19C)
Organizational Behaviors
1:30-3:00
MMI | 1502'
),
(
    'section19d-wed-3',
    'Section 19D',
    'Wednesday',
    'Wed',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-wed-4',
    'Section 19D',
    'Wednesday',
    'Wed',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 2105',
    'Competitive Programming-I',
    'SNN',
    '1703',
    'CSE 2105
Competitive Programming-I
1:30-4:30
SNN | 1703'
),
(
    'section19d-thu-1',
    'Section 19D',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section19d-fri-4',
    'Section 19D',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-sat-1',
    'Section 20A',
    'Saturday',
    'Sat',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1113 (+20B)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20B)
Bangladesh Studies
9:30-11:00
AR | 1502'
),
(
    'section20a-sat-2',
    'Section 20A',
    'Saturday',
    'Sat',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'IJ',
    '1701',
    'CSE 1213
Structured Programming
Language
11:00-12:30
IJ | 1701'
),
(
    'section20a-sat-3',
    'Section 20A',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-sat-4',
    'Section 20A',
    'Saturday',
    'Sat',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 1214',
    'Structured Programming Lab',
    'IJ',
    '902',
    'CSE 1214
Structured Programming Lab
1:30-4:30
IJ | 902'
),
(
    'section20a-sun-1',
    'Section 20A',
    'Sunday',
    'Sun',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'PHY 1112',
    'Physics Lab',
    'SMM',
    'Physics Lab',
    'PHY 1112
Physics Lab
9:30-12:30
SMM | Physics Lab'
),
(
    'section20a-sun-3',
    'Section 20A',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-mon-3',
    'Section 20A',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-tue-1',
    'Section 20A',
    'Tuesday',
    'Tue',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'ASMS',
    '801',
    'MATH 1111
Mathematics-I
9:30-11:00
ASMS | 801'
),
(
    'section20a-tue-3',
    'Section 20A',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-tue-4',
    'Section 20A',
    'Tuesday',
    'Tue',
    4,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'IJ',
    '801',
    'CSE 1213
Structured Programming
Language
11:00-12:30
IJ | 801'
),
(
    'section20a-tue-5',
    'Section 20A',
    'Tuesday',
    'Tue',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'IJ',
    '801',
    'CSE 1203
Discrete Mathematics
3:00-4:30
IJ | 801'
),
(
    'section20a-wed-1',
    'Section 20A',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-thu-1',
    'Section 20A',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20a-fri-1',
    'Section 20A',
    'Friday',
    'Fri',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'IJ',
    '803',
    'CSE 1203
Discrete Mathematics
9:30-11:00
IJ | 803'
),
(
    'section20a-fri-2',
    'Section 20A',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 1113 (+20B)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20B)
Bangladesh Studies
11:00-12:30
AR | 1502'
),
(
    'section20a-fri-4',
    'Section 20A',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-sat-1',
    'Section 20B',
    'Saturday',
    'Sat',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1113 (+20A)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20A)
Bangladesh Studies
9:30-11:00
AR | 1502'
),
(
    'section20b-sat-3',
    'Section 20B',
    'Saturday',
    'Sat',
    3,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1213 (+20C)',
    'Structured Programming Language',
    'SNN',
    '1502',
    'CSE 1213 (+20C)
Structured Programming
Language
11:00-12:30
SNN | 1502'
),
(
    'section20b-sun-1',
    'Section 20B',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'ASMS',
    '1101',
    'MATH 1111
Mathematics-I
9:30-11:00
ASMS | 1101'
),
(
    'section20b-sun-3',
    'Section 20B',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-mon-1',
    'Section 20B',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1213 (+20C)',
    'Structured Programming Language',
    'SNN',
    '1402',
    'CSE 1213 (+20C)
Structured Programming
Language
9:30-11:00
SNN | 1402'
),
(
    'section20b-mon-2',
    'Section 20B',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'IJ',
    '803',
    'CSE 1203
Discrete Mathematics
11:00-12:30
IJ | 803'
),
(
    'section20b-mon-3',
    'Section 20B',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-mon-4',
    'Section 20B',
    'Monday',
    'Mon',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 1214',
    'Structured Programming Lab',
    'SNN',
    '1703',
    'CSE 1214
Structured Programming Lab
1:30-4:30
SNN | 1703'
),
(
    'section20b-tue-1',
    'Section 20B',
    'Tuesday',
    'Tue',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'PHY 1112',
    'Physics Lab',
    'SMM',
    'Physics Lab',
    'PHY 1112
Physics Lab
9:30-12:30
SMM | Physics Lab'
),
(
    'section20b-tue-3',
    'Section 20B',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-wed-1',
    'Section 20B',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-thu-1',
    'Section 20B',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-fri-2',
    'Section 20B',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 1113 (+20A)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20A)
Bangladesh Studies
11:00-12:30
AR | 1502'
),
(
    'section20b-fri-4',
    'Section 20B',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20b-fri-6',
    'Section 20B',
    'Friday',
    'Fri',
    6,
    '3:30-5:00',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'IJ',
    '1103',
    'CSE 1203
Discrete Mathematics
3:30-5:00
IJ | 1103'
),
(
    'section20c-sat-3',
    'Section 20C',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-sun-1',
    'Section 20C',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'TA',
    '804',
    'MATH 1111
Mathematics-I
9:30-11:00
TA | 804'
),
(
    'section20c-sun-2',
    'Section 20C',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1213 (+20B)',
    'Structured Programming Language',
    'SNN',
    '1402',
    'CSE 1213 (+20B)
Structured Programming
Language
11:00-12:30
SNN | 1402'
),
(
    'section20c-sun-3',
    'Section 20C',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-sun-4',
    'Section 20C',
    'Sunday',
    'Sun',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'PHY 1112',
    'Physics Lab',
    'TA',
    'Physics Lab',
    'PHY 1112
Physics Lab
1:30-4:30
TA | Physics Lab'
),
(
    'section20c-mon-1',
    'Section 20C',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1213 (+20B)',
    'Structured Programming Language',
    'SNN',
    '1402',
    'CSE 1213 (+20B)
Structured Programming
Language
9:30-11:00
SNN | 1402'
),
(
    'section20c-mon-2',
    'Section 20C',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 1113 (+20D)',
    'Bangladesh Studies',
    'AR',
    '1402',
    'HUM 1113 (+20D)
Bangladesh Studies
11:00-12:30
AR | 1402'
),
(
    'section20c-mon-3',
    'Section 20C',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-mon-4',
    'Section 20C',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'MII',
    '803',
    'CSE 1203
Discrete Mathematics
1:30-3:00
MII | 803'
),
(
    'section20c-mon-5',
    'Section 20C',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'TA',
    '803',
    'PHY 1111
Physics
3:00-4:30
TA | 803'
),
(
    'section20c-tue-2',
    'Section 20C',
    'Tuesday',
    'Tue',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'MII',
    '803',
    'CSE 1203
Discrete Mathematics
11:00-12:30
MII | 803'
),
(
    'section20c-tue-3',
    'Section 20C',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-tue-4',
    'Section 20C',
    'Tuesday',
    'Tue',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 1214',
    'Structured Programming Lab',
    'SNN',
    '902',
    'CSE 1214
Structured Programming Lab
1:30-4:30
SNN | 902'
),
(
    'section20c-wed-1',
    'Section 20C',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-thu-1',
    'Section 20C',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-fri-1',
    'Section 20C',
    'Friday',
    'Fri',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1113 (+20D)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20D)
Bangladesh Studies
9:30-11:00
AR | 1502'
),
(
    'section20c-fri-2',
    'Section 20C',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'TA',
    '803',
    'PHY 1111
Physics
11:00-12:30
TA | 803'
),
(
    'section20c-fri-4',
    'Section 20C',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20c-fri-6',
    'Section 20C',
    'Friday',
    'Fri',
    6,
    '3:30-5:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'TA',
    '1701',
    'MATH 1111
Mathematics-I
3:30-5:00
TA | 1701'
),
(
    'section20d-sat-1',
    'Section 20D',
    'Saturday',
    'Sat',
    1,
    '9:30-12:30',
    'Lab',
    NULL,
    'PHY 1112',
    'Physics Lab',
    'TA',
    'Physics Lab',
    'PHY 1112
Physics Lab
9:30-12:30
TA | Physics Lab'
),
(
    'section20d-sat-3',
    'Section 20D',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-sat-4',
    'Section 20D',
    'Saturday',
    'Sat',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'TA',
    '1701',
    'PHY 1111
Physics
1:30-3:00
TA | 1701'
),
(
    'section20d-sat-5',
    'Section 20D',
    'Saturday',
    'Sat',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'TA',
    '801',
    'MATH 1111
Mathematics-I
3:00-4:30
TA | 801'
),
(
    'section20d-sun-1',
    'Section 20D',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'MII',
    '803',
    'CSE 1203
Discrete Mathematics
9:30-11:00
MII | 803'
),
(
    'section20d-sun-2',
    'Section 20D',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'TA',
    '803',
    'MATH 1111
Mathematics-I
11:00-12:30
TA | 803'
),
(
    'section20d-sun-3',
    'Section 20D',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-sun-4',
    'Section 20D',
    'Sunday',
    'Sun',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 1214',
    'Structured Programming Lab',
    'TBA',
    '902',
    'CSE 1214
Structured Programming Lab
1:30-4:30
TBA | 902'
),
(
    'section20d-mon-1',
    'Section 20D',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'MII',
    '803',
    'CSE 1203
Discrete Mathematics
9:30-11:00
MII | 803'
),
(
    'section20d-mon-2',
    'Section 20D',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 1113 (+20C)',
    'Bangladesh Studies',
    'AR',
    '1402',
    'HUM 1113 (+20C)
Bangladesh Studies
11:00-12:30
AR | 1402'
),
(
    'section20d-mon-3',
    'Section 20D',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-mon-4',
    'Section 20D',
    'Monday',
    'Mon',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'TA',
    '801',
    'PHY 1111
Physics
1:30-3:00
TA | 801'
),
(
    'section20d-mon-5',
    'Section 20D',
    'Monday',
    'Mon',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'TBA',
    '801',
    'CSE 1213
Structured Programming
Language
3:00-4:30
TBA | 801'
),
(
    'section20d-tue-3',
    'Section 20D',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-wed-1',
    'Section 20D',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-thu-1',
    'Section 20D',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20d-fri-1',
    'Section 20D',
    'Friday',
    'Fri',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1113 (+20C)',
    'Bangladesh Studies',
    'AR',
    '1502',
    'HUM 1113 (+20C)
Bangladesh Studies
9:30-11:00
AR | 1502'
),
(
    'section20d-fri-2',
    'Section 20D',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'TBA',
    '1701',
    'CSE 1213
Structured Programming
Language
11:00-12:30
TBA | 1701'
),
(
    'section20d-fri-4',
    'Section 20D',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-sat-3',
    'Section 20E',
    'Saturday',
    'Sat',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-sun-1',
    'Section 20E',
    'Sunday',
    'Sun',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'TBA',
    '801',
    'CSE 1213
Structured Programming
Language
9:30-11:00
TBA | 801'
),
(
    'section20e-sun-2',
    'Section 20E',
    'Sunday',
    'Sun',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'DHS',
    '801',
    'PHY 1111
Physics
11:00-12:30
DHS | 801'
),
(
    'section20e-sun-3',
    'Section 20E',
    'Sunday',
    'Sun',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-sun-4',
    'Section 20E',
    'Sunday',
    'Sun',
    4,
    '1:30-3:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'DHS',
    '801',
    'MATH 1111
Mathematics-I
1:30-3:00
DHS | 801'
),
(
    'section20e-sun-5',
    'Section 20E',
    'Sunday',
    'Sun',
    5,
    '3:00-4:30',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'AR',
    '801',
    'CSE 1203
Discrete Mathematics
3:00-4:30
AR | 801'
),
(
    'section20e-mon-1',
    'Section 20E',
    'Monday',
    'Mon',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'CSE 1213',
    'Structured Programming Language',
    'TBA',
    '801',
    'CSE 1213
Structured Programming
Language
9:30-11:00
TBA | 801'
),
(
    'section20e-mon-2',
    'Section 20E',
    'Monday',
    'Mon',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'HUM 1113',
    'Bangladesh Studies',
    'TA',
    '801',
    'HUM 1113
Bangladesh Studies
11:00-12:30
TA | 801'
),
(
    'section20e-mon-3',
    'Section 20E',
    'Monday',
    'Mon',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-mon-4',
    'Section 20E',
    'Monday',
    'Mon',
    4,
    '1:30-4:30',
    'Lab',
    NULL,
    'CSE 1214',
    'Structured Programming Lab',
    'TBA',
    '902',
    'CSE 1214
Structured Programming Lab
1:30-4:30
TBA | 902'
),
(
    'section20e-tue-1',
    'Section 20E',
    'Tuesday',
    'Tue',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'MATH 1111',
    'Mathematics-I',
    'DHS',
    '1502',
    'MATH 1111
Mathematics-I
9:30-11:00
DHS | 1502'
),
(
    'section20e-tue-2',
    'Section 20E',
    'Tuesday',
    'Tue',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'CSE 1203',
    'Discrete Mathematics',
    'AR',
    '801',
    'CSE 1203
Discrete Mathematics
11:00-12:30
AR | 801'
),
(
    'section20e-tue-3',
    'Section 20E',
    'Tuesday',
    'Tue',
    3,
    '12:00 PM - 1:00 PM',
    'Break',
    'Lunch Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-wed-1',
    'Section 20E',
    'Wednesday',
    'Wed',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Teachers'' Off Day (No Classes)',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-thu-1',
    'Section 20E',
    'Thursday',
    'Thu',
    1,
    '9:00 AM - 10:30 AM',
    'No Class',
    'Defense & Counselling Day',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
),
(
    'section20e-fri-1',
    'Section 20E',
    'Friday',
    'Fri',
    1,
    '9:30-11:00',
    'Theory',
    NULL,
    'HUM 1113',
    'Bangladesh Studies',
    'TA',
    '801',
    'HUM 1113
Bangladesh Studies
9:30-11:00
TA | 801'
),
(
    'section20e-fri-2',
    'Section 20E',
    'Friday',
    'Fri',
    2,
    '11:00-12:30',
    'Theory',
    NULL,
    'PHY 1111',
    'Physics',
    'DHS',
    '801',
    'PHY 1111
Physics
11:00-12:30
DHS | 801'
),
(
    'section20e-fri-4',
    'Section 20E',
    'Friday',
    'Fri',
    4,
    '1:00-2:30',
    'Break',
    'Jumu''ah Break',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
)
ON CONFLICT (id) DO UPDATE SET
    section = EXCLUDED.section,
    day = EXCLUDED.day,
    day_short = EXCLUDED.day_short,
    col_index = EXCLUDED.col_index,
    time_slot = EXCLUDED.time_slot,
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    course_code = EXCLUDED.course_code,
    course_title = EXCLUDED.course_title,
    faculty = EXCLUDED.faculty,
    room = EXCLUDED.room,
    raw_text = EXCLUDED.raw_text,
    updated_at = now();


-- 10. SEED ROUTINE DRAFTS FROM ROUTINE ITEMS
INSERT INTO public.routine_drafts
SELECT * FROM public.routine_items
ON CONFLICT (id) DO UPDATE SET
    section = EXCLUDED.section,
    day = EXCLUDED.day,
    day_short = EXCLUDED.day_short,
    col_index = EXCLUDED.col_index,
    time_slot = EXCLUDED.time_slot,
    type = EXCLUDED.type,
    title = EXCLUDED.title,
    course_code = EXCLUDED.course_code,
    course_title = EXCLUDED.course_title,
    faculty = EXCLUDED.faculty,
    room = EXCLUDED.room,
    raw_text = EXCLUDED.raw_text,
    updated_at = EXCLUDED.updated_at;

-- 11. INITIALIZE PUBLISH STATUS IN APP_SETTINGS
INSERT INTO public.app_settings (key, value)
VALUES (
    'routine_publish_status',
    json_build_object(
        'last_published_at', timezone('utc'::text, now()),
        'published_count', (SELECT count(*) FROM public.routine_items),
        'has_unpublished_changes', false
    )::jsonb
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();


-- COMPLETED SUCCESSFULLY!
-- Check total counts:
-- SELECT count(*) FROM routine_items; -- Should be 323
-- SELECT count(*) FROM routine_drafts; -- Should be 323
-- SELECT count(*) FROM faculty_members; -- Should be 34
-- SELECT count(*) FROM app_settings; -- Should be 5