import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

def clean_cell(cell):
    if not cell:
        return None
    c = cell.strip()
    if not c or c == "None":
        return None
    return c

# Define sections list in chronological order as found
sections_list = [
    "Section 13",
    "Section 14A",
    "Section 14B",
    "Section 15A",
    "Section 15B",
    "Section 16",
    "Section 17A",
    "Section 17B",
    "Section 18A",
    "Section 18B",
    "Section 19A",
    "Section 19B",
    "Section 19C",
    "Section 19D",
    "Section 20A",
    "Section 20B",
    "Section 20C",
    "Section 20D",
    "Section 20E",
]

# Standard time slots
# Saturday - Thursday slots:
# Slot 1: 9:00 - 10:30
# Slot 2: 10:30 - 12:00
# Slot 3: 12:00 - 1:00 (Lunch Break)
# Slot 4: 1:00 - 2:30
# Slot 5: 2:30 - 4:00
# (Labs may span 9:30-12:30 or 1:30-4:30 or 3:00-4:30 / 3:30-5:00)

# Friday time slots:
# 9:30-11:00, 11:00-12:30, 12:30-1:00, 1:00-2:30 (Jumu'ah), 2:30-3:30, 3:30-4:00 / 3:30-5:00, 4:00-5:00

# Let's write a script that collects all table rows per page, along with section headings on that page sorted by vertical position.

with pdfplumber.open(pdf_path) as pdf:
    page_data = []
    for page_idx, page in enumerate(pdf.pages):
        text = page.extract_text()
        tables = page.extract_tables()

        # Find position of 'Section X' in text
        words = page.extract_words()
        section_headers = []
        for w in words:
            if 'Section' in w['text']:
                # look ahead for section name like '13', '14A', etc.
                section_headers.append(w)
        
        page_data.append({
            'page': page_idx + 1,
            'text': text,
            'tables': tables
        })

print("Pages parsed:", len(page_data))
