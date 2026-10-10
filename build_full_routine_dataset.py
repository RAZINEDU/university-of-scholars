import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

# Let's extract all tables from all pages and merge them sequentially by Section header!
# A section table starts when we see a row with ['Day', '9:00-10:30', ...] or a Section header in text.

def extract_all():
    with pdfplumber.open(pdf_path) as pdf:
        all_section_tables = {}
        current_section = "Section 13"
        current_rows = []

        for p_idx, page in enumerate(pdf.pages):
            text = page.extract_text()
            # find section names in text
            sec_matches = re.findall(r'Section\s+\d+[A-E]?', text)
            tables = page.extract_tables()

            for t in tables:
                for row in t:
                    # check if row is header row
                    first_cell = row[0].replace('\n', ' ').strip() if row and row[0] else ''
                    
                    # If first_cell is 'Day', check if text above or section_matches gives new section
                    if first_cell == 'Day':
                        if current_rows:
                            if current_section not in all_section_tables:
                                all_section_tables[current_section] = []
                            all_section_tables[current_section].extend(current_rows)
                            current_rows = []
                        # determine section name for this header
                        # If sec_matches contains a section name, use the latest one
                        # But wait, let's look at page text around this table
                    
                    current_rows.append((p_idx + 1, row))

        if current_rows:
            if current_section not in all_section_tables:
                all_section_tables[current_section] = []
            all_section_tables[current_section].extend(current_rows)

    return all_section_tables

print("Testing dynamic extraction...")
