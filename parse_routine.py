import pdfplumber
import json
import re

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

with pdfplumber.open(pdf_path) as pdf:
    print(f"Total pages: {len(pdf.pages)}")
    for idx, page in enumerate(pdf.pages):
        text = page.extract_text()
        print(f"=== PAGE {idx+1} ===")
        tables = page.extract_tables()
        print(f"Found {len(tables)} tables")
        for t_idx, table in enumerate(tables):
            print(f"--- Table {t_idx+1} ---")
            for row in table:
                print(row)
