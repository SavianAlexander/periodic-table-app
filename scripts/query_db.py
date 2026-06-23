import sqlite3
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "elements.db")
JSON_PATH = os.path.join(BASE_DIR, "src", "data", "elements.json")

def main():
    if not os.path.exists(DB_PATH):
        # Database does not exist yet. Run ingest script to create it.
        import subprocess
        print("elements.db not found. Running ingest_db.py...")
        subprocess.run(["python", os.path.join(BASE_DIR, "scripts", "ingest_db.py")], check=True)

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Query all elements ordered by atomic number
    cursor.execute("SELECT * FROM elements ORDER BY atomic_number;")
    elements_rows = cursor.fetchall()
    
    elements_list = []
    for el_row in elements_rows:
        atomic_number = el_row["atomic_number"]
        
        # Query everyday uses
        cursor.execute("SELECT use FROM everyday_uses WHERE element_atomic_number = ? ORDER BY id;", (atomic_number,))
        uses = [row["use"] for row in cursor.fetchall()]
        
        # Query emission spectra
        cursor.execute("SELECT wavelength FROM emission_spectra WHERE element_atomic_number = ? ORDER BY id;", (atomic_number,))
        spectra_rows = cursor.fetchall()
        if spectra_rows:
            spectra = []
            for r in spectra_rows:
                val = r["wavelength"]
                if val.is_integer():
                    spectra.append(int(val))
                else:
                    spectra.append(val)
        else:
            spectra = "Visible spectrum lines"
            
        # Query isotopes
        cursor.execute("SELECT isotope_name, mass_number, half_life FROM isotopes WHERE element_atomic_number = ? ORDER BY id;", (atomic_number,))
        isotopes_rows = cursor.fetchall()
        isotopes = []
        for r in isotopes_rows:
            isotopes.append({
                "isotopeName": r["isotope_name"],
                "massNumber": r["mass_number"],
                "halfLife": r["half_life"]
            })
            
        # Map fields
        element_dict = {
            "atomicNumber": el_row["atomic_number"],
            "symbol": el_row["symbol"],
            "name": el_row["name"],
            "atomicMass": el_row["atomic_mass"],
            "groupBlock": el_row["group_block"],
            "electronConfiguration": el_row["electron_configuration"],
            "everydayUses": uses,
            "emissionSpectra": spectra,
            "electronegativity": el_row["electronegativity"],
            "meltingPoint": el_row["melting_point"],
            "boilingPoint": el_row["boiling_point"],
            "discoverer": el_row["discoverer"],
            "discoveryYear": el_row["discovery_year"],
            "stateAtRoomTemp": el_row["state_at_room_temp"],
            "ionizationEnergy": el_row["ionization_energy"],
            "density": el_row["density"],
            "crystalStructure": el_row["crystal_structure"],
            "videoUrl": el_row["video_url"],
            "isotopes": isotopes
        }
        elements_list.append(element_dict)
        
    conn.close()
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    
    # Write to JSON
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(elements_list, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {len(elements_list)} elements in {JSON_PATH} from elements.db")

if __name__ == "__main__":
    main()
