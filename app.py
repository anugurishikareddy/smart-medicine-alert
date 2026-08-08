from flask import Flask, request, jsonify, send_from_directory
import sqlite3
from database import create_database

app = Flask(__name__)


# ---------------- SERVE FRONTEND ----------------

@app.route("/home")
def home_page():
    return send_from_directory("..", "index.html")


@app.route("/<path:filename>")
def files(filename):
    return send_from_directory("..", filename)



# ---------------- CREATE DATABASE ----------------

create_database()



# ---------------- TEST ROUTE ----------------

@app.route("/")
def home():
    return "Smart Medicine Alert Backend Running Successfully!"



# ---------------- GET ALL MEDICINES ----------------

@app.route("/medicines", methods=["GET"])
def get_medicines():

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM medicines")

    medicines = cursor.fetchall()

    connection.close()


    medicine_list = []

    for medicine in medicines:

        medicine_list.append({

            "id": medicine[0],
            "name": medicine[1],
            "dosage": medicine[2],
            "time": medicine[3],
            "status": medicine[4]

        })


    return jsonify(medicine_list)



# ---------------- ADD MEDICINE ----------------

@app.route("/add_medicine", methods=["POST"])
def add_medicine():

    data = request.json


    name = data["name"]
    dosage = data["dosage"]
    time = data["time"]
    status = data["status"]


    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()


    cursor.execute("""
        INSERT INTO medicines
        (name, dosage, time, status)
        VALUES (?, ?, ?, ?)
    """,
    (name, dosage, time, status))


    connection.commit()
    connection.close()


    return jsonify({

        "message": "Medicine added successfully!"

    })



# ---------------- DELETE MEDICINE ----------------

@app.route("/delete_medicine/<int:id>", methods=["DELETE"])
def delete_medicine(id):

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()


    cursor.execute(
        "DELETE FROM medicines WHERE id=?",
        (id,)
    )


    connection.commit()


    deleted = cursor.rowcount


    connection.close()


    if deleted == 0:

        return jsonify({

            "message": "Medicine not found"

        })


    return jsonify({

        "message": "Medicine deleted successfully!"

    })



# ---------------- UPDATE MEDICINE ----------------

@app.route("/update_medicine/<int:id>", methods=["PUT"])
def update_medicine(id):

    data = request.json


    name = data["name"]
    dosage = data["dosage"]
    time = data["time"]


    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()


    cursor.execute("""
        UPDATE medicines
        SET name=?, dosage=?, time=?
        WHERE id=?
    """,
    (name, dosage, time, id))


    connection.commit()


    updated = cursor.rowcount


    connection.close()


    if updated == 0:

        return jsonify({

            "message": "Medicine not found"

        })


    return jsonify({

        "message": "Medicine updated successfully!"

    })
    # ---------------- UPDATE STATUS ----------------

@app.route("/update_status/<int:id>", methods=["PUT"])
def update_status(id):

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE medicines
        SET status=?
        WHERE id=?
    """,
    ("Taken", id))


    connection.commit()

    updated = cursor.rowcount

    connection.close()


    if updated == 0:

        return jsonify({
            "message": "Medicine not found"
        })


    return jsonify({
        "message": "Medicine marked as Taken!"
    })

# ---------------- MARK MEDICINE TAKEN ----------------
@app.route("/mark_taken/<int:id>", methods=["PUT"])
def mark_taken(id):

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE medicines
        SET status='Taken'
        WHERE id=?
    """, (id,))

    connection.commit()

    updated = cursor.rowcount

    connection.close()

    if updated == 0:
        return jsonify({
            "message": "Medicine not found"
        })

    return jsonify({
        "message": "Medicine marked as Taken!"
    })

# ---------------- HISTORY API ----------------

@app.route("/add_history", methods=["POST"])
def add_history():

    data = request.json

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO history
        (name, dosage, time, status, date)
        VALUES (?, ?, ?, ?, ?)
    """,
    (
        data["name"],
        data["dosage"],
        data["time"],
        data["status"],
        data["date"]
    ))

    connection.commit()
    connection.close()

    return jsonify({
        "message": "History added successfully!"
    })


@app.route("/history", methods=["GET"])
def get_history():

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("SELECT * FROM history")

    rows = cursor.fetchall()

    connection.close()

    history = []

    for row in rows:
        history.append({
            "id": row[0],
            "name": row[1],
            "dosage": row[2],
            "time": row[3],
            "status": row[4],
            "date": row[5]
        })

    return jsonify(history)


@app.route("/clear_history", methods=["DELETE"])
def clear_history():

    connection = sqlite3.connect("medicine.db")
    cursor = connection.cursor()

    cursor.execute("DELETE FROM history")

    connection.commit()
    connection.close()

    return jsonify({
        "message": "History cleared successfully!"
    })
# ---------------- RUN SERVER ----------------

if __name__ == "__main__":

    app.run(debug=True)