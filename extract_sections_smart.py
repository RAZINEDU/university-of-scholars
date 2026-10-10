import pdfplumber
import json

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

with pdfplumber.open(pdf_path) as pdf:
    for i, p in enumerate(pdf.pages):
        print(f"=== PAGE {i+1} ===")
        # Get words matching Section
        words = [w for w in p.extract_words() if 'Section' in w['text']]
        for w in words:
            print(f"  Section header word: '{w['text']}' at y0={w['top']:.1f}")
        
        tables = p.extract_tables()
        for t_idx, t in enumerate(tables):
            # let's see first row of each table
            if t:
                print(f"  Table {t_idx+1} ({len(t)} rows). First row: {t[0][:3]}")
