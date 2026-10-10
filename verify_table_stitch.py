import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

# Sequence of sections and their row sources
# Each item: (section_name, list of (page_num, table_index, row_type))
# row_type: 'header' (time header row), 'days' (day rows)

section_maps = [
    ("Section 13", [(1, 0, "full")]),  # Page 1 Table 0 has header + Sat..Fri
    ("Section 14A", [(1, 1, "header"), (2, 0, "days")]),
    ("Section 14B", [(2, 1, "header"), (3, 0, "days")]),
    ("Section 15A", [(3, 1, "header"), (4, 0, "days")]),
    ("Section 15B", [(4, 1, "header"), (5, 0, "days")]),
    ("Section 16", [(6, 0, "part1"), (7, 0, "part2")]), # P6 T0 (header + Sat..Thu + Fri time), P7 T0 (Fri)
    ("Section 17A", [(7, 1, "header_sat_wed"), (8, 0, "thu_fri")]),
    ("Section 17B", [(8, 1, "header_sat_tue"), (9, 0, "wed_fri")]),
    ("Section 18A", [(9, 1, "header_sat_mon"), (10, 0, "tue_fri")]),
    ("Section 18B", [(10, 1, "header_sat_sun"), (11, 0, "mon_fri")]),
    ("Section 19A", [(11, 1, "header_sat_sun"), (12, 0, "mon_fri")]),
    ("Section 19B", [(12, 1, "header_sat_sun"), (13, 0, "mon_fri")]),
    ("Section 19C", [(13, 1, "header_sat_sun"), (14, 0, "mon_fri")]),
    ("Section 19D", [(14, 1, "header_sat_sun"), (15, 0, "mon_fri")]),
    ("Section 20A", [(15, 1, "header_sat_sun"), (16, 0, "mon_fri")]),
    ("Section 20B", [(16, 1, "header_sat"), (17, 0, "sun_fri")]),
    ("Section 20C", [(17, 1, "header_sat"), (18, 0, "sun_fri")]),
    ("Section 20D", [(18, 1, "header_sat"), (19, 0, "sun_fri")]),
    ("Section 20E", [(19, 1, "header_sat"), (20, 0, "sun_fri")]),
]

with pdfplumber.open(pdf_path) as pdf:
    for sec_name, sources in section_maps:
        all_rows = []
        for page_num, table_idx, part in sources:
            table = pdf.pages[page_num - 1].extract_tables()[table_idx]
            all_rows.extend(table)
        print(f"=== {sec_name} total rows: {len(all_rows)} ===")
        for r in all_rows:
            day_str = r[0] if r and r[0] else "Empty"
            day_str = day_str.replace('\n', ' ')
            print(f"  Row header: {repr(day_str[:15])} | Cols: {len(r)}")

