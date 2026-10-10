import json
import re

def get_duration(time_str):
    if not time_str: return 0
    # Clean string: '9:30 AM - 12:30 PM', '1:30-4:30' -> '9:30-12:30'
    time_str = time_str.upper().replace(' AM', '').replace(' PM', '').replace(' ', '')
    parts = time_str.split('-')
    if len(parts) != 2: return 0
    
    def to_hours(t):
        if ':' not in t: return 0
        h, m = map(int, t.split(':'))
        if h < 8 and h != 12: h += 12
        return h + m / 60.0
        
    try:
        start = to_hours(parts[0])
        end = to_hours(parts[1])
        if end < start:
            end += 12
        return end - start
    except Exception:
        return 0

with open('src/data/routineData.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

changed_count = 0
for item in data:
    if item.get('type') in ['Break', 'No Class']:
        continue
    
    duration = get_duration(item.get('timeSlot'))
    course_title = (item.get('courseTitle') or '').lower()
    raw_text = (item.get('rawText') or '').lower()
    
    is_cp = 'competitive programming' in course_title or 'competitive programming' in raw_text
    
    if duration >= 2.5 or is_cp:
        if item.get('type') != 'Lab':
            item['type'] = 'Lab'
            changed_count += 1
            print(f"Changed {item.get('courseCode')} {item.get('courseTitle')} ({item.get('timeSlot')}) to Lab")

with open('src/data/routineData.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    
print(f'Total changed: {changed_count}')
