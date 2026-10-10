import pdfplumber

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

with pdfplumber.open(pdf_path) as pdf:
    for idx, page in enumerate(pdf.pages):
        print(f"=== PAGE {idx+1} ===")
        # extract words or lines to find section headings
        text = page.extract_text()
        sections = [line for line in text.split('\n') if 'Section' in line]
        print("Sections found in text:", sections)
