import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

# Mapping of section names to page ranges and table structure
# Page 1: Section 13 (Table 1), Section 14A (starts at bottom header, Table 2 is header for 14A)
# Page 2: Table 1 is Section 14A (Sat - Fri), bottom header Section 14B
# Page 3: Table 1 is Section 14B (Sat - Fri), bottom header Section 15A
# Page 4: Table 1 is Section 15A (Sat - Fri), bottom header Section 15B
# Page 5: Table 1 is Section 15B (Sat - Fri), bottom header Section 16
# Page 6: Table 1 is Section 16 (Sat - Fri), bottom header Section 17A
# Page 7: Table 1 is Section 17A (Sat - Fri), bottom header Section 17B
# Page 8: Table 1 is Section 17B (Sat - Fri), bottom header Section 18A
# Page 9: Table 1 is Section 18A (Sat - Fri), bottom header Section 18B
# Page 10: Table 1 is Section 18B (Sat - Fri), bottom header Section 19A
# Page 11: Table 1 is Section 19A (Sat - Fri), bottom header Section 19B
# Page 12: Table 1 is Section 19B (Sat - Fri), bottom header Section 19C
# Page 13: Table 1 is Section 19C (Sat - Fri), bottom header Section 19D
# Page 14: Table 1 is Section 19D (Sat - Fri), bottom header Section 20A
# Page 15: Table 1 is Section 20A (Sat - Fri), bottom header Section 20B
# Page 16: Table 1 is Section 20B (Sat - Fri), bottom header Section 20C
# Page 17: Table 1 is Section 20C (Sat - Fri), bottom header Section 20D
# Page 18: Table 1 is Section 20D (Sat - Fri), bottom header Section 20E
# Page 19: Table 1 is Section 20E (Sat - Fri)
# Page 20: Table 1 is Section 20E continuation (or extra rows)

# Let's verify Table 1 on Page 1 (Section 13) vs Table 1 on Page 2 (Section 14A) etc.

def parse_pdf():
    routine_by_section = {}
    
    # We will map page -> section
    # On page 1: Table 1 -> Section 13
    # On page 2: Table 1 -> Section 14A
    # On page 3: Table 1 -> Section 14B
    # On page 4: Table 1 -> Section 15A
    # On page 5: Table 1 -> Section 15B
    # On page 6: Table 1 -> Section 16
    # On page 7: Table 1 -> Section 17A
    # On page 8: Table 1 -> Section 17B
    # On page 9: Table 1 -> Section 18A
    # On page 10: Table 1 -> Section 18B
    # On page 11: Table 1 -> Section 19A
    # On page 12: Table 1 -> Section 19B
    # On page 13: Table 1 -> Section 19C
    # On page 14: Table 1 -> Section 19D
    # On page 15: Table 1 -> Section 20A
    # On page 16: Table 1 -> Section 20B
    # On page 17: Table 1 -> Section 20C
    # On page 18: Table 1 -> Section 20D
    # On page 19: Table 1 -> Section 20E
    # On page 20: Table 1 -> Section 20E (Sun - Fri)
    
    page_to_section = {
        1: "Section 13",
        2: "Section 14A",
        3: "Section 14B",
        4: "Section 15A",
        5: "Section 15B",
        6: "Section 16",
        7: "Section 17A",
        8: "Section 17B",
        9: "Section 18A",
        10: "Section 18B",
        11: "Section 19A",
        12: "Section 19B",
        13: "Section 19C",
        14: "Section 19D",
        15: "Section 20A",
        16: "Section 20B",
        17: "Section 20C",
        18: "Section 20D",
        19: "Section 20E",
        20: "Section 20E"
    }

    with pdfplumber.open(pdf_path) as pdf:
        for page_num, sec_name in page_to_section.items():
            page = pdf.pages[page_num - 1]
            tables = page.extract_tables()
            print(f"Page {page_num} ({sec_name}) has {len(tables)} tables")
            if sec_name not in routine_by_section:
                routine_by_section[sec_name] = []
            
            # Primary schedule table is tables[0]
            if tables:
                main_table = tables[0]
                routine_by_section[sec_name].append({
                    'page': page_num,
                    'rows': main_table
                })

    return routine_by_section

res = parse_pdf()
for sec, data in res.items():
    print(f"=== {sec} ===")
    for d in data:
        print(f"  Page {d['page']}: {len(d['rows'])} rows")

