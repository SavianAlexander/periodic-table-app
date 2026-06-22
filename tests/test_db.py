import unittest
import sqlite3
import json
import os
import subprocess

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "elements.db")
JSON_PATH = os.path.join(BASE_DIR, "src", "data", "elements.json")

class TestDatabaseBackend(unittest.TestCase):

    def test_database_file_exists(self):
        """Verify that elements.db exists at the root."""
        self.assertTrue(os.path.exists(DB_PATH), "elements.db does not exist")

    def test_tables_exist(self):
        """Verify that the required relational tables exist with correct columns."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Verify elements table
        cursor.execute("PRAGMA table_info(elements);")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        required_columns = [
            "atomic_number", "symbol", "name", "atomic_mass", "group_block",
            "electron_configuration", "electronegativity", "ionization_energy",
            "density", "melting_point", "boiling_point", "crystal_structure",
            "discoverer", "discovery_year", "state_at_room_temp"
        ]
        for col in required_columns:
            self.assertIn(col, columns, f"Column '{col}' is missing in elements table")
            
        # Verify isotopes table
        cursor.execute("PRAGMA table_info(isotopes);")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        required_isotopes_cols = ["id", "element_atomic_number", "isotope_name", "mass_number", "half_life"]
        for col in required_isotopes_cols:
            self.assertIn(col, columns, f"Column '{col}' is missing in isotopes table")
            
        # Verify everyday_uses table
        cursor.execute("PRAGMA table_info(everyday_uses);")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        required_uses_cols = ["id", "element_atomic_number", "use"]
        for col in required_uses_cols:
            self.assertIn(col, columns, f"Column '{col}' is missing in everyday_uses table")
            
        # Verify emission_spectra table
        cursor.execute("PRAGMA table_info(emission_spectra);")
        columns = {row[1]: row[2] for row in cursor.fetchall()}
        required_spectra_cols = ["id", "element_atomic_number", "wavelength"]
        for col in required_spectra_cols:
            self.assertIn(col, columns, f"Column '{col}' is missing in emission_spectra table")
            
        conn.close()

    def test_element_count(self):
        """Verify that the elements table contains exactly 118 elements."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT count(*) FROM elements;")
        count = cursor.fetchone()[0]
        conn.close()
        self.assertEqual(count, 118, f"Expected 118 elements, found {count}")

    def test_relational_integrity(self):
        """Verify that every element has appropriate isotopes and everyday uses."""
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Every element should have at least one isotope
        cursor.execute("SELECT DISTINCT element_atomic_number FROM isotopes;")
        elements_with_isotopes = {row[0] for row in cursor.fetchall()}
        self.assertEqual(len(elements_with_isotopes), 118, "Some elements are missing isotopes")
        
        # Every element should have at least one everyday use
        cursor.execute("SELECT DISTINCT element_atomic_number FROM everyday_uses;")
        elements_with_uses = {row[0] for row in cursor.fetchall()}
        self.assertEqual(len(elements_with_uses), 118, "Some elements are missing everyday uses")
        
        conn.close()

    def test_json_reconstruction(self):
        """Verify that query_db.py generates the json file with correct schema and augmented fields."""
        # Run the query script to regenerate elements.json
        script_path = os.path.join(BASE_DIR, "scripts", "query_db.py")
        result = subprocess.run(["python", script_path], capture_output=True, text=True, check=True)
        self.assertIn("Successfully generated 118 elements", result.stdout)
        
        # Load and verify JSON
        with open(JSON_PATH, "r", encoding="utf-8") as f:
            elements = json.load(f)
            
        self.assertEqual(len(elements), 118)
        
        # Check first element (Hydrogen) augmented properties
        h = elements[0]
        self.assertEqual(h["atomicNumber"], 1)
        self.assertEqual(h["symbol"], "H")
        self.assertEqual(h["name"], "Hydrogen")
        self.assertEqual(h["ionizationEnergy"], 1312.0)
        self.assertEqual(h["density"], 0.00008988)
        self.assertEqual(h["crystalStructure"], "Hexagonal")
        self.assertIsInstance(h["isotopes"], list)
        self.assertGreater(len(h["isotopes"]), 0)
        
        # Ensure all isotopes have the required keys
        for iso in h["isotopes"]:
            self.assertIn("isotopeName", iso)
            self.assertIn("massNumber", iso)
            self.assertIn("halfLife", iso)

if __name__ == "__main__":
    unittest.main()
