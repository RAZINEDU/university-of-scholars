import json

with open("routine_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

import os
os.makedirs("src/data", exist_ok=True)

with open("src/data/routineData.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Copied to src/data/routineData.json!")
