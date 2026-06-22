import urllib.request
import json
import os

url = "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"

def fetch_data():
    print("Fetching periodic table data...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    elements = data.get("elements", [])
    
    # Ensure the directory exists
    os.makedirs("src/data", exist_ok=True)
    
    # Save the elements array to JSON
    target_file = "src/data/elements.json"
    with open(target_file, "w", encoding="utf-8") as f:
        json.dump(elements, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully saved {len(elements)} elements to {target_file}")

if __name__ == "__main__":
    fetch_data()
