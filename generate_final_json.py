import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

# Standard time slots for Saturday to Thursday based on column index 1 to 5:
NORMAL_TIME_SLOTS = {
    1: "9:00 AM - 10:30 AM",
    2: "10:30 AM - 12:00 PM",
    3: "12:00 PM - 1:00 PM", # Lunch Break
    4: "1:00 PM - 2:30 PM",
    5: "2:30 PM - 4:00 PM",
    6: "4:00 PM - 5:00 PM"
}

DAY_FULL_NAMES = {
    "Sat": "Saturday",
    "Sun": "Sunday",
    "Mon": "Monday",
    "Tue": "Tuesday",
    "Wed": "Wednesday",
    "Thu": "Thursday",
    "Fri": "Friday"
}

# Let's map sections to their page & table sequences
sections = [
    {"name": "Section 13", "parts": [(1, 0)]},
    {"name": "Section 14A", "parts": [(2, 0)]},
    {"name": "Section 14B", "parts": [(3, 0)]},
    {"name": "Section 15A", "parts": [(4, 0)]},
    {"name": "Section 15B", "parts": [(5, 0)]},
    {"name": "Section 16", "parts": [(6, 0), (7, 0)]},
    {"name": "Section 17A", "parts": [(7, 1), (8, 0)]},
    {"name": "Section 17B", "parts": [(8, 1), (9, 0)]},
    {"name": "Section 18A", "parts": [(9, 1), (10, 0)]},
    {"name": "Section 18B", "parts": [(10, 1), (11, 0)]},
    {"name": "Section 19A", "parts": [(11, 1), (12, 0)]},
    {"name": "Section 19B", "parts": [(12, 1), (13, 0)]},
    {"name": "Section 19C", "parts": [(13, 1), (14, 0)]},
    {"name": "Section 19D", "parts": [(14, 1), (15, 0)]},
    {"name": "Section 20A", "parts": [(15, 1), (16, 0)]},
    {"name": "Section 20B", "parts": [(16, 1), (17, 0)]},
    {"name": "Section 20C", "parts": [(17, 1), (18, 0)]},
    {"name": "Section 20D", "parts": [(18, 1), (19, 0)]},
    {"name": "Section 20E", "parts": [(19, 1), (20, 0)]},
]

def parse_cell_content(cell_text):
    if not cell_text or not cell_text.strip():
        return None
    
    txt = cell_text.strip()
    
    # Common special cases
    if "Lunch Break" in txt:
        return {"type": "Break", "title": "Lunch Break"}
    if "Jumu'ah Break" in txt or "Jumu'ah" in txt:
        return {"type": "Break", "title": "Jumu'ah Break"}
    if "Teachers' off day" in txt or "off day" in txt:
        return {"type": "No Class", "title": "Teachers' Off Day (No Classes)"}
    if "Defense & Counselling" in txt or "Counselling" in txt:
        return {"type": "No Class", "title": "Defense & Counselling Day"}
    
    lines = [l.strip() for l in txt.split("\n") if l.strip()]
    if not lines:
        return None
        
    # Match course code, e.g. CSE 4149 or HUM 3103 or EEE 2113 or MATH 1213 or CSE 3108 (+17A,17B,15B)
    code_match = re.search(r'([A-Z]{3,4}\s+\d{4}(?:\s+\([^\)]+\))?)', lines[0])
    course_code = code_match.group(1) if code_match else lines[0]
    
    # Check if lab
    is_lab = "Lab" in txt or "lab" in txt or "Lab" in course_code
    
    # Look for room & faculty pattern at the end: e.g., "MES | 1502" or "IJ | Auditorium (13th floor)" or "EEE-F1 | EEE Lab (EEE Dept)"
    faculty = None
    room = None
    time_slot = None
    
    # Extract time pattern if inside text like 11:00-12:30 or 9:30-12:30 or 1:30-4:30
    time_match = re.search(r'(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})', txt)
    if time_match:
        time_slot = time_match.group(1).replace(" ", "")
        
    last_line = lines[-1]
    if "|" in last_line:
        parts = [p.strip() for p in last_line.split("|")]
        faculty = parts[0]
        room = parts[1]
    
    # Title is lines between code and faculty/time
    title_lines = []
    for line in lines:
        if line == lines[0] and code_match:
            continue
        if time_match and time_slot in line.replace(" ", ""):
            continue
        if "|" in line:
            continue
        title_lines.append(line)
        
    course_title = " ".join(title_lines) if title_lines else course_code
    
    return {
        "type": "Lab" if is_lab else "Theory",
        "courseCode": course_code,
        "courseTitle": course_title,
        "faculty": faculty,
        "room": room,
        "timeSlot": time_slot,
        "rawText": txt
    }

def main():
    dataset = []

    with pdfplumber.open(pdf_path) as pdf:
        for sec in sections:
            sec_name = sec["name"]
            combined_rows = []
            for page_num, table_idx in sec["parts"]:
                t = pdf.pages[page_num - 1].extract_tables()[table_idx]
                combined_rows.extend(t)
            
            # Let's parse rows for this section
            fri_time_headers = []
            
            for row in combined_rows:
                if not row or not row[0]:
                    continue
                
                day_key = row[0].strip().replace('\n', ' ')
                
                if day_key == 'Day':
                    # Header row for Sat-Thu
                    continue
                
                if day_key == 'Fri time':
                    fri_time_headers = [c.strip().replace('\n', ' ') if c else '' for c in row[1:]]
                    continue
                
                day_name = DAY_FULL_NAMES.get(day_key, day_key)
                
                # Iterate columns
                for col_idx, cell in enumerate(row[1:], start=1):
                    if not cell:
                        continue
                    
                    parsed = parse_cell_content(cell)
                    if not parsed:
                        continue
                        
                    # Determine time slot
                    if day_key == 'Fri':
                        time_slot = fri_time_headers[col_idx - 1] if (col_idx - 1) < len(fri_time_headers) else None
                        if parsed.get("timeSlot"):
                            time_slot = parsed["timeSlot"]
                    else:
                        time_slot = parsed.get("timeSlot") or NORMAL_TIME_SLOTS.get(col_idx, "Unknown")
                    
                    entry = {
                        "id": f"{sec_name.lower().replace(' ', '')}-{day_key.lower()}-{col_idx}",
                        "section": sec_name,
                        "day": day_name,
                        "dayShort": day_key,
                        "colIndex": col_idx,
                        "timeSlot": time_slot,
                        "type": parsed.get("type"),
                        "title": parsed.get("title"),
                        "courseCode": parsed.get("courseCode"),
                        "courseTitle": parsed.get("courseTitle"),
                        "faculty": parsed.get("faculty"),
                        "room": parsed.get("room"),
                        "rawText": parsed.get("rawText")
                    }
                    dataset.append(entry)

    print(f"Total entries parsed: {len(dataset)}")
    
    with open("routine_data.json", "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2, ensure_ascii=False)

    print("Saved to routine_data.json!")

if __name__ == "__main__":
    main()
