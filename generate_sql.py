import json
import re

def escape_sql(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, (dict, list)):
        s = json.dumps(val, ensure_ascii=False)
        return "'" + s.replace("'", "''") + "'::jsonb"
    s = str(val)
    return "'" + s.replace("'", "''") + "'"

def main():
    # 1. Read Routine Items
    with open('src/data/routineData.json', 'r', encoding='utf-8') as f:
        routine_items = json.load(f)

    # 2. Read Teacher Data
    with open('src/data/teacherData.ts', 'r', encoding='utf-8') as f:
        teacher_ts = f.read()

    match_faculty = re.search(r'export const CSE_FACULTY_MEMBERS: FacultyMember\[\] = (\[[\s\S]*?\]);\s*\n\s*// Teacher code directory', teacher_ts)
    if not match_faculty:
        raise Exception("Could not find CSE_FACULTY_MEMBERS in teacherData.ts")

    faculty_members = json.loads(match_faculty.group(1))

    # Also parse TEACHER_DIRECTORY to get any additional teachers not in CSE_FACULTY_MEMBERS
    existing_codes = set(f.get('code') for f in faculty_members if f.get('code'))
    match_td = re.search(r'export const TEACHER_DIRECTORY: Record<string, TeacherInfo> = (\{[\s\S]*?\});\s*\n\s*/\*\*', teacher_ts)
    
    additional_teachers = []
    if match_td:
        td_block = match_td.group(1)
        # Parse items in td_block
        teacher_blocks = re.findall(r'"([^"]+)":\s*\{\s*code:\s*"([^"]*)",\s*name:\s*"([^"]*)",\s*designation:\s*"([^"]*)",\s*department:\s*"([^"]*)",\s*phone:\s*"([^"]*)",\s*email:\s*"([^"]*)",\s*imageUrl:\s*"([^"]*)"(?:,\s*room:\s*"([^"]*)")?\s*\}', td_block)
        
        current_serial = len(faculty_members) + 1
        for tb in teacher_blocks:
            code = tb[1] or tb[0]
            if code not in existing_codes and code != 'TBA':
                clean_slug = code.lower().replace('.', '').replace(' ', '-')
                additional_teachers.append({
                    "serial": current_serial,
                    "slug": clean_slug,
                    "cleanSlug": clean_slug,
                    "code": code,
                    "name": tb[2],
                    "designation": tb[3],
                    "department": tb[4],
                    "phone": tb[5],
                    "email": tb[6],
                    "profileUrl": "",
                    "imageUrl": tb[7],
                    "officeAddress": "",
                    "bio": "",
                    "researchInterests": [],
                    "education": [],
                    "experience": [],
                    "publications": [],
                    "room": tb[8] if len(tb) > 8 and tb[8] else ""
                })
                existing_codes.add(code)
                current_serial += 1

    all_faculty = faculty_members + additional_teachers

    lines = []
    lines.append("-- =================================================================")
    lines.append("-- IUS CSE CLASS ROUTINE & SCHEDULE PORTAL - SUPABASE DATABASE SETUP")
    lines.append("-- Generated for: https://ngmxgqablklfmvxtbqso.supabase.co")
    lines.append("-- Includes Tables, Indexes, RLS Policies, and Complete Data Seed")
    lines.append("-- =================================================================\n")

    lines.append("-- 1. CREATE EXTENSION FOR UUID GENERATION")
    lines.append('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n')

    lines.append("-- 2. CREATE TABLE: routine_items (Live Published Routine)")
    lines.append("""CREATE TABLE IF NOT EXISTS public.routine_items (
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
""")

    lines.append("-- 2.1 CREATE TABLE: routine_drafts (Staging / Draft Routine for Admin)")
    lines.append("""CREATE TABLE IF NOT EXISTS public.routine_drafts (
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
""")

    lines.append("-- 3. CREATE TABLE: faculty_members")
    lines.append("""CREATE TABLE IF NOT EXISTS public.faculty_members (
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
""")

    lines.append("-- 4. CREATE TABLE: app_settings")
    lines.append("""CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
""")

    lines.append("-- 5. CREATE PERFORMANCE INDEXES")
    lines.append("CREATE INDEX IF NOT EXISTS idx_routine_section ON public.routine_items(section);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_routine_day ON public.routine_items(day);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_routine_faculty ON public.routine_items(faculty);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_routine_room ON public.routine_items(room);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_routine_course_code ON public.routine_items(course_code);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_draft_section ON public.routine_drafts(section);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_draft_day ON public.routine_drafts(day);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_draft_faculty ON public.routine_drafts(faculty);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_draft_room ON public.routine_drafts(room);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_faculty_code ON public.faculty_members(code);")
    lines.append("CREATE INDEX IF NOT EXISTS idx_faculty_slug ON public.faculty_members(slug);\n")

    lines.append("-- 6. ROW LEVEL SECURITY (RLS) POLICIES")
    lines.append("ALTER TABLE public.routine_items ENABLE ROW LEVEL SECURITY;")
    lines.append("ALTER TABLE public.routine_drafts ENABLE ROW LEVEL SECURITY;")
    lines.append("ALTER TABLE public.faculty_members ENABLE ROW LEVEL SECURITY;")
    lines.append("ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;\n")

    lines.append("-- Remove existing policies if any")
    lines.append('DROP POLICY IF EXISTS "Allow public read routine" ON public.routine_items;')
    lines.append('DROP POLICY IF EXISTS "Allow admin modify routine" ON public.routine_items;')
    lines.append('DROP POLICY IF EXISTS "Allow public read drafts" ON public.routine_drafts;')
    lines.append('DROP POLICY IF EXISTS "Allow admin modify drafts" ON public.routine_drafts;')
    lines.append('DROP POLICY IF EXISTS "Allow public read faculty" ON public.faculty_members;')
    lines.append('DROP POLICY IF EXISTS "Allow admin modify faculty" ON public.faculty_members;')
    lines.append('DROP POLICY IF EXISTS "Allow public read settings" ON public.app_settings;')
    lines.append('DROP POLICY IF EXISTS "Allow admin modify settings" ON public.app_settings;\n')

    lines.append("-- Read Policies (Public read for all)")
    lines.append('CREATE POLICY "Allow public read routine" ON public.routine_items FOR SELECT USING (true);')
    lines.append('CREATE POLICY "Allow public read drafts" ON public.routine_drafts FOR SELECT USING (true);')
    lines.append('CREATE POLICY "Allow public read faculty" ON public.faculty_members FOR SELECT USING (true);')
    lines.append('CREATE POLICY "Allow public read settings" ON public.app_settings FOR SELECT USING (true);\n')

    lines.append("-- Write Policies (Full CRUD access for admin operations)")
    lines.append('CREATE POLICY "Allow admin modify routine" ON public.routine_items FOR ALL USING (true) WITH CHECK (true);')
    lines.append('CREATE POLICY "Allow admin modify drafts" ON public.routine_drafts FOR ALL USING (true) WITH CHECK (true);')
    lines.append('CREATE POLICY "Allow admin modify faculty" ON public.faculty_members FOR ALL USING (true) WITH CHECK (true);')
    lines.append('CREATE POLICY "Allow admin modify settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);\n')

    lines.append("-- 6.1 ATOMIC PUBLISH & REVERT FUNCTIONS")
    lines.append("""CREATE OR REPLACE FUNCTION public.publish_routine_draft()
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
""")

    DEFAULT_BATCH_GROUPS = [
        {"batch": "13", "label": "Batch 13", "sections": ["Section 13"]},
        {"batch": "14", "label": "Batch 14", "sections": ["Section 14A", "Section 14B"]},
        {"batch": "15", "label": "Batch 15", "sections": ["Section 15A", "Section 15B"]},
        {"batch": "16", "label": "Batch 16", "sections": ["Section 16"]},
        {"batch": "17", "label": "Batch 17", "sections": ["Section 17A", "Section 17B"]},
        {"batch": "18", "label": "Batch 18", "sections": ["Section 18A", "Section 18B"]},
        {"batch": "19", "label": "Batch 19", "sections": ["Section 19A", "Section 19B", "Section 19C", "Section 19D"]},
        {"batch": "20", "label": "Batch 20", "sections": ["Section 20A", "Section 20B", "Section 20C", "Section 20D", "Section 20E"]},
    ]

    DEFAULT_PORTAL_TIME_SLOTS = {
        "satThuSlots": [
            {"colIndex": 1, "label": "9:30 AM - 11:00 AM", "slotString": "09:30-11:00"},
            {"colIndex": 2, "label": "11:00 AM - 12:30 PM", "slotString": "11:00-12:30"},
            {"colIndex": 3, "label": "12:30 PM - 1:30 PM", "slotString": "12:30 PM - 1:30 PM", "isBreak": True},
            {"colIndex": 4, "label": "1:30 PM - 3:00 PM", "slotString": "01:30-03:00"},
            {"colIndex": 5, "label": "3:00 PM - 4:30 PM", "slotString": "03:00-04:30"},
        ],
        "fridaySlots": [
            {"colIndex": 1, "label": "9:30 AM - 11:00 AM", "slotString": "09:30-11:00"},
            {"colIndex": 2, "label": "11:00 AM - 12:30 PM", "slotString": "11:00-12:30"},
            {"colIndex": 3, "label": "12:30 PM - 1:00 PM", "slotString": "12:30-01:00"},
            {"colIndex": 4, "label": "1:00 PM - 2:30 PM", "slotString": "01:00-02:30", "isBreak": True},
            {"colIndex": 5, "label": "2:30 PM - 3:30 PM", "slotString": "02:30-03:30"},
            {"colIndex": 6, "label": "3:30 PM - 4:00 PM", "slotString": "03:30-04:00"},
            {"colIndex": 7, "label": "4:00 PM - 5:00 PM", "slotString": "04:00-05:00"},
        ],
    }

    lines.append("-- 7. SEED APP SETTINGS")
    lines.append(f"""INSERT INTO public.app_settings (key, value)
VALUES 
    ('semester_info', '{json.dumps({"name": "Fall 2026", "active": True, "announcement": "Welcome to IUS CSE Class Routine & Schedule Portal!"})}'::jsonb),
    ('admin_config', '{json.dumps({"allow_public_comments": False, "maintenance_mode": False})}'::jsonb),
    ('batch_groups', '{json.dumps(DEFAULT_BATCH_GROUPS)}'::jsonb),
    ('routine_time_slots', '{json.dumps(DEFAULT_PORTAL_TIME_SLOTS)}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
""")

    lines.append(f"-- 8. SEED FACULTY MEMBERS ({len(all_faculty)} records)")
    lines.append("INSERT INTO public.faculty_members (serial, code, name, designation, department, slug, clean_slug, phone, email, profile_url, image_url, office_address, bio, research_interests, education, experience, publications, room)")
    lines.append("VALUES")
    
    fac_values = []
    for f in all_faculty:
        val = f"""(
    {escape_sql(f.get('serial'))},
    {escape_sql(f.get('code'))},
    {escape_sql(f.get('name'))},
    {escape_sql(f.get('designation'))},
    {escape_sql(f.get('department'))},
    {escape_sql(f.get('slug'))},
    {escape_sql(f.get('cleanSlug'))},
    {escape_sql(f.get('phone'))},
    {escape_sql(f.get('email'))},
    {escape_sql(f.get('profileUrl'))},
    {escape_sql(f.get('imageUrl'))},
    {escape_sql(f.get('officeAddress'))},
    {escape_sql(f.get('bio'))},
    {escape_sql(f.get('researchInterests', []))},
    {escape_sql(f.get('education', []))},
    {escape_sql(f.get('experience', []))},
    {escape_sql(f.get('publications', []))},
    {escape_sql(f.get('room', ''))}
)"""
        fac_values.append(val)
    
    lines.append(",\n".join(fac_values))
    lines.append("""ON CONFLICT (code) DO UPDATE SET
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
""")

    lines.append(f"\n-- 9. SEED ROUTINE ITEMS ({len(routine_items)} records)")
    lines.append("INSERT INTO public.routine_items (id, section, day, day_short, col_index, time_slot, type, title, course_code, course_title, faculty, room, raw_text)")
    lines.append("VALUES")

    batch_values = []
    for r in routine_items:
        val = f"""(
    {escape_sql(r.get('id'))},
    {escape_sql(r.get('section'))},
    {escape_sql(r.get('day'))},
    {escape_sql(r.get('dayShort'))},
    {escape_sql(r.get('colIndex', 0))},
    {escape_sql(r.get('timeSlot'))},
    {escape_sql(r.get('type'))},
    {escape_sql(r.get('title'))},
    {escape_sql(r.get('courseCode'))},
    {escape_sql(r.get('courseTitle'))},
    {escape_sql(r.get('faculty'))},
    {escape_sql(r.get('room'))},
    {escape_sql(r.get('rawText'))}
)"""
        batch_values.append(val)

    lines.append(",\n".join(batch_values))
    lines.append("""ON CONFLICT (id) DO UPDATE SET
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
""")

    lines.append("""
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
""")

    lines.append("\n-- COMPLETED SUCCESSFULLY!")
    lines.append("-- Check total counts:")
    lines.append("-- SELECT count(*) FROM routine_items; -- Should be 323")
    lines.append("-- SELECT count(*) FROM routine_drafts; -- Should be 323")
    lines.append(f"-- SELECT count(*) FROM faculty_members; -- Should be {len(all_faculty)}")
    lines.append("-- SELECT count(*) FROM app_settings; -- Should be 5")

    output_sql = "\n".join(lines)
    with open('supabase_schema_and_seed.sql', 'w', encoding='utf-8') as f:
        f.write(output_sql)

    print(f"Generated supabase_schema_and_seed.sql successfully! Total size: {len(output_sql)} characters.")
    print(f"Routine items: {len(routine_items)}, Faculty members: {len(all_faculty)}")

if __name__ == '__main__':
    main()
