-- ============================================================
-- IUS CSE Class Routine Fall 2026 - Full Update
-- Generated from CSE Class Routine Fall-2026.xlsx
-- Run this in Supabase SQL Editor
-- ============================================================

-- Step 1: Clear existing data
TRUNCATE TABLE public.routine_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.routine_drafts RESTART IDENTITY CASCADE;

-- Step 2: Insert all routine items
INSERT INTO public.routine_items
  (id, section, day, day_short, col_index, time_slot, type, title,
   course_code, course_title, faculty, room, raw_text, updated_at)
VALUES
  ('section13a-sat-col2-cse4149', 'Section 13A', 'Saturday', 'Sat', 2, '10:30-12:00', 'Theory', 'Data Science & Big Data Analytics', 'CSE 4149', 'Data Science & Big Data Analytics', 'MES', '1502', 'CSE 4149
Data Science & Big Data Analytics
10:30 - 12:00
MES | 1502', NOW()),
  ('section13a-sat-col3-break', 'Section 13A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section13a-sat-col4-cse4230', 'Section 13A', 'Saturday', 'Sat', 4, '1:00-4:00', 'Lab', 'Artificial Intelligence Lab', 'CSE 4230', 'Artificial Intelligence Lab', 'RBS', '1503', 'CSE 4230
Artificial Intelligence Lab
1:00-4:00
RBS | 1503', NOW()),
  ('section13a-sun-col2-cse4229', 'Section 13A', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Artificial Intelligence', 'CSE 4229', 'Artificial Intelligence', 'RBS', '2004', 'CSE 4229
Artificial Intelligence
10:30 - 12:00
RBS | 2004', NOW()),
  ('section13a-sun-col3-break', 'Section 13A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section13a-sun-col5-cse4277', 'Section 13A', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Network & Server Administration', 'CSE 4277', 'Network & Server Administration', 'MMI', '1903', 'CSE 4277
Network & Server Administration
2:30-4:00
MMI | 1903', NOW()),
  ('section13a-mon-col1-cse4278', 'Section 13A', 'Monday', 'Mon', 1, '9:00-12:00', 'Lab', 'Network & Server Administration Lab', 'CSE 4278', 'Network & Server Administration Lab', 'MMI', '1503', 'CSE 4278
Network & Server Administration Lab
9:00-12:00
MMI | 1503', NOW()),
  ('section13a-mon-col3-break', 'Section 13A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section13a-mon-col4-cse4277', 'Section 13A', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Network & Server Administration', 'CSE 4277', 'Network & Server Administration', 'MMI', '1701', 'CSE 4277
Network & Server Administration
1:00-2:30
MMI | 1701', NOW()),
  ('section13a-mon-col5-cse4149', 'Section 13A', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Data Science & Big Data Analytics', 'CSE 4149', 'Data Science & Big Data Analytics', 'MES', '1903', 'CSE 4149
Data Science & Big Data Analytics
2:30-4:00
MES | 1903', NOW()),
  ('section13a-tue-col3-break', 'Section 13A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section13a-wed-col1-break', 'Section 13A', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section13a-thu-col1-break', 'Section 13A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section13a-fri-col4-break', 'Section 13A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section14a-sat-col2-cse4135', 'Section 14A', 'Saturday', 'Sat', 2, '10:30-12:00', 'Theory', 'Cyber Security & Law', 'CSE 4135', 'Cyber Security & Law', 'ST', '804', 'CSE 4135
Cyber Security & Law
10:30 - 12:00
ST | 804', NOW()),
  ('section14a-sat-col3-break', 'Section 14A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14a-sat-col4-cse4148', 'Section 14A', 'Saturday', 'Sat', 4, '1:00-2:30', 'Theory', 'Mobile Application Development', 'CSE 4148', 'Mobile Application Development', 'ST', '1502', 'CSE 4148
Mobile Application Development
1:00-2:30
ST | 1502', NOW()),
  ('section14a-sat-col5-cse4201', 'Section 14A', 'Saturday', 'Sat', 5, '2:30-4:00', 'Theory', 'Data Mining & Machine Learning', 'CSE 4201', 'Data Mining & Machine Learning', 'AMJ', '1502', 'CSE 4201
Data Mining & Machine Learning
2:30-4:00
AMJ | 1502', NOW()),
  ('section14a-sun-col1-cse4125', 'Section 14A', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'D. SI', '2003', 'CSE 4125
Software Engineering
9:00-10:30
D. SI | 2003', NOW()),
  ('section14a-sun-col2-cse4148', 'Section 14A', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Mobile Application Development', 'CSE 4148', 'Mobile Application Development', 'ST', '2003', 'CSE 4148
Mobile Application Development
10:30 - 12:00
ST | 2003', NOW()),
  ('section14a-sun-col3-break', 'Section 14A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14a-sun-col4-cse4138', 'Section 14A', 'Sunday', 'Sun', 4, '1:00-4:00', 'Lab', 'Operating System Lab', 'CSE 4138', 'Operating System Lab', 'SNZ', '1503', 'CSE 4138
Operating System Lab
1:00-4:00
SNZ | 1503', NOW()),
  ('section14a-mon-col1-cse4137', 'Section 14A', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Operating System', 'CSE 4137', 'Operating System', 'SNZ', '1901', 'CSE 4137
Operating System
9:00-10:30
SNZ | 1901', NOW()),
  ('section14a-mon-col2-cse4125', 'Section 14A', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'D. SI', '1901', 'CSE 4125
Software Engineering
10:30 - 12:00
D. SI | 1901', NOW()),
  ('section14a-mon-col3-break', 'Section 14A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14a-mon-col4-cse4135', 'Section 14A', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Cyber Security & Law', 'CSE 4135', 'Cyber Security & Law', 'ST', '1901', 'CSE 4135
Cyber Security & Law
1:00-2:30
ST | 1901', NOW()),
  ('section14a-mon-col5-cse4201', 'Section 14A', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Data Mining & Machine Learning', 'CSE 4201', 'Data Mining & Machine Learning', 'AMJ', '1901', 'CSE 4201
Data Mining & Machine Learning
2:30-4:00
AMJ | 1901', NOW()),
  ('section14a-tue-col3-break', 'Section 14A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14a-wed-col1-cse4126', 'Section 14A', 'Wednesday', 'Wed', 1, '9:00-12:00', 'Lab', 'Software Engineering Lab', 'CSE 4126', 'Software Engineering Lab', 'SNZ', '1703', 'CSE 4126
Software Engineering Lab
9:00-12:00
SNZ | 1703', NOW()),
  ('section14a-wed-col3-break', 'Section 14A', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14a-thu-col1-break', 'Section 14A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section14a-fri-col4-break', 'Section 14A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section14b-sat-col3-break', 'Section 14B', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14b-sun-col1-cse4135', 'Section 14B', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Cyber Security & Law', 'CSE 4135', 'Cyber Security & Law', 'ST', '1903', 'CSE 4135
Cyber Security & Law
9:00-10:30
ST | 1903', NOW()),
  ('section14b-sun-col2-cse4201', 'Section 14B', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Data Mining & Machine Learning', 'CSE 4201', 'Data Mining & Machine Learning', 'MES', '2001', 'CSE 4201
Data Mining & Machine Learning
10:30 - 12:00
MES | 2001', NOW()),
  ('section14b-sun-col3-break', 'Section 14B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14b-sun-col4-cse4125', 'Section 14B', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'SI', '1903', 'CSE 4125
Software Engineering
1:00-2:30
SI | 1903', NOW()),
  ('section14b-sun-col5-cse4137', 'Section 14B', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Operating System', 'CSE 4137', 'Operating System', 'TBA', '1901', 'CSE 4137
Operating System
2:30-4:00
TBA | 1901', NOW()),
  ('section14b-mon-col1-cse4125', 'Section 14B', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'SI', '2001', 'CSE 4125
Software Engineering
9:00-10:30
SI | 2001', NOW()),
  ('section14b-mon-col2-cse4201', 'Section 14B', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Data Mining & Machine Learning', 'CSE 4201', 'Data Mining & Machine Learning', 'MES', '1704', 'CSE 4201
Data Mining & Machine Learning
10:30 - 12:00
MES | 1704', NOW()),
  ('section14b-mon-col3-break', 'Section 14B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14b-mon-col5-cse4135', 'Section 14B', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Cyber Security & Law', 'CSE 4135', 'Cyber Security & Law', 'STR', '1701', 'CSE 4135
Cyber Security & Law
2:30-4:00
STR | 1701', NOW()),
  ('section14b-tue-col3-break', 'Section 14B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14b-wed-col1-cse4137', 'Section 14B', 'Wednesday', 'Wed', 1, '9:00-10:30', 'Theory', 'Operating System', 'CSE 4137', 'Operating System', 'TBA', '1502', 'CSE 4137
Operating System
9:00-10:30
TBA | 1502', NOW()),
  ('section14b-wed-col3-break', 'Section 14B', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section14b-wed-col4-cse4138', 'Section 14B', 'Wednesday', 'Wed', 4, '1:00-4:00', 'Lab', 'Operating System Lab', 'CSE 4138', 'Operating System Lab', 'TBA', '1503', 'CSE 4138
Operating System Lab
1:00-4:00
TBA | 1503', NOW()),
  ('section14b-thu-col1-break', 'Section 14B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section14b-fri-col1-cse4126', 'Section 14B', 'Friday', 'Fri', 1, '9:00-12:00', 'Lab', 'Software Engineering Lab', 'CSE 4126', 'Software Engineering Lab', 'SNZ', '1503', 'CSE 4126
Software Engineering Lab
9:00-12:00
SNZ | 1503', NOW()),
  ('section14b-fri-col4-break', 'Section 14B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section14b-fri-col5-cse4148', 'Section 14B', 'Friday', 'Fri', 5, '3:30-5:00', 'Theory', 'Mobile Application Development', 'CSE 4148', 'Mobile Application Development', 'RBS', '902', 'CSE 4148
Mobile Application Development
3:30-5:00
RBS | 902', NOW()),
  ('section15a-sat-col2-cse3131', 'Section 15A', 'Saturday', 'Sat', 2, '10:30-12:00', 'Theory', 'Data Communication & Networking', 'CSE 3131', 'Data Communication & Networking', 'TH', '803', 'CSE 3131
Data Communication & Networking
10:30 - 12:00
TH | 803', NOW()),
  ('section15a-sat-col3-break', 'Section 15A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15a-sat-col4-eee2114', 'Section 15A', 'Saturday', 'Sat', 4, '1:00-4:00', 'Lab', 'Electronics Devices & Circuits Lab', 'EEE 2114', 'Electronics Devices & Circuits Lab', 'IMH', 'EEE Lab (EEE Dept)', 'EEE 2114
Electronics Devices & Circuits Lab
1:00-4:00
IMH | EEE Lab (EEE Dept)', NOW()),
  ('section15a-sun-col1-hum3103', 'Section 15A', 'Sunday', 'Sun', 1, '09:00-12:00', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'LM', '1901', 'HUM 3103
Principles of Management
09:00 - 12:00
LM | 1901', NOW()),
  ('section15a-sun-col3-break', 'Section 15A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15a-mon-col1-cse3132', 'Section 15A', 'Monday', 'Mon', 1, '9:00-12:00', 'Lab', 'Data Communication & Networking Lab', 'CSE 3132', 'Data Communication & Networking Lab', 'TH', '1703', 'CSE 3132
Data Communication & Networking Lab
9:00-12:00
TH | 1703', NOW()),
  ('section15a-mon-col3-break', 'Section 15A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15a-mon-col4-cse4125', 'Section 15A', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'MNI', '2001', 'CSE 4125
Software Engineering
1:00-2:30
MNI | 2001', NOW()),
  ('section15a-tue-col1-cse4126', 'Section 15A', 'Tuesday', 'Tue', 1, '9:00-12:00', 'Lab', 'Software Engineering Lab', 'CSE 4126', 'Software Engineering Lab', 'MNI', '1703', 'CSE 4126
Software Engineering Lab
9:00-12:00
MNI | 1703', NOW()),
  ('section15a-tue-col3-break', 'Section 15A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15a-tue-col4-cse3220', 'Section 15A', 'Tuesday', 'Tue', 4, '1:00-4:00', 'Lab', 'NLP Lab using Python', 'CSE 3220', 'NLP Lab using Python', 'RBS', '1503', 'CSE 3220
NLP Lab using Python
1:00-4:00
RBS | 1503', NOW()),
  ('section15a-wed-col1-break', 'Section 15A', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section15a-thu-col1-break', 'Section 15A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section15a-fri-col1-eee2113', 'Section 15A', 'Friday', 'Fri', 1, '9:00-10:30', 'Theory', 'Electronics Devices & Circuits', 'EEE 2113', 'Electronics Devices & Circuits', 'IMH', '804', 'EEE 2113
Electronics Devices & Circuits
9:00-10:30
IMH | 804', NOW()),
  ('section15a-fri-col2-cse3219', 'Section 15A', 'Friday', 'Fri', 2, '10:30-12:00', 'Theory', 'Compiler Construction', 'CSE 3219', 'Compiler Construction', 'RBS', '804', 'CSE 3219
Compiler Construction
10:30 - 12:00
RBS | 804', NOW()),
  ('section15a-fri-col4-break', 'Section 15A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section15a-fri-col6-cse3131', 'Section 15A', 'Friday', 'Fri', 6, '3:30-5:00', 'Theory', 'Data Communication & Networking', 'CSE 3131', 'Data Communication & Networking', 'TH', '804', 'CSE 3131
Data Communication & Networking
3:30-5:00
TH | 804', NOW()),
  ('section15b-sat-col3-break', 'Section 15B', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15b-sat-col4-eee2114', 'Section 15B', 'Saturday', 'Sat', 4, '1:00-4:00', 'Lab', 'Electronics Devices & Circuits Lab', 'EEE 2114', 'Electronics Devices & Circuits Lab', 'ZAJ', '903', 'EEE 2114
Electronics Devices & Circuits Lab
1:00-4:00
ZAJ | 903', NOW()),
  ('section15b-sun-col1-hum3103', 'Section 15B', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '804', 'HUM 3103
Principles of Management
9:00-10:30
SS | 804', NOW()),
  ('section15b-sun-col2-cse3131', 'Section 15B', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Data Communication & Networking', 'CSE 3131', 'Data Communication & Networking', 'HMK', '1903', 'CSE 3131
Data Communication & Networking
10:30 - 12:00
HMK | 1903', NOW()),
  ('section15b-sun-col3-break', 'Section 15B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15b-sun-col4-cse3219', 'Section 15B', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Compiler Construction', 'CSE 3219', 'Compiler Construction', 'AR', '1704', 'CSE 3219
Compiler Construction
1:00-2:30
AR | 1704', NOW()),
  ('section15b-sun-col5-cse4125', 'Section 15B', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'TBA', '1702', 'CSE 4125
Software Engineering
2:30-4:00
TBA | 1702', NOW()),
  ('section15b-mon-col1-cse310817a,17b,15a', 'Section 15B', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Integrated Design Project I', 'CSE 3108 (+17A,17B,15A)', 'Integrated Design Project I', 'IJ', 'Auditorium (13th floor)', 'CSE 3108 (+17A,17B,15A)
Integrated Design Project I
9:00-10:30
IJ | Auditorium (13th floor)', NOW()),
  ('section15b-mon-col2-hum3103', 'Section 15B', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '1702', 'HUM 3103
Principles of Management
10:30 - 12:00
SS | 1702', NOW()),
  ('section15b-mon-col3-break', 'Section 15B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15b-mon-col4-cse3220', 'Section 15B', 'Monday', 'Mon', 4, '1:00-4:00', 'Lab', 'NLP Lab using Python', 'CSE 3220', 'NLP Lab using Python', 'AR', '1503', 'CSE 3220
NLP Lab using Python
1:00-4:00
AR | 1503', NOW()),
  ('section15b-tue-col1-cse4126', 'Section 15B', 'Tuesday', 'Tue', 1, '9:00-12:00', 'Lab', 'Software Engineering Lab', 'CSE 4126', 'Software Engineering Lab', 'TBA', '1503', 'CSE 4126
Software Engineering Lab
9:00-12:00
TBA | 1503', NOW()),
  ('section15b-tue-col3-break', 'Section 15B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15b-tue-col4-eee2113', 'Section 15B', 'Tuesday', 'Tue', 4, '1:00-2:30', 'Theory', 'Electronics Devices & Circuits', 'EEE 2113', 'Electronics Devices & Circuits', 'ZAJ', '803', 'EEE 2113
Electronics Devices & Circuits
1:00-2:30
ZAJ | 803', NOW()),
  ('section15b-tue-col5-cse4125', 'Section 15B', 'Tuesday', 'Tue', 5, '2:30-4:00', 'Theory', 'Software Engineering', 'CSE 4125', 'Software Engineering', 'TBA', '804', 'CSE 4125
Software Engineering
2:30-4:00
TBA | 804', NOW()),
  ('section15b-wed-col3-break', 'Section 15B', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section15b-thu-col1-break', 'Section 15B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section15b-fri-col1-cse3132', 'Section 15B', 'Friday', 'Fri', 1, '9:00-12:00', 'Lab', 'Data Communication & Networking Lab', 'CSE 3132', 'Data Communication & Networking Lab', 'HMK', '902', 'CSE 3132
Data Communication & Networking Lab
9:00-12:00
HMK | 902', NOW()),
  ('section15b-fri-col4-break', 'Section 15B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section15b-fri-col6-cse3131', 'Section 15B', 'Friday', 'Fri', 6, '3:30-5:00', 'Theory', 'Data Communication & Networking', 'CSE 3131', 'Data Communication & Networking', 'HMK', '803', 'CSE 3131
Data Communication & Networking
3:30-5:00
HMK | 803', NOW()),
  ('section16a-sat-col3-break', 'Section 16A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section16a-sun-col2-cse1111', 'Section 16A', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1704', 'CSE 1111
Theory of Computing
10:30 - 12:00
MAR | 1704', NOW()),
  ('section16a-sun-col3-break', 'Section 16A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section16a-sun-col4-hum3103', 'Section 16A', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '1702', 'HUM 3103
Principles of Management
1:00-2:30
SS | 1702', NOW()),
  ('section16a-mon-col1-cse1111', 'Section 16A', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1701', 'CSE 1111
Theory of Computing
9:00-10:30
MAR | 1701', NOW()),
  ('section16a-mon-col2-cse3151', 'Section 16A', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Digital Logic Design', 'CSE 3151', 'Digital Logic Design', 'RBS', '1701', 'CSE 3151
Digital Logic Design
10:30 - 12:00
RBS | 1701', NOW()),
  ('section16a-mon-col3-break', 'Section 16A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section16a-mon-col5-cse3253', 'Section 16A', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Microprocessor & Assembly Language', 'CSE 3253', 'Microprocessor & Assembly Language', 'MNI', '1103', 'CSE 3253
Microprocessor & Assembly Language
2:30-4:00
MNI | 1103', NOW()),
  ('section16a-tue-col1-cse3152', 'Section 16A', 'Tuesday', 'Tue', 1, '9:00-12:00', 'Lab', 'Digital Logic Design Lab', 'CSE 3152', 'Digital Logic Design Lab', 'RBS', '802', 'CSE 3152
Digital Logic Design Lab
9:00-12:00
RBS | 802', NOW()),
  ('section16a-tue-col3-break', 'Section 16A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section16a-wed-col1-hum3103', 'Section 16A', 'Wednesday', 'Wed', 1, '9:00-10:30', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '801', 'HUM 3103
Principles of Management
9:00-10:30
SS | 801', NOW()),
  ('section16a-wed-col2-cse3253', 'Section 16A', 'Wednesday', 'Wed', 2, '10:30-12:00', 'Theory', 'Microprocessor & Assembly Language', 'CSE 3253', 'Microprocessor & Assembly Language', 'MNI', '801', 'CSE 3253
Microprocessor & Assembly Language
10:30 - 12:00
MNI | 801', NOW()),
  ('section16a-wed-col3-break', 'Section 16A', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section16a-wed-col4-cse3254', 'Section 16A', 'Wednesday', 'Wed', 4, '1:00-4:00', 'Lab', 'Microprocessor & Assembly Language Lab', 'CSE 3254', 'Microprocessor & Assembly Language Lab', 'MNI', '802', 'CSE 3254
Microprocessor & Assembly Language Lab
1:00-4:00
MNI | 802', NOW()),
  ('section16a-thu-col1-break', 'Section 16A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section16a-fri-col4-eee1212', 'Section 16A', 'Friday', 'Fri', 4, '2:30-5:00', 'Lab', 'Electrical Circuit Analysis +  Lab', 'EEE 1212', 'Electrical Circuit Analysis +  Lab', 'MES', '1503', 'EEE 1212
Electrical Circuit Analysis +  Lab
2:30-5:00
MES | 1503', NOW()),
  ('section17a-sat-col1-cse2222', 'Section 17A', 'Saturday', 'Sat', 1, '9:00-12:00', 'Lab', 'System Analysis & Design Lab', 'CSE 2222', 'System Analysis & Design Lab', 'MAA', '1503', 'CSE 2222
System Analysis & Design Lab
9:00-12:00
MAA | 1503', NOW()),
  ('section17a-sat-col3-break', 'Section 17A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17a-sat-col4-math2217', 'Section 17A', 'Saturday', 'Sat', 4, '1:00-2:30', 'Theory', 'Math-IV (Probability & Statistics)', 'MATH 2217', 'Math-IV (Probability & Statistics)', 'AMJ', '801', 'MATH 2217
Math-IV (Probability & Statistics)
1:00-2:30
AMJ | 801', NOW()),
  ('section17a-sat-col5-hum3103*', 'Section 17A', 'Saturday', 'Sat', 5, '1:00-2:30', 'Theory', 'Principles of Management', 'HUM 3103 *', 'Principles of Management', 'RH', '801', 'HUM 3103 *
Principles of Management
1:00-2:30
RH | 801', NOW()),
  ('section17a-sun-col1-cse310817b,15a,15b', 'Section 17A', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Integrated Design Project I', 'CSE 3108 (+17B,15A,15B)', 'Integrated Design Project I', 'IJ', '1504', 'CSE 3108 (+17B,15A,15B)
Integrated Design Project I
9:00-10:30
IJ | 1504', NOW()),
  ('section17a-sun-col2-cse2215', 'Section 17A', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Data Structures & Algorithms', 'CSE 2215', 'Data Structures & Algorithms', 'TBA', '1702', 'CSE 2215
Data Structures & Algorithms
10:30 - 12:00
TBA | 1702', NOW()),
  ('section17a-sun-col3-break', 'Section 17A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17a-sun-col4-cse1111', 'Section 17A', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1701', 'CSE 1111
Theory of Computing
1:00-2:30
MAR | 1701', NOW()),
  ('section17a-sun-col5-cse2221', 'Section 17A', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'System Analysis & Design', 'CSE 2221', 'System Analysis & Design', 'MAA', '1701', 'CSE 2221
System Analysis & Design
2:30-4:00
MAA | 1701', NOW()),
  ('section17a-mon-col1-math2217', 'Section 17A', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Math-IV (Probability & Statistics)', 'MATH 2217', 'Math-IV (Probability & Statistics)', 'AMJ', '1504', 'MATH 2217
Math-IV (Probability & Statistics)
9:00-10:30
AMJ | 1504', NOW()),
  ('section17a-mon-col2-cse1111', 'Section 17A', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1504', 'CSE 1111
Theory of Computing
10:30 - 12:00
MAR | 1504', NOW()),
  ('section17a-mon-col3-break', 'Section 17A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17a-tue-col1-hum3103', 'Section 17A', 'Tuesday', 'Tue', 1, '9:00-10:30', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'RH', '804', 'HUM 3103
Principles of Management
9:00-10:30
RH | 804', NOW()),
  ('section17a-tue-col2-cse3108', 'Section 17A', 'Tuesday', 'Tue', 2, '10:30-12:00', 'Theory', 'Integrated Design Project I', 'CSE 3108', 'Integrated Design Project I', 'MAA', 'Auditorium (13th floor)', 'CSE 3108
Integrated Design Project I
10:30 - 12:00
MAA | Auditorium (13th floor)', NOW()),
  ('section17a-tue-col3-break', 'Section 17A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17a-tue-col4-cse2216', 'Section 17A', 'Tuesday', 'Tue', 4, '1:00-4:00', 'Lab', 'Data Structures & Algorithms Lab', 'CSE 2216', 'Data Structures & Algorithms Lab', 'TBA', '802', 'CSE 2216
Data Structures & Algorithms Lab
1:00-4:00
TBA | 802', NOW()),
  ('section17a-wed-col1-break', 'Section 17A', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section17a-thu-col1-break', 'Section 17A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section17a-fri-col4-break', 'Section 17A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section17b-sat-col1-cse2216', 'Section 17B', 'Saturday', 'Sat', 1, '9:00-12:00', 'Lab', 'Data Structures & Algorithms Lab', 'CSE 2216', 'Data Structures & Algorithms Lab', 'AA', '1703', 'CSE 2216
Data Structures & Algorithms Lab
9:00-12:00
AA | 1703', NOW()),
  ('section17b-sat-col3-break', 'Section 17B', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17b-sat-col4-cse2215', 'Section 17B', 'Saturday', 'Sat', 4, '1:00-2:30', 'Theory', 'Data Structures & Algorithms', 'CSE 2215', 'Data Structures & Algorithms', 'AA', '803', 'CSE 2215
Data Structures & Algorithms
1:00-2:30
AA | 803', NOW()),
  ('section17b-sat-col5-cse3108', 'Section 17B', 'Saturday', 'Sat', 5, '2:30-4:00', 'Theory', 'Integrated Design Project I', 'CSE 3108', 'Integrated Design Project I', 'MAA', 'Auditorium (13th floor)', 'CSE 3108
Integrated Design Project I
2:30-4:00
MAA | Auditorium (13th floor)', NOW()),
  ('section17b-sun-col1-cse1111', 'Section 17B', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1704', 'CSE 1111
Theory of Computing
9:00-10:30
MAR | 1704', NOW()),
  ('section17b-sun-col2-cse2221', 'Section 17B', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'System Analysis & Design', 'CSE 2221', 'System Analysis & Design', 'MAA', '1701', 'CSE 2221
System Analysis & Design
10:30 - 12:00
MAA | 1701', NOW()),
  ('section17b-sun-col3-break', 'Section 17B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17b-sun-col4-math2217', 'Section 17B', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Math-IV (Probability & Statistics)', 'MATH 2217', 'Math-IV (Probability & Statistics)', 'IJ', '1504', 'MATH 2217
Math-IV (Probability & Statistics)
1:00-2:30
IJ | 1504', NOW()),
  ('section17b-sun-col5-hum3103', 'Section 17B', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '1504', 'HUM 3103
Principles of Management
2:30-4:00
SS | 1504', NOW()),
  ('section17b-mon-col2-math2217', 'Section 17B', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Math-IV (Probability & Statistics)', 'MATH 2217', 'Math-IV (Probability & Statistics)', 'IJ', '1903', 'MATH 2217
Math-IV (Probability & Statistics)
10:30 - 12:00
IJ | 1903', NOW()),
  ('section17b-mon-col3-break', 'Section 17B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17b-mon-col4-hum3103', 'Section 17B', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Principles of Management', 'HUM 3103', 'Principles of Management', 'SS', '1702', 'HUM 3103
Principles of Management
1:00-2:30
SS | 1702', NOW()),
  ('section17b-mon-col5-cse1111', 'Section 17B', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Theory of Computing', 'CSE 1111', 'Theory of Computing', 'MAR', '1101', 'CSE 1111
Theory of Computing
2:30-4:00
MAR | 1101', NOW()),
  ('section17b-tue-col3-break', 'Section 17B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17b-wed-col3-break', 'Section 17B', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section17b-thu-col1-break', 'Section 17B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section17b-fri-col1-cse2222sp', 'Section 17B', 'Friday', 'Fri', 1, '9:00-12:00', 'Lab', 'System Analysis & Design Lab (with SP)', 'CSE 2222 (+SP)', 'System Analysis & Design Lab (with SP)', 'MAA', '802', 'CSE 2222 (+SP)
System Analysis & Design Lab (with SP)
9:00-12:00
MAA | 802', NOW()),
  ('section17b-fri-col4-break', 'Section 17B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section18a-sat-col1-cse3224', 'Section 18A', 'Saturday', 'Sat', 1, '9:00-12:00', 'Lab', 'Database Management System Lab', 'CSE 3224', 'Database Management System Lab', 'HMK', '802', 'CSE 3224
Database Management System Lab
9:00-12:00
HMK | 802', NOW()),
  ('section18a-sat-col3-break', 'Section 18A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18a-sat-col4-cse2234', 'Section 18A', 'Saturday', 'Sat', 4, '1:00-2:30', 'Lab', 'Numerical Analysis with MATLAB', 'CSE 2234', 'Numerical Analysis with MATLAB', 'TH', '804', 'CSE 2234
Numerical Analysis with MATLAB
1:00-2:30
TH | 804', NOW()),
  ('section18a-sun-col1-hum1111', 'Section 18A', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Organizational Behaviors', 'HUM 1111', 'Organizational Behaviors', 'MMI', '1702', 'HUM 1111
Organizational Behaviors
9:00-10:30
MMI | 1702', NOW()),
  ('section18a-sun-col2-cse2234', 'Section 18A', 'Sunday', 'Sun', 2, '10:30-12:00', 'Lab', 'Numerical Analysis with MATLAB', 'CSE 2234', 'Numerical Analysis with MATLAB', 'TH', '1501', 'CSE 2234
Numerical Analysis with MATLAB
10:30 - 12:00
TH | 1501', NOW()),
  ('section18a-sun-col3-break', 'Section 18A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18a-sun-col4-cse2205', 'Section 18A', 'Sunday', 'Sun', 4, '1:00-4:00', 'Theory', 'Competitive Programming-II', 'CSE 2205', 'Competitive Programming-II', 'MES', '802', 'CSE 2205
Competitive Programming-II
1:00-4:00
MES | 802', NOW()),
  ('section18a-mon-col1-bba2211', 'Section 18A', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Business Communication', 'BBA 2211', 'Business Communication', 'SS', '1501', 'BBA 2211
Business Communication
9:00-10:30
SS | 1501', NOW()),
  ('section18a-mon-col2-math2115', 'Section 18A', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Mathematics-III', 'MATH 2115', 'Mathematics-III', 'AMF', '1103', 'MATH 2115
Mathematics-III
10:30 - 12:00
AMF | 1103', NOW()),
  ('section18a-mon-col3-break', 'Section 18A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18a-mon-col4-cse2144', 'Section 18A', 'Monday', 'Mon', 4, '1:00-4:00', 'Theory', 'Engineering Drawing', 'CSE 2144', 'Engineering Drawing', 'SNZ', '802', 'CSE 2144
Engineering Drawing
1:00-4:00
SNZ | 802', NOW()),
  ('section18a-tue-col1-math2115', 'Section 18A', 'Tuesday', 'Tue', 1, '9:00-10:30', 'Theory', 'Mathematics-III', 'MATH 2115', 'Mathematics-III', 'AMF', '803', 'MATH 2115
Mathematics-III
9:00-10:30
AMF | 803', NOW()),
  ('section18a-tue-col3-break', 'Section 18A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18a-tue-col4-cse3223', 'Section 18A', 'Tuesday', 'Tue', 4, '1:00-2:30', 'Theory', 'Database Management System', 'CSE 3223', 'Database Management System', 'HMK', '804', 'CSE 3223
Database Management System
1:00-2:30
HMK | 804', NOW()),
  ('section18a-tue-col5-bba2211', 'Section 18A', 'Tuesday', 'Tue', 5, '2:30-4:00', 'Theory', 'Business Communication', 'BBA 2211', 'Business Communication', 'SS', '803', 'BBA 2211
Business Communication
2:30-4:00
SS | 803', NOW()),
  ('section18a-wed-col1-break', 'Section 18A', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section18a-thu-col1-break', 'Section 18A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section18a-fri-col4-break', 'Section 18A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section18b-sat-col1-math2115', 'Section 18B', 'Saturday', 'Sat', 1, '9:00-10:30', 'Theory', 'Mathematics-III', 'MATH 2115', 'Mathematics-III', 'DRA', '801', 'MATH 2115
Mathematics-III
9:00-10:30
DRA | 801', NOW()),
  ('section18b-sat-col3-break', 'Section 18B', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18b-sat-col4-cse3224', 'Section 18B', 'Saturday', 'Sat', 4, '1:00-4:00', 'Lab', 'Database Management System Lab', 'CSE 3224', 'Database Management System Lab', 'AR', '802', 'CSE 3224
Database Management System Lab
1:00-4:00
AR | 802', NOW()),
  ('section18b-sun-col1-cse3223', 'Section 18B', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Database Management System', 'CSE 3223', 'Database Management System', 'AR', '1701', 'CSE 3223
Database Management System
9:00-10:30
AR | 1701', NOW()),
  ('section18b-sun-col2-bba2211', 'Section 18B', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Business Communication', 'BBA 2211', 'Business Communication', 'SS', '1504', 'BBA 2211
Business Communication
10:30 - 12:00
SS | 1504', NOW()),
  ('section18b-sun-col3-break', 'Section 18B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18b-sun-col4-hum1111', 'Section 18B', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Organizational Behaviors', 'HUM 1111', 'Organizational Behaviors', 'MMI', '1501', 'HUM 1111
Organizational Behaviors
1:00-2:30
MMI | 1501', NOW()),
  ('section18b-sun-col5-cse2234', 'Section 18B', 'Sunday', 'Sun', 5, '2:30-4:00', 'Lab', 'Numerical Analysis with MATLAB', 'CSE 2234', 'Numerical Analysis with MATLAB', 'ST', '1501', 'CSE 2234
Numerical Analysis with MATLAB
2:30-4:00
ST | 1501', NOW()),
  ('section18b-mon-col1-cse2234', 'Section 18B', 'Monday', 'Mon', 1, '9:00-10:30', 'Lab', 'Numerical Analysis with MATLAB', 'CSE 2234', 'Numerical Analysis with MATLAB', 'ST', '1103', 'CSE 2234
Numerical Analysis with MATLAB
9:00-10:30
ST | 1103', NOW()),
  ('section18b-mon-col2-math2115', 'Section 18B', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Mathematics-III', 'MATH 2115', 'Mathematics-III', 'DRA', '1101', 'MATH 2115
Mathematics-III
10:30 - 12:00
DRA | 1101', NOW()),
  ('section18b-mon-col3-break', 'Section 18B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18b-mon-col4-cse2144', 'Section 18B', 'Monday', 'Mon', 4, '1:00-4:00', 'Theory', 'Engineering Drawing', 'CSE 2144', 'Engineering Drawing', 'TH', '902', 'CSE 2144
Engineering Drawing
1:00-4:00
TH | 902', NOW()),
  ('section18b-tue-col3-break', 'Section 18B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18b-wed-col1-cse2205', 'Section 18B', 'Wednesday', 'Wed', 1, '9:00-12:00', 'Theory', 'Competitive Programming-II', 'CSE 2205', 'Competitive Programming-II', 'SNN', '1503', 'CSE 2205
Competitive Programming-II
9:00-12:00
SNN | 1503', NOW()),
  ('section18b-wed-col3-break', 'Section 18B', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section18b-wed-col5-bba2211', 'Section 18B', 'Wednesday', 'Wed', 5, '2:30-4:00', 'Theory', 'Business Communication', 'BBA 2211', 'Business Communication', 'SS', '801', 'BBA 2211
Business Communication
2:30-4:00
SS | 801', NOW()),
  ('section18b-thu-col1-break', 'Section 18B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section18b-fri-col4-break', 'Section 18B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section19a-sat-col3-break', 'Section 19A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19a-sun-col3-break', 'Section 19A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19a-sun-col4-math1213', 'Section 19A', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'AMF', '1103', 'MATH 1213
Mathematics-II
1:00-2:30
AMF | 1103', NOW()),
  ('section19a-sun-col5-eng121319b', 'Section 19A', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Communicative English', 'ENG 1213 (+19B)', 'Communicative English', 'HMK', '1402', 'ENG 1213 (+19B)
Communicative English
2:30-4:00
HMK | 1402', NOW()),
  ('section19a-mon-col3-break', 'Section 19A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19a-mon-col4-math1213', 'Section 19A', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'AMF', '1501', 'MATH 1213
Mathematics-II
1:00-2:30
AMF | 1501', NOW()),
  ('section19a-mon-col5-hum111119b', 'Section 19A', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Organizational Behaviors', 'HUM 1111 (+19B)', 'Organizational Behaviors', 'MMI', '1502', 'HUM 1111 (+19B)
Organizational Behaviors
2:30-4:00
MMI | 1502', NOW()),
  ('section19a-tue-col3-break', 'Section 19A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19a-tue-col4-cse2142', 'Section 19A', 'Tuesday', 'Tue', 4, '1:00-4:00', 'Lab', 'Object Oriented Programming Lab', 'CSE 2142', 'Object Oriented Programming Lab', 'AMJ', '1703', 'CSE 2142
Object Oriented Programming Lab
1:00-4:00
AMJ | 1703', NOW()),
  ('section19a-wed-col3-break', 'Section 19A', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19a-thu-col1-break', 'Section 19A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section19a-fri-col1-cse2105', 'Section 19A', 'Friday', 'Fri', 1, '9:00-12:00', 'Theory', 'Competitive Programming-I', 'CSE 2105', 'Competitive Programming-I', 'MES', '1703', 'CSE 2105
Competitive Programming-I
9:00-12:00
MES | 1703', NOW()),
  ('section19a-fri-col4-break', 'Section 19A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section19a-fri-col6-cse2141', 'Section 19A', 'Friday', 'Fri', 6, '3:30-5:00', 'Theory', 'Object Oriented Programming', 'CSE 2141', 'Object Oriented Programming', 'AMJ', '801', 'CSE 2141
Object Oriented Programming
3:30-5:00
AMJ | 801', NOW()),
  ('section19b-sat-col1-cse2142', 'Section 19B', 'Saturday', 'Sat', 1, '9:00-12:00', 'Lab', 'Object Oriented Programming Lab', 'CSE 2142', 'Object Oriented Programming Lab', 'AMJ', '902', 'CSE 2142
Object Oriented Programming Lab
9:00-12:00
AMJ | 902', NOW()),
  ('section19b-sat-col3-break', 'Section 19B', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19b-sat-col4-cse2105', 'Section 19B', 'Saturday', 'Sat', 4, '1:00-4:00', 'Theory', 'Competitive Programming-I', 'CSE 2105', 'Competitive Programming-I', 'MES', '1703', 'CSE 2105
Competitive Programming-I
1:00-4:00
MES | 1703', NOW()),
  ('section19b-sun-col2-math1213', 'Section 19B', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'AMF', '1103', 'MATH 1213
Mathematics-II
10:30 - 12:00
AMF | 1103', NOW()),
  ('section19b-sun-col3-break', 'Section 19B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19b-sun-col5-eng121319a', 'Section 19B', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Communicative English', 'ENG 1213 (+19A)', 'Communicative English', 'HMK', '1402', 'ENG 1213 (+19A)
Communicative English
2:30-4:00
HMK | 1402', NOW()),
  ('section19b-mon-col1-math1213', 'Section 19B', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'AMF', '1704', 'MATH 1213
Mathematics-II
9:00-10:30
AMF | 1704', NOW()),
  ('section19b-mon-col3-break', 'Section 19B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19b-mon-col4-cse2141', 'Section 19B', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Object Oriented Programming', 'CSE 2141', 'Object Oriented Programming', 'AMJ', '1103', 'CSE 2141
Object Oriented Programming
1:00-2:30
AMJ | 1103', NOW()),
  ('section19b-mon-col5-hum111119a', 'Section 19B', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Organizational Behaviors', 'HUM 1111 (+19A)', 'Organizational Behaviors', 'MMI', '1502', 'HUM 1111 (+19A)
Organizational Behaviors
2:30-4:00
MMI | 1502', NOW()),
  ('section19b-tue-col3-break', 'Section 19B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19b-wed-col3-break', 'Section 19B', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19b-thu-col1-break', 'Section 19B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section19b-fri-col4-break', 'Section 19B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section19c-sat-col3-break', 'Section 19C', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19c-sun-col2-cse2141', 'Section 19C', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Object Oriented Programming', 'CSE 2141', 'Object Oriented Programming', 'MNI', '804', 'CSE 2141
Object Oriented Programming
10:30 - 12:00
MNI | 804', NOW()),
  ('section19c-sun-col3-break', 'Section 19C', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19c-sun-col4-cse2105', 'Section 19C', 'Sunday', 'Sun', 4, '1:00-4:00', 'Theory', 'Competitive Programming-I', 'CSE 2105', 'Competitive Programming-I', 'SNN', '1703', 'CSE 2105
Competitive Programming-I
1:00-4:00
SNN | 1703', NOW()),
  ('section19c-mon-col1-cse2142', 'Section 19C', 'Monday', 'Mon', 1, '9:00-12:00', 'Lab', 'Object Oriented Programming Lab', 'CSE 2142', 'Object Oriented Programming Lab', 'MNI', '902', 'CSE 2142
Object Oriented Programming Lab
9:00-12:00
MNI | 902', NOW()),
  ('section19c-mon-col3-break', 'Section 19C', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19c-mon-col4-math1213', 'Section 19C', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'DHS', '1101', 'MATH 1213
Mathematics-II
1:00-2:30
DHS | 1101', NOW()),
  ('section19c-mon-col5-eng121319d', 'Section 19C', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Communicative English', 'ENG 1213 (+19D)', 'Communicative English', 'HMK', '1402', 'ENG 1213 (+19D)
Communicative English
2:30-4:00
HMK | 1402', NOW()),
  ('section19c-tue-col2-math1213', 'Section 19C', 'Tuesday', 'Tue', 2, '10:30-12:00', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'DHS', '804', 'MATH 1213
Mathematics-II
10:30 - 12:00
DHS | 804', NOW()),
  ('section19c-tue-col3-break', 'Section 19C', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19c-tue-col4-hum111119d', 'Section 19C', 'Tuesday', 'Tue', 4, '1:00-2:30', 'Theory', 'Organizational Behaviors', 'HUM 1111 (+19D)', 'Organizational Behaviors', 'MMI', '1502', 'HUM 1111 (+19D)
Organizational Behaviors
1:00-2:30
MMI | 1502', NOW()),
  ('section19c-wed-col3-break', 'Section 19C', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19c-thu-col1-break', 'Section 19C', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section19c-fri-col4-break', 'Section 19C', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section19d-sat-col3-break', 'Section 19D', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19d-sun-col3-break', 'Section 19D', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19d-sun-col4-cse2141', 'Section 19D', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Object Oriented Programming', 'CSE 2141', 'Object Oriented Programming', 'HMK', '804', 'CSE 2141
Object Oriented Programming
1:00-2:30
HMK | 804', NOW()),
  ('section19d-sun-col5-math1213', 'Section 19D', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'DHS', '1103', 'MATH 1213
Mathematics-II
2:30-4:00
DHS | 1103', NOW()),
  ('section19d-mon-col2-math1213', 'Section 19D', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Mathematics-II', 'MATH 1213', 'Mathematics-II', 'DHS', '804', 'MATH 1213
Mathematics-II
10:30 - 12:00
DHS | 804', NOW()),
  ('section19d-mon-col3-break', 'Section 19D', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19d-mon-col5-eng121319c', 'Section 19D', 'Monday', 'Mon', 5, '2:30-4:00', 'Theory', 'Communicative English', 'ENG 1213 (+19C)', 'Communicative English', 'HMK', '1402', 'ENG 1213 (+19C)
Communicative English
2:30-4:00
HMK | 1402', NOW()),
  ('section19d-tue-col1-cse2142', 'Section 19D', 'Tuesday', 'Tue', 1, '9:00-12:00', 'Lab', 'Object Oriented Programming Lab', 'CSE 2142', 'Object Oriented Programming Lab', 'HMK', '902', 'CSE 2142
Object Oriented Programming Lab
9:00-12:00
HMK | 902', NOW()),
  ('section19d-tue-col3-break', 'Section 19D', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19d-tue-col4-hum111119c', 'Section 19D', 'Tuesday', 'Tue', 4, '1:00-2:30', 'Theory', 'Organizational Behaviors', 'HUM 1111 (+19C)', 'Organizational Behaviors', 'MMI', '1502', 'HUM 1111 (+19C)
Organizational Behaviors
1:00-2:30
MMI | 1502', NOW()),
  ('section19d-wed-col3-break', 'Section 19D', 'Wednesday', 'Wed', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section19d-wed-col4-cse2105', 'Section 19D', 'Wednesday', 'Wed', 4, '1:00-4:00', 'Theory', 'Competitive Programming-I', 'CSE 2105', 'Competitive Programming-I', 'SNN', '1703', 'CSE 2105
Competitive Programming-I
1:00-4:00
SNN | 1703', NOW()),
  ('section19d-thu-col1-break', 'Section 19D', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section19d-fri-col4-break', 'Section 19D', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section20a-sat-col2-cse1213', 'Section 20A', 'Saturday', 'Sat', 2, '10:30-12:00', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'IJ', '1701', 'CSE 1213
Structured Programming Language
10:30 - 12:00
IJ | 1701', NOW()),
  ('section20a-sat-col3-break', 'Section 20A', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20a-sat-col4-cse1214', 'Section 20A', 'Saturday', 'Sat', 4, '1:00-4:00', 'Lab', 'Structured Programming Lab', 'CSE 1214', 'Structured Programming Lab', 'IJ', '902', 'CSE 1214
Structured Programming Lab
1:00-4:00
IJ | 902', NOW()),
  ('section20a-sun-col1-phy1112', 'Section 20A', 'Sunday', 'Sun', 1, '9:00-12:00', 'Lab', 'Physics Lab', 'PHY 1112', 'Physics Lab', 'SMM', '1502', 'PHY 1112
Physics Lab
9:00-12:00
SMM | 1502', NOW()),
  ('section20a-sun-col3-break', 'Section 20A', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20a-mon-col3-break', 'Section 20A', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20a-tue-col1-math1111', 'Section 20A', 'Tuesday', 'Tue', 1, '9:00-10:30', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'ASMS', '801', 'MATH 1111
Mathematics-I
9:00-10:30
ASMS | 801', NOW()),
  ('section20a-tue-col3-break', 'Section 20A', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20a-tue-col4-cse1213', 'Section 20A', 'Tuesday', 'Tue', 4, '1:00-2:30', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'IJ', '801', 'CSE 1213
Structured Programming Language
1:00-2:30
IJ | 801', NOW()),
  ('section20a-tue-col5-cse1203', 'Section 20A', 'Tuesday', 'Tue', 5, '2:30-4:00', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'IJ', '801', 'CSE 1203
Discrete Mathematics
2:30-4:00
IJ | 801', NOW()),
  ('section20a-wed-col1-break', 'Section 20A', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section20a-thu-col1-break', 'Section 20A', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section20a-fri-col1-cse1203', 'Section 20A', 'Friday', 'Fri', 1, '9:00-10:30', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'IJ', '803', 'CSE 1203
Discrete Mathematics
9:00-10:30
IJ | 803', NOW()),
  ('section20a-fri-col2-hum1113', 'Section 20A', 'Friday', 'Fri', 2, '10:30-12:00', 'Theory', 'Bangladesh Studies', 'HUM 1113', 'Bangladesh Studies', 'AR', '803', 'HUM 1113
Bangladesh Studies
10:30 - 12:00
AR | 803', NOW()),
  ('section20a-fri-col4-break', 'Section 20A', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section20b-sun-col1-math1111', 'Section 20B', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'ASMS', '1101', 'MATH 1111
Mathematics-I
9:00-10:30
ASMS | 1101', NOW()),
  ('section20b-sun-col3-break', 'Section 20B', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20b-sun-col5-cse1203', 'Section 20B', 'Sunday', 'Sun', 5, '10:30-12:00', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'IJ', '1101', 'CSE 1203
Discrete Mathematics
10:30 - 12:00
IJ | 1101', NOW()),
  ('section20b-mon-col1-hum1113', 'Section 20B', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Bangladesh Studies', 'HUM 1113', 'Bangladesh Studies', 'AR', '1502', 'HUM 1113
Bangladesh Studies
9:00-10:30
AR | 1502', NOW()),
  ('section20b-mon-col2-cse1213', 'Section 20B', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'SNN', '803', 'CSE 1213
Structured Programming Language
10:30 - 12:00
SNN | 803', NOW()),
  ('section20b-mon-col3-break', 'Section 20B', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20b-mon-col4-cse1214', 'Section 20B', 'Monday', 'Mon', 4, '1:00-4:00', 'Lab', 'Structured Programming Lab', 'CSE 1214', 'Structured Programming Lab', 'SNN', '1703', 'CSE 1214
Structured Programming Lab
1:00-4:00
SNN | 1703', NOW()),
  ('section20b-tue-col1-phy1112', 'Section 20B', 'Tuesday', 'Tue', 1, '9:00-12:00', 'Lab', 'Physics Lab', 'PHY 1112', 'Physics Lab', 'SMM', '1502', 'PHY 1112
Physics Lab
9:00-12:00
SMM | 1502', NOW()),
  ('section20b-tue-col3-break', 'Section 20B', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20b-wed-col1-break', 'Section 20B', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section20b-thu-col1-break', 'Section 20B', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section20b-fri-col4-break', 'Section 20B', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section20b-fri-col5-cse1203', 'Section 20B', 'Friday', 'Fri', 5, '2:30-4:00', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'IJ', '1101', 'CSE 1203
Discrete Mathematics
2:30-4:00
IJ | 1101', NOW()),
  ('section20c-sat-col3-break', 'Section 20C', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20c-sun-col3-break', 'Section 20C', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20c-sun-col4-phy1112', 'Section 20C', 'Sunday', 'Sun', 4, '1:00-4:00', 'Lab', 'Physics Lab', 'PHY 1112', 'Physics Lab', 'TA', 'Physics Lab', 'PHY 1112
Physics Lab
1:00-4:00
TA | Physics Lab', NOW()),
  ('section20c-mon-col1-cse121320b', 'Section 20C', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Structured Programming Language', 'CSE 1213 (+20B)', 'Structured Programming Language', 'SNN', '1402', 'CSE 1213 (+20B)
Structured Programming Language
9:00-10:30
SNN | 1402', NOW()),
  ('section20c-mon-col2-hum111320d', 'Section 20C', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Bangladesh Studies', 'HUM 1113 (+20D)', 'Bangladesh Studies', 'AR', '1402', 'HUM 1113 (+20D)
Bangladesh Studies
10:30 - 12:00
AR | 1402', NOW()),
  ('section20c-mon-col3-break', 'Section 20C', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20c-mon-col4-cse1203', 'Section 20C', 'Monday', 'Mon', 4, '1:00-2:30', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'MII', '803', 'CSE 1203
Discrete Mathematics
1:00-2:30
MII | 803', NOW()),
  ('section20c-tue-col3-break', 'Section 20C', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20c-tue-col4-cse1214', 'Section 20C', 'Tuesday', 'Tue', 4, '1:00-4:00', 'Lab', 'Structured Programming Lab', 'CSE 1214', 'Structured Programming Lab', 'SNN', '902', 'CSE 1214
Structured Programming Lab
1:00-4:00
SNN | 902', NOW()),
  ('section20c-wed-col1-break', 'Section 20C', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section20c-thu-col1-break', 'Section 20C', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section20c-fri-col4-break', 'Section 20C', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section20c-fri-col5-math1111', 'Section 20C', 'Friday', 'Fri', 5, '3:30-5:00', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'TA', '1701', 'MATH 1111
Mathematics-I
3:30-5:00
TA | 1701', NOW()),
  ('section20d-sat-col1-phy1112', 'Section 20D', 'Saturday', 'Sat', 1, '9:00-12:00', 'Lab', 'Physics Lab', 'PHY 1112', 'Physics Lab', 'TA', 'Physics Lab', 'PHY 1112
Physics Lab
9:00-12:00
TA | Physics Lab', NOW()),
  ('section20d-sat-col3-break', 'Section 20D', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20d-sat-col4-math1111', 'Section 20D', 'Saturday', 'Sat', 4, '2:30-4:00', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'TA', '1701', 'MATH 1111
Mathematics-I
2:30-4:00
TA | 1701', NOW()),
  ('section20d-sat-col5-cse1213', 'Section 20D', 'Saturday', 'Sat', 5, '10:30-12:00', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'TBA', '1701', 'CSE 1213
Structured Programming Language
10:30 - 12:00
TBA | 1701', NOW()),
  ('section20d-sun-col1-cse1203', 'Section 20D', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'MII', '803', 'CSE 1203
Discrete Mathematics
9:00-10:30
MII | 803', NOW()),
  ('section20d-sun-col2-math1111', 'Section 20D', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'TA', '803', 'MATH 1111
Mathematics-I
10:30 - 12:00
TA | 803', NOW()),
  ('section20d-sun-col3-break', 'Section 20D', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20d-sun-col4-cse1214', 'Section 20D', 'Sunday', 'Sun', 4, '1:00-4:00', 'Lab', 'Structured Programming Lab', 'CSE 1214', 'Structured Programming Lab', 'TBA', '902', 'CSE 1214
Structured Programming Lab
1:00-4:00
TBA | 902', NOW()),
  ('section20d-mon-col1-cse1203', 'Section 20D', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'MII', '803', 'CSE 1203
Discrete Mathematics
9:00-10:30
MII | 803', NOW()),
  ('section20d-mon-col2-hum111320c', 'Section 20D', 'Monday', 'Mon', 2, '10:30-12:00', 'Theory', 'Bangladesh Studies', 'HUM 1113 (+20C)', 'Bangladesh Studies', 'AR', '1402', 'HUM 1113 (+20C)
Bangladesh Studies
10:30 - 12:00
AR | 1402', NOW()),
  ('section20d-mon-col3-break', 'Section 20D', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20d-mon-col4-cse1213', 'Section 20D', 'Monday', 'Mon', 4, '2:30-4:00', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'TBA', '801', 'CSE 1213
Structured Programming Language
2:30-4:00
TBA | 801', NOW()),
  ('section20d-tue-col3-break', 'Section 20D', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20d-wed-col1-break', 'Section 20D', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section20d-thu-col1-break', 'Section 20D', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section20d-fri-col4-break', 'Section 20D', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW()),
  ('section20e-sat-col3-break', 'Section 20E', 'Saturday', 'Sat', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20e-sun-col1-cse1213', 'Section 20E', 'Sunday', 'Sun', 1, '9:00-10:30', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'TBA', '801', 'CSE 1213
Structured Programming Language
9:00-10:30
TBA | 801', NOW()),
  ('section20e-sun-col2-phy1111', 'Section 20E', 'Sunday', 'Sun', 2, '10:30-12:00', 'Theory', 'Physics', 'PHY 1111', 'Physics', 'DHS', '801', 'PHY 1111
Physics
10:30 - 12:00
DHS | 801', NOW()),
  ('section20e-sun-col3-break', 'Section 20E', 'Sunday', 'Sun', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20e-sun-col4-math1111', 'Section 20E', 'Sunday', 'Sun', 4, '1:00-2:30', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'DHS', '801', 'MATH 1111
Mathematics-I
1:00-2:30
DHS | 801', NOW()),
  ('section20e-sun-col5-cse1203', 'Section 20E', 'Sunday', 'Sun', 5, '2:30-4:00', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'AR', '801', 'CSE 1203
Discrete Mathematics
2:30-4:00
AR | 801', NOW()),
  ('section20e-mon-col1-cse1213', 'Section 20E', 'Monday', 'Mon', 1, '9:00-10:30', 'Theory', 'Structured Programming Language', 'CSE 1213', 'Structured Programming Language', 'TBA', '801', 'CSE 1213
Structured Programming Language
9:00-10:30
TBA | 801', NOW()),
  ('section20e-mon-col3-break', 'Section 20E', 'Monday', 'Mon', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20e-mon-col4-cse1214', 'Section 20E', 'Monday', 'Mon', 4, '1:00-4:00', 'Lab', 'Structured Programming Lab', 'CSE 1214', 'Structured Programming Lab', 'TBA', '902', 'CSE 1214
Structured Programming Lab
1:00-4:00
TBA | 902', NOW()),
  ('section20e-tue-col1-math1111', 'Section 20E', 'Tuesday', 'Tue', 1, '9:00-10:30', 'Theory', 'Mathematics-I', 'MATH 1111', 'Mathematics-I', 'DHS', '1502', 'MATH 1111
Mathematics-I
9:00-10:30
DHS | 1502', NOW()),
  ('section20e-tue-col2-cse1203', 'Section 20E', 'Tuesday', 'Tue', 2, '10:30-12:00', 'Theory', 'Discrete Mathematics', 'CSE 1203', 'Discrete Mathematics', 'AR', '801', 'CSE 1203
Discrete Mathematics
10:30 - 12:00
AR | 801', NOW()),
  ('section20e-tue-col3-break', 'Section 20E', 'Tuesday', 'Tue', 3, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Lunch Break', NOW()),
  ('section20e-wed-col1-break', 'Section 20E', 'Wednesday', 'Wed', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Teachers'' off day — no classes', NOW()),
  ('section20e-thu-col1-break', 'Section 20E', 'Thursday', 'Thu', 1, '', 'No Class', NULL, NULL, NULL, NULL, NULL, 'Defense & Counselling Day', NOW()),
  ('section20e-fri-col1-hum1113', 'Section 20E', 'Friday', 'Fri', 1, '9:00-10:30', 'Theory', 'Bangladesh Studies', 'HUM 1113', 'Bangladesh Studies', 'TA', '801', 'HUM 1113
Bangladesh Studies
9:00-10:30
TA | 801', NOW()),
  ('section20e-fri-col2-phy1111', 'Section 20E', 'Friday', 'Fri', 2, '10:30-12:00', 'Theory', 'Physics', 'PHY 1111', 'Physics', 'DHS', '801', 'PHY 1111
Physics
10:30 - 12:00
DHS | 801', NOW()),
  ('section20e-fri-col4-break', 'Section 20E', 'Friday', 'Fri', 4, '', 'Break', NULL, NULL, NULL, NULL, NULL, 'Jumu''ah Break', NOW());

-- Step 3: Mirror to drafts table
INSERT INTO public.routine_drafts
  (id, section, day, day_short, col_index, time_slot, type, title,
   course_code, course_title, faculty, room, raw_text, updated_at)
  SELECT id, section, day, day_short, col_index, time_slot, type, title,
         course_code, course_title, faculty, room, raw_text, updated_at
  FROM public.routine_items;

-- Step 4: Update batch_groups setting
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'batch_groups',
  '[{"batch":"13","label":"Batch 13","sections":["Section 13A"]},{"batch":"14","label":"Batch 14","sections":["Section 14A","Section 14B"]},{"batch":"15","label":"Batch 15","sections":["Section 15A","Section 15B"]},{"batch":"16","label":"Batch 16","sections":["Section 16A"]},{"batch":"17","label":"Batch 17","sections":["Section 17A","Section 17B"]},{"batch":"18","label":"Batch 18","sections":["Section 18A","Section 18B"]},{"batch":"19","label":"Batch 19","sections":["Section 19A","Section 19B","Section 19C","Section 19D"]},{"batch":"20","label":"Batch 20","sections":["Section 20A","Section 20B","Section 20C","Section 20D","Section 20E"]}]'::jsonb,
  NOW()
)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = NOW();

-- Step 5: Update semester info & name
INSERT INTO public.app_settings (key, value, updated_at)
VALUES (
  'semester_info',
  '{"name": "Fall 2026", "announcement": "Welcome to IUS CSE Class Routine & Schedule Portal!", "active": true}'::jsonb,
  NOW()
)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = NOW();

INSERT INTO public.app_settings (key, value, updated_at)
VALUES ('semester_name', '"Fall 2026"'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value, updated_at = NOW();

-- Total items: 306