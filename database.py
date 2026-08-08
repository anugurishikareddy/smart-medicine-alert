
import sqlite3


def create_database():

    connection = sqlite3.connect("medicine.db")

    cursor = connection.cursor()


    # Medicines table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dosage TEXT,
        time TEXT,
        status TEXT
    )
    """)


    # History table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dosage TEXT,
        time TEXT,
        status TEXT,
        date TEXT
    )
    """)


    connection.commit()

    connection.close()


    print("Database created successfully!")


create_database()