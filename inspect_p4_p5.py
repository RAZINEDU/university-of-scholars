import pdfplumber

pdf_path = "CSE Final Draft Routine (Fall_2026).pdf"

with pdfplumber.open(pdf_path) as pdf:
    for p_num in [4, 5]:
        print(f"=== Page {p_num} ===")
        page = pdf.pages[p_num - 1]
        print("TEXT:", page.extract_text()[:300])
        tables = page.extract_tables()
        print(f"Num tables: {len(tables)}")
        for t_idx, t in enumerate(tables):
            print(f"Table {t_idx+1}:")
            for r in t:
                print(" ", r[:3])
