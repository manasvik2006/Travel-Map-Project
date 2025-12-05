import sqlite3

def create_db():
    conn = sqlite3.connect("travel.db")
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS travel_info (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            place TEXT,
            distance REAL,
            time REAL,
            cost REAL
        )
    """)
    conn.commit()
    conn.close()

create_db()
